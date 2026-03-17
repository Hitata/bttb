import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/bazi/readings — List authenticated user's readings
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const readings = await prisma.baziReading.findMany({
    where: { userId: session.user.id },
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
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, gender, birthYear, birthMonth, birthDay, birthHour, birthMinute, result, isPublic } = body

    // Generate a slug
    const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`

    const reading = await prisma.baziReading.create({
      data: {
        userId: session.user.id,
        name,
        gender,
        birthYear: Number(birthYear),
        birthMonth: Number(birthMonth),
        birthDay: Number(birthDay),
        birthHour: birthHour != null ? Number(birthHour) : null,
        birthMinute: birthMinute != null ? Number(birthMinute) : null,
        result: JSON.stringify(result),
        slug,
        isPublic: isPublic ?? false,
      },
    })

    return NextResponse.json(reading, { status: 201 })
  } catch (error) {
    console.error('Save reading error:', error)
    return NextResponse.json({ error: 'Failed to save reading' }, { status: 500 })
  }
}
