import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = await prisma.readingToken.findUnique({ where: { id } })
    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }

    await prisma.readingToken.update({
      where: { id },
      data: { expiresAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error revoking token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
