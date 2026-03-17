# Architecture

**Analysis Date:** 2026-03-18

## Pattern Overview

**Overall:** Three-tier web application with domain-driven Bazi calculation engine

**Key Characteristics:**
- Frontend layer: Next.js App Router with React 19 for UI
- API layer: Next.js Route Handlers for HTTP endpoints
- Domain layer: Pure calculation library with zero dependencies
- Persistent layer: Prisma ORM with SQLite database

## Layers

**Presentation Layer:**
- Purpose: Render UI and manage client-side state
- Location: `src/app/` (pages), `src/components/` (React components)
- Contains: Page components, form inputs, display components, layouts
- Depends on: `@/lib/bazi` for types and utilities, Next.js, React, shadcn/ui
- Used by: Browser client

**API Layer:**
- Purpose: Handle HTTP requests, authenticate, coordinate domain layer
- Location: `src/app/api/`
- Contains: Route handlers (POST, GET) for `/auth`, `/bazi/calculate`, `/bazi/readings`, `/bazi/daivan`
- Depends on: Domain layer (`@/lib/bazi`), Prisma (`@/lib/prisma`), Auth.js
- Used by: Client-side fetch calls, third-party integrations

**Domain Layer:**
- Purpose: Pure calculation logic for Bazi (Ba Zi / Four Pillars)
- Location: `src/lib/bazi/`
- Contains: Calendar conversion, pillar computation, luck cycles, spirit stars, compass, 10 gods, Na Yin, Thai Menh Cung
- Depends on: Constants only (no external APIs)
- Used by: API handlers, components for type exports

**Authentication Layer:**
- Purpose: Session management and user identity
- Location: `src/lib/auth.ts`
- Contains: NextAuth.js configuration with GitHub and Google providers, Prisma adapter
- Depends on: NextAuth.js, Prisma
- Used by: All protected API routes, SessionProvider wrapper

**Data Access Layer:**
- Purpose: Database operations
- Location: `src/lib/prisma.ts`
- Contains: Prisma client singleton for reuse across handlers
- Depends on: Prisma client
- Used by: API handlers, cached database queries

## Data Flow

**User Reading Creation:**

1. User fills `BirthInputForm` (`src/components/bazi/BirthInputForm.tsx`) with name, gender, birth date/time
2. Form submits POST to `/api/bazi/calculate` with `BirthInput` JSON
3. Route handler (`src/app/api/bazi/calculate/route.ts`) calls `computeBazi()` from `src/lib/bazi/index.ts`
4. Domain layer computes and returns `BaziResult` (pillars, luck cycles, compass, etc.)
5. Handler returns JSON response to client
6. Client renders result using display components: `BaziPillarTable`, `DaiVanSection`, `FengShuiCompass`, `ThanSatTable`, etc.
7. User clicks "Lưu lá số" (Save) → POST to `/api/bazi/readings` with `BaziResult` JSON
8. Route handler authenticates session, stores to `BaziReading` table with serialized result
9. Redirects to `/readings` to list saved charts

**Saved Reading Retrieval:**

1. User navigates to `/readings` (authenticated page)
2. `ReadingsPage` fetches GET `/api/bazi/readings`
3. Handler returns list of user's `BaziReading` records
4. User clicks a saved reading → navigates to `/bazi/[id]`
5. `SavedReadingPage` fetches `GET /api/bazi/readings/[id]`
6. Handler retrieves record, deserializes `result` JSON to `BaziResult`
7. Page renders same components as calculation view

**Celebrity Case Display:**

1. User navigates to `/bazi/cases`
2. Page server-renders (async) and queries `BaziCase.findMany()` from database
3. Maps cases to `CaseCard` components, links to `/bazi/cases/[slug]`
4. User clicks case → navigates to `/bazi/cases/[slug]/page.tsx`
5. Page loads `BaziCase` by slug, deserializes `chartData`, displays with case-specific components

**Dynamic Year Pillar:**

1. User clicks year on `/bazi` chart grid
2. Triggers `handleYearClick()` handler in `BaziPageContent`
3. Calls `GET /api/bazi/daivan/[year]` with query params: `dm`, `yc`, `yb`, `db` (day master and pillar indices)
4. Route handler calls `computeYearPillar()` from domain layer
5. Returns `CurrentYearData` JSON for that year
6. Client merges into state and re-renders current year panel

**State Management:**

- Client components use React hooks (`useState`, `useCallback`, `useEffect`)
- Server components handle async data fetching (Prisma queries)
- Session state via `useSession()` from `next-auth/react`
- Form state managed per-component (BirthInputForm, etc.)
- No external state management library (Redux, Zustand)

## Key Abstractions

**BaziResult:**
- Purpose: Complete Bazi chart output from birth information
- Examples: `src/lib/bazi/types.ts` (interface definition), returned from `computeBazi()`
- Pattern: Nested object structure with pillars, cycles, compass, spirit stars

**BirthInput:**
- Purpose: User-provided birth parameters
- Examples: Name, gender, year, month, day, hour, minute
- Pattern: Simple data transfer object

