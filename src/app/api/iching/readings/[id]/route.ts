import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { prompt, analysisMode } = body

    await prisma.iChingReading.update({
      where: { id },
      data: {
        ...(prompt !== undefined && { prompt }),
        ...(analysisMode !== undefined && { analysisMode }),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Update reading error:', error)
    return NextResponse.json({ error: 'Failed to update reading' }, { status: 500 })
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const reading = await prisma.iChingReading.findUnique({ where: { id } })

    if (!reading) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...reading,
      lines: JSON.parse(reading.lines),
      coins: JSON.parse(reading.coins),
    })
  } catch (error) {
    console.error('Get reading error:', error)
    return NextResponse.json({ error: 'Failed to get reading' }, { status: 500 })
  }
}
