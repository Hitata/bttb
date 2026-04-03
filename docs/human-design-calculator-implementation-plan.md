# Human Design Living Bodygraph Calculator — Implementation Plan

## Context

The bttb app has a beautiful 8-chapter Human Design educational section but zero personalization. Users can't calculate their own chart. The Vietnamese HD community has no native-language interactive tool. This plan implements the full Living Bodygraph Calculator (Approach C from the approved design doc at `~/.gstack/projects/Hitata-bttb/hit-main-design-20260401-001943.md`).

User constraints: functional programming style, proper data structures/algorithms, good DB relations.

---

## Step 0: Scope Challenge

### What already exists (reuse, don't rebuild)

| Existing Code | Reuse For |
|---|---|
| `HD_CHANNELS` with `gates: [number, number]` + `fromCenter`/`toCenter` | Channel-to-gate lookup — NO separate `channel-table.ts` needed |
| `HD_CENTERS` with `types: CenterType[]` including `'motor'` | Motor center detection for type derivation |
| `HD_TYPES` with `sacralDefined`/`motorToThroat` flags | Type validation after derivation |
| `HD_PROFILES` with `conscious`/`unconscious` line numbers | Profile lookup after line derivation |
| `GeoVector`, `Ecliptic`, `SunPosition`, `SearchSunLongitude`, `MakeTime` from `astronomy-engine` | Verified API: `GeoVector(body, t, true) → Ecliptic()` for all planets; `SunPosition(t).elon` for Sun; NO `Body.NorthNode` — use mean node formula |
| `BodygraphSvg` component with center shapes/positions | Enhanced via optional props (backward compatible) |
| I Ching `PromptGenerator.tsx` pattern | HD copy prompt component |
| `BaziReading` Prisma schema pattern | `HumanDesignReading` model |
| `Hexagram` model (number, nameVi, nameZh, nameEn) | Seed gate descriptions from hexagram data |

### Scope reduction from design doc

- **REMOVED:** `channel-table.ts` — `HD_CHANNELS` already has gate pairs. One helper function in `derive-chart.ts` replaces it.
- **FIX REQUIRED:** `HD_CHANNELS` has 4 corrupted entries: `'44-26-alt'` (gates [28,38] but wrong ID), `'48-16-alt'` (duplicate of 20-57), `'36-35-alt'` (duplicate of 64-47), `'37-40-alt'` (gates [49,19] but wrong ID). After dedup: audit for exactly 36 unique channels. Fix IDs to match gate pairs. Identify any missing channel.
- **DEFERRED to Phase 2.5:** 384 line descriptions, 768 incarnation cross names
- **DEFERRED to separate design:** Unified cross-system "Today's Energy" view

### File count

| Phase | New Files | Modified Files | Total |
|-------|-----------|----------------|-------|
| 1: Engine + API | 4 new | 2 modified | 6 |
| 2: Interactive UI | 5 new | 1 modified | 6 |
| 3: Transits | 2 new | 1 modified | 3 |
| Skill | 1 new | 0 | 1 |
| **Total** | **12 new** | **4 modified** | **16** |

Still above 8 files, but it's 3 phases with clear phase gates. Phase 1 alone is 6 files — tight and testable.

---

## Architecture

```
                    ┌─────────────────────────────────────────┐
                    │         Birth Input Form                │
                    │  (year, month, day, hour, minute,       │
                    │   timezone IANA, lat, lng)               │
                    └───────────────┬─────────────────────────┘
                                    │ POST
                    ┌───────────────▼─────────────────────────┐
                    │   /api/human-design/calculate            │
                    │   validate → UTC convert → compute       │
                    └───────────────┬─────────────────────────┘
                                    │
              ┌─────────────────────▼──────────────────────────┐
              │          computeHumanDesign(input)              │
              │   src/lib/human-design/index.ts                │
              └──┬──────────────┬───────────────────┬──────────┘
                 │              │                   │
    ┌────────────▼───┐  ┌──────▼────────┐  ┌───────▼──────────┐
    │  gate-table.ts │  │ calculate-    │  │  derive-chart.ts │
    │                │  │ planets.ts    │  │                  │
    │ longitudeToGate│  │               │  │ gates → channels │
    │ (pure lookup)  │  │ 13 bodies ×   │  │ channels → centers│
    │                │  │ 2 timestamps  │  │ centers → type   │
    │ 64 entries     │  │ (Personality  │  │ type → authority │
    │ 5.625°/gate    │  │  + Design)    │  │ sun lines → profile│
    │ 0.9375°/line   │  │               │  │ sun gates → cross│
    └────────────────┘  │ astronomy-    │  └──────────────────┘
                        │ engine        │
                        │ SearchSunLong │
                        │ EclipticGeo..│
                        └───────────────┘
                                    │
              ┌─────────────────────▼──────────────────────────┐
              │           HumanDesignChart (result)             │
              │                                                │
              │  type, strategy, authority, profile,            │
              │  incarnationCross, definedCenters,              │
              │  definedChannels, gateActivations[26],          │
              │  personalityPlanets[13], designPlanets[13]      │
              └──────────────┬─────────────────────────────────┘
                             │
                 ┌───────────┼───────────────┐
                 │           │               │
        ┌────────▼──┐ ┌─────▼─────┐ ┌───────▼──────────┐
        │BodygraphSvg│ │ChartSumm- │ │HDPromptGenerator │
        │(enhanced)  │ │aryPanel   │ │(copy to clipboard│
        │            │ │           │ │ for Claude skill) │
        │Personality │ │Type badge │ │                  │
        │= black     │ │Authority  │ │Structured text   │
        │Design      │ │Profile    │ │matching skill    │
        │= red       │ │Cross      │ │input format      │
        └────────────┘ └───────────┘ └──────────────────┘
```

### Data Flow: Design Date (88° offset)

```
Birth Sun longitude (e.g., 30°)
        │
        ▼
Target = (30 - 88 + 360) % 360 = 302°
        │
        ▼
SearchSunLongitude(302°, birthDate - 100 days, 120)
        │                    ▲
        │            searches FORWARD
        │            from 100 days before birth
        ▼
Design Date ≈ birth - 88 days
        │
        ▼
Calculate 13 bodies at Design Date
```

### Type Derivation Algorithm (graph traversal)

```
Motor centers: Sacral, Heart, Solar Plexus, Root

hasMotorToThroat(definedChannels, definedCenters):
  1. Build adjacency graph from definedChannels
  2. BFS/DFS from each motor center (except Sacral if checking Manifestor)
  3. If any path reaches 'throat' → true

Type derivation:
  ┌─ Sacral defined?
  │  ├─ YES → hasMotorToThroat?
  │  │         ├─ YES → Manifesting Generator
  │  │         └─ NO  → Generator
  │  └─ NO  → hasMotorToThroat? (Heart/SP/Root only)
  │            ├─ YES → Manifestor
  │            └─ NO  → any center defined?
  │                     ├─ YES → Projector
  │                     └─ NO  → Reflector

Authority hierarchy (first defined center wins):
  Solar Plexus → Sacral → Spleen → Heart → G → Throat → None/Lunar
```

---

## Phase 1: Calculation Engine + API

