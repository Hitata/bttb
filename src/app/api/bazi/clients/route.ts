import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeBazi, HEAVENLY_STEMS } from '@/lib/bazi'
import type { BirthInput } from '@/lib/bazi'
import { findOrCreateProfile } from '@/lib/shared/auto-profile'

// Save a new client profile (auto-computes bazi)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, gender, year, month, day, hour, minute,
            birthPlace, latitude, longitude, timezone } = body

    const result = await prisma.$transaction(async (tx) => {
      // Compute bazi chart (same pattern as before)
      const input: BirthInput = { name, gender, year, month, day, hour: hour ?? 0, minute: minute ?? 0 }
      const baziResult = computeBazi(input)

      // Build day master label
      const dmStem = HEAVENLY_STEMS[baziResult.dayMasterIndex]
      const dayMaster = `${dmStem.name} ${dmStem.element}`

      // Build chart summary from tứ trụ
      const { tutru } = baziResult
      const chartSummary = `${tutru.thienTru.can}${tutru.thienTru.chi} ${tutru.nguyetTru.can}${tutru.nguyetTru.chi} ${tutru.nhatTru.can}${tutru.nhatTru.chi} ${tutru.thoiTru.can}${tutru.thoiTru.chi}`

      // Create client WITH location fields (new)
      const client = await tx.baziClient.create({
        data: {
          name, gender,
          birthYear: year, birthMonth: month, birthDay: day,
          birthHour: hour ?? 0, birthMinute: minute ?? 0,
          birthPlace: birthPlace ?? null,
          latitude: latitude ?? null,
          longitude: longitude ?? null,
          timezone: timezone ?? null,
          dayMaster, chartSummary,
          fullChart: JSON.stringify(baziResult),
        },
      })

      // Auto-create/link profile (new)
      const profileId = await findOrCreateProfile(tx, 'bazi', client.id, {
        name, birthYear: year, birthMonth: month, birthDay: day, gender,
      })

      return { id: client.id, profileId, dayMaster, chartSummary }
    })

    return NextResponse.json(result)
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
