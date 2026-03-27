import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const numbersParam = searchParams.get('numbers')

    if (!numbersParam) {
      return NextResponse.json(
        { error: 'Missing numbers parameter' },
        { status: 400 },
      )
    }

    const numbers = numbersParam.split(',').map(Number).filter(n => n >= 1 && n <= 64)

    if (numbers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid numbers parameter' },
        { status: 400 },
      )
    }

    const hexagrams = await prisma.hexagram.findMany({
      where: { number: { in: numbers } },
      orderBy: { number: 'asc' },
    })

    return NextResponse.json(hexagrams)
  } catch (error) {
    console.error('Hexagram fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hexagrams' },
      { status: 500 },
    )
  }
}