### 1.1 Types — `src/lib/human-design/types.ts` (~80 lines)

```typescript
// Functional style: all types are readonly, all functions are pure

export interface HDBirthInput {
  readonly name: string
  readonly year: number
  readonly month: number
  readonly day: number
  readonly hour: number
  readonly minute: number
  readonly timezone: string      // IANA (authoritative for UTC conversion)
  readonly latitude: number
  readonly longitude: number
  readonly gender?: string
  readonly birthTimeUnknown?: boolean
}

export interface GateActivation {
  readonly gate: number          // 1-64
  readonly line: number          // 1-6
  readonly longitude: number     // ecliptic degrees
  readonly body: CelestialBody
  readonly side: 'personality' | 'design'
}

export type CelestialBody =
  | 'Sun' | 'Earth' | 'Moon' | 'NorthNode' | 'SouthNode'
  | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn'
  | 'Uranus' | 'Neptune' | 'Pluto'

export interface PlanetPosition {
  readonly body: CelestialBody
  readonly longitude: number     // ecliptic degrees 0-360
  readonly gate: number
  readonly line: number
}

export interface PersonalityDesignActivations {
  readonly personality: readonly PlanetPosition[]  // 13 bodies at birth
  readonly design: readonly PlanetPosition[]       // 13 bodies at design date
  readonly designDate: Date
  readonly birthDateUTC: Date
}

export interface DefinedChannel {
  readonly id: string
  readonly gates: readonly [number, number]
  readonly fromCenter: string
  readonly toCenter: string
  readonly activatedBy: {
    readonly gate1: GateActivation
    readonly gate2: GateActivation
  }
}

export type HDAuthorityType =
  | 'emotional' | 'sacral' | 'splenic' | 'ego' | 'self-projected'
  | 'mental' | 'lunar'

export type HDTypeId =
  | 'generator' | 'manifesting-generator' | 'manifestor'
  | 'projector' | 'reflector'

export interface HumanDesignChart {
  readonly input: HDBirthInput
  readonly type: HDTypeId
  readonly authority: HDAuthorityType
  readonly profile: { readonly conscious: number; readonly unconscious: number }
  readonly incarnationCross: {
    readonly personalitySun: number
    readonly personalityEarth: number
    readonly designSun: number
    readonly designEarth: number
  }
  readonly definedCenters: readonly string[]
  readonly undefinedCenters: readonly string[]
  readonly definedChannels: readonly DefinedChannel[]
  readonly gateActivations: readonly GateActivation[]
  readonly personalityPlanets: readonly PlanetPosition[]
  readonly designPlanets: readonly PlanetPosition[]
  readonly designDate: string    // ISO string
  readonly birthDateUTC: string  // ISO string
  readonly birthTimeUnknown: boolean
}
```

### 1.2 Gate Table — `src/lib/human-design/gate-table.ts` (~100 lines)

Pure functional lookup. The gate wheel starts at Gate 41 at 2°00' Aquarius (332.0° ecliptic).

```typescript
// The HD wheel order (64 gates starting from 332.0° ecliptic)
// Each gate spans exactly 5.625°, each line spans 0.9375°
const GATE_WHEEL_ORDER: readonly number[] = [
  41, 19, 13, 49, 30, 55, 37, 63,  // Aquarius → Pisces
  22, 36, 25, 17, 21, 51, 42, 3,   // Pisces → Aries → Taurus
  27, 24, 2, 23, 8, 20, 16, 35,    // Taurus → Gemini
  45, 12, 15, 52, 39, 53, 62, 56,  // Gemini → Cancer
  31, 33, 7, 4, 29, 59, 40, 64,    // Leo → Virgo
  47, 6, 46, 18, 48, 57, 32, 50,   // Virgo → Libra
  28, 44, 1, 43, 14, 34, 9, 5,     // Scorpio → Sagittarius
  26, 11, 10, 58, 38, 54, 61, 60,  // Sagittarius → Capricorn
] as const

const WHEEL_START_DEGREE = 332.0  // Gate 41 starts here

export function longitudeToGate(longitude: number): { gate: number; line: number } {
  // Normalize to 0-360
  const normalized = ((longitude % 360) + 360) % 360
  // Offset from wheel start
  const offset = ((normalized - WHEEL_START_DEGREE) % 360 + 360) % 360
  // Gate index (0-63)
  const gateIndex = Math.floor(offset / 5.625)
  // Line within gate (1-6)
  const lineOffset = offset - (gateIndex * 5.625)
  const line = Math.floor(lineOffset / 0.9375) + 1

  return {
    gate: GATE_WHEEL_ORDER[gateIndex % 64],
    line: Math.min(line, 6),
  }
}
```

### 1.3 Planet Calculation — `src/lib/human-design/calculate-planets.ts` (~160 lines)

```typescript
import { SearchSunLongitude, MakeTime, Body, GeoVector, Ecliptic, SunPosition } from 'astronomy-engine'

// CRITICAL: astronomy-engine API quirks (verified in node):
// - Sun: use SunPosition(t).elon (NOT GeoVector for Sun — it works but SunPosition is cleaner)
// - Earth: = (Sun longitude + 180) % 360 (geocentric Earth is always opposite Sun)
// - Moon + planets: GeoVector(body, t, true) → Ecliptic() → .elon
// - North Node: NO Body.NorthNode in astronomy-engine!
//   Use mean node formula: Omega = (125.04452 - 1934.136261 * T) mod 360
//   where T = Julian centuries from J2000.0
// - South Node: = (North Node + 180) % 360

// Pure function: get ecliptic longitude for any HD body
function getEclipticLongitude(body: CelestialBody, date: Date): number {
  const t = MakeTime(date)
  switch (body) {
    case 'Sun':
      return SunPosition(t).elon
    case 'Earth':
      return (SunPosition(t).elon + 180) % 360
    case 'NorthNode':
      return meanLunarNode(date)
    case 'SouthNode':
      return (meanLunarNode(date) + 180) % 360
    case 'Moon':
    default: {
      const geo = GeoVector(Body[body], t, true)
      return Ecliptic(geo).elon
    }
  }
}

// Mean Lunar Node: Omega = 125.04452 - 1934.136261 * T
function meanLunarNode(date: Date): number {
  const jd = dateToJulianDay(date)
  const T = (jd - 2451545.0) / 36525  // Julian centuries from J2000.0
  return ((125.04452 - 1934.136261 * T) % 360 + 360) % 360
}

// Pure function: Date → 13 planet positions
function calculateBodyPositions(date: Date): readonly PlanetPosition[] {
  return HD_BODIES.map(name => {
    const longitude = getEclipticLongitude(name, date)
    const { gate, line } = longitudeToGate(longitude)
    return { body: name, longitude, gate, line }
  })
}

// Find Design date: when Sun was 88° earlier
function findDesignDate(birthDateUTC: Date): Date {
  const birthSunLong = SunPosition(MakeTime(birthDateUTC)).elon
  const targetLong = ((birthSunLong - 88) % 360 + 360) % 360  // explicit 360° wrap
  // Search FORWARD from 100 days before birth
  const searchStart = new Date(birthDateUTC.getTime() - 100 * 86400000)
  const result = SearchSunLongitude(targetLong, MakeTime(searchStart), 120)
  if (!result) throw new Error('Could not determine Design date')
  return result.date
}

export function calculatePlanetaryPositions(birthDateUTC: Date): PersonalityDesignActivations {
  const designDate = findDesignDate(birthDateUTC)
  return {
    personality: calculateBodyPositions(birthDateUTC),
    design: calculateBodyPositions(designDate),
    designDate,
    birthDateUTC,
  }
}
```

