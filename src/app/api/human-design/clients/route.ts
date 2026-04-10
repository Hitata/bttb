import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeHumanDesign } from '@/lib/human-design'
import { findOrCreateProfile } from '@/lib/shared/auto-profile'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, gender, year, month, day, hour, minute,
            birthTimeUnknown, birthPlace, latitude, longitude, timezone } = body

    // Gender is required
    if (!gender) {
      return NextResponse.json({ error: 'Gender is required' }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      const input = {
        name,
        gender,
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: birthTimeUnknown ? 12 : Number(hour ?? 12),
        minute: birthTimeUnknown ? 0 : Number(minute ?? 0),
        timezone,
        latitude: Number(latitude),
        longitude: Number(longitude),
        birthTimeUnknown: birthTimeUnknown ?? false,
      }
      const chart = computeHumanDesign(input)
      const designType = chart.type
      const chartSummary = `${chart.type} · ${chart.authority}`

      const client = await tx.humanDesignClient.create({
        data: {
          name,
          gender,
          birthYear: Number(year),
          birthMonth: Number(month),
          birthDay: Number(day),
          birthHour: birthTimeUnknown ? null : Number(hour),
          birthMinute: birthTimeUnknown ? null : Number(minute),
          birthTimeUnknown: birthTimeUnknown ?? false,
          birthPlace: birthPlace ?? null,
          latitude: latitude != null ? Number(latitude) : null,
          longitude: longitude != null ? Number(longitude) : null,
          timezone: timezone ?? null,
          designType,
          chartSummary,
          fullChart: JSON.stringify(chart),
        },
      })

      const profileId = await findOrCreateProfile(tx, 'hd', client.id, {
        name,
        birthYear: Number(year),
        birthMonth: Number(month),
        birthDay: Number(day),
        gender,
      })

      return { id: client.id, profileId, designType, chartSummary }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Save HD client error:', error)
    return NextResponse.json({ error: 'Failed to save client' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    const clients = await prisma.humanDesignClient.findMany({
      where: q ? { name: { contains: q } } : undefined,
      select: {
        id: true,
        name: true,
        gender: true,
        birthYear: true,
        birthMonth: true,
        birthDay: true,
        birthHour: true,
        birthTimeUnknown: true,
        birthPlace: true,
        designType: true,
        chartSummary: true,
        createdAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('List HD clients error:', error)
    return NextResponse.json({ error: 'Failed to list clients' }, { status: 500 })
  }
}
