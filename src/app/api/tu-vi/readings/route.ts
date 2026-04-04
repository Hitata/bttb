import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tu-vi/readings — List all Tử Vi readings
export async function GET() {
  const readings = await prisma.tuViReading.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      gender: true,
      birthYear: true,
      birthMonth: true,
      birthDay: true,
      birthHour: true,
      birthMinute: true,
      birthPlace: true,
      slug: true,
      isPublic: true,
      createdAt: true,
    },
  })

  return NextResponse.json(readings)
}

// POST /api/tu-vi/readings — Save a Tử Vi reading
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name, gender, birthYear, birthMonth, birthDay,
      birthHour, birthMinute,
      birthPlace, latitude, longitude, timezone, result,
    } = body

    const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`
    const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
    const now = new Date().toISOString()

    await prisma.$executeRaw`
      INSERT INTO TuViReading (id, name, gender, birthYear, birthMonth, birthDay, birthHour, birthMinute, birthPlace, latitude, longitude, timezone, result, slug, isPublic, createdAt, updatedAt)
      VALUES (${id}, ${name}, ${gender}, ${Number(birthYear)}, ${Number(birthMonth)}, ${Number(birthDay)}, ${birthHour != null ? Number(birthHour) : null}, ${birthMinute != null ? Number(birthMinute) : null}, ${birthPlace || ''}, ${Number(latitude)}, ${Number(longitude)}, ${timezone}, ${JSON.stringify(result)}, ${slug}, 0, ${now}, ${now})
    `

    return NextResponse.json({ id, slug }, { status: 201 })
  } catch (error) {
    console.error('Save Tử Vi reading error:', error)
    return NextResponse.json({ error: 'Failed to save reading' }, { status: 500 })
  }
}
