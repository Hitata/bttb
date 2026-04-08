import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [baziClients, tuViClients, hdClients] = await Promise.all([
      prisma.baziClient.findMany({
        where: { clientProfile: null },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
      prisma.tuViClient.findMany({
        where: { clientProfile: null },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
      prisma.humanDesignClient.findMany({
        where: { clientProfile: null },
        select: { id: true, name: true },
      }),
    ])

    const hdMapped = hdClients.map(c => ({ id: c.id, name: c.name, type: 'hd' as const }))

    const result = [
      ...baziClients.map((c) => ({ id: c.id, name: c.name, type: 'bazi' as const })),
      ...tuViClients.map((c) => ({ id: c.id, name: c.name, type: 'tuvi' as const })),
      ...hdMapped,
    ].sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error listing unlinked clients:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
