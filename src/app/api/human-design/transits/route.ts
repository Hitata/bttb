import { NextResponse } from 'next/server'
import { calculateTransits } from '@/lib/human-design/calculate-transits'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')
    const date = dateStr ? new Date(dateStr) : new Date()

    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
    }

    const transits = calculateTransits(date)
    return NextResponse.json({ date: date.toISOString(), transits })
  } catch (error) {
    console.error('Transit calculation error:', error)
    return NextResponse.json({ error: 'Transit calculation failed' }, { status: 500 })
  }
}
