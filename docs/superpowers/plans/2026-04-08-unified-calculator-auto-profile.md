# Unified Birth Calculator & Auto-Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify three birth calculator forms into one shared component, auto-create `ClientProfile` on submission, and add full Human Design client support.

**Architecture:** Shared `<BirthInputForm />` component renders all birth data fields. Each system page wraps it with system-specific submission logic. Backend `/api/{system}/clients` endpoints auto-create `ClientProfile` in a transaction. Admin can generate additional readings from client detail page.

**Tech Stack:** Next.js 16, React, Prisma (SQLite), TypeScript, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-04-08-unified-calculator-auto-profile-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `prisma/schema.prisma` | Modify | Add HumanDesignClient, update ClientProfile + BaziClient |
| `src/components/shared/BirthInputForm.tsx` | Create | Shared birth data form component |
| `src/lib/shared/city-presets.ts` | Create | City preset data extracted from calculators |
| `src/lib/shared/auto-profile.ts` | Create | Shared auto-profile creation logic |
| `src/app/bazi/page.tsx` | Modify | Use shared form |
| `src/app/tu-vi/calculator/page.tsx` | Modify | Use shared form |
| `src/app/human-design/calculator/page.tsx` | Modify | Use shared form |
| `src/app/api/bazi/clients/route.ts` | Modify | Add location fields + auto-profile |
| `src/app/api/tu-vi/clients/route.ts` | Modify | Add auto-profile |
| `src/app/api/human-design/clients/route.ts` | Create | HD client endpoint with auto-profile |
| `src/app/api/admin/clients/route.ts` | Modify | Add hasHd |
| `src/app/api/admin/clients/[id]/route.ts` | Modify | Add hdClient support |
| `src/app/api/admin/clients/unlinked/route.ts` | Modify | Add HD clients |
| `src/app/api/admin/clients/[id]/generate/route.ts` | Create | Generate additional readings |
| `src/app/admin/clients/[id]/page.tsx` | Modify | HD tab + generate buttons |
| `src/components/bazi/BirthInputForm.tsx` | Delete | Replaced by shared component |
| `scripts/migrate-client-profiles.ts` | Create | One-time migration for existing clients |

---

## Task 1: Database Schema Changes

**Files:**
- Modify: `prisma/schema.prisma:145-162` (BaziClient), `prisma/schema.prisma:233-245` (ClientProfile)

- [ ] **Step 1: Add HumanDesignClient model to schema**

Add after `TuViClient` model (after line ~199):

```prisma
model HumanDesignClient {
  id               String   @id @default(cuid())
  name             String
  gender           String
  birthYear        Int
  birthMonth       Int
  birthDay         Int
  birthHour        Int?
  birthMinute      Int?
  birthTimeUnknown Boolean  @default(false)
  birthPlace       String?
  latitude         Float?
  longitude        Float?
  timezone         String?
  designType       String?
  chartSummary     String?
  fullChart        String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  clientProfile    ClientProfile?

  @@index([name])
}
```

- [ ] **Step 2: Add location fields to BaziClient**

Add after `birthMinute` field in BaziClient (around line 157):

```prisma
  birthPlace     String?
  latitude       Float?
  longitude      Float?
  timezone       String?
```

- [ ] **Step 3: Update ClientProfile model**

Replace the ClientProfile model (lines 233-245) with:

```prisma
model ClientProfile {
  id             String              @id @default(cuid())
  name           String
  baziClientId   String?             @unique
  tuViClientId   String?             @unique
  hdClientId     String?             @unique
  baziClient     BaziClient?         @relation(fields: [baziClientId], references: [id])
  tuViClient     TuViClient?         @relation(fields: [tuViClientId], references: [id])
  hdClient       HumanDesignClient?  @relation(fields: [hdClientId], references: [id])
  tokens         ReadingToken[]
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt

  @@index([name])
}
```

- [ ] **Step 4: Generate and apply migration**

```bash
npx prisma migrate dev --name add_hd_client_and_profile_updates
```

- [ ] **Step 5: Verify Prisma client generates**

```bash
npx prisma generate
```

- [ ] **Step 6: Commit**

```bash
git add prisma/
git commit -m "feat: add HumanDesignClient model, update ClientProfile and BaziClient schema"
```

---

## Task 2: Verify City Presets (Already Extracted)

**Files:**
- Verify: `src/lib/shared/city-presets.ts` (already exists)

City presets are already extracted to a shared module. No creation needed.

- [ ] **Step 1: Verify existing city presets file**

The file already exists with these exports:
- `CITIES` (array of `CityPreset` with `label`, `tz`, `lat`, `lng` properties)
- `CUSTOM_CITY_INDEX` (last entry in array — the "Khác / Other" option)
- `CityPreset` interface

**IMPORTANT:** The shared form (Task 3) must import `CITIES` and `CUSTOM_CITY_INDEX` (NOT `CITY_PRESETS`). City property is `.label` (NOT `.name`).

No commit needed — file already exists.

---

## Task 3: Shared BirthInputForm Component

