import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET!
const COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours

export async function verifyAdminCredentials(username: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { username } })
  if (!admin) return null
  const valid = await bcrypt.compare(password, admin.password)
  return valid ? admin : null
}

export function signAdminToken(adminId: string): string {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyAdminToken(token: string): { adminId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { adminId: string }
  } catch {
    return null
  }
}

export async function setAdminCookie(adminId: string) {
  const token = signAdminToken(adminId)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function clearAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getAdminSession(): Promise<{ adminId: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}