**VERIFIED API usage:**
- Sun: `SunPosition(t).elon` = 83.85° for Jun 15, 1990 ✓
- Moon: `GeoVector(Body.Moon, t, true) → Ecliptic() → .elon` = 341.48° ✓
- All planets (Mercury through Pluto): `GeoVector → Ecliptic` works ✓
- Earth: Sun + 180° = 263.85° ✓
- Mean North Node: formula gives 308.40° for Jun 15, 1990 ✓ (Aquarius region)
- `Body.NorthNode` does NOT exist in astronomy-engine — confirmed `undefined`

### 1.4 Chart Derivation — `src/lib/human-design/derive-chart.ts` (~220 lines)

This is the core algorithm. Functional style with pure functions, no mutation.

```typescript
import { HD_CHANNELS, HD_CENTERS } from '@/lib/human-design-data'

// Step 1: Collect all gate activations
function collectGateActivations(activations: PersonalityDesignActivations): GateActivation[] {
  const fromSide = (positions: PlanetPosition[], side: 'personality' | 'design') =>
    positions.map(p => ({ gate: p.gate, line: p.line, longitude: p.longitude, body: p.body, side }))
  return [
    ...fromSide(activations.personality, 'personality'),
    ...fromSide(activations.design, 'design'),
  ]
}

// Step 2: Find defined channels (both gates of a channel are activated)
function findDefinedChannels(allActivations: GateActivation[]): DefinedChannel[] {
  const activeGates = new Set(allActivations.map(a => a.gate))
  return HD_CHANNELS
    .filter(ch => activeGates.has(ch.gates[0]) && activeGates.has(ch.gates[1]))
    .map(ch => ({
      id: ch.id,
      gates: ch.gates,
      fromCenter: ch.fromCenter,
      toCenter: ch.toCenter,
      activatedBy: {
        gate1: allActivations.find(a => a.gate === ch.gates[0])!,
        gate2: allActivations.find(a => a.gate === ch.gates[1])!,
      },
    }))
}

// Step 3: Find defined centers (connected to at least one defined channel)
function findDefinedCenters(definedChannels: DefinedChannel[]): string[] {
  const centers = new Set<string>()
  definedChannels.forEach(ch => {
    centers.add(ch.fromCenter)
    centers.add(ch.toCenter)
  })
  return [...centers]
}

// Step 4: Motor-to-Throat detection via BFS
// Build adjacency graph from defined channels, BFS from motor centers to throat
function hasMotorToThroat(
  definedChannels: DefinedChannel[],
  definedCenters: string[],
  excludeSacral: boolean = false
): boolean {
  // Build adjacency list from defined channels only
  const adj = new Map<string, string[]>()
  for (const ch of definedChannels) {
    if (!adj.has(ch.fromCenter)) adj.set(ch.fromCenter, [])
    if (!adj.has(ch.toCenter)) adj.set(ch.toCenter, [])
    adj.get(ch.fromCenter)!.push(ch.toCenter)
    adj.get(ch.toCenter)!.push(ch.fromCenter)
  }

  // Motor centers from HD_CENTERS data
  const motorCenters = HD_CENTERS
    .filter(c => c.types.includes('motor') && definedCenters.includes(c.id))
    .filter(c => !excludeSacral || c.id !== 'sacral')
    .map(c => c.id)

  // BFS from each motor center
  for (const motor of motorCenters) {
    const visited = new Set<string>()
    const queue = [motor]
    while (queue.length > 0) {
      const current = queue.shift()!
      if (current === 'throat') return true
      if (visited.has(current)) continue
      visited.add(current)
      for (const neighbor of (adj.get(current) ?? [])) {
        if (!visited.has(neighbor)) queue.push(neighbor)
      }
    }
  }
  return false
}

// Step 5: Derive type
function deriveType(definedCenters: string[], definedChannels: DefinedChannel[]): HDTypeId {
  const sacralDefined = definedCenters.includes('sacral')
  if (sacralDefined) {
    return hasMotorToThroat(definedChannels, definedCenters)
      ? 'manifesting-generator' : 'generator'
  }
  if (hasMotorToThroat(definedChannels, definedCenters, true)) return 'manifestor'
  if (definedCenters.length > 0) return 'projector'
  return 'reflector'
}

// Step 6: Derive authority (first defined in hierarchy wins)
const AUTHORITY_HIERARCHY: { center: string; authority: HDAuthorityType }[] = [
  { center: 'solar-plexus', authority: 'emotional' },
  { center: 'sacral', authority: 'sacral' },
  { center: 'spleen', authority: 'splenic' },
  { center: 'heart', authority: 'ego' },
  { center: 'g', authority: 'self-projected' },
  { center: 'throat', authority: 'mental' },
]

function deriveAuthority(definedCenters: string[], type: HDTypeId): HDAuthorityType {
  if (type === 'reflector') return 'lunar'
  for (const { center, authority } of AUTHORITY_HIERARCHY) {
    if (definedCenters.includes(center)) return authority
  }
  return 'lunar' // fallback (shouldn't happen for non-reflectors with defined centers)
}

// Step 7: Derive profile from Personality Sun line + Design Sun line
// Step 8: Derive incarnation cross from Sun/Earth gates

// Main orchestrator
export function deriveChart(activations: PersonalityDesignActivations): HumanDesignChart { ... }
```

### 1.5 Orchestrator — `src/lib/human-design/index.ts` (~40 lines)

```typescript
export function computeHumanDesign(input: HDBirthInput): HumanDesignChart {
  const birthDateUTC = localToUTC(input)      // IANA timezone → UTC
  const activations = calculatePlanetaryPositions(birthDateUTC)
  return deriveChart(activations, input)
}
```

**Timezone conversion:** Use `Intl.DateTimeFormat` with `timeZone` option to convert local time to UTC. No external dependency needed — built into Node.js/browser.

### 1.6 API Route — `src/app/api/human-design/calculate/route.ts` (~60 lines)

Follows Bazi pattern. POST → validate → compute → return JSON.

### 1.7 Prisma Schema — `prisma/schema.prisma` (modify)

```prisma
model User {
  // ... existing fields
  hdReadings    HumanDesignReading[]   // ADD THIS LINE
}

model HumanDesignReading {
  id               String   @id @default(cuid())
  userId           String?
  user             User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  name             String
  gender           String?
  birthYear        Int
  birthMonth       Int
  birthDay         Int
  birthHour        Int?
  birthMinute      Int?
  birthTimeUnknown Boolean  @default(false)
  birthPlace       String
  latitude         Float
  longitude        Float
  timezone         String   // IANA timezone string
  result           String   // JSON HumanDesignChart
  slug             String?  @unique
  isPublic         Boolean  @default(false)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@index([userId])
}
```

