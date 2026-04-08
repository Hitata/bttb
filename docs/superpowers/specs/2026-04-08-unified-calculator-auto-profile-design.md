# Unified Birth Calculator & Auto-Profile Creation

**Date:** 2026-04-08
**Status:** Draft

## Problem

Three calculator pages (Bazi, Tu-Vi, Human Design) each implement their own birth input form with overlapping fields. When a client submits, `ClientProfile` is not auto-created — admin must manually link clients. Human Design has no client model at all.

## Solution

1. One shared `<BirthInputForm />` component used by all three calculator pages
2. Auto-create `ClientProfile` on every calculator submission (backend)
3. Add `HumanDesignClient` model and wire it into `ClientProfile`
4. Admin can generate additional readings for existing clients from the admin panel

## Design

### 1. Shared Form Component

**File:** `src/components/shared/BirthInputForm.tsx`

A pure, system-agnostic form that collects birth data.

**Fields (always shown):**

| Field | Type | Notes |
|-------|------|-------|
| name | text | Required |
| gender | select | "male" / "female" (pages can display as Nam/Nữ) |
| birthYear | number | 1900–2100 |
| birthMonth | select | 1–12 |
| birthDay | select | 1–31 |
| birthHour | select | 0–23 |
| birthMinute | select | 0–59 |
| birthTimeUnknown | checkbox | When checked, defaults to 12:00. Only visually shown on HD page, but always part of the data model. |
| birthPlace | select + custom | City presets (HCMC, Hanoi, etc.) + custom option |
| timezone | text | Auto-filled from city, editable for custom |
| latitude | number | Auto-filled from city, editable for custom |
| longitude | number | Auto-filled from city, editable for custom |

**Props:**

```typescript
interface BirthFormData {
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
  showBirthTimeUnknown?: boolean  // only true on HD page
}
```

**Field name mapping:** The form uses `birthYear`, `birthMonth`, etc. Existing APIs use `year`, `month`, `day`. Each wrapper page maps field names before calling its API — the form contract stays clean, APIs stay unchanged.

**Tu-Vi hour handling:** The form collects precise hours (0-23). Tu-Vi's `computeTuVi` function handles mapping to Earthly Branches internally — no special handling needed in the form.

**Migration from existing forms:**