**Files:**
- Create: `src/components/shared/BirthInputForm.tsx`
- Reference: `src/components/bazi/BirthInputForm.tsx` (existing Bazi-only form for styling patterns)
- Reference: `src/app/tu-vi/calculator/page.tsx` (city selector pattern)
- Reference: `src/app/human-design/calculator/page.tsx` (birthTimeUnknown pattern)

- [ ] **Step 1: Create the shared BirthInputForm component**

Build the unified form with all fields. Follow the existing styling patterns from `src/components/bazi/BirthInputForm.tsx` (h-8 inputs, text-sm, rounded-md border, focus:border-primary).

```typescript
// src/components/shared/BirthInputForm.tsx
'use client'

import { useState } from 'react'
import { CITIES, CUSTOM_CITY_INDEX } from '@/lib/shared/city-presets'

export interface BirthFormData {
  name: string
  gender: 'male' | 'female'
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number
  birthMinute: number
  birthTimeUnknown: boolean
  birthPlace: string
  timezone: string
  latitude: number
  longitude: number
}

interface BirthInputFormProps {
  onSubmit: (data: BirthFormData) => void
  loading?: boolean
  defaultValues?: Partial<BirthFormData>
  showBirthTimeUnknown?: boolean
}
```

Fields to render (in order):
1. **Name** — text input, required
2. **Gender** — select with "Nam" / "Nữ" labels (values are 'male'/'female')
3. **Birth date row** — Day (select 1-31), Month (select 1-12), Year (number 1900-2100)
4. **Birth time row** — Hour (select 0-23), Minute (select 0-59)
5. **Birth time unknown** — checkbox, only rendered if `showBirthTimeUnknown` is true. When checked, disables hour/minute selects and sets them to 12:00.
6. **Birth place** — select from `CITY_PRESETS` + "Khác (Custom)" option at index `CUSTOM_CITY_INDEX`
7. **Custom location fields** — only shown when custom city selected: Timezone (text), Latitude (number), Longitude (number)
8. **Submit button** — disabled when `loading`

When a city preset is selected, auto-fill timezone/lat/lng from `CITY_PRESETS`. Default city: index 0 (HCMC).

Use the same input class pattern as existing form: `"h-8 w-full rounded-md border bg-background px-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"`

- [ ] **Step 2: Verify it renders**

Import and render it temporarily in any page. Confirm all fields show, city presets populate, birthTimeUnknown toggle works.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/BirthInputForm.tsx
git commit -m "feat: add shared BirthInputForm component with all birth data fields"
```

---

## Task 4: Refactor Bazi Page to Use Shared Form

**Files:**
- Modify: `src/app/bazi/page.tsx`
- Delete: `src/components/bazi/BirthInputForm.tsx`

- [ ] **Step 1: Update Bazi page imports and submission**

Replace the import of `BirthInputForm` from `@/components/bazi/BirthInputForm` with the shared one from `@/components/shared/BirthInputForm`.

Update `handleSubmit` to accept `BirthFormData` instead of `BirthInput`, and map fields:

```typescript
const handleSubmit = async (data: BirthFormData) => {
  const input: BirthInput = {
    name: data.name,
    gender: data.gender,
    year: data.birthYear,
    month: data.birthMonth,
    day: data.birthDay,
    hour: data.birthHour,
    minute: data.birthMinute,
  }
  // ... existing calculate logic using input
}
```

Update `handleSaveClient` to also send location fields:

```typescript
body: JSON.stringify({
  name: input.name,
  gender: input.gender,
  year: input.year,
  month: input.month,
  day: input.day,
  hour: input.hour,
  minute: input.minute,
  birthPlace: lastFormData.birthPlace,    // store from handleSubmit
  latitude: lastFormData.latitude,
  longitude: lastFormData.longitude,
  timezone: lastFormData.timezone,
}),
```

Store the full `BirthFormData` in a ref or state so `handleSaveClient` can access location fields.

Update the `<BirthInputForm>` usage:

```tsx
<BirthInputForm
  onSubmit={handleSubmit}
  loading={isLoading}
  defaultValues={initialValues ? {
    name: initialValues.name,
    gender: initialValues.gender,
    birthYear: initialValues.year,
    birthMonth: initialValues.month,
    birthDay: initialValues.day,
    birthHour: initialValues.hour,
    birthMinute: initialValues.minute,
  } : undefined}
/>
```

- [ ] **Step 2: Update BirthInputSummary if needed**

Check if `BirthInputSummary` component references `BirthInput` type. If so, update it to work with the data it receives (it gets `input` which is already mapped to `BirthInput`).

- [ ] **Step 3: Delete old BirthInputForm**

```bash
rm src/components/bazi/BirthInputForm.tsx
```

Check for any other imports of the old component:

```bash
grep -r "components/bazi/BirthInputForm" src/
```

- [ ] **Step 4: Verify Bazi page works**

```bash
npm run build
```

Navigate to `/bazi`, fill in form, calculate, verify chart displays, click "Lưu khách hàng", verify client saves.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: migrate Bazi page to shared BirthInputForm"
```

---

