import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/bazi/readings — List all readings
export async function GET() {
  const readings = await prisma.baziReading.findMany({
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
      slug: true,
      isPublic: true,
      createdAt: true,
    },
  })

  return NextResponse.json(readings)
}

// POST /api/bazi/readings — Save a reading
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, gender, birthYear, birthMonth, birthDay, birthHour, birthMinute, result, isPublic } = body

    const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`
    const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
    const now = new Date().toISOString()

    await prisma.$executeRaw`
      INSERT INTO BaziReading (id, name, gender, birthYear, birthMonth, birthDay, birthHour, birthMinute, result, slug, isPublic, createdAt, updatedAt)
      VALUES (${id}, ${name}, ${gender}, ${Number(birthYear)}, ${Number(birthMonth)}, ${Number(birthDay)}, ${birthHour != null ? Number(birthHour) : null}, ${birthMinute != null ? Number(birthMinute) : null}, ${JSON.stringify(result)}, ${slug}, ${isPublic ? 1 : 0}, ${now}, ${now})
    `

    return NextResponse.json({ id, slug }, { status: 201 })
  } catch (error) {
    console.error('Save reading error:', error)
    return NextResponse.json({ error: 'Failed to save reading' }, { status: 500 })
  }
}
