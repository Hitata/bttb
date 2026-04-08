import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { clientProfileId, clientType } = await request.json()

    if (!clientProfileId || !clientType) {
      return NextResponse.json({ error: 'clientProfileId and clientType required' }, { status: 400 })
    }
    if (clientType !== 'bazi' && clientType !== 'tuvi') {
      return NextResponse.json({ error: 'clientType must be "bazi" or "tuvi"' }, { status: 400 })
    }

    const profile = await prisma.clientProfile.findUnique({ where: { id: clientProfileId } })
    if (!profile) {
      return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })
    }
    if (clientType === 'bazi' && !profile.baziClientId) {
      return NextResponse.json({ error: 'No Bazi reading linked to this profile' }, { status: 400 })
    }
    if (clientType === 'tuvi' && !profile.tuViClientId) {
      return NextResponse.json({ error: 'No TuVi reading linked to this profile' }, { status: 400 })
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const token = await prisma.readingToken.create({
      data: {
        clientProfileId,
        clientType,
        maxMessages: 10,
        expiresAt,
      },
    })

    return NextResponse.json({
      ...token,
      url: `/readings/${token.id}`,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