**Design choices matching Bazi pattern:**
- `result` as `String` (JSON), not `Json` type — SQLite compatibility, matches `BaziReading`
- `birthYear/Month/Day/Hour/Minute` as separate Int fields — matches `BaziReading`, enables queries
- `slug` + `isPublic` — enables shareable chart URLs
- `@@index([userId])` — efficient user lookup
- `onDelete: Cascade` — matches existing User relation pattern

**Relation diagram:**

```
┌──────────────────┐     1:N     ┌─────────────────────┐
│      User        │◄────────────│   HumanDesignReading │
│                  │             │                     │
│ id               │             │ id                  │
│ name             │             │ userId (FK)         │
│ email            │             │ name                │
│ readings[]       │             │ birthYear/Month/Day │
│ hdReadings[]  ◄──┤             │ birthHour/Minute    │
│                  │             │ birthTimeUnknown    │
└──────────────────┘             │ birthPlace          │
        │                        │ latitude/longitude  │
        │ 1:N                    │ timezone (IANA)     │
        ▼                        │ result (JSON)       │
┌──────────────────┐             │ slug (unique)       │
│   BaziReading    │             │ isPublic            │
└──────────────────┘             └─────────────────────┘
                                         │
                                   JSON contains:
                              HumanDesignChart with
                              type, authority, profile,
                              cross, centers, channels,
                              26 gate activations
```

---

## Phase 2: Interactive Chart Page

### Design Specs — Information Architecture

**Navigation flow:**
```
/human-design (learning hub)
    └── /human-design/calculator (birth input form)
            └── POST /api/human-design/calculate → save → redirect
                    └── /human-design/chart/[id] (interactive result)
                            ├── click center → right panel: center detail
                            ├── click channel → right panel: channel detail
                            ├── click gate → right panel: gate detail
                            └── toggle transits → overlay (Phase 3)
```

**Content hierarchy per screen:**

Calculator page (single column, centered):
1. Page title + breadcrumb (vn primary, en italic)
2. Birth input form (compact, follows Bazi BirthInputForm pattern)
3. CTA button "Tính Biểu Đồ" (Calculate My Design)
4. Brief explainer text about birth time accuracy

Chart result page (three-panel, the hero screen):
1. **First thing user sees:** The bodygraph SVG, large and center (this IS the product)
2. **Second:** Type badge with Vietnamese name, top of left panel (identity confirmation)
3. **Third:** Detail panel appears on interaction (right side, initially shows chart overview)
4. **Persistent:** Copy Prompt button, top-right corner, terracotta primary

### Design Specs — Color Mapping (from DESIGN.md)

All UI uses existing CSS tokens. No new colors introduced.

| Element | Token / Value | Notes |
|---------|--------------|-------|
| Page background | `var(--background)` | Warm cream / warm near-black |
| Card surfaces | `var(--card)` | Panels, detail boxes |
| Primary CTA | `var(--primary)` | Terracotta — Calculate button, Copy Prompt |
| Personality activations | `var(--foreground)` | Dark strokes (conscious) |
| Design activations | `var(--destructive)` | Red/warm strokes (unconscious) |
| Both Personality+Design | CSS gradient: `var(--foreground)` to `var(--destructive)` | Striped channel lines |
| Defined centers | Per-center color from `HD_CENTERS[].color` at `fillOpacity: 0.25` | Existing pattern |
| Undefined centers | `stroke: currentColor` at `strokeOpacity: 0.15` | Outline only, very faint |
| Defined channels | `var(--primary)` at `strokeOpacity: 0.7`, `strokeWidth: 2.5` | Terracotta glow, not purple |
| Undefined channels | `currentColor` at `strokeOpacity: 0.08`, `strokeWidth: 1` | Nearly invisible |
| Transit overlay (Phase 3) | `var(--chart-2)` (teal) at `opacity: 0.5` | Pulsing animation |
| Type badge background | Per-type color from `HD_TYPES[].color` + `'18'` | Light tint, existing pattern |
| Type badge border | Per-type color + `'40'` | 40% opacity border |
| Detail panel border | Selected element's color + `'40'` | Dynamic, matches click target |
| Section borders | `var(--border)` | Warm gray dividers |
| Labels | `text-muted-foreground` | `text-xs font-medium` |
| Body text | `text-foreground` | `text-sm leading-relaxed` |
| English subtitles | `text-muted-foreground italic` | `text-xs` beneath Vietnamese |

### Design Specs — Component Mapping (from DESIGN.md)

| UI Element | shadcn/ui Component | Variant/Size | Notes |
|------------|-------------------|--------------|-------|
| Calculate button | `Button` | `default` / `lg` | Terracotta primary, full-width in form |
| Copy Prompt button | `Button` | `outline` / `default` | Top-right of chart page |
| Type badge | Custom | — | `rounded-lg px-3 py-1.5` with type color bg, not a shadcn Badge |
| Form inputs | Native `<input>` | — | Match Bazi: `h-8 rounded-md border`, no shadcn Input (existing pattern) |
| City dropdown | `<select>` or custom | — | Match Bazi pattern, native for mobile |
| Date picker | Native `<input type="date">` | — | Native for best mobile UX |
| Time picker | Native `<input type="time">` | — | Native for precision |
| Detail panel | `Card` | `default` | `CardHeader` + `CardContent`, dynamic border color |
| Summary items | Custom list | — | `flex items-center gap-2` with colored dot + label |
| Bottom sheet (mobile) | Custom | — | Not a shadcn Dialog. Custom `fixed bottom-0` with drag handle |
| Toast (copy/error) | `Sonner` or custom | — | Follow existing toast pattern if any |
| Skeleton loader | Custom | — | `animate-pulse bg-muted rounded` shapes matching center positions |

### Design Specs — Typography (from DESIGN.md)

| Element | Classes |
|---------|---------|
| Page title | `text-2xl sm:text-3xl font-bold` |
| Section heading | `text-lg font-bold` |
| Card title | `font-semibold text-sm` |
| Body text | `text-sm leading-relaxed` |
| Labels | `text-xs font-medium text-muted-foreground` |
| English captions | `text-xs text-muted-foreground italic` |
| Gate numbers (on SVG) | `text-[10px] font-medium fill-muted-foreground` |
| Type badge | `text-base font-bold` |
| Profile number | `text-2xl font-bold tabular-nums` |

### Design Specs — Spacing & Layout

| Element | Value |
|---------|-------|
| Container | `max-w-6xl mx-auto px-4 py-8` |
| Calculator form | `max-w-md mx-auto` (centered single column) |
| Chart page: left panel | `w-[200px] lg:w-[220px]` sticky `lg:top-[72px]` |
| Chart page: center (bodygraph) | `flex-1 min-w-[300px]` |
| Chart page: right panel | `w-[280px] lg:w-[300px]` |
| Panel internal padding | `p-4` |
| Section gaps | `space-y-6` |
| Form field gaps | `space-y-2.5` (matches Bazi) |
| Card border radius | `rounded-lg` (10px from DESIGN.md) |
| Input height | `h-8` (compact, matches Bazi) |

### Design Specs — Animations & Transitions

