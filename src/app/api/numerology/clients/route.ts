import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeNumerology } from '@/lib/numerology'
import type { NumerologyInput } from '@/lib/numerology'
import { findOrCreateProfile } from '@/lib/shared/auto-profile'

// Save a new client profile (auto-computes numerology)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, birthYear, birthMonth, birthDay } = body

    const result = await prisma.$transaction(async (tx) => {
      // Compute numerology chart
      const input: NumerologyInput = {
        fullName,
        birthYear: Number(birthYear),
        birthMonth: Number(birthMonth),
        birthDay: Number(birthDay),
      }
      const numResult = computeNumerology(input)

      // Build chart summary
      const chartSummary = `Life Path ${numResult.lifePath.value} | Expression ${numResult.expression.value} | Soul Urge ${numResult.soulUrge.value}`

      // Create client
      const client = await tx.numerologyClient.create({
        data: {
          fullName,
          birthYear: Number(birthYear),
          birthMonth: Number(birthMonth),
          birthDay: Number(birthDay),
          lifePathNumber: numResult.lifePath.value,
          chartSummary,
          fullChart: JSON.stringify(numResult),
        },
      })

      // Auto-create/link profile (no gender for numerology)
      const profileId = await findOrCreateProfile(tx, 'numerology', client.id, {
        name: fullName,
        birthYear: Number(birthYear),
        birthMonth: Number(birthMonth),
        birthDay: Number(birthDay),
      })

      return { id: client.id, profileId, lifePathNumber: numResult.lifePath.value, chartSummary }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Save numerology client error:', error)
    return NextResponse.json({ error: 'Failed to save client' }, { status: 500 })
  }
}

// List all clients (for search/select)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    const clients = await prisma.numerologyClient.findMany({
      where: q ? { fullName: { contains: q } } : undefined,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        birthYear: true,
        birthMonth: true,
        birthDay: true,
        lifePathNumber: true,
        chartSummary: true,
        createdAt: true,
      },
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('List numerology clients error:', error)
    return NextResponse.json({ error: 'Failed to list clients' }, { status: 500 })
  }
}
