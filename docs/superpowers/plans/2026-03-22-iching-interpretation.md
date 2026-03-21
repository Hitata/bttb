# I Ching Interpretation Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add DB-backed hexagram interpretation text, nuclear hexagram computation, collapsible interpretation display, and a prompt generator for Claude chat — building on the existing coin casting feature.

**Architecture:** Prisma Hexagram model seeded from markdown reference files. Nuclear hexagram computed in the casting engine. Batch API endpoint fetches interpretation text. Two new client components (InterpretationDisplay, PromptGenerator) render below the existing hexagram result.

**Tech Stack:** Prisma + SQLite, Next.js App Router, TypeScript, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-22-iching-interpretation-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/lib/iching/types.ts` | Modify | Add `nuclearNumber` to HexagramInfo, add HexagramData type |
| `src/lib/iching/hexagram.ts` | Modify | Add `computeNuclearNumber()` function |
| `src/lib/iching/casting.ts` | Modify | Call `computeNuclearNumber()` in `castHexagram()` |
| `prisma/schema.prisma` | Modify | Add Hexagram model |
| `prisma/data/64-hexagrams-part1.md` | Create | Copy from skill (hexagrams 1–32) |
| `prisma/data/64-hexagrams-part2.md` | Create | Copy from skill (hexagrams 33–64) |
| `prisma/seed-hexagrams.ts` | Create | Parse markdown, seed DB with 64 records |
| `package.json` | Modify | Add prisma seed config |
| `src/app/api/iching/hexagrams/route.ts` | Create | GET batch hexagrams from DB |
| `src/components/iching/InterpretationDisplay.tsx` | Create | Collapsible interpretation sections |
| `src/components/iching/PromptGenerator.tsx` | Create | Copy-paste prompt builder |
| `src/components/iching/HexagramResult.tsx` | Modify | Integrate InterpretationDisplay + PromptGenerator |

## Parallelization Map

```
Task 1 (types update)
  ├─► Task 2 (computeNuclearNumber) ─► Task 3 (update casting engine) ──┐
  │                                                                       │
  ├─► Task 4 (Prisma schema + data + seed) ─► Task 5 (batch API) ───────┤
  │                                                                       │
  ├─► Task 7 (PromptGenerator) ──────────────────────────────────────────┤
  │                                                                       ├─► Task 8 (integrate into HexagramResult)
  └─► Task 6 (InterpretationDisplay) ────────────────────────────────────┘
