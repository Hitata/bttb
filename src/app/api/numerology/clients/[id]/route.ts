import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const client = await prisma.numerologyClient.findUnique({ where: { id } })

    if (!client) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...client,
      fullChart: JSON.parse(client.fullChart),
    })
  } catch (error) {
    console.error('Get numerology client error:', error)
    return NextResponse.json({ error: 'Failed to get client' }, { status: 500 })
  }
}
