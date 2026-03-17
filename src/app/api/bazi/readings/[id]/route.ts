import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/bazi/readings/[id] — Get a single reading
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const reading = await prisma.baziReading.findUnique({
    where: { id },
    include: { user: { select: { name: true, image: true } } },
  })

  if (!reading) {
    return NextResponse.json({ error: 'Reading not found' }, { status: 404 })
  }

  // Check access: public or owner
  if (!reading.isPublic) {
    const session = await auth()
    if (session?.user?.id !== reading.userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }
  }

  return NextResponse.json({
    ...reading,
    result: JSON.parse(reading.result),
  })
}
