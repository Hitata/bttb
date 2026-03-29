import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeBazi, HEAVENLY_STEMS } from '@/lib/bazi'
import type { BirthInput } from '@/lib/bazi'

// Save a new client profile (auto-computes bazi)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, gender, year, month, day, hour, minute } = body

    // Compute bazi chart
    const input: BirthInput = { name, gender, year, month, day, hour: hour ?? 0, minute: minute ?? 0 }
    const result = computeBazi(input)

    // Build day master label
    const dmStem = HEAVENLY_STEMS[result.dayMasterIndex]
    const dayMaster = `${dmStem.name} ${dmStem.element}`

    // Build chart summary
    const { tutru } = result
    const chartSummary = `${tutru.thienTru.can}${tutru.thienTru.chi} ${tutru.nguyetTru.can}${tutru.nguyetTru.chi} ${tutru.nhatTru.can}${tutru.nhatTru.chi} ${tutru.thoiTru.can}${tutru.thoiTru.chi}`

    const client = await prisma.baziClient.create({
      data: {
        name,
        gender,
        birthYear: year,
        birthMonth: month,
        birthDay: day,
        birthHour: hour ?? 0,
        birthMinute: minute ?? 0,
        dayMaster,
        chartSummary,
        fullChart: JSON.stringify(result),
      },
    })

    return NextResponse.json({ id: client.id, dayMaster, chartSummary })
  } catch (error) {
    console.error('Save bazi client error:', error)
    return NextResponse.json({ error: 'Failed to save client' }, { status: 500 })
  }
}

// List all clients (for search/select)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    const clients = await prisma.baziClient.findMany({
      where: q ? { name: { contains: q } } : undefined,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        gender: true,
        birthYear: true,
        birthMonth: true,
        birthDay: true,
        birthHour: true,
        dayMaster: true,
        chartSummary: true,
        createdAt: true,
      },
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('List bazi clients error:', error)
    return NextResponse.json({ error: 'Failed to list clients' }, { status: 500 })
  }
}
