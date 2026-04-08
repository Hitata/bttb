# Admin Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an admin page to manage client profiles, view Bazi/TuVi readings, and generate shareable reading links with 10-question chat caps.

**Architecture:** Next.js app router pages + API routes, Prisma schema extensions, cookie-based JWT auth for admin, CLI script for first admin user. Follows existing project patterns (client components, fetch in useEffect, Tailwind styling).

**Tech Stack:** Next.js 16, Prisma (SQLite), bcryptjs, jsonwebtoken, Tailwind CSS v4, lucide-react

**Spec:** `docs/superpowers/specs/2026-04-08-admin-page-design.md`

---

## File Structure

```
prisma/schema.prisma                          — Modify: add 4 new models + reverse relations
scripts/create-admin.ts                       — Create: CLI script for first admin user
src/lib/admin-auth.ts                         — Create: JWT sign/verify + cookie helpers
src/middleware.ts                             — Create: protect /admin and /api/admin routes
src/app/admin/page.tsx                        — Create: login form + client list
src/app/admin/clients/[id]/page.tsx           — Create: client profile detail page
src/app/api/admin/login/route.ts              — Create: POST login
src/app/api/admin/logout/route.ts             — Create: POST logout
src/app/api/admin/clients/route.ts            — Create: GET list + POST create
src/app/api/admin/clients/[id]/route.ts       — Create: GET detail + PATCH update
src/app/api/admin/tokens/route.ts             — Create: POST generate token
src/app/api/admin/tokens/[id]/route.ts        — Create: DELETE (soft-invalidate)
.env                                          — Modify: add ADMIN_JWT_SECRET
```

---

### Task 1: Schema — Add New Models

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add AdminUser, ClientProfile, ReadingToken, ReadingMessage models**

Add to the end of `prisma/schema.prisma`:

```prisma
model AdminUser {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ClientProfile {
  id            String       @id @default(cuid())
  name          String
  baziClientId  String?      @unique
  tuViClientId  String?      @unique
  baziClient    BaziClient?  @relation(fields: [baziClientId], references: [id])
  tuViClient    TuViClient?  @relation(fields: [tuViClientId], references: [id])
  tokens        ReadingToken[]
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  @@index([name])
}

model ReadingToken {
  id              String         @id @default(cuid())
  clientProfileId String
  clientType      String
  sessionId       String?
  maxMessages     Int            @default(10)
  expiresAt       DateTime
  createdAt       DateTime       @default(now())
  clientProfile   ClientProfile  @relation(fields: [clientProfileId], references: [id])
  messages        ReadingMessage[]

  @@index([clientProfileId])
}

model ReadingMessage {
  id        String       @id @default(cuid())
  tokenId   String
  role      String
  content   String
  createdAt DateTime     @default(now())
  token     ReadingToken @relation(fields: [tokenId], references: [id])

  @@index([tokenId])
}
```

- [ ] **Step 2: Add reverse relation fields to BaziClient and TuViClient**

In the `BaziClient` model, add before the closing `}`:
```prisma
  clientProfile ClientProfile?
```

In the `TuViClient` model, add before the closing `}`:
```prisma
  clientProfile ClientProfile?
```

- [ ] **Step 3: Run migration**

```bash
npx prisma migrate dev --name add_admin_and_client_profiles
```

Expected: Migration created and applied successfully.

- [ ] **Step 4: Commit**

```bash
git add prisma/
git commit -m "feat: add AdminUser, ClientProfile, ReadingToken, ReadingMessage models"
```

---

### Task 2: Dependencies + Environment

**Files:**
- Modify: `package.json`
- Modify: `.env`

- [ ] **Step 1: Install dependencies**

```bash
npm install bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

- [ ] **Step 2: Add ADMIN_JWT_SECRET to .env**

Generate a random secret and add to `.env`:

```
ADMIN_JWT_SECRET=<generate-random-64-char-hex>
```

Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add bcryptjs and jsonwebtoken dependencies"
```

