import { NextResponse } from 'next/server'
import { castHexagram, isValidImageHash } from '@/lib/iching/casting'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { imageHash } = body

    if (!isValidImageHash(imageHash)) {
      return NextResponse.json(
        { error: 'Invalid image hash' },
        { status: 400 },
      )
    }

    const result = castHexagram(imageHash)
    return NextResponse.json(result)
  } catch (error) {
    console.error('I Ching casting error:', error)
    return NextResponse.json(
      { error: 'Casting failed' },
      { status: 500 },
    )
  }
}
