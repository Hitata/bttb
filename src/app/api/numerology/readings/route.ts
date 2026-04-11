import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/numerology/readings — List all readings
export async function GET() {
  const readings = await prisma.numerologyReading.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      birthYear: true,
      birthMonth: true,
      birthDay: true,
      slug: true,
      isPublic: true,
      createdAt: true,
    },
  })

  return NextResponse.json(readings)
}

// POST /api/numerology/readings — Save a reading
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { fullName, birthYear, birthMonth, birthDay, result, isPublic } = body

    const slug = `${fullName.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`
    const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
    const now = new Date().toISOString()

    await prisma.$executeRaw`
      INSERT INTO NumerologyReading (id, userId, fullName, birthYear, birthMonth, birthDay, result, slug, isPublic, createdAt, updatedAt)
      VALUES (${id}, ${session.user.id}, ${fullName}, ${Number(birthYear)}, ${Number(birthMonth)}, ${Number(birthDay)}, ${JSON.stringify(result)}, ${slug}, ${isPublic ? 1 : 0}, ${now}, ${now})
    `

    return NextResponse.json({ id, slug }, { status: 201 })
  } catch (error) {
    console.error('Save numerology reading error:', error)
    return NextResponse.json({ error: 'Failed to save reading' }, { status: 500 })
  }
}
