import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/human-design/readings/[id] — Get a single HD reading
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const reading = await prisma.humanDesignReading.findFirst({
    where: {
      OR: [
        { id: params.id },
        { slug: params.id },
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
