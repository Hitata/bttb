import { NextResponse } from 'next/server'
import { castHexagram, isValidImageHash } from '@/lib/iching/casting'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { imageHash, intentionTime, question } = body

    if (!isValidImageHash(imageHash)) {
      return NextResponse.json(
        { error: 'Invalid image hash' },
        { status: 400 },
      )
    }

    const result = castHexagram(imageHash, intentionTime)

    // Auto-save reading on cast
    const reading = await prisma.iChingReading.create({
      data: {
        imageHash,
        question: question ?? '',
        intentionTime: new Date(result.intentionTime),
        lines: JSON.stringify(result.lines),
        coins: JSON.stringify(result.coins),
        primaryNumber: result.primary.number,
        changedNumber: result.changed?.number ?? null,
        nuclearNumber: result.primary.nuclearNumber,
      },
    })

    return NextResponse.json({ ...result, readingId: reading.id })
  } catch (error) {
    console.error('I Ching casting error:', error)
    return NextResponse.json(
      { error: 'Casting failed' },
      { status: 500 },
    )
  }
}