## Task 5: Refactor Tu-Vi Calculator to Use Shared Form

**Files:**
- Modify: `src/app/tu-vi/calculator/page.tsx`

- [ ] **Step 1: Replace inline form with shared component**

Remove all inline form state (name, gender, day, month, year, hourBranch, cityIndex, customTz, customLat, customLng) and the form JSX.

Import and use `<BirthInputForm />`. Handle submission by mapping `BirthFormData` to Tu-Vi's expected format:

```typescript
const handleSubmit = async (data: BirthFormData) => {
  setIsLoading(true)
  try {
    // Map gender to Vietnamese
    const gender = data.gender === 'male' ? 'Nam' : 'Nữ'

    // Calculate
    const calcRes = await fetch('/api/tu-vi/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        gender,
        year: data.birthYear,
        month: data.birthMonth,
        day: data.birthDay,
        hour: data.birthHour,
        minute: data.birthMinute,
        timezone: data.timezone,
        latitude: data.latitude,
        longitude: data.longitude,
        birthPlace: data.birthPlace,
      }),
    })
    // ... rest of existing logic (save readings, save clients, redirect)
  } finally {
    setIsLoading(false)
  }
}
```

The client save POST already uses the same field names — just pass the mapped values.

- [ ] **Step 2: Remove HOUR_OPTIONS array**

The earthly branch hour selector is no longer needed. The shared form uses 0-23 hour select. Remove the `HOUR_OPTIONS` const. Tu-Vi's backend (`computeTuVi`) already accepts numeric hours.

- [ ] **Step 3: Verify Tu-Vi calculator works**

```bash
npm run build
```

Navigate to `/tu-vi/calculator`, fill in form, submit, verify chart displays and client saves.

- [ ] **Step 4: Commit**

```bash
git add src/app/tu-vi/calculator/page.tsx
git commit -m "refactor: migrate Tu-Vi calculator to shared BirthInputForm"
```

---

## Task 6: Refactor HD Calculator to Use Shared Form

**Files:**
- Modify: `src/app/human-design/calculator/page.tsx`

- [ ] **Step 1: Replace inline form with shared component**

Remove all inline form state and JSX. Use the shared form with `showBirthTimeUnknown={true}`:

```tsx
<BirthInputForm
  onSubmit={handleSubmit}
  loading={isLoading}
  showBirthTimeUnknown={true}
/>
```

Map `BirthFormData` in handleSubmit:

```typescript
const handleSubmit = async (data: BirthFormData) => {
  const calcBody = {
    name: data.name,
    gender: data.gender,
    year: data.birthYear,
    month: data.birthMonth,
    day: data.birthDay,
    hour: data.birthTimeUnknown ? 12 : data.birthHour,
    minute: data.birthTimeUnknown ? 0 : data.birthMinute,
    timezone: data.timezone,
    latitude: data.latitude,
    longitude: data.longitude,
    birthTimeUnknown: data.birthTimeUnknown,
  }
  // ... calculate, save reading, redirect (existing logic)
}
```

- [ ] **Step 2: Add client save call**

After the reading save, add client save (same pattern as Tu-Vi):

```typescript
// Fire-and-forget client save
fetch('/api/human-design/clients', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: data.name,
    gender: data.gender,
    year: data.birthYear,
    month: data.birthMonth,
    day: data.birthDay,
    hour: data.birthTimeUnknown ? null : data.birthHour,
    minute: data.birthTimeUnknown ? null : data.birthMinute,
    birthTimeUnknown: data.birthTimeUnknown,
    birthPlace: data.birthPlace,
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
  }),
}).catch(() => {})
```

- [ ] **Step 3: Verify HD calculator works**

```bash
npm run build
```

Navigate to `/human-design/calculator`, test with and without "birth time unknown" checked.

- [ ] **Step 4: Commit**

```bash
git add src/app/human-design/calculator/page.tsx
git commit -m "refactor: migrate HD calculator to shared BirthInputForm, add client save"
```

---

## Task 7: Auto-Profile Creation Utility

**Files:**
- Create: `src/lib/shared/auto-profile.ts`
- Reference: `prisma/schema.prisma`

Shared utility used by all three client API endpoints.

- [ ] **Step 1: Create auto-profile utility**