- Extracts city presets from Tu-Vi/HD calculator (they're identical)
- Replaces `BirthInputForm` in `src/components/bazi/BirthInputForm.tsx` (old Bazi-only form)
- Replaces inline forms in Tu-Vi and HD calculator pages

### 2. System-Specific Wrapper Pages

Each page uses `<BirthInputForm />` and handles its own submission.

**Bazi page** (`src/app/bazi/page.tsx`):
- Renders `<BirthInputForm showBirthTimeUnknown={false} />`
- On submit: POST `/api/bazi/calculate` → display chart
- Save client: POST `/api/bazi/clients` triggered by separate "Lưu khách hàng" button (preserves existing two-step UX: calculate first, then optionally save). Auto-profile creation happens at this save step, not on form submit.

**Tu-Vi page** (`src/app/tu-vi/calculator/page.tsx`):
- Renders `<BirthInputForm showBirthTimeUnknown={false} />`
- On submit: POST `/api/tu-vi/calculate` → POST `/api/tu-vi/readings` + POST `/api/tu-vi/clients`
- Redirects to chart view

**HD page** (`src/app/human-design/calculator/page.tsx`):
- Renders `<BirthInputForm showBirthTimeUnknown={true} />`
- On submit: POST `/api/human-design/calculate` → POST `/api/human-design/readings` + POST `/api/human-design/clients` (new)
- Redirects to chart view

### 3. Database Changes

#### New model: `HumanDesignClient`

```prisma
model HumanDesignClient {
  id             String   @id @default(cuid())
  name           String
  gender         String
  birthYear      Int
  birthMonth     Int
  birthDay       Int
  birthHour      Int?
  birthMinute    Int?
  birthTimeUnknown Boolean @default(false)
  birthPlace     String?
  latitude       Float?
  longitude      Float?
  timezone       String?
  designType     String?      // e.g., "Generator", "Projector"
  chartSummary   String?
  fullChart      String?      // JSON
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  clientProfile  ClientProfile?

  @@index([name])
}
```

#### Updated model: `ClientProfile`

```prisma
model ClientProfile {
  id              String   @id @default(cuid())
  name            String
  baziClientId    String?  @unique
  tuViClientId    String?  @unique
  hdClientId      String?  @unique      // NEW
  baziClient      BaziClient?    @relation(fields: [baziClientId], references: [id])
  tuViClient      TuViClient?    @relation(fields: [tuViClientId], references: [id])
  hdClient        HumanDesignClient? @relation(fields: [hdClientId], references: [id])  // NEW
  tokens          ReadingToken[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

#### Updated model: `BaziClient`

Add location fields so all clients store location uniformly:

```prisma
model BaziClient {
  // ... existing fields ...
  birthPlace     String?    // NEW
  latitude       Float?     // NEW
  longitude      Float?     // NEW
  timezone       String?    // NEW
}
```

### 4. Backend: Auto-Create ClientProfile

Each system's `/api/{system}/clients` POST endpoint gains this logic:

```
1. Validate input
2. Compute chart (system-specific)
3. Create {System}Client record
4. Check if ClientProfile with same name + birth date exists
   → If yes: link this client record to existing profile
   → If no: create new ClientProfile and link
5. Return { id, profileId, ...summary }
```

**Matching logic for existing profiles:** Match on `name` + `birthYear` + `birthMonth` + `birthDay` + `gender`. Adding gender reduces false matches for common names with the same birth date.

**Transaction:** Steps 3-4 run in a Prisma transaction to prevent orphaned records.

**Gender mapping:** The shared form uses `'male' | 'female'` internally. Each wrapper page maps before calling its API:
- Bazi: uses `'male' | 'female'` as-is
- Tu-Vi: maps to `'Nam' | 'Nữ'` (Vietnamese convention used by `computeTuVi`)
- HD: uses `'male' | 'female'` as-is

The `ClientProfile` matching normalizes gender for comparison (treats `'Nam'` = `'male'`, `'Nữ'` = `'female'`).

### 5. New API: `/api/human-design/clients`

**POST:** Creates `HumanDesignClient` + auto-creates/links `ClientProfile`. Same pattern as Bazi and Tu-Vi client endpoints.

**GET:** Lists HD clients with search. Same pattern as other client list endpoints.

### 6. Admin: Generate Additional Readings

**Location:** `/admin/clients/[id]` page

For each system NOT yet linked to the client profile, show a "Generate {System}" button.

**Flow:**
1. Admin clicks "Generate Tu-Vi" on a client that only has Bazi
2. Backend calls the calculation API with the client's stored birth data
3. Creates the system-specific client record
4. Links it to the existing `ClientProfile`
5. UI refreshes to show the new reading

**API:** `POST /api/admin/clients/[id]/generate`

```typescript
// Request
{ system: 'bazi' | 'tuvi' | 'hd' }

// Response
{ success: true, clientId: string, chartSummary: string }
```

This endpoint:
1. Loads the `ClientProfile` and its linked clients
2. Gets birth data from any existing linked client
3. Runs the requested system's calculation
4. Creates the new client record and links it to the profile

### 7. Updated Admin Client List & Detail

The `/api/admin/clients` GET endpoint already returns `hasBazi` and `hasTuVi`. Add `hasHd` to show which systems each client has.

**Reading tokens for HD:** Add `'hd'` as a valid `clientType` for `ReadingToken`. The admin detail page adds an "HD Link" button alongside existing "Bazi Link" and "TuVi Link" buttons.

**Admin detail page:** Add an HD tab to show HD chart data alongside existing Bazi and Tu-Vi tabs. Update the `ClientDetail` interface to include `hdClient`.

**Admin endpoints to update:**
- `GET/PATCH /api/admin/clients/[id]` — include `hdClient` in response, accept `hdClientId` in PATCH
- `GET /api/admin/clients/unlinked` — also query `HumanDesignClient` records with no linked profile

### 8. Migration Path

The existing unlinked `BaziClient` and `TuViClient` records need `ClientProfile` records. A one-time migration script will:

1. Group existing clients by `name` + `birthYear` + `birthMonth` + `birthDay` + normalized gender
2. For each group, create one `ClientProfile` linking all matching clients
3. For ungrouped clients, create individual `ClientProfile` records
4. Skip clients that already have a `ClientProfile` (idempotent — safe to re-run)
5. Run inside a transaction per group to avoid partial state
6. If a group has conflicting genders (e.g., BaziClient says "male", TuViClient says "Nữ"), skip it and log a warning for manual resolution

## File Changes Summary

| File | Action |
|------|--------|
| `prisma/schema.prisma` | Add `HumanDesignClient`, update `ClientProfile` + `BaziClient` |
| `src/components/shared/BirthInputForm.tsx` | New — shared form component |
| `src/app/bazi/page.tsx` | Refactor to use shared form |
| `src/app/tu-vi/calculator/page.tsx` | Refactor to use shared form |
| `src/app/human-design/calculator/page.tsx` | Refactor to use shared form + add client save |
| `src/app/api/bazi/clients/route.ts` | Add auto-profile creation + location fields |
| `src/app/api/tu-vi/clients/route.ts` | Add auto-profile creation |
| `src/app/api/human-design/clients/route.ts` | New — HD client endpoint |
| `src/app/api/admin/clients/route.ts` | Add `hasHd` to response |
| `src/app/api/admin/clients/[id]/route.ts` | Add `hdClient` to GET response, accept `hdClientId` in PATCH |
| `src/app/api/admin/clients/[id]/generate/route.ts` | New — generate additional readings |
| `src/app/api/admin/clients/unlinked/route.ts` | Add `HumanDesignClient` query |
| `src/app/admin/clients/[id]/page.tsx` | Add HD tab, generate buttons, HD reading token support |
| `src/components/bazi/BirthInputForm.tsx` | Delete (replaced by shared component) |
| `prisma/migrations/...` | New migration for schema changes |
| `scripts/migrate-client-profiles.ts` | One-time script to create profiles for existing clients |
