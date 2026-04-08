import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    const profiles = await prisma.clientProfile.findMany({
      where: q ? { name: { contains: q } } : undefined,
      include: {
        baziClient: { select: { id: true, name: true, gender: true, birthYear: true, birthMonth: true, birthDay: true, dayMaster: true } },
        tuViClient: { select: { id: true, name: true, gender: true, birthYear: true, birthMonth: true, birthDay: true, cucName: true } },
        tokens: {
          include: {
            _count: { select: { messages: { where: { role: 'client' } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const result = profiles.map((p) => {
      const birth = p.baziClient ?? p.tuViClient
      const activeTokens = p.tokens.filter(
        (t) => t.expiresAt > new Date() && t._count.messages < t.maxMessages
      ).length
      return {
        id: p.id,
        name: p.name,
        birthYear: birth?.birthYear,
        birthMonth: birth?.birthMonth,
        birthDay: birth?.birthDay,
        gender: birth?.gender,
        hasBazi: !!p.baziClientId,
        hasTuVi: !!p.tuViClientId,
        activeTokens,
        createdAt: p.createdAt,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error listing clients:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, baziClientId, tuViClientId } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!baziClientId && !tuViClientId) {
      return NextResponse.json({ error: 'At least one reading type must be linked' }, { status: 400 })
    }

    if (baziClientId) {
      const bazi = await prisma.baziClient.findUnique({ where: { id: baziClientId }, include: { clientProfile: true } })
      if (!bazi) return NextResponse.json({ error: 'BaziClient not found' }, { status: 404 })
      if (bazi.clientProfile) return NextResponse.json({ error: 'BaziClient already linked to another profile' }, { status: 409 })
    }
    if (tuViClientId) {
      const tuvi = await prisma.tuViClient.findUnique({ where: { id: tuViClientId }, include: { clientProfile: true } })
      if (!tuvi) return NextResponse.json({ error: 'TuViClient not found' }, { status: 404 })
      if (tuvi.clientProfile) return NextResponse.json({ error: 'TuViClient already linked to another profile' }, { status: 409 })
    }

    const profile = await prisma.clientProfile.create({
      data: { name, baziClientId, tuViClientId },
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