```typescript
// src/lib/shared/auto-profile.ts
import { PrismaClient, Prisma } from '@prisma/client'

type SystemType = 'bazi' | 'tuvi' | 'hd'

interface ClientMatch {
  name: string
  birthYear: number
  birthMonth: number
  birthDay: number
  gender: string  // normalized to 'male' | 'female'
}

/**
 * Find or create a ClientProfile for a newly created system client.
 * Runs inside caller's transaction.
 */
export async function findOrCreateProfile(
  tx: Prisma.TransactionClient,
  system: SystemType,
  clientId: string,
  match: ClientMatch,
): Promise<string> {
  // Normalize gender for matching
  const normalizedGender = match.gender === 'Nam' ? 'male'
    : match.gender === 'Nữ' ? 'female'
    : match.gender

  // Find existing profile by matching linked clients' birth data + gender
  // Gender is normalized: Bazi stores 'male'/'female', Tu-Vi stores 'Nam'/'Nữ'
  const genderVariants = normalizedGender === 'male' ? ['male', 'Nam'] : ['female', 'Nữ']

  const existing = await tx.clientProfile.findFirst({
    where: {
      name: match.name,
      OR: [
        {
          baziClient: {
            birthYear: match.birthYear,
            birthMonth: match.birthMonth,
            birthDay: match.birthDay,
            gender: { in: genderVariants },
          },
        },
        {
          tuViClient: {
            birthYear: match.birthYear,
            birthMonth: match.birthMonth,
            birthDay: match.birthDay,
            gender: { in: genderVariants },
          },
        },
        {
          hdClient: {
            birthYear: match.birthYear,
            birthMonth: match.birthMonth,
            birthDay: match.birthDay,
            gender: { in: genderVariants },
          },
        },
      ],
    },
  })

  const linkField = system === 'bazi' ? 'baziClientId'
    : system === 'tuvi' ? 'tuViClientId'
    : 'hdClientId'

  if (existing) {
    // Link to existing profile
    const updated = await tx.clientProfile.update({
      where: { id: existing.id },
      data: { [linkField]: clientId },
    })
    return updated.id
  }

  // Create new profile
  const profile = await tx.clientProfile.create({
    data: {
      name: match.name,
      [linkField]: clientId,
    },
  })
  return profile.id
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/shared/auto-profile.ts
git commit -m "feat: add auto-profile creation utility for client endpoints"
```

---

## Task 8: Update Bazi Clients API

**Files:**
- Modify: `src/app/api/bazi/clients/route.ts:7-44`

- [ ] **Step 1: Add location fields and auto-profile to POST handler**

