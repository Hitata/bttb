import { NextResponse } from 'next/server'
import { computeBazi } from '@/lib/bazi'
import type { BirthInput } from '@/lib/bazi'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, gender, year, month, day, hour, minute } = body

    if (!name || !gender || !year || !month || !day) {
      return NextResponse.json(
        { error: 'Missing required fields: name, gender, year, month, day' },
        { status: 400 },
      )
    }

    const input: BirthInput = {
      name,
      gender,
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: Number(hour ?? 0),
      minute: Number(minute ?? 0),
    }

    const result = computeBazi(input)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Bazi calculation error:', error)
    return NextResponse.json(
      { error: 'Calculation failed' },
      { status: 500 },
    )
  }
}