Note: Do NOT commit `.env`. It should already be in `.gitignore`.

---

### Task 3: Admin Auth Library

**Files:**
- Create: `src/lib/admin-auth.ts`

- [ ] **Step 1: Create admin auth helpers**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/admin-auth.ts
git commit -m "feat: add admin auth library (JWT + bcrypt helpers)"
```

---

### Task 4: Middleware — Protect Admin Routes

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create middleware**

Note: Middleware runs in Edge runtime, so we can't use `jsonwebtoken` (Node-only). Use Web Crypto API for JWT verification instead.

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function verifyJWT(token: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    const [headerB64, payloadB64, signatureB64] = token.split('.')
    const data = encoder.encode(`${headerB64}.${payloadB64}`)
    const signature = Uint8Array.from(atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
    const valid = await crypto.subtle.verify('HMAC', key, signature, data)
    if (!valid) return false
    const payload = JSON.parse(atob(payloadB64))
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/api/admin/login') {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('admin_session')?.value
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin?login=true', request.url))
    }

    const valid = await verifyJWT(token, process.env.ADMIN_JWT_SECRET!)
    if (!valid) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin?login=true', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
```

- [ ] **Step 2: Verify middleware doesn't break existing routes**

```bash
npm run dev
```

Visit `http://localhost:3000/bazi` — should load normally.
Visit `http://localhost:3000/admin` — should redirect to `/admin?login=true`.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add middleware to protect admin routes"
```

---

### Task 5: Create Admin Script

**Files:**
- Create: `scripts/create-admin.ts`

- [ ] **Step 1: Create the CLI script**

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

async function main() {
  const username = await prompt('Username: ')
  if (!username) {
    console.error('Username is required')
    process.exit(1)
  }

  const existing = await prisma.adminUser.findUnique({ where: { username } })
  if (existing) {
    console.error(`Admin user "${username}" already exists`)
    process.exit(1)
  }

  const password = await prompt('Password: ')
  if (!password || password.length < 8) {
    console.error('Password must be at least 8 characters')
    process.exit(1)
  }

  const hashed = await bcrypt.hash(password, 12)
  const admin = await prisma.adminUser.create({
    data: { username, password: hashed },
  })

  console.log(`Admin user "${admin.username}" created successfully`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
```

- [ ] **Step 2: Add npm script to package.json**

Add to `scripts` in `package.json`:

```json
"admin:create": "npx tsx scripts/create-admin.ts"
```

- [ ] **Step 3: Run the script to create your admin user**

```bash
npm run admin:create
```

Enter your chosen username and password when prompted.

- [ ] **Step 4: Commit**

```bash
git add scripts/create-admin.ts package.json
git commit -m "feat: add CLI script for creating admin users"
```

---

### Task 6: API — Login & Logout

**Files:**
- Create: `src/app/api/admin/login/route.ts`
- Create: `src/app/api/admin/logout/route.ts`

- [ ] **Step 1: Create login route**

```typescript
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
```

- [ ] **Step 2: Create logout route**

```typescript
// src/app/api/admin/logout/route.ts
import { NextResponse } from 'next/server'
import { clearAdminCookie } from '@/lib/admin-auth'

export async function POST() {
  await clearAdminCookie()
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/login/ src/app/api/admin/logout/
git commit -m "feat: add admin login and logout API routes"
```

---

### Task 7: API — Client Profiles CRUD

**Files:**
- Create: `src/app/api/admin/clients/route.ts`
- Create: `src/app/api/admin/clients/[id]/route.ts`

- [ ] **Step 1: Create client list + create route**

