// src/app/api/readings/[tokenId]/messages/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateToken } from '@/lib/reading-token'
import { query } from '@anthropic-ai/claude-agent-sdk'

export const maxDuration = 120 // Allow up to 2 minutes for Claude response

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId } = await params
  const { status, token } = await validateToken(tokenId)

  if (status === 'not_found') {
    return NextResponse.json({ error: 'Token not found' }, { status: 404 })
  }
  if (status === 'expired') {
    return NextResponse.json({ error: 'This reading link has expired. Contact your practitioner for a new one.' }, { status: 403 })
  }
  if (status === 'maxed') {
    return NextResponse.json({ error: 'You have reached the maximum number of questions for this reading.' }, { status: 403 })
  }

  const body = await request.json()
  const message = body?.message
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: 'Message too long (max 2000 characters)' }, { status: 400 })
  }

  // Save client message
  const clientMsg = await prisma.readingMessage.create({
    data: { tokenId, role: 'client', content: message.trim() },
  })

  // Build chart context for system prompt
  const profile = token!.clientProfile
  const chartClient = token!.clientType === 'bazi' ? profile.baziClient : profile.tuViClient
  const chartType = token!.clientType === 'bazi' ? 'Bát Tự (Four Pillars)' : 'Tử Vi'

  let chartSummaryLine = ''
  let chartJson = null
  if (chartClient) {
    const c = chartClient as Record<string, unknown>
    chartSummaryLine = (c.chartSummary || c.dayMaster || c.cucName || '') as string
    try { chartJson = JSON.parse(c.fullChart as string) } catch { /* ignore */ }
  }

  const systemPrompt = `You are a warm, knowledgeable ${chartType} practitioner answering follow-up questions about a client's reading.

Client: ${profile.name}
Chart type: ${chartType}
${chartSummaryLine ? `Chart summary: ${chartSummaryLine}` : ''}

Full chart data:
${chartJson ? JSON.stringify(chartJson, null, 2) : 'Not available'}

Guidelines:
- Answer in the same language the client uses (Vietnamese or English)
- Be specific to THIS client's chart — reference their actual pillars, elements, stars
- Keep answers practical and actionable
- If asked about topics outside ${chartType} (medical, legal, financial advice), politely redirect
- Be warm but professional`

  // Build the prompt with conversation history
  const priorMessages = token!.messages.map(m =>
    `${m.role === 'client' ? 'Client' : 'Practitioner'}: ${m.content}`
  ).join('\n\n')

  const fullPrompt = priorMessages
    ? `${priorMessages}\n\nClient: ${message.trim()}`
    : message.trim()

  try {
    const conversation = query({
      prompt: fullPrompt,
      options: {
        systemPrompt,
        maxTurns: 3,
        model: 'claude-sonnet-4-6',
        permissionMode: 'bypassPermissions',
        ...(token!.sessionId ? { resume: token!.sessionId } : {}),
      },
    })

    let assistantContent = ''
    let sessionId: string | undefined

    for await (const msg of conversation) {
      if (msg.type === 'assistant') {
        // Log each step: tool calls and text
        for (const block of msg.message.content) {
          if (block.type === 'tool_use') {
            console.log(`[Claude SDK] Tool: ${block.name}`, block.input && typeof block.input === 'object' ? JSON.stringify(block.input).slice(0, 200) : '')
          } else if (block.type === 'text') {
            console.log(`[Claude SDK] Text: ${block.text.slice(0, 150)}`)
          }
        }
        console.log(`[Claude SDK] Usage: ${JSON.stringify(msg.message.usage)}`)
      } else if (msg.type === 'result') {
        if (msg.subtype === 'success') {
          assistantContent = msg.result || ''
          sessionId = msg.session_id
          console.log(`[Claude SDK] Done. Cost: $${msg.total_cost_usd ?? '?'}, Session: ${sessionId}`)
        } else {
          console.error('[Claude SDK] Error:', msg.subtype, 'errors' in msg ? msg.errors : '')
        }
      }
    }

    if (!assistantContent) {
      assistantContent = 'I was unable to generate a response. Please try again.'
    }

    // Save assistant response
    await prisma.readingMessage.create({
      data: { tokenId, role: 'assistant', content: assistantContent },
    })

    // Update session ID for conversation continuity
    if (sessionId && sessionId !== token!.sessionId) {
      await prisma.readingToken.update({
        where: { id: tokenId },
        data: { sessionId },
      })
    }

    const newClientCount = token!.messages.filter(m => m.role === 'client').length + 1

    return NextResponse.json({
      role: 'assistant',
      content: assistantContent,
      clientMessageCount: newClientCount,
    })
  } catch (error) {
    console.error('Claude query error:', error)
    // Roll back the client message
    await prisma.readingMessage.delete({ where: { id: clientMsg.id } })
    return NextResponse.json(
      { error: 'Failed to get a response. Please try again in a moment.' },
      { status: 500 }
    )
  }
}