| Interaction | Spec |
|-------------|------|
| Center/gate hover | `transition-all duration-200`, fillOpacity +0.15, strokeWidth +1 |
| Center/gate click | `transition-all duration-200`, ring-2 with center color |
| Panel content swap | `transition-opacity duration-300` (fade between details) |
| Chart first render | Gates fade in sequentially: `animation: fadeIn 0.6s ease-out`, stagger 30ms per gate |
| Defined channel pulse | `animation: subtle-pulse 3s ease-in-out infinite` (subtle opacity 0.5→0.7→0.5) |
| Transit overlay (Phase 3) | `animation: transit-glow 2s ease-in-out infinite` (teal pulse) |
| Copy button feedback | `transition-colors duration-150`, bg switches to `var(--primary)` for 1.5s after copy |
| Mobile panel slide | `transition-transform duration-300 ease-out` (slide up from bottom) |

### Design Specs — User Journey & Emotional Arc

```
STEP | USER DOES                    | USER FEELS           | DESIGN SUPPORTS IT WITH
-----|------------------------------|----------------------|----------------------------------
1    | Finds /calculator from       | Curious, maybe       | Clean form, warm cream bg,
     | HD learning pages            | skeptical             | brief text: "Nhập thông tin sinh
     |                              |                      | để khám phá biểu đồ của bạn"
2    | Fills birth data             | Invested (sharing     | Compact form feels fast. City
     |                              | personal info)        | dropdown validates. Time picker
     |                              |                      | feels precise, not fiddly.
3    | Clicks "Tính Biểu Đồ"       | Anticipation          | Button spinner + "Đang tính..."
     |                              |                      | ~1s feels like computation,
     |                              |                      | not a loading screen.
4    | Chart appears                | "Whoa" moment         | Bodygraph fades in with stagger
     |                              | (the payoff)          | animation. Centers light up with
     |                              |                      | their colors. Type badge is
     |                              |                      | immediate identity confirmation.
5    | Reads type + profile         | Recognition           | Vietnamese primary. Bold type
     |                              | ("that's me")         | name. Strategy as actionable text.
6    | Clicks a defined center      | Discovery / depth     | Detail panel slides in with gate
     |                              |                      | info, planet, I Ching reference.
     |                              |                      | "This is MY chart, not generic."
7    | Clicks Copy Prompt           | Empowerment           | Structured text ready for Claude.
     |                              | ("I can get a         | Button confirms copy instantly.
     |                              |  reading from this")  |
8    | Returns next day (Phase 3)   | Daily ritual          | Transit overlay shows what's
     |                              |                      | active TODAY on their chart.
     |                              |                      | "Your chart is alive."
```

**5-second visceral:** Warm cream + terracotta, not clinical white + blue. This feels personal.
**5-minute behavioral:** Clicking centers reveals layers of meaning. Chart is navigation, not output.
**5-year reflective:** This becomes their daily practice tool. Transit overlay drives return visits.

### Design Specs — Interaction States

| Feature | Loading | Empty | Error | Success | Partial |
|---------|---------|-------|-------|---------|---------|
| Calculator form submit | Button shows spinner + "Đang tính..." (Calculating...), disabled. Form fields locked. | N/A | Red toast: "Không thể tính biểu đồ. Vui lòng thử lại." (Cannot calculate chart). Form unlocked. If invalid timezone: inline field error. | Redirect to chart/[id] with brief confetti-like subtle particle animation on the bodygraph | N/A |
| Chart page load | Bodygraph skeleton: 9 center shapes pulse with `animate-pulse` in `var(--muted)`. Left panel shows 4 skeleton lines. | N/A (always has data from API) | Full-page error: "Biểu đồ không tìm thấy" (Chart not found) with link back to calculator | Bodygraph fades in with gate stagger animation (30ms per gate) | Birth time unknown: amber banner at top "Giờ sinh chưa xác định — biểu đồ có thể chưa chính xác" with `var(--chart-5)` amber background |
| Detail panel (click center/gate) | Shimmer effect on panel while loading gate description | Initial state: show chart overview text "Chạm vào trung tâm hoặc cổng để khám phá" (Tap a center or gate to explore) with subtle hand-tap icon | N/A (all data is local) | Content fades in with `duration-300` | N/A |
| Copy Prompt | N/A | N/A | Toast: "Không thể sao chép" (Cannot copy) | Button text changes to "Đã sao chép ✓" for 1.5s, bg flashes `var(--primary)` | N/A |
| Transit overlay (Phase 3) | "Đang tải transit..." with pulsing teal dot | N/A | "Không thể tải dữ liệu transit" with retry button | Transit gates pulse with teal glow | N/A |

### Design Specs — Responsive Behavior

**Desktop (≥1024px):** Three-panel layout. Left summary (220px) + center bodygraph (flex) + right detail (300px).

**Tablet (768-1023px):** Two-panel. Left summary collapses into a horizontal strip above bodygraph. Right detail panel stays as overlay/sidebar that slides in on click.

**Mobile (<768px):** Stacked with slide-up bottom sheet.
- Compact summary strip at top: `[Type badge] [Profile] [Copy button]` in one row
- Bodygraph fills remaining viewport height (`h-[calc(100vh-140px)]`)
- Tap center/gate → bottom sheet slides up (`translate-y-0` from `translate-y-full`, `duration-300`)
- Bottom sheet: `rounded-t-2xl shadow-lg`, max 50% viewport height, scrollable
- Drag handle at top: `w-12 h-1 rounded-full bg-muted-foreground/30 mx-auto`
- Swipe down to dismiss

**Calculator form (all breakpoints):** Single column, `max-w-md mx-auto`. No responsive changes needed.

### Design Specs — Resolved Design Decisions

**1. Detail panel initial state:** Mini chart overview. Shows type description (2-3 sentences Vietnamese), defined centers count, channel count, and "Chạm vào biểu đồ để khám phá" prompt with hand-tap icon. Gives immediate value before interaction.

**2. Mobile layout:** Stacked with slide-up bottom sheet. Compact summary strip at top, bodygraph fills screen, tap to open bottom sheet for details.

**3. Channel colors:** Defined channels use `var(--primary)` (terracotta), NOT the current hardcoded `#8b5cf6` purple. This aligns with DESIGN.md and differentiates from generic Tailwind violet.

**4. Personality vs Design distinction:** Personality = `var(--foreground)` (dark), Design = `var(--destructive)` (warm red). Both present on same gate = CSS linear gradient stripe. This uses existing DESIGN.md tokens and is colorblind-safe (opacity + stroke width also differ).

### Design Specs — Accessibility

| Requirement | Spec |
|-------------|------|
| Keyboard nav (bodygraph) | Centers and channels are focusable with `tabindex="0"`. Arrow keys move between adjacent centers. Enter/Space activates detail panel. Focus ring: `ring-3 ring-ring/50` (existing DESIGN.md pattern) |
| Screen reader (bodygraph) | Each center: `role="button" aria-label="Trung tâm [name] — [defined/undefined]"`. Each channel: `aria-label="Kênh [gate1]-[gate2] — [defined/undefined]"` |
| Color contrast | All text meets WCAG AA. Vietnamese body text on cream bg: contrast ratio >4.5:1. Muted foreground on cream: >3:1 for `text-xs` (large enough for AA). Defined vs undefined centers distinguished by fill AND opacity AND stroke width (not color alone) |
| Touch targets | SVG center click areas: minimum 44x44px touch target (existing center size is 28px diameter, but hit area extends via invisible `<circle>` with r=22) |
| Motion reduction | `prefers-reduced-motion: reduce` → disable stagger animation, channel pulse, transit glow. Fade-in only. |
| Bottom sheet (mobile) | `role="dialog" aria-modal="true" aria-label="Chi tiết"`. Focus trap when open. Escape to close. |
| Form labels | All inputs have associated `<label>` elements. Required fields marked with `aria-required="true"` |
| Lang attribute | `lang="vi"` on Vietnamese text blocks, `lang="en"` on English captions |

