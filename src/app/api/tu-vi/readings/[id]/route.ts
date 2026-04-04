import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tu-vi/readings/[id] — Get a single Tử Vi reading
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const reading = await prisma.tuViReading.findFirst({
    where: {
      OR: [
        { id },
        { slug: id },
      ],
    },
  })

  if (!reading) {
    return NextResponse.json({ error: 'Reading not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...reading,
    result: JSON.parse(reading.result),
  })
}
