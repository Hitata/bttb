import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/human-design/readings/[id] — Get a single HD reading
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const reading = await prisma.humanDesignReading.findFirst({
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

// PATCH /api/human-design/readings/[id] — Update a reading's name
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json()
  const { name } = body

  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const reading = await prisma.humanDesignReading.update({
    where: { id },
    data: { name },
  })

  return NextResponse.json(reading)
}

// DELETE /api/human-design/readings/[id] — Delete a reading
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  await prisma.humanDesignReading.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