### 2.1 Calculator Page — `src/app/human-design/calculator/page.tsx`

Birth input form with:
- Name, date picker, time picker
- Location: curated Vietnamese cities dropdown + manual lat/lng/timezone override
- IANA timezone auto-filled from city selection
- "Calculate My Design" → POST to API → save to DB → redirect to `/human-design/chart/[id]`
- Unknown birth time: checkbox "Không biết giờ sinh" → hides time picker, shows warning text
- Form follows Bazi BirthInputForm pattern: `h-8` inputs, `text-xs` labels, `space-y-2.5`, `focus:border-primary focus:ring-1 focus:ring-primary/30`

### 2.2 Chart Result Page — `src/app/human-design/chart/[id]/page.tsx`

Three-panel layout:
- **Left:** `ChartSummaryPanel` — type, strategy, authority, profile, cross
- **Center:** Enhanced `BodygraphSvg` — personal chart as clickable navigation
- **Right:** `GateDetailPanel` — shows details for selected center/channel/gate

### 2.3 Enhanced BodygraphSvg — `src/components/human-design/BodygraphSvg.tsx` (modify)

All new props are optional (backward compatible):

```typescript
interface BodygraphSvgProps {
  // Existing props (unchanged)
  definedCenters?: string[]
  highlightCenter?: string | null
  onCenterClick?: (centerId: string) => void
  showLabels?: boolean
  showChannels?: boolean
  className?: string
  // NEW optional props
  activations?: PersonalityDesignActivations
  gateActivations?: readonly GateActivation[]
  onGateClick?: (gateId: number) => void
  transitActivations?: readonly GateActivation[]
  showGateLabels?: boolean
}
```

When `activations` provided:
- Personality gates = dark/black strokes
- Design gates = red/warm strokes
- Both = gradient/dual-color
- Channel lines show which gates are active

### 2.4 Gate Descriptions — `src/lib/human-design/gate-descriptions.ts`

Seeded from existing `Hexagram` DB model (nameVi, nameZh, nameEn). The I Ching hexagram numbers map 1:1 to HD gate numbers. Add HD-specific themes on top.

```typescript
export interface GateDescription {
  readonly gate: number
  readonly nameVi: string
  readonly nameEn: string
  readonly nameZh: string
  readonly theme: { readonly vn: string; readonly en: string }
  readonly shadow: string
  readonly gift: string
  readonly siddhi: string
  readonly iChingHexagram: number  // same as gate number
}
```

### 2.5 Prompt Generator — `src/components/human-design/HDPromptGenerator.tsx`

Follows I Ching PromptGenerator pattern. Generates structured text:

```
╔══════════════════════════════════════════╗
║      HUMAN DESIGN CHART · BIỂU ĐỒ      ║
╚══════════════════════════════════════════╝

Name: [name]
Birth: [datetime] [timezone]

┌─ TYPE & STRATEGY ────────────────────────┐
│  Type: [vn] ([en])
│  Strategy: [strategy]
│  Authority: [authority]
│  Profile: [conscious]/[unconscious]
│  Incarnation Cross: [gates]
└──────────────────────────────────────────┘

┌─ DEFINED CENTERS ────────────────────────┐
│  [list of defined centers with types]
└──────────────────────────────────────────┘

┌─ DEFINED CHANNELS ───────────────────────┐
│  [channel name: gate-gate (centers)]
└──────────────────────────────────────────┘

┌─ PERSONALITY (Conscious) ────────────────┐
│  Sun: Gate [n] Line [l] — [name]
│  Earth: Gate [n] Line [l] — [name]
│  [... 13 bodies]
└──────────────────────────────────────────┘

┌─ DESIGN (Unconscious) ──────────────────┐
│  Sun: Gate [n] Line [l] — [name]
│  [... 13 bodies]
└──────────────────────────────────────────┘
```

---

## Phase 3: Transits (brief — detailed design deferred until Phase 2 ships)

- `calculate-transits.ts` — same `calculateBodyPositions()` called with `new Date()` instead of birth date
- `TransitOverlay` on BodygraphSvg — pulsing semi-transparent gates
- Toggle on chart page, date picker

---

## Claude Skill: `hd-foundation`

Location: `.claude/skills/hd-foundation/SKILL.md`

Three interpretation modes:
1. **Mechanic** — technical chart reading
2. **Guide** — practical life guidance from type/authority/strategy
3. **Integration** — cross-reference with Bazi/I Ching if provided

Input: the structured text from HDPromptGenerator (copy-pasted by user).

---

## Test Plan

### Code Path Coverage Diagram

