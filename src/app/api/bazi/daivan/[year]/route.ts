import { NextResponse } from 'next/server'
import { computeYearPillar } from '@/lib/bazi'

// GET /api/bazi/daivan/[year]?dm=X&yc=X&yb=X&db=X
// Returns full pillar data for a specific year
export async function GET(
  request: Request,
  { params }: { params: Promise<{ year: string }> },
) {
  const { year: yearStr } = await params
  const year = Number(yearStr)

  if (isNaN(year)) {
    return NextResponse.json({ error: 'Invalid year' }, { status: 400 })
  }

  const url = new URL(request.url)
  const dm = Number(url.searchParams.get('dm') ?? 0)
  const yc = Number(url.searchParams.get('yc') ?? 0)
  const yb = Number(url.searchParams.get('yb') ?? 0)
  const db = Number(url.searchParams.get('db') ?? 0)

  const data = computeYearPillar(year, dm, yc, yb, db)

  return NextResponse.json(data)
}
