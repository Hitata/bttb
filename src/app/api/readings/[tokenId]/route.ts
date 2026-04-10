// src/app/api/readings/[tokenId]/route.ts
import { NextResponse } from 'next/server'
import { validateToken } from '@/lib/reading-token'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId } = await params
  const { status, token } = await validateToken(tokenId)

  if (status === 'not_found') {
    return NextResponse.json({ error: 'Token not found' }, { status: 404 })
  }

  const profile = token!.clientProfile
  const clientData = token!.clientType === 'bazi'
    ? profile.baziClient
    : profile.tuViClient

  // Extract tutru from fullChart for bazi clients
  let tutru = null
  let chartDate = null
  if (token!.clientType === 'bazi' && profile.baziClient?.fullChart) {
    try {
      const fullChart = JSON.parse(profile.baziClient.fullChart)
      tutru = fullChart.tutru ?? null
      chartDate = fullChart.date ?? null
    } catch { /* ignore parse errors */ }
  }

  return NextResponse.json({
    status,
    tokenId: token!.id,
    clientType: token!.clientType,
    clientName: profile.name,
    expiresAt: token!.expiresAt,
    maxMessages: token!.maxMessages,
    clientMessageCount: token!.messages.filter(m => m.role === 'client').length,
    chartData: clientData,
    tutru,
    chartDate,
    messages: token!.messages.map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt,
    })),
  })
}