```
CODE PATH COVERAGE
===========================
[+] src/lib/human-design/gate-table.ts
    │
    ├── longitudeToGate()
    │   ├── [GAP] Normal range (e.g., 0°, 180°, 359°)
    │   ├── [GAP] Wheel start boundary (332.0° = Gate 41 Line 1)
    │   ├── [GAP] Wheel wrap-around (331.99° = Gate 60 Line 6)
    │   ├── [GAP] Exact gate boundary (337.625° = Gate 19 Line 1)
    │   ├── [GAP] Negative longitude input → normalize
    │   └── [GAP] All 64 gates reachable (spot-check 10 known gates)

[+] src/lib/human-design/calculate-planets.ts
    │
    ├── findDesignDate()
    │   ├── [GAP] Normal case (Sun at ~100° → target ~12°)
    │   ├── [GAP] 360° wrap (Sun at 30° → target 302°)
    │   ├── [GAP] Sun near 0° (wrap edge case)
    │   └── [GAP] Error: SearchSunLongitude returns null
    │
    ├── calculateBodyPositions()
    │   ├── [GAP] All 13 bodies return valid positions
    │   ├── [GAP] Earth = Sun + 180°
    │   └── [GAP] South Node = North Node + 180°
    │
    └── calculatePlanetaryPositions()
        ├── [GAP] Returns personality + design arrays of 13 each
        └── [GAP] Design date is ~88 days before birth

[+] src/lib/human-design/derive-chart.ts
    │
    ├── findDefinedChannels()
    │   ├── [GAP] Both gates active → channel defined
    │   ├── [GAP] Only one gate active → channel NOT defined
    │   └── [GAP] Zero channels defined (Reflector)
    │
    ├── findDefinedCenters()
    │   ├── [GAP] Centers connected to defined channels
    │   └── [GAP] No channels → no centers (Reflector)
    │
    ├── hasMotorToThroat() — BFS
    │   ├── [GAP] Direct motor→throat channel (e.g., 45-21 Heart→Throat)
    │   ├── [GAP] Indirect path (Root→Spleen→Throat via defined channels)
    │   ├── [GAP] No path exists → false
    │   ├── [GAP] Sacral excluded when checking Manifestor
    │   └── [GAP] Multiple motors, one reaches throat
    │
    ├── deriveType()
    │   ├── [GAP] Generator (Sacral defined, no motor-to-throat)
    │   ├── [GAP] Manifesting Generator (Sacral + motor-to-throat)
    │   ├── [GAP] Manifestor (no Sacral, motor-to-throat)
    │   ├── [GAP] Projector (no Sacral, no motor-to-throat, has centers)
    │   └── [GAP] Reflector (no defined centers)
    │
    ├── deriveAuthority()
    │   ├── [GAP] Each of 7 authority types
    │   └── [GAP] Reflector → lunar
    │
    └── deriveChart()
        └── [GAP] [→E2E] Full chart against mybodygraph.com known charts

[+] src/app/api/human-design/calculate/route.ts
    │
    ├── [GAP] Valid input → 200 with chart
    ├── [GAP] Missing required fields → 400
    ├── [GAP] Invalid timezone → 400
    ├── [GAP] Unknown birth time → result has birthTimeUnknown=true
    └── [GAP] Calculation error → 500

USER FLOW COVERAGE
===========================
[+] Calculator form
    │
    ├── [GAP] [→E2E] Fill form → submit → see chart result
    ├── [GAP] City selection auto-fills timezone
    ├── [GAP] Empty required fields → validation error
    └── [GAP] Unknown birth time checkbox → noon default + warning

[+] Interactive chart
    │
    ├── [GAP] [→E2E] Click center → detail panel shows center info
    ├── [GAP] Click channel → detail panel shows channel info
    ├── [GAP] Click gate → detail panel shows gate activation
    └── [GAP] Copy prompt → clipboard contains structured text

─────────────────────────────────
COVERAGE: 0/35 paths tested (0%)
GAPS: 35 paths need tests (4 need E2E)
─────────────────────────────────
```

### Critical verification tests

1. **Gate table accuracy:** Test 10 known gate-degree pairs from the published wheel
2. **Full chart comparison:** Calculate charts for 3-4 known birth dates, compare against mybodygraph.com (type, profile, defined centers must match)
3. **Type derivation:** One test case per type (5 tests) with hand-crafted gate activation sets
4. **Authority derivation:** One test per authority type (7 tests)
5. **BFS motor-to-throat:** Direct path, indirect path, no path, Sacral exclusion

### Test file locations

- `__tests__/lib/human-design/gate-table.test.ts`
- `__tests__/lib/human-design/calculate-planets.test.ts`
- `__tests__/lib/human-design/derive-chart.test.ts`
- `__tests__/api/human-design/calculate.test.ts`

---

## Failure Modes

| Codepath | Failure | Test? | Error Handling? | User sees |
|----------|---------|-------|----------------|-----------|
| findDesignDate | SearchSunLongitude returns null | GAP | YES (throws) | 500 error |
| longitudeToGate | NaN longitude input | GAP | NO | Wrong gate |
| calculateBodyPositions | astronomy-engine throws | GAP | NO | 500 error |
| IANA timezone invalid | Intl.DateTimeFormat throws | GAP | YES (validate) | 400 error |
| Prisma save | DB write fails | GAP | NO | Silent failure |

**Critical gaps:** NaN longitude and Prisma save failure need error handling.

---

## Error & Rescue Registry (CEO Review)

```
METHOD/CODEPATH              | WHAT CAN GO WRONG               | RESCUED? | RESCUE ACTION              | USER SEES
-----------------------------|----------------------------------|----------|----------------------------|------------------
longitudeToGate()            | NaN longitude input              | N → FIX  | Guard: if NaN, throw       | 500 → "Calc failed"
                             | longitude out of 0-360           | Y        | normalize via modulo        | correct gate
findDesignDate()             | SearchSunLongitude returns null   | Y        | throw Error                 | 500 → "Cannot calc"
calculateBodyPositions()     | astronomy-engine throws           | N → FIX  | try/catch + context         | 500 → "Calc failed for [body]"
                             | Invalid date (e.g., Feb 30)      | N → FIX  | validate date before calc   | 400 → field error
getEclipticLongitude()       | Body enum mismatch               | Y        | TypeScript prevents         | N/A
meanLunarNode()              | Date overflow/NaN                | N → FIX  | Guard: validate JD          | 500 → "Calc failed"
localToUTC()                 | Invalid IANA timezone string     | Y        | validate before compute     | 400 → field error
                             | Pre-1975 VN timezone offset      | Y*       | Intl handles; add test      | correct UTC*
computeHumanDesign()         | Any sub-function throws          | N → FIX  | API route try/catch         | 500 → structured error
API route POST               | Missing required fields          | Y        | validate, return 400        | field errors
                             | Computation throws               | N → FIX  | try/catch, return 500       | "Calculation error"
Prisma save                  | DB write fails                   | N → FIX  | catch, still return chart   | chart shows (save silent fail)
                             | Unique slug collision            | N → FIX  | retry with new slug         | transparent
```

**Resolution:** 7 gaps found. All are straightforward:
1. Add NaN guard in `getEclipticLongitude` (1 line)
2. Wrap `calculateBodyPositions` in try/catch with body context (3 lines)
3. Validate date components before computation (5 lines)
4. Guard JD calculation in `meanLunarNode` (1 line)
5. API route: try/catch around `computeHumanDesign`, return structured 500 (5 lines)
6. API route: catch Prisma errors on save, still return chart (3 lines)
7. Slug collision: retry with suffix (3 lines)

---

## NOT in scope

- 384 line descriptions (Phase 2.5 content task)
- 768 incarnation cross name lookup (Phase 2.5 content task)
- Unified cross-system "Today's Energy" view (separate design doc)
- Geocoding API integration (start with curated city list)
- Social sharing / OG image generation
- Community features / composite charts
- Rate limiting on calculate endpoint (low priority for personal project)
- Structured logging/metrics beyond console.error (sufficient for SQLite/personal scale)
- Feature flags (additive deployment, rollback = git revert)

---

## Worktree Parallelization Strategy

| Step | Modules touched | Depends on |
|------|----------------|------------|
| Phase 1: Calc engine | `src/lib/human-design/` | — |
| Phase 1: Prisma model | `prisma/` | — |
| Phase 2: UI components | `src/components/human-design/` | Calc engine (types) |
| Phase 2: Pages | `src/app/human-design/` | Calc engine + UI components |
| Phase 3: Transits | `src/lib/human-design/`, `src/components/` | Phase 2 |
| Skill: hd-foundation | `.claude/skills/` | Independent |

**Parallel lanes:**

```
Lane A: Calc engine (gate-table → calculate-planets → derive-chart → index → API route)
         + Prisma schema migration
Lane B: Claude skill (hd-foundation SKILL.md) — fully independent
Lane C: Gate descriptions data file — independent content work

After A merges:
Lane D: UI components (enhanced BodygraphSvg, ChartSummaryPanel, GateDetailPanel, HDPromptGenerator)
Lane E: Pages (calculator form, chart result page)

After D+E merge:
Lane F: Transit calculation + overlay
```

