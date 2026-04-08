import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const profile = await prisma.clientProfile.findUnique({
      where: { id },
      include: {
        baziClient: true,
        tuViClient: true,
        tokens: {
          include: {
            _count: { select: { messages: { where: { role: 'client' } } } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error getting client:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { baziClientId, tuViClientId } = await request.json()

    const existing = await prisma.clientProfile.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    if (baziClientId) {
      const bazi = await prisma.baziClient.findUnique({ where: { id: baziClientId }, include: { clientProfile: true } })
      if (!bazi) return NextResponse.json({ error: 'BaziClient not found' }, { status: 404 })
      if (bazi.clientProfile && bazi.clientProfile.id !== id) {
        return NextResponse.json({ error: 'BaziClient already linked to another profile' }, { status: 409 })
      }
    }
    if (tuViClientId) {
      const tuvi = await prisma.tuViClient.findUnique({ where: { id: tuViClientId }, include: { clientProfile: true } })
      if (!tuvi) return NextResponse.json({ error: 'TuViClient not found' }, { status: 404 })
      if (tuvi.clientProfile && tuvi.clientProfile.id !== id) {
        return NextResponse.json({ error: 'TuViClient already linked to another profile' }, { status: 409 })
      }
    }

    const updated = await prisma.clientProfile.update({
      where: { id },
      data: {
        ...(baziClientId !== undefined && { baziClientId }),
        ...(tuViClientId !== undefined && { tuViClientId }),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
