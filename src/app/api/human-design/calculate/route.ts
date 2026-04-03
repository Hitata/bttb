import { NextResponse } from 'next/server'
import { computeHumanDesign } from '@/lib/human-design'
import type { HDBirthInput } from '@/lib/human-design'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, year, month, day, hour, minute, timezone, latitude, longitude, gender, birthTimeUnknown } = body

    if (!name || !year || !month || !day || !timezone) {
      return NextResponse.json(
        { error: 'Missing required fields: name, year, month, day, timezone' },
        { status: 400 },
      )
    }

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Missing required fields: latitude, longitude' },
        { status: 400 },
      )
    }

    const input: HDBirthInput = {
      name,
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: Number(hour ?? 12),
      minute: Number(minute ?? 0),
      timezone,
      latitude: Number(latitude),
      longitude: Number(longitude),
      gender,
      birthTimeUnknown: birthTimeUnknown ?? false,
    }

    const result = computeHumanDesign(input)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Human Design calculation error:', error)
    return NextResponse.json(
      { error: 'Calculation failed' },
      { status: 500 },
    )
  }
}