Update the POST handler to:
1. Accept location fields from request body
2. Store them on BaziClient
3. Auto-create ClientProfile in a transaction

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeBazi, HEAVENLY_STEMS } from '@/lib/bazi'
import type { BirthInput } from '@/lib/bazi'
import { findOrCreateProfile } from '@/lib/shared/auto-profile'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, gender, year, month, day, hour, minute,
            birthPlace, latitude, longitude, timezone } = body

    const result = await prisma.$transaction(async (tx) => {
      // Compute bazi chart (same pattern as existing)
      const input: BirthInput = { name, gender, year, month, day, hour: hour ?? 0, minute: minute ?? 0 }
      const baziResult = computeBazi(input)

      // Build day master label
      const dmStem = HEAVENLY_STEMS[baziResult.dayMasterIndex]
      const dayMaster = `${dmStem.name} ${dmStem.element}`

      // Build chart summary from tứ trụ
      const { tutru } = baziResult
      const chartSummary = `${tutru.thienTru.can}${tutru.thienTru.chi} ${tutru.nguyetTru.can}${tutru.nguyetTru.chi} ${tutru.nhatTru.can}${tutru.nhatTru.chi} ${tutru.thoiTru.can}${tutru.thoiTru.chi}`

      // Create client with location fields
      const client = await tx.baziClient.create({
        data: {
          name, gender,
          birthYear: year, birthMonth: month, birthDay: day,
          birthHour: hour ?? 0, birthMinute: minute ?? 0,
          birthPlace: birthPlace ?? null,
          latitude: latitude ?? null,
          longitude: longitude ?? null,
          timezone: timezone ?? null,
          dayMaster, chartSummary,
          fullChart: JSON.stringify(baziResult),
        },
      })

      // Auto-create profile
      const profileId = await findOrCreateProfile(tx, 'bazi', client.id, {
        name, birthYear: year, birthMonth: month, birthDay: day, gender,
      })

      return { id: client.id, profileId, dayMaster, chartSummary }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Save bazi client error:', error)
    return NextResponse.json({ error: 'Failed to save client' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Verify**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/bazi/clients/route.ts
git commit -m "feat: add location fields and auto-profile to Bazi clients API"
```

---

## Task 9: Update Tu-Vi Clients API

**Files:**
- Modify: `src/app/api/tu-vi/clients/route.ts:6-54`

- [ ] **Step 1: Add auto-profile creation to POST handler**

Wrap existing client creation in a transaction and add `findOrCreateProfile`:

```typescript
import { findOrCreateProfile } from '@/lib/shared/auto-profile'

export async function POST(req: Request) {
  const { name, gender, year, month, day, hour, minute,
          timezone, latitude, longitude, birthPlace } = await req.json()

  const result = await prisma.$transaction(async (tx) => {
    // Existing: compute chart
    const input: TuViBirthInput = { name, gender, year, month, day, hour, minute,
                                     timezone, latitude, longitude, birthPlace }
    const chart = computeTuVi(input)
    const cucName = chart.profile.cucName
    const chartSummary = /* existing logic */

    const client = await tx.tuViClient.create({
      data: {
        name, gender,
        birthYear: year, birthMonth: month, birthDay: day,
        birthHour: hour, birthMinute: minute,
        birthPlace, latitude, longitude, timezone,
        cucName, chartSummary,
        fullChart: JSON.stringify(chart),
      },
    })

    const profileId = await findOrCreateProfile(tx, 'tuvi', client.id, {
      name, birthYear: year, birthMonth: month, birthDay: day, gender,
    })

    return { id: client.id, profileId, cucName, chartSummary }
  })

  return Response.json(result)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/tu-vi/clients/route.ts
git commit -m "feat: add auto-profile creation to Tu-Vi clients API"
```

---

## Task 10: Create HD Clients API

**Files:**
- Create: `src/app/api/human-design/clients/route.ts`
- Reference: `src/app/api/tu-vi/clients/route.ts` (pattern to follow)

- [ ] **Step 1: Create the endpoint**

```typescript
// src/app/api/human-design/clients/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeHumanDesign } from '@/lib/human-design'
import { findOrCreateProfile } from '@/lib/shared/auto-profile'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, gender, year, month, day, hour, minute,
            birthTimeUnknown, birthPlace, latitude, longitude, timezone } = body

    // Gender is required — reject empty/missing
    if (!gender) {
      return NextResponse.json({ error: 'Gender is required' }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      // Compute chart
      const input = {
        name, gender,
        year, month, day,
        hour: birthTimeUnknown ? 12 : hour,
        minute: birthTimeUnknown ? 0 : minute,
        timezone, latitude, longitude,
        birthTimeUnknown,
      }
      const chart = computeHumanDesign(input)
      const designType = chart.type  // e.g., "Generator"
      const chartSummary = `${chart.type} · ${chart.authority}`

      const client = await tx.humanDesignClient.create({
        data: {
          name,
          gender,
          birthYear: year, birthMonth: month, birthDay: day,
          birthHour: birthTimeUnknown ? null : hour,
          birthMinute: birthTimeUnknown ? null : minute,
          birthTimeUnknown: birthTimeUnknown ?? false,
          birthPlace: birthPlace ?? null,
          latitude: latitude ?? null,
          longitude: longitude ?? null,
          timezone: timezone ?? null,
          designType, chartSummary,
          fullChart: JSON.stringify(chart),
        },
      })

      const profileId = await findOrCreateProfile(tx, 'hd', client.id, {
        name, birthYear: year, birthMonth: month, birthDay: day, gender,
      })

      return { id: client.id, profileId, designType, chartSummary }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Save HD client error:', error)
    return NextResponse.json({ error: 'Failed to save client' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    const clients = await prisma.humanDesignClient.findMany({
      where: q ? { name: { contains: q } } : undefined,
      select: {
        id: true, name: true, gender: true,
        birthYear: true, birthMonth: true, birthDay: true,
        birthHour: true, birthTimeUnknown: true,
        birthPlace: true, designType: true, chartSummary: true,
        createdAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('List HD clients error:', error)
    return NextResponse.json({ error: 'Failed to list clients' }, { status: 500 })
  }
}
```

**IMPORTANT:** Verify `computeHumanDesign` exists and check its actual export name in `src/lib/human-design/index.ts`. Also verify what properties the returned chart object has (`type`, `authority`, etc.).

- [ ] **Step 2: Commit**

```bash
git add src/app/api/human-design/clients/route.ts
git commit -m "feat: add Human Design clients API with auto-profile"
```

---

## Task 11: Update Admin Clients List API

**Files:**
- Modify: `src/app/api/admin/clients/route.ts:4-47` (GET), `src/app/api/admin/clients/route.ts:49-80` (POST)

- [ ] **Step 1: Add hasHd to GET response**

In the GET handler, update the include to add `hdClient`:

```typescript
include: {
  baziClient: true,
  tuViClient: true,
  hdClient: true,  // ADD
  tokens: { /* existing */ },
},
```

In the map function, add:

```typescript
hasHd: !!p.hdClient,
```

- [ ] **Step 2: Accept hdClientId in POST handler**

Update the POST handler to accept `hdClientId`:

```typescript
const { name, baziClientId, tuViClientId, hdClientId } = body
```

Add validation for hdClientId (same pattern as bazi/tuvi):

```typescript
if (hdClientId) {
  const hd = await prisma.humanDesignClient.findUnique({ where: { id: hdClientId } })
  if (!hd) return Response.json({ error: 'HD client not found' }, { status: 400 })
  const existing = await prisma.clientProfile.findFirst({ where: { hdClientId } })
  if (existing) return Response.json({ error: 'HD client already linked' }, { status: 400 })
}
```

Update the create call:

```typescript
data: { name, baziClientId, tuViClientId, hdClientId }
```

Update the "at least one reading type" validation to include hdClientId.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/clients/route.ts
git commit -m "feat: add HD support to admin clients list API"
```

---

## Task 12: Update Admin Client Detail API

**Files:**
- Modify: `src/app/api/admin/clients/[id]/route.ts`

- [ ] **Step 1: Add hdClient to GET response**

Update the include in the findUnique:

```typescript
include: {
  baziClient: true,
  tuViClient: true,
  hdClient: true,  // ADD
  tokens: { /* existing */ },
},
```

- [ ] **Step 2: Accept hdClientId in PATCH handler**

Add hdClientId to the PATCH handler, same validation pattern as baziClientId/tuViClientId:

```typescript
const { baziClientId, tuViClientId, hdClientId } = body

if (hdClientId) {
  const hd = await prisma.humanDesignClient.findUnique({ where: { id: hdClientId } })
  if (!hd) return Response.json({ error: 'HD client not found' }, { status: 400 })
  const linkedProfile = await prisma.clientProfile.findFirst({
    where: { hdClientId, NOT: { id: params.id } },
  })
  if (linkedProfile) return Response.json({ error: 'HD client already linked' }, { status: 400 })
}
```

Include `hdClientId` in the update data.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/clients/[id]/route.ts
git commit -m "feat: add HD support to admin client detail API"
```

---

## Task 13: Update Admin Unlinked Clients API

**Files:**
- Modify: `src/app/api/admin/clients/unlinked/route.ts`

- [ ] **Step 1: Add HD clients to unlinked query**

Add a third parallel query for unlinked HD clients:

```typescript
const [baziClients, tuViClients, hdClients] = await Promise.all([
  prisma.baziClient.findMany({ where: { clientProfile: null } }),
  prisma.tuViClient.findMany({ where: { clientProfile: null } }),
  prisma.humanDesignClient.findMany({ where: { clientProfile: null } }),
])
```

Map HD clients to the common format:

```typescript
const hdMapped = hdClients.map(c => ({ id: c.id, name: c.name, type: 'hd' as const }))
```

Merge all three arrays and sort.

- [ ] **Step 2: Commit**

```bash
git add src/app/api/admin/clients/unlinked/route.ts
git commit -m "feat: add HD clients to unlinked clients API"
```

---

## Task 14: Admin Generate Additional Readings Endpoint

**Files:**
- Create: `src/app/api/admin/clients/[id]/generate/route.ts`

- [ ] **Step 1: Create the generate endpoint**

```typescript
// src/app/api/admin/clients/[id]/generate/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeBazi, HEAVENLY_STEMS } from '@/lib/bazi'
import { computeTuVi } from '@/lib/tu-vi'
import { computeHumanDesign } from '@/lib/human-design'
import type { BirthInput } from '@/lib/bazi/types'
import type { TuViBirthInput } from '@/lib/tu-vi/types'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const { system } = await req.json()

  if (!['bazi', 'tuvi', 'hd'].includes(system)) {
    return NextResponse.json({ error: 'Invalid system' }, { status: 400 })
  }

  // Load profile with all linked clients
  const profile = await prisma.clientProfile.findUnique({
    where: { id },
    include: { baziClient: true, tuViClient: true, hdClient: true },
  })

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Get birth data from any existing linked client
  const source = profile.baziClient ?? profile.tuViClient ?? profile.hdClient
  if (!source) {
    return NextResponse.json({ error: 'No birth data available' }, { status: 400 })
  }

  // Validate gender is not empty
  if (!source.gender) {
    return NextResponse.json({ error: 'Source client has no gender set' }, { status: 400 })
  }

  // Check system not already linked
  if (system === 'bazi' && profile.baziClientId) {
    return NextResponse.json({ error: 'Bazi already generated' }, { status: 400 })
  }
  if (system === 'tuvi' && profile.tuViClientId) {
    return NextResponse.json({ error: 'Tu-Vi already generated' }, { status: 400 })
  }
  if (system === 'hd' && profile.hdClientId) {
    return NextResponse.json({ error: 'HD already generated' }, { status: 400 })
  }

  // Helper to extract location from source (Bazi may not have it, Tu-Vi and HD do)
  const getLocation = () => ({
    birthPlace: ('birthPlace' in source ? (source as any).birthPlace : null) ?? 'TP. Hồ Chí Minh',
    latitude: ('latitude' in source ? (source as any).latitude : null) ?? 10.8231,
    longitude: ('longitude' in source ? (source as any).longitude : null) ?? 106.6297,
    timezone: ('timezone' in source ? (source as any).timezone : null) ?? 'Asia/Ho_Chi_Minh',
  })

  const result = await prisma.$transaction(async (tx) => {
    if (system === 'bazi') {
      const input: BirthInput = {
        name: source.name,
        gender: normalizeGender(source.gender),
        year: source.birthYear,
        month: source.birthMonth,
        day: source.birthDay,
        hour: source.birthHour ?? 12,
        minute: source.birthMinute ?? 0,
      }
      const baziResult = computeBazi(input)

      // Build day master label (same pattern as bazi clients API)
      const dmStem = HEAVENLY_STEMS[baziResult.dayMasterIndex]
      const dayMaster = `${dmStem.name} ${dmStem.element}`

      // Build chart summary from tứ trụ
      const { tutru } = baziResult
      const chartSummary = `${tutru.thienTru.can}${tutru.thienTru.chi} ${tutru.nguyetTru.can}${tutru.nguyetTru.chi} ${tutru.nhatTru.can}${tutru.nhatTru.chi} ${tutru.thoiTru.can}${tutru.thoiTru.chi}`

      const loc = getLocation()
      const client = await tx.baziClient.create({
        data: {
          name: source.name, gender: input.gender,
          birthYear: input.year, birthMonth: input.month, birthDay: input.day,
          birthHour: input.hour, birthMinute: input.minute,
          birthPlace: loc.birthPlace, latitude: loc.latitude,
          longitude: loc.longitude, timezone: loc.timezone,
          dayMaster, chartSummary,
          fullChart: JSON.stringify(baziResult),
        },
      })
      await tx.clientProfile.update({
        where: { id },
        data: { baziClientId: client.id },
      })
      return { clientId: client.id, chartSummary }
    }

    if (system === 'tuvi') {
      const tuViGender = source.gender === 'male' ? 'Nam'
        : source.gender === 'female' ? 'Nữ'
        : source.gender  // already Vietnamese
      const input: TuViBirthInput = {
        name: source.name,
        gender: tuViGender as 'Nam' | 'Nữ',
        year: source.birthYear,
        month: source.birthMonth,
        day: source.birthDay,
        hour: source.birthHour ?? 12,
        minute: source.birthMinute ?? 0,
        timezone: ('timezone' in source ? (source as any).timezone : null) ?? 'Asia/Ho_Chi_Minh',
        latitude: ('latitude' in source ? (source as any).latitude : null) ?? 10.8231,
        longitude: ('longitude' in source ? (source as any).longitude : null) ?? 106.6297,
        birthPlace: ('birthPlace' in source ? (source as any).birthPlace : null) ?? 'TP. Hồ Chí Minh',
      }
      const chart = computeTuVi(input)
      const cucName = chart.profile.cucName
      const chartSummary = `${cucName}`
      const client = await tx.tuViClient.create({
        data: {
          name: source.name, gender: tuViGender,
          birthYear: input.year, birthMonth: input.month, birthDay: input.day,
          birthHour: input.hour, birthMinute: input.minute,
          birthPlace: input.birthPlace, latitude: input.latitude,
          longitude: input.longitude, timezone: input.timezone,
          cucName, chartSummary,
          fullChart: JSON.stringify(chart),
        },
      })
      await tx.clientProfile.update({
        where: { id },
        data: { tuViClientId: client.id },
      })
      return { clientId: client.id, chartSummary }
    }

    if (system === 'hd') {
      const input = {
        name: source.name,
        gender: normalizeGender(source.gender),
        year: source.birthYear,
        month: source.birthMonth,
        day: source.birthDay,
        hour: source.birthHour ?? 12,
        minute: source.birthMinute ?? 0,
        timezone: ('timezone' in source ? (source as any).timezone : null) ?? 'Asia/Ho_Chi_Minh',
        latitude: ('latitude' in source ? (source as any).latitude : null) ?? 10.8231,
        longitude: ('longitude' in source ? (source as any).longitude : null) ?? 106.6297,
      }
      const chart = computeHumanDesign(input)
      const designType = chart.type
      const chartSummary = `${chart.type} · ${chart.authority}`
      const client = await tx.humanDesignClient.create({
        data: {
          name: source.name, gender: normalizeGender(source.gender),
          birthYear: input.year, birthMonth: input.month, birthDay: input.day,
          birthHour: source.birthHour, birthMinute: source.birthMinute,
          birthTimeUnknown: source.birthHour == null,
          birthPlace: ('birthPlace' in source ? (source as any).birthPlace : null),
          latitude: input.latitude, longitude: input.longitude,
          timezone: input.timezone,
          designType, chartSummary,
          fullChart: JSON.stringify(chart),
        },
      })
      await tx.clientProfile.update({
        where: { id },
        data: { hdClientId: client.id },
      })
      return { clientId: client.id, chartSummary }
    }

    throw new Error('Invalid system')
  })

  return NextResponse.json({ success: true, ...result })
}

function normalizeGender(g: string): 'male' | 'female' {
  if (g === 'Nam' || g === 'male') return 'male'
  return 'female'
}
```

Verify exact import paths for `computeBazi`, `computeTuVi`, `computeHumanDesign` by checking `src/lib/bazi/index.ts`, `src/lib/tu-vi/index.ts`, `src/lib/human-design/index.ts`.

- [ ] **Step 2: Commit**

```bash
git add src/app/api/admin/clients/[id]/generate/route.ts
git commit -m "feat: add admin endpoint to generate additional readings for clients"
```

---

## Task 15: Update Admin Client Detail Page

**Files:**
- Modify: `src/app/admin/clients/[id]/page.tsx`

- [ ] **Step 1: Update ClientDetail interface**

Add HD fields to the `ClientDetail` interface (around line 17):

```typescript
hdClientId: string | null
hdClient: {
  name: string
  gender: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number | null
  birthTimeUnknown: boolean
  designType: string | null
  chartSummary: string | null
} | null
```

- [ ] **Step 2: Add HD tab**

Update `activeTab` type to include `'hd'`:

```typescript
const [activeTab, setActiveTab] = useState<'bazi' | 'tuvi' | 'hd'>('bazi')
```

Add the HD tab button alongside existing Bazi and TuVi tabs. Add the HD tab content panel showing designType, chartSummary, and birth data.

- [ ] **Step 3: Add generate buttons for missing systems**

For each system NOT linked to the profile, show a "Generate" button:

```tsx
{!client.baziClientId && (
  <button onClick={() => handleGenerate('bazi')}>Generate Bazi</button>
)}
{!client.tuViClientId && (
  <button onClick={() => handleGenerate('tuvi')}>Generate Tu-Vi</button>
)}
{!client.hdClientId && (
  <button onClick={() => handleGenerate('hd')}>Generate HD</button>
)}
```

Add the handler:

```typescript
const handleGenerate = async (system: string) => {
  setGenerating(system)
  try {
    const res = await fetch(`/api/admin/clients/${id}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system }),
    })
    if (res.ok) {
      // Refresh client data
      fetchClient()
    }
  } finally {
    setGenerating(null)
  }
}
```

- [ ] **Step 4: Add HD reading token button**

In the token generation section, add an "HD Link" button alongside "Bazi Link" and "TuVi Link":

```tsx
{client.hdClientId && (
  <button onClick={() => handleGenerateToken('hd')}>
    HD Link
  </button>
)}
```

- [ ] **Step 5: Verify admin page works**

```bash
npm run build
```

Navigate to `/admin`, log in, view a client detail page. Verify:
- HD tab shows if hdClient exists
- Generate buttons show for missing systems
- Generate actually creates the reading and refreshes

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/clients/[id]/page.tsx
git commit -m "feat: add HD tab and generate buttons to admin client detail page"
```

---

## Task 16: Migration Script for Existing Clients

**Files:**
- Create: `scripts/migrate-client-profiles.ts`

- [ ] **Step 1: Create migration script**

```typescript
// scripts/migrate-client-profiles.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Find all clients without profiles
  const [baziClients, tuViClients] = await Promise.all([
    prisma.baziClient.findMany({ where: { clientProfile: null } }),
    prisma.tuViClient.findMany({ where: { clientProfile: null } }),
  ])

  console.log(`Found ${baziClients.length} unlinked Bazi clients`)
  console.log(`Found ${tuViClients.length} unlinked Tu-Vi clients`)

  // Group by name + birth date + normalized gender
  type Key = string
  const groups = new Map<Key, { baziId?: string; tuViId?: string; name: string }>()

  const normalize = (g: string) => (g === 'Nam' || g === 'male') ? 'male' : 'female'
  const key = (name: string, y: number, m: number, d: number, g: string): Key =>
    `${name}|${y}|${m}|${d}|${normalize(g)}`

  for (const c of baziClients) {
    const k = key(c.name, c.birthYear, c.birthMonth, c.birthDay, c.gender)
    const group = groups.get(k) ?? { name: c.name }
    group.baziId = c.id
    groups.set(k, group)
  }

  for (const c of tuViClients) {
    const k = key(c.name, c.birthYear, c.birthMonth, c.birthDay, c.gender)
    const existing = groups.get(k)
    if (existing) {
      existing.tuViId = c.id
    } else {
      groups.set(k, { name: c.name, tuViId: c.id })
    }
  }

  let created = 0
  let skipped = 0

  for (const [, group] of groups) {
    try {
      await prisma.clientProfile.create({
        data: {
          name: group.name,
          baziClientId: group.baziId ?? null,
          tuViClientId: group.tuViId ?? null,
        },
      })
      created++
    } catch (e) {
      // Skip if already linked (unique constraint)
      skipped++
    }
  }

  console.log(`Created ${created} profiles, skipped ${skipped}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

- [ ] **Step 2: Run it**

```bash
npx tsx scripts/migrate-client-profiles.ts
```

- [ ] **Step 3: Verify**

Check the database to confirm profiles were created:

```bash
npx prisma studio
```

- [ ] **Step 4: Commit**

```bash
git add scripts/migrate-client-profiles.ts
git commit -m "feat: add migration script to create profiles for existing unlinked clients"
```

---

## Task 17: Final Verification

- [ ] **Step 1: Full build check**

```bash
npm run build
```

- [ ] **Step 2: End-to-end test flow**

1. Go to `/bazi` → fill form → calculate → save client → verify appears in `/admin/clients`
2. Go to `/tu-vi/calculator` → fill form → submit → verify auto-appears in `/admin/clients`
3. Go to `/human-design/calculator` → fill form → submit → verify auto-appears in `/admin/clients`
4. In admin, open a client → click "Generate Tu-Vi" → verify it generates and links
5. In admin, generate reading token for HD → verify link works

- [ ] **Step 3: Clean up old Bazi form component**

Verify `src/components/bazi/BirthInputForm.tsx` is deleted and no imports reference it:

```bash
grep -r "components/bazi/BirthInputForm" src/
```

If the directory `src/components/bazi/` is now empty (after deleting BirthInputForm), check if other components live there. Only delete directory if empty.

- [ ] **Step 4: Final commit if any cleanup needed**

```bash
git add -A
git commit -m "chore: final cleanup for unified calculator migration"
```
