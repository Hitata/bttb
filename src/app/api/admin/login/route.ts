// src/app/api/admin/login/route.ts
import { NextResponse } from 'next/server'
import { verifyAdminCredentials, setAdminCookie } from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    const admin = await verifyAdminCredentials(username, password)
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    await setAdminCookie(admin.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
