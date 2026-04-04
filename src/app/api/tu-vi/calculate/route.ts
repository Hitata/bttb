import { NextResponse } from 'next/server'
import { computeTuVi } from '@/lib/tu-vi'
import type { TuViBirthInput } from '@/lib/tu-vi'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, year, month, day, hour, minute, timezone, latitude, longitude, gender, birthPlace } = body

    if (!name || !year || !month || !day || !timezone || !gender) {
      return NextResponse.json(
        { error: 'Missing required fields: name, year, month, day, timezone, gender' },
        { status: 400 },
      )
    }

    if (hour == null) {
      return NextResponse.json(
        { error: 'Birth hour is required for Tử Vi calculation' },
        { status: 400 },
      )
    }

    if (!['Nam', 'Nữ'].includes(gender)) {
      return NextResponse.json(
        { error: 'Gender must be Nam or Nữ' },
        { status: 400 },
      )
    }

    const input: TuViBirthInput = {
      name,
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: Number(hour),
      minute: Number(minute ?? 0),
      timezone,
      latitude: Number(latitude ?? 0),
      longitude: Number(longitude ?? 0),
      gender,
      birthPlace: birthPlace || '',
    }

    const result = computeTuVi(input)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Tử Vi calculation error:', error)
    return NextResponse.json(
      { error: 'Calculation failed' },
      { status: 500 },
    )
  }
}