**Pillar:**
- Purpose: Individual pillar (year/month/day/hour) with all derived properties
- Examples: `Pillar` interface contains stem, branch, ten god, hidden stems, Na Yin, spirit stars
- Pattern: Composition of calculated fields from stem-branch indices

**Computation Modules:**
- `pillars.ts`: Converts birth date to Four Pillars, handles solar-lunar conversion
- `luck-cycles.ts`: Computes Đại Vận (60-year cycles) and 10-year sub-cycles
- `compass.ts`: Calculates feng shui directions and zodiac associations
- `spirit-stars.ts`: Determines Than Sat (auspicious/inauspicious stars)
- `ten-gods.ts`: Maps stem-branch pairs to Ten God relationships to day master
- `na-yin.ts`: Gets Na Yin (sound resonance) for stem-branch pairs
- `life-cycle.ts`: Computes life stage (Trường Sinh - 12 stages)
- Each module exports pure functions with no side effects

## Entry Points

**Web Application:**
- Location: `src/app/layout.tsx`
- Triggers: Browser navigation to `http://localhost:3000`
- Responsibilities: Wraps app in `SessionProvider`, renders header with navigation, renders child pages

**Main Page:**
- Location: `src/app/page.tsx`
- Triggers: GET `/` (root path)
- Responsibilities: Landing page with authenticated greeting, links to Bazi tool, Cases, Saved Readings

**Bazi Calculator:**
- Location: `src/app/bazi/page.tsx`
- Triggers: GET `/bazi`, may include query params: `?name=&gender=&y=&m=&d=&h=&min=`
- Responsibilities: Form input, calculation request, result display with multiple sections

**Saved Reading View:**
- Location: `src/app/bazi/[id]/page.tsx`
- Triggers: GET `/bazi/[id]` (dynamic route with reading ID)
- Responsibilities: Fetch saved BaziReading, deserialize, display read-only chart

**Cases List:**
- Location: `src/app/bazi/cases/page.tsx`
- Triggers: GET `/bazi/cases`
- Responsibilities: Query published BaziCase records, render cards with metadata

**Case Detail:**
- Location: `src/app/bazi/cases/[slug]/page.tsx`
- Triggers: GET `/bazi/cases/[slug]` (dynamic route with case slug)
- Responsibilities: Fetch BaziCase, render detailed analysis with timeline, FAQ, luck pillars

**Saved Readings List:**
- Location: `src/app/readings/page.tsx`
- Triggers: GET `/readings` (authenticated only)
- Responsibilities: Fetch user's BaziReading list, display summary cards

**Sign In:**
- Location: `src/app/signin/page.tsx`
- Triggers: GET `/signin`
- Responsibilities: Auth.js sign-in UI (GitHub, Google providers)

## Error Handling

**Strategy:** Try-catch in API handlers, error boundaries implicit via Suspense fallbacks

**Patterns:**

- **API handlers:** Catch and return `NextResponse.json({ error: string }, { status: number })`
  - Example: `src/app/api/bazi/calculate/route.ts` catches calculation errors, returns 500
  - Example: `src/app/api/bazi/readings/route.ts` checks session, returns 401 if unauthorized

- **Client pages:** Conditional rendering on error state
  - Example: `BaziPageContent` in `src/app/bazi/page.tsx` sets `error` state and displays error message

- **Async operations:** `.catch()` or try-catch in effects/handlers
  - Example: `SavedReadingPage` catches fetch errors and sets `error` to "Không tìm thấy lá số"

- **Silent failures:** Some network calls fail silently (no UI feedback)
  - Example: `handleYearClick` in `src/app/bazi/page.tsx` uses empty catch block

## Cross-Cutting Concerns

**Logging:**
- Only in API handlers: `console.error()` on exceptions
- Examples: `src/app/api/bazi/calculate/route.ts`, `src/app/api/bazi/readings/route.ts`
- No structured logging library; plain console

**Validation:**
- API handlers validate required fields (name, gender, year, month, day)
- Example: `src/app/api/bazi/calculate/route.ts` returns 400 if missing fields
- Type safety via TypeScript interfaces; no runtime schema validation (no Zod, Yup)

**Authentication:**
- All sensitive endpoints guard with `const session = await auth()`
- Returns 401 if session missing
- Examples: `GET /api/bazi/readings`, `POST /api/bazi/readings`
- Public endpoints: `/api/bazi/calculate`, `/api/bazi/daivan/[year]`, GET case endpoints

**Authorization:**
- `BaziReading` queries filter by `userId` from session
- `BaziCase` queries filter by `isPublished: true`
- No role-based access control; simple ownership check

**Rendering Modes:**
- Server Components: Pages (`src/app/**page.tsx`), case detail, cases list use async/await for Prisma
- Client Components: Marked with `'use client'` for interactivity (forms, state, hooks)
- Suspense: Wraps async operations to show fallback UI

---

*Architecture analysis: 2026-03-18*
