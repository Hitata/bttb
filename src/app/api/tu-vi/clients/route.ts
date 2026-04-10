import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeTuVi } from '@/lib/tu-vi'
import type { TuViBirthInput } from '@/lib/tu-vi'
import { findOrCreateProfile } from '@/lib/shared/auto-profile'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, gender, year, month, day, hour, minute, timezone, latitude, longitude, birthPlace } = body

    const input: TuViBirthInput = {
      name,
      gender,
      year,
      month,
      day,
      hour: hour ?? 0,
      minute: minute ?? 0,
      timezone,
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
      birthPlace: birthPlace || '',
    }

    const chart = computeTuVi(input)

    const cucName = chart.profile.cucName
    const chartSummary = `${chart.profile.napAm.name} · ${chart.profile.menhChu}`

    const { client, profileId } = await prisma.$transaction(async (tx) => {
      const client = await tx.tuViClient.create({
        data: {
          name,
          gender,
          birthYear: year,
          birthMonth: month,
          birthDay: day,
          birthHour: hour ?? 0,
          birthMinute: minute ?? 0,
          birthPlace: birthPlace || '',
          latitude: latitude ?? 0,
          longitude: longitude ?? 0,
          timezone,
          cucName,
          chartSummary,
          fullChart: JSON.stringify(chart),
        },
      })

      const profileId = await findOrCreateProfile(tx, 'tuvi', client.id, {
        name,
        birthYear: year,
        birthMonth: month,
        birthDay: day,
        gender,
      })

      return { client, profileId }
    })

    return NextResponse.json({ id: client.id, cucName, chartSummary, profileId })
  } catch (error) {
    console.error('Save tuvi client error:', error)
    return NextResponse.json({ error: 'Failed to save client' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    const clients = await prisma.tuViClient.findMany({
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
        birthPlace: true,
        cucName: true,
        chartSummary: true,
        createdAt: true,
      },
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('List tuvi clients error:', error)
    return NextResponse.json({ error: 'Failed to list clients' }, { status: 500 })
  }
}
