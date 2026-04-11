import { NextResponse } from 'next/server'
import { computeNumerology } from '@/lib/numerology'
import type { NumerologyInput } from '@/lib/numerology'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { fullName, birthYear, birthMonth, birthDay } = body

    if (!fullName || !birthYear || !birthMonth || !birthDay) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, birthYear, birthMonth, birthDay' },
        { status: 400 },
      )
    }

    const input: NumerologyInput = {
      fullName,
      birthYear: Number(birthYear),
      birthMonth: Number(birthMonth),
      birthDay: Number(birthDay),
    }

    const result = computeNumerology(input)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Numerology calculation error:', error)
    return NextResponse.json(
      { error: 'Calculation failed' },
      { status: 500 },
    )
  }
}