```typescript
// src/app/api/admin/clients/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    const profiles = await prisma.clientProfile.findMany({
      where: q ? { name: { contains: q } } : undefined,
      include: {
        baziClient: { select: { id: true, name: true, gender: true, birthYear: true, birthMonth: true, birthDay: true, dayMaster: true } },
        tuViClient: { select: { id: true, name: true, gender: true, birthYear: true, birthMonth: true, birthDay: true, cucName: true } },
        tokens: {
          include: {
            _count: { select: { messages: { where: { role: 'client' } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const result = profiles.map((p) => {
      const birth = p.baziClient ?? p.tuViClient
      const activeTokens = p.tokens.filter(
        (t) => t.expiresAt > new Date() && t._count.messages < t.maxMessages
      ).length
      return {
        id: p.id,
        name: p.name,
        birthYear: birth?.birthYear,
        birthMonth: birth?.birthMonth,
        birthDay: birth?.birthDay,
        gender: birth?.gender,
        hasBazi: !!p.baziClientId,
        hasTuVi: !!p.tuViClientId,
        activeTokens,
        createdAt: p.createdAt,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error listing clients:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, baziClientId, tuViClientId } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!baziClientId && !tuViClientId) {
      return NextResponse.json({ error: 'At least one reading type must be linked' }, { status: 400 })
    }

    // Validate referenced records exist and aren't already linked
    if (baziClientId) {
      const bazi = await prisma.baziClient.findUnique({ where: { id: baziClientId }, include: { clientProfile: true } })
      if (!bazi) return NextResponse.json({ error: 'BaziClient not found' }, { status: 404 })
      if (bazi.clientProfile) return NextResponse.json({ error: 'BaziClient already linked to another profile' }, { status: 409 })
    }
    if (tuViClientId) {
      const tuvi = await prisma.tuViClient.findUnique({ where: { id: tuViClientId }, include: { clientProfile: true } })
      if (!tuvi) return NextResponse.json({ error: 'TuViClient not found' }, { status: 404 })
      if (tuvi.clientProfile) return NextResponse.json({ error: 'TuViClient already linked to another profile' }, { status: 409 })
    }

    const profile = await prisma.clientProfile.create({
      data: { name, baziClientId, tuViClientId },
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create client detail + update route**

```typescript
// src/app/api/admin/clients/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const profile = await prisma.clientProfile.findUnique({
      where: { id },
      include: {
        baziClient: true,
        tuViClient: true,
        tokens: {
          include: {
            _count: { select: { messages: { where: { role: 'client' } } } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error getting client:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { baziClientId, tuViClientId } = await request.json()

    const existing = await prisma.clientProfile.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Validate new links
    if (baziClientId) {
      const bazi = await prisma.baziClient.findUnique({ where: { id: baziClientId }, include: { clientProfile: true } })
      if (!bazi) return NextResponse.json({ error: 'BaziClient not found' }, { status: 404 })
      if (bazi.clientProfile && bazi.clientProfile.id !== id) {
        return NextResponse.json({ error: 'BaziClient already linked to another profile' }, { status: 409 })
      }
    }
    if (tuViClientId) {
      const tuvi = await prisma.tuViClient.findUnique({ where: { id: tuViClientId }, include: { clientProfile: true } })
      if (!tuvi) return NextResponse.json({ error: 'TuViClient not found' }, { status: 404 })
      if (tuvi.clientProfile && tuvi.clientProfile.id !== id) {
        return NextResponse.json({ error: 'TuViClient already linked to another profile' }, { status: 409 })
      }
    }

    const updated = await prisma.clientProfile.update({
      where: { id },
      data: {
        ...(baziClientId !== undefined && { baziClientId }),
        ...(tuViClientId !== undefined && { tuViClientId }),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/clients/
git commit -m "feat: add admin client profiles CRUD API routes"
```

---

### Task 8: API — Token Generation & Revocation

**Files:**
- Create: `src/app/api/admin/tokens/route.ts`
- Create: `src/app/api/admin/tokens/[id]/route.ts`

- [ ] **Step 1: Create token generation route**

```typescript
// src/app/api/admin/tokens/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { clientProfileId, clientType } = await request.json()

    if (!clientProfileId || !clientType) {
      return NextResponse.json({ error: 'clientProfileId and clientType required' }, { status: 400 })
    }
    if (clientType !== 'bazi' && clientType !== 'tuvi') {
      return NextResponse.json({ error: 'clientType must be "bazi" or "tuvi"' }, { status: 400 })
    }

    // Verify the profile has the requested reading type linked
    const profile = await prisma.clientProfile.findUnique({ where: { id: clientProfileId } })
    if (!profile) {
      return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })
    }
    if (clientType === 'bazi' && !profile.baziClientId) {
      return NextResponse.json({ error: 'No Bazi reading linked to this profile' }, { status: 400 })
    }
    if (clientType === 'tuvi' && !profile.tuViClientId) {
      return NextResponse.json({ error: 'No TuVi reading linked to this profile' }, { status: 400 })
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const token = await prisma.readingToken.create({
      data: {
        clientProfileId,
        clientType,
        maxMessages: 10,
        expiresAt,
      },
    })

    return NextResponse.json({
      ...token,
      url: `/readings/${token.id}`,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create token revocation route**

```typescript
// src/app/api/admin/tokens/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = await prisma.readingToken.findUnique({ where: { id } })
    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }

    // Soft-invalidate by setting expiry to now
    await prisma.readingToken.update({
      where: { id },
      data: { expiresAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error revoking token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/tokens/
git commit -m "feat: add token generation and revocation API routes"
```

---

### Task 9: Admin Page — Login Form + Client List

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/layout.tsx`

- [ ] **Step 1: Create admin layout**

```typescript
// src/app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Create admin page with login + client list**

```typescript
// src/app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LogOut, Search, Star, Moon } from 'lucide-react'

interface ClientSummary {
  id: string
  name: string
  birthYear: number
  birthMonth: number
  birthDay: number
  gender: string
  hasBazi: boolean
  hasTuVi: boolean
  activeTokens: number
  createdAt: string
}

function normalizeGender(gender: string | undefined): string {
  if (!gender) return ''
  const lower = gender.toLowerCase()
  if (lower === 'male' || lower === 'nam') return 'Nam'
  if (lower === 'female' || lower === 'nữ' || lower === 'nu') return 'Nữ'
  return gender
}

function formatBirthDate(year?: number, month?: number, day?: number): string {
  if (!year || !month || !day) return ''
  return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
}

export default function AdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showLogin = searchParams.get('login') === 'true'

  const [isLoggedIn, setIsLoggedIn] = useState(!showLogin)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [clients, setClients] = useState<ClientSummary[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        setLoginError('Invalid credentials')
        return
      }
      setIsLoggedIn(true)
      router.replace('/admin')
    } catch {
      setLoginError('Connection error')
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    setIsLoggedIn(false)
    router.replace('/admin?login=true')
  }

  useEffect(() => {
    if (!isLoggedIn) return
    setLoading(true)
    const timeout = setTimeout(async () => {
      try {
        const q = search ? `?q=${encodeURIComponent(search)}` : ''
        const res = await fetch(`/api/admin/clients${q}`)
        if (res.status === 401) {
          setIsLoggedIn(false)
          router.replace('/admin?login=true')
          return
        }
        const data = await res.json()
        setClients(data)
      } catch (error) {
        console.error('Error loading clients:', error)
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => clearTimeout(timeout)
  }, [isLoggedIn, search, router])

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-lg border bg-card p-6">
          <h1 className="text-xl font-semibold">Admin Login</h1>
          {loginError && <p className="text-sm text-red-500">{loginError}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2"
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-foreground px-3 py-2 text-background hover:opacity-90"
          >
            Log in
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <LogOut size={16} /> Log out
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border bg-background py-2 pl-9 pr-3"
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : clients.length === 0 ? (
        <p className="text-muted-foreground">No clients found.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Birth Date</th>
                <th className="px-4 py-3 text-left font-medium">Gender</th>
                <th className="px-4 py-3 text-left font-medium">Readings</th>
                <th className="px-4 py-3 text-left font-medium">Active Links</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => router.push(`/admin/clients/${client.id}`)}
                  className="cursor-pointer border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{client.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatBirthDate(client.birthYear, client.birthMonth, client.birthDay)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{normalizeGender(client.gender)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {client.hasBazi && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600">
                          <Star size={12} /> Bazi
                        </span>
                      )}
                      {client.hasTuVi && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-600">
                          <Moon size={12} /> TuVi
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{client.activeTokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify the page loads**

```bash
npm run dev
```

Visit `http://localhost:3000/admin` — should show login form.
Log in with the admin user created in Task 5.
After login, should show empty client list.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/
git commit -m "feat: add admin login form and client list page"
```

---

### Task 10: Admin Page — Client Profile Detail

**Files:**
- Create: `src/app/admin/clients/[id]/page.tsx`

- [ ] **Step 1: Create client detail page**

```typescript
// src/app/admin/clients/[id]/page.tsx
'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Copy, Check, Plus, Star, Moon } from 'lucide-react'

interface TokenData {
  id: string
  clientType: string
  maxMessages: number
  expiresAt: string
  createdAt: string
  _count: { messages: number }
}

interface ClientDetail {
  id: string
  name: string
  baziClientId: string | null
  tuViClientId: string | null
  baziClient: {
    name: string
    gender: string
    birthYear: number
    birthMonth: number
    birthDay: number
    birthHour: number
    dayMaster: string
    chartSummary: string
  } | null
  tuViClient: {
    name: string
    gender: string
    birthYear: number
    birthMonth: number
    birthDay: number
    birthHour: number
    cucName: string
    chartSummary: string
  } | null
  tokens: TokenData[]
}

function normalizeGender(gender: string): string {
  const lower = gender.toLowerCase()
  if (lower === 'male' || lower === 'nam') return 'Nam'
  if (lower === 'female' || lower === 'nữ' || lower === 'nu') return 'Nữ'
  return gender
}

function getTokenStatus(token: TokenData): { label: string; color: string } {
  const now = new Date()
  if (new Date(token.expiresAt) <= now) return { label: 'Expired', color: 'bg-muted text-muted-foreground' }
  if (token._count.messages >= token.maxMessages) return { label: 'Maxed', color: 'bg-orange-500/10 text-orange-600' }
  return { label: 'Active', color: 'bg-green-500/10 text-green-600' }
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'bazi' | 'tuvi'>('bazi')
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/clients/${id}`)
        if (res.status === 401) {
          router.replace('/admin?login=true')
          return
        }
        if (!res.ok) {
          router.replace('/admin')
          return
        }
        const data = await res.json()
        setClient(data)
        // Default to whichever tab has data
        if (!data.baziClientId && data.tuViClientId) setActiveTab('tuvi')
      } catch (error) {
        console.error('Error loading client:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  async function generateToken(clientType: 'bazi' | 'tuvi') {
    setGenerating(true)
    try {
      const res = await fetch('/api/admin/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientProfileId: id, clientType }),
      })
      if (res.ok) {
        // Reload client data to show new token
        const clientRes = await fetch(`/api/admin/clients/${id}`)
        const data = await clientRes.json()
        setClient(data)
      }
    } catch (error) {
      console.error('Error generating token:', error)
    } finally {
      setGenerating(false)
    }
  }

  async function copyLink(tokenId: string) {
    const url = `${window.location.origin}/readings/${tokenId}`
    await navigator.clipboard.writeText(url)
    setCopiedTokenId(tokenId)
    setTimeout(() => setCopiedTokenId(null), 2000)
  }

  async function revokeToken(tokenId: string) {
    try {
      await fetch(`/api/admin/tokens/${tokenId}`, { method: 'DELETE' })
      const clientRes = await fetch(`/api/admin/clients/${id}`)
      const data = await clientRes.json()
      setClient(data)
    } catch (error) {
      console.error('Error revoking token:', error)
    }
  }

  if (loading) return <div className="mx-auto max-w-4xl p-6 text-muted-foreground">Loading...</div>
  if (!client) return <div className="mx-auto max-w-4xl p-6 text-muted-foreground">Client not found</div>

  const birth = client.baziClient ?? client.tuViClient
  const birthDate = birth
    ? `${birth.birthDay.toString().padStart(2, '0')}/${birth.birthMonth.toString().padStart(2, '0')}/${birth.birthYear}`
    : ''

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <button onClick={() => router.push('/admin')} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{client.name}</h1>
        {birth && (
          <p className="text-muted-foreground">
            {birthDate} · {normalizeGender(birth.gender)}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('bazi')}
          className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'bazi' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Star size={14} /> Bazi
        </button>
        <button
          onClick={() => setActiveTab('tuvi')}
          className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'tuvi' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Moon size={14} /> TuVi
        </button>
      </div>

      {/* Tab Content */}
      <div className="mb-8 rounded-lg border bg-card p-4">
        {activeTab === 'bazi' ? (
          client.baziClient ? (
            <div>
              <p className="font-medium">{client.baziClient.dayMaster}</p>
              <p className="mt-1 text-sm text-muted-foreground">{client.baziClient.chartSummary}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No Bazi reading linked.</p>
          )
        ) : (
          client.tuViClient ? (
            <div>
              <p className="font-medium">{client.tuViClient.cucName}</p>
              <p className="mt-1 text-sm text-muted-foreground">{client.tuViClient.chartSummary}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No TuVi reading linked.</p>
          )
        )}
      </div>

      {/* Tokens */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Reading Links</h2>
        <div className="flex gap-2">
          {client.baziClientId && (
            <button
              onClick={() => generateToken('bazi')}
              disabled={generating}
              className="flex items-center gap-1 rounded-md bg-amber-500/10 px-3 py-1.5 text-sm text-amber-600 hover:bg-amber-500/20 disabled:opacity-50"
            >
              <Plus size={14} /> Bazi Link
            </button>
          )}
          {client.tuViClientId && (
            <button
              onClick={() => generateToken('tuvi')}
              disabled={generating}
              className="flex items-center gap-1 rounded-md bg-purple-500/10 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-500/20 disabled:opacity-50"
            >
              <Plus size={14} /> TuVi Link
            </button>
          )}
        </div>
      </div>

      {client.tokens.length === 0 ? (
        <p className="text-muted-foreground">No reading links generated yet.</p>
      ) : (
        <div className="space-y-2">
          {client.tokens.map((token) => {
            const status = getTokenStatus(token)
            const expiryDate = new Date(token.expiresAt).toLocaleDateString()
            return (
              <div key={token.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${status.color}`}>
                    {status.label}
                  </span>
                  <span className="text-sm">
                    {token.clientType === 'bazi' ? 'Bazi' : 'TuVi'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {token._count.messages}/{token.maxMessages} questions
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Expires {expiryDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyLink(token.id)}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
                  >
                    {copiedTokenId === token.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copiedTokenId === token.id ? 'Copied' : 'Copy'}
                  </button>
                  {status.label === 'Active' && (
                    <button
                      onClick={() => revokeToken(token.id)}
                      className="rounded-md px-2 py-1 text-sm text-red-500 hover:bg-red-500/10"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify the page loads**

```bash
npm run dev
```

Navigate to `/admin`, then click a client row (you'll need to create one first via the API or next task). Verify tabs, token generation, and copy link work.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/clients/
git commit -m "feat: add admin client profile detail page with token management"
```

---

### Task 11: Verify Full Flow

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Fix any lint errors.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Fix any build errors.

- [ ] **Step 3: Manual smoke test**

1. Visit `/admin` → see login form
2. Log in with admin credentials → see client list (empty)
3. Create a test ClientProfile via API:
   ```bash
   # First get a BaziClient or TuViClient ID from the DB
   npx prisma studio
   ```
   Then POST to `/api/admin/clients` with the ID.
4. See client in list → click → see detail page
5. Generate a reading link → copy it
6. Verify the link format is `/readings/<cuid>`
7. Log out → verify redirect to login

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address lint and build issues for admin page"
```
