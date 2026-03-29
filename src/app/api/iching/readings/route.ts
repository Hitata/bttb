import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Save a new reading
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      imageHash,
      intentionTime,
      lines,
      coins,
      primaryNumber,
      changedNumber,
      nuclearNumber,
      prompt,
      analysisMode,
      question,
    } = body

    const reading = await prisma.iChingReading.create({
      data: {
        imageHash,
        question: question ?? '',
        intentionTime: new Date(intentionTime),
        lines: JSON.stringify(lines),
        coins: JSON.stringify(coins),
        primaryNumber,
        changedNumber: changedNumber ?? null,
        nuclearNumber,
        prompt,
        analysisMode: analysisMode ?? 'standard',
      },
    })

    return NextResponse.json({ id: reading.id })
  } catch (error) {
    console.error('Save reading error:', error)
    return NextResponse.json({ error: 'Failed to save reading' }, { status: 500 })
  }
}

// List all readings
export async function GET() {
  try {
    const readings = await prisma.iChingReading.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        imageHash: true,
        question: true,
        primaryNumber: true,
        changedNumber: true,
        nuclearNumber: true,
        analysisMode: true,
        intentionTime: true,
        createdAt: true,
      },
    })

    return NextResponse.json(readings)
  } catch (error) {
    console.error('List readings error:', error)
    return NextResponse.json({ error: 'Failed to list readings' }, { status: 500 })
  }
}
