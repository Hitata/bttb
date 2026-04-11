import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/numerology/readings/[id] — Get a single reading
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const reading = await prisma.numerologyReading.findUnique({
    where: { id },
  })

  if (!reading) {
    return NextResponse.json({ error: 'Reading not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...reading,
    result: JSON.parse(reading.result),
  })
}

// PATCH /api/numerology/readings/[id] — Update a reading's fullName
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json()
  const { fullName } = body

  if (!fullName || typeof fullName !== 'string') {
    return NextResponse.json({ error: 'fullName is required' }, { status: 400 })
  }

  const reading = await prisma.numerologyReading.update({
    where: { id },
    data: { fullName },
  })

  return NextResponse.json(reading)
}

// DELETE /api/numerology/readings/[id] — Delete a reading
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  await prisma.numerologyReading.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