```

**Parallel groups:**
- After Task 1: Tasks 2, 4, 6, 7 can run in parallel
- After Task 2: Task 3
- After Task 4: Task 5
- After Tasks 3+5+6+7: Task 8 (integration)

---

## Task 1: Update Types

**Files:**
- Modify: `src/lib/iching/types.ts`

- [ ] **Step 1: Add `nuclearNumber` to `HexagramInfo` and add `HexagramData` type**

Add `nuclearNumber: number` to the existing `HexagramInfo` interface.

Add new type:
```ts
export interface HexagramData {
  number: number
  nameVi: string
  nameZh: string
  nameEn: string
  structure: string
  nuclearNumber: number
  energyState: string
  physicist: string
  sage: string
  advisor: string
  balance: string
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/iching/types.ts
git commit -m "feat(iching): add nuclearNumber to HexagramInfo and HexagramData type"
```

---

## Task 2: Nuclear Hexagram Computation

**Files:**
- Modify: `src/lib/iching/hexagram.ts`

**Depends on:** Task 1

- [ ] **Step 1: Add `computeNuclearNumber()` function**

Add to `hexagram.ts`:

```ts
/**
 * Compute the nuclear hexagram (Hỗ quái) number from 6 lines.
 * Lower nuclear trigram = lines[1], lines[2], lines[3] (0-indexed: lines 2,3,4 in 1-indexed)
 * Upper nuclear trigram = lines[2], lines[3], lines[4] (0-indexed: lines 3,4,5 in 1-indexed)
 */
export function computeNuclearNumber(lines: LineValue[]): number {
  const lowerIdx = linesToTrigramIndex(lines[1], lines[2], lines[3])
  const upperIdx = linesToTrigramIndex(lines[2], lines[3], lines[4])
  return KING_WEN[upperIdx][lowerIdx]
}
```

`linesToTrigramIndex` already handles all LineValue types (7/9→yang=1, 6/8→yin=0).

- [ ] **Step 2: Update `lookupHexagram()` to include `nuclearNumber`**

The existing `lookupHexagram` function returns `HexagramInfo`. Update it to also call `computeNuclearNumber(lines)` and include the result in the returned object.

- [ ] **Step 3: Commit**

```bash
git add src/lib/iching/hexagram.ts
git commit -m "feat(iching): add nuclear hexagram computation"
```

---

## Task 3: Update Casting Engine

**Files:**
- Modify: `src/lib/iching/casting.ts`

**Depends on:** Task 2

- [ ] **Step 1: Update `castHexagram()` to use nuclear numbers**

The `lookupHexagram()` call already returns `nuclearNumber` (updated in Task 2). The casting engine needs no structural changes — just verify that both `primary` and `changed` HexagramInfo objects now include `nuclearNumber`.

For the changed hexagram, `lookupHexagram(changedLines)` will automatically compute the nuclear number of the changed lines.

Verify by reading the updated return value of `castHexagram()` — both `result.primary.nuclearNumber` and `result.changed?.nuclearNumber` should be populated.

- [ ] **Step 2: Smoke test**

```bash
curl -s -X POST http://localhost:3002/api/iching/cast \
  -H 'Content-Type: application/json' \
  -d '{"imageHash":"test123"}' | python3 -c "
import sys,json
d=json.load(sys.stdin)
print(f'Primary #{d[\"primary\"][\"number\"]} nuclear: {d[\"primary\"].get(\"nuclearNumber\", \"MISSING\")}')
if d['changed']:
    print(f'Changed #{d[\"changed\"][\"number\"]} nuclear: {d[\"changed\"].get(\"nuclearNumber\", \"MISSING\")}')
"
```

Expected: both should show a nuclear number (not "MISSING").

- [ ] **Step 3: Commit**

```bash
git add src/lib/iching/casting.ts
git commit -m "feat(iching): casting response now includes nuclear hexagram numbers"
```

---

## Task 4: Prisma Schema + Data Files + Seed Script

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `package.json`
- Create: `prisma/data/64-hexagrams-part1.md`
- Create: `prisma/data/64-hexagrams-part2.md`
- Create: `prisma/seed-hexagrams.ts`

**Depends on:** Task 1

- [ ] **Step 1: Add Hexagram model to Prisma schema**

Add to `prisma/schema.prisma`:

```prisma
model Hexagram {
  number        Int     @id
  nameVi        String
  nameZh        String
  nameEn        String
  structure     String
  nuclearNumber Int
  energyState   String
  physicist     String
  sage          String
  advisor       String
  balance       String
}
```

- [ ] **Step 2: Run migration**

```bash
npx prisma migrate dev --name add-hexagram-model
```

- [ ] **Step 3: Copy data files from the extracted skill archive**

Copy from `/tmp/iching-skill/iching-foundation/references/`:
- `64-hexagrams-part1.md` → `prisma/data/64-hexagrams-part1.md`
- `64-hexagrams-part2.md` → `prisma/data/64-hexagrams-part2.md`

- [ ] **Step 4: Create the seed script**

Create `prisma/seed-hexagrams.ts`:

The script:
1. Reads both markdown files
2. Splits on `## Hexagram ` boundaries (skipping the preamble in part 1)
3. For each entry, regex-extracts:
   - Heading: `## Hexagram (\d+) — .+ \/ (.+) \/ (.+)` → number, nameVi, nameEn
   - `**Structure**: (.+)` → structure
   - `**Nuclear Hexagram**: (\d+)` → nuclearNumber
   - `**Energy State**: (.+)` → energyState (text until next `**` section)
   - `**Physicist**: (.+)` → physicist
   - `**Sage**: (.+)` → sage
   - `**Advisor**: (.+)` → advisor
   - `**Balance**: (.+)` → balance
4. Imports `HEXAGRAM_NAMES` from `../src/lib/iching/hexagram` (use relative path — `@/` alias may not resolve under `npx tsx` from the `prisma/` directory) to get `nameZh` for each number
5. Upserts all 64 records
6. Asserts `count === 64` at the end

Important parsing notes:
- The em-dash (—) in the heading, not a regular dash
- Text sections span multiple lines until the next `**Section**:` or `---`
- `nameEn` may be UPPERCASE in the heading — store as-is (e.g. "THE CREATIVE")
- Trim whitespace from all extracted text

- [ ] **Step 5: Add seed config to package.json**

Add to `package.json`:
```json
"prisma": {
  "seed": "npx tsx prisma/seed-hexagrams.ts"
}
```

- [ ] **Step 6: Run the seed and verify**

```bash
npx prisma db seed
```

Expected: "Seeded 64 hexagrams" (or similar success message).

Verify with:
```bash
npx prisma studio
```
Or query directly — check that hexagram #1 (Càn), #2 (Khôn), #11 (Thái), #64 are all present with correct text.

- [ ] **Step 7: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/ prisma/data/ prisma/seed-hexagrams.ts package.json
git commit -m "feat(iching): add Hexagram DB model, data files, and seed script for 64 hexagrams"
```

---

## Task 5: Batch Hexagrams API

**Files:**
- Create: `src/app/api/iching/hexagrams/route.ts`

**Depends on:** Task 4

- [ ] **Step 1: Create the GET handler**

```ts
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
```

The codebase uses a shared Prisma singleton at `src/lib/prisma.ts`. Always use `import { prisma } from '@/lib/prisma'` — never `new PrismaClient()`.

- [ ] **Step 2: Smoke test**

```bash
curl -s 'http://localhost:3002/api/iching/hexagrams?numbers=1,11,64' | python3 -c "
import sys,json
data=json.load(sys.stdin)
for h in data:
    print(f'#{h[\"number\"]} {h[\"nameVi\"]} ({h[\"nameZh\"]}) — {h[\"nameEn\"][:30]}...')
"
```

Expected: 3 hexagram records with correct names and non-empty text fields.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/iching/hexagrams/route.ts
git commit -m "feat(iching): add batch hexagrams API endpoint"
```

---

## Task 6: InterpretationDisplay Component

**Files:**
- Create: `src/components/iching/InterpretationDisplay.tsx`

**Depends on:** Task 1

- [ ] **Step 1: Create the component**

Props:
```ts
interface InterpretationDisplayProps {
  primaryNumber: number
  changedNumber: number | null
  nuclearNumber: number
}
```

Implementation:
- `'use client'` component
- On mount, fetch hexagram data from `/api/iching/hexagrams?numbers=N,N,N` (deduplicate numbers — nuclear may equal primary)
- Loading state while fetching
- Three hexagram sections, each collapsible (use a simple `useState<Set<string>>` for expanded sections):
  - **Primary Hexagram** — expanded by default
  - **Changed Hexagram** — collapsed, only shown if `changedNumber` is not null
  - **Nuclear Hexagram (Hỗ Quái)** — collapsed
- Each section shows:
  - Header: `#N nameVi (nameZh) — nameEn` + collapse/expand chevron
  - Structure line
  - Five text blocks: Energy State, Physicist, Sage, Advisor, Balance
  - Each text block has a small label and the text with `whitespace-pre-line`
- Dark styling: bg-[#0a0a0a], text-white/70 for body, text-white/40 for labels
- Section dividers: thin border-white/5 lines

- [ ] **Step 2: Commit**

```bash
git add src/components/iching/InterpretationDisplay.tsx
git commit -m "feat(iching): add InterpretationDisplay with collapsible sections"
```

---

## Task 7: PromptGenerator Component

**Files:**
- Create: `src/components/iching/PromptGenerator.tsx`

**Depends on:** Task 1

- [ ] **Step 1: Create the component**

Props:
```ts
import type { CastingResponse, HexagramData } from '@/lib/iching/types'

interface PromptGeneratorProps {
  result: CastingResponse
  primaryData: HexagramData | null
  changedData: HexagramData | null
  nuclearData: HexagramData | null
}
```

Implementation:
- `'use client'` component
- Renders a "Copy prompt for Claude" button
- On click, builds the prompt string (see spec lines 199-229 for exact template)
- Line value descriptions:
  - 9 → "Lão Dương (Old Yang — biến)"
  - 7 → "Thiếu Dương (Young Yang — tĩnh)"
  - 8 → "Thiếu Âm (Young Yin — tĩnh)"
  - 6 → "Lão Âm (Old Yin — biến)"
- Moving line positions: list which lines are 6 or 9, or "Không có" if none
- Uses `navigator.clipboard.writeText(prompt)`
- Shows "Copied!" feedback for 2 seconds via useState toggle
- Button styled like the "Gieo lại" button: border-only, rounded, muted text, 48px+ tap target
- Dark styling consistent with the page

- [ ] **Step 2: Commit**

```bash
git add src/components/iching/PromptGenerator.tsx
git commit -m "feat(iching): add PromptGenerator with clipboard copy"
```

---

## Task 8: Integrate into HexagramResult

**Files:**
- Modify: `src/components/iching/HexagramResult.tsx`

**Depends on:** Tasks 3, 5, 6, 7

- [ ] **Step 1: Add hexagram data fetching and render new components**

Update `HexagramResult` to:
1. Import `InterpretationDisplay` and `PromptGenerator`
2. Import `HexagramData` type
3. Add state for fetched hexagram data: `primaryData`, `changedData`, `nuclearData`
4. On mount (or when `result` changes), fetch from `/api/iching/hexagrams?numbers=...`
   - Collect unique numbers: `result.primary.nuclearNumber`, `result.primary.number`, `result.changed?.number`, `result.changed?.nuclearNumber`
   - Single fetch, then distribute results to the three state variables
5. Render below the existing hexagram line diagrams:
   - `<InterpretationDisplay>` with the three numbers
   - `<PromptGenerator>` with result + fetched data
   - Existing "Gieo lại" button stays at the bottom

The existing hexagram diagram rendering stays exactly as-is. New components are appended below.

- [ ] **Step 2: Smoke test**

1. Navigate to `/iching`
2. Drop an image
3. After casting, verify:
   - Hexagram lines display (existing — should still work)
   - Interpretation sections appear below with collapsible text
   - "Copy prompt for Claude" button appears
   - Clicking it copies a structured prompt to clipboard
   - "Gieo lại" still works
4. Test on mobile (393px viewport)

- [ ] **Step 3: Commit**

```bash
git add src/components/iching/HexagramResult.tsx
git commit -m "feat(iching): integrate interpretation display and prompt generator into result view"
```