**Execution:** Launch A + B + C in parallel worktrees. Merge A. Launch D + E in parallel. Merge. Then F.

---

## Build Sequence (implementation order)

1. `src/lib/human-design/types.ts` — all type definitions
2. `src/lib/human-design/gate-table.ts` — pure data + `longitudeToGate`
3. **TEST:** gate table accuracy against 10 known gates
4. `src/lib/human-design/calculate-planets.ts` — astronomy-engine integration
5. **TEST:** planet positions + design date calculation
6. `src/lib/human-design/derive-chart.ts` — BFS + derivation logic
7. **TEST:** type/authority/profile derivation, one case per type
8. `src/lib/human-design/index.ts` — orchestrator
9. `src/app/api/human-design/calculate/route.ts` — API endpoint
10. **TEST:** API route validation + full chart output
11. **VERIFY:** Compare 3-4 charts against mybodygraph.com
12. `prisma/schema.prisma` — HumanDesignReading model + migration
13. `src/lib/human-design/gate-descriptions.ts` — seed from Hexagram data
14. Enhanced `BodygraphSvg` — optional props, Personality/Design colors
15. `ChartSummaryPanel`, `GateDetailPanel` components
16. `HDPromptGenerator` component
17. Calculator page + chart result page
18. `.claude/skills/hd-foundation/SKILL.md`
19. Transit calculation + overlay (Phase 3)

---

## Verification

1. **Unit tests:** `npm test` (or vitest/jest) — all 35 paths covered
2. **Manual chart comparison:** Calculate chart for a known birth date, compare type/profile/centers/channels against mybodygraph.com
3. **API test:** `curl -X POST http://localhost:3000/api/human-design/calculate -H 'Content-Type: application/json' -d '{"name":"Test","year":1990,"month":6,"day":15,"hour":14,"minute":30,"timezone":"Asia/Ho_Chi_Minh","latitude":10.8231,"longitude":106.6297}'`
4. **UI test:** Open calculator page → fill form → submit → verify bodygraph renders with correct defined centers
5. **Prompt test:** Click "Copy Prompt" → paste into Claude with /hd-foundation → verify interpretation makes sense

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 1 | DONE | 7 error gaps found (all trivial fixes), 3 interaction edge cases, 0 architecture issues |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | DONE | 5 issues found, all resolved |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | DONE | score: 3/10 → 8/10, 4 decisions made |

### Eng Review Findings

| # | Area | Issue | Resolution | Status |
|---|------|-------|------------|--------|
| 1 | Architecture | HD_CHANNELS has 4 corrupted entries (wrong IDs, duplicates) | Clean data before implementation. Added to TODOS.md | WILL FIX |
| 2 | Code Quality | astronomy-engine wrapper needs thin FP abstraction for testability | Plan updated: thin wrapper with dependency injection | PLAN UPDATED |
| 3 | Tests | 35 test paths identified, 0 covered. No test runner in project | Vitest chosen. Full test suite in build sequence | PLAN UPDATED |
| 4 | Performance | Transit calculations called on every page load (13 bodies) | 1-hour TTL in-memory cache added to plan | PLAN UPDATED |
| 5 | Outside Voice | 2 showstoppers: `SunPosition` API (not `EclipticLongitude`), `Body.NorthNode` doesn't exist | Verified in node REPL. Plan updated with correct APIs. Mean node formula validated | PLAN UPDATED |

### Design Review Findings

| # | Pass | Before | After | Key Addition |
|---|------|--------|-------|-------------|
| 1 | Info Architecture | 3/10 | 8/10 | Nav flow, content hierarchy, color token mapping, typography, spacing, layout dimensions, animation specs |
| 2 | Interaction States | 2/10 | 8/10 | Loading/empty/error/success/partial for all 5 features with Vietnamese text |
| 3 | User Journey | 4/10 | 8/10 | 8-step emotional arc with 3 time horizons (5s/5m/5y) |
| 4 | AI Slop Risk | 6/10 | 8/10 | Litmus checks passed. Channel color changed from #8b5cf6 to var(--primary) |
| 5 | Design System | 7/10 | 8/10 | Component mapping table (shadcn/ui + native elements) |
| 6 | Responsive & A11y | 5/10 | 8/10 | Mobile bottom sheet, keyboard nav, ARIA labels, touch targets, motion reduction |
| 7 | Decisions | — | 4 resolved | Initial panel state, mobile layout, channel colors, Personality/Design distinction |

### Pre-implementation TODOs (in TODOS.md)

1. **Validate Mean Lunar Node Formula** — compare against 5+ published ephemeris dates
2. **Audit HD_CHANNELS Data** — fix 4 corrupted entries, verify exactly 36 unique channels

### CEO Review Findings (HOLD SCOPE)

```
+====================================================================+
|            MEGA PLAN REVIEW — COMPLETION SUMMARY                   |
+====================================================================+
| Mode selected        | HOLD SCOPE                                  |
| System Audit         | Clean. No stashed work, no conflicting PRs  |
| Step 0               | HOLD SCOPE, Approach A (current plan)        |
| Section 1  (Arch)    | 0 issues — clean 3-layer pipeline            |
| Section 2  (Errors)  | 7 error paths mapped, 7 GAPS (all trivial)   |
| Section 3  (Security)| 0 High severity. Rate limiting deferred      |
| Section 4  (Data/UX) | 3 edge cases mapped, 3 minor gaps            |
| Section 5  (Quality) | 0 issues — functional style is clean         |
| Section 6  (Tests)   | 35 paths + 1 pre-1975 TZ test = 36 total     |
| Section 7  (Perf)    | 0 issues — transit cache already planned      |
| Section 8  (Observ)  | 1 gap: add console.error context in API route |
| Section 9  (Deploy)  | 0 risks — additive migration, no flags needed |
| Section 10 (Future)  | Reversibility: 5/5, debt: 0 items             |
| Section 11 (Design)  | Already reviewed 8/10 by /plan-design-review  |
+--------------------------------------------------------------------+
| NOT in scope         | written (9 items)                            |
| What already exists  | written (Step 0 table, 9 reuse targets)      |
| Dream state delta    | Plan achieves Phase 1-3, ~80% of 12mo ideal  |
| Error/rescue registry| 12 methods, 7 GAPS (0 CRITICAL — all trivial) |
| Failure modes        | 5 total, 0 CRITICAL GAPS (all have fixes)    |
| TODOS.md updates     | 0 new (existing 2 TODOs sufficient)           |
| Scope proposals      | 0 proposed (HOLD SCOPE mode)                  |
| CEO plan             | skipped (HOLD SCOPE)                          |
| Outside voice        | skipped (context limit)                       |
| Lake Score           | N/A (HOLD SCOPE)                              |
| Diagrams produced    | 5 (system arch, data flow, type derivation,   |
|                      |    relation diagram, code path coverage)       |
| Stale diagrams found | 0                                             |
| Unresolved decisions | 0                                             |
+====================================================================+
```

**VERDICT:** ALL THREE REVIEWS COMPLETE (ENG + DESIGN + CEO). Plan is implementation-ready after pre-impl TODOs.
