# I Ching Coin Casting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Kinh Dịch page where users drop an image to generate an I Ching hexagram via the 擲錢法 (coin casting) method, with an immersive coin animation.

**Architecture:** Hybrid client/server — client hashes the image via SHA-256, server combines the hash with a soul string (TRUNG) and timestamp to seed a PRNG that produces 6 traditional coin-casting lines. CSS-animated coin toss plays on the client while the result is already computed.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Web Crypto API (client SHA-256), Node crypto (server SHA-256)

**Spec:** `docs/superpowers/specs/2026-03-22-iching-coin-casting-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/lib/iching/types.ts` | Create | TypeScript types: LineValue, CoinFace, CastingResponse, TrigramData, HexagramData |
| `src/lib/iching/trung.ts` | Create | TRUNG constant (server-only) |
| `src/lib/iching/hexagram.ts` | Create | 8 trigrams, King Wen 8×8 table, 64 hexagram names, lookup functions |
| `src/lib/iching/casting.ts` | Create | Hash combining, bit extraction, coin→line mapping, full casting pipeline |
| `src/app/api/iching/cast/route.ts` | Create | POST handler: validate imageHash, call casting engine, return response |
| `src/components/iching/ImageDropZone.tsx` | Create | Drag-and-drop + click-to-browse, client-side SHA-256 hashing |
| `src/components/iching/HexagramResult.tsx` | Create | Side-by-side primary + changed hexagram display |
| `src/components/iching/CoinCastAnimation.tsx` | Create | 6-round × 3-coin CSS animation with skip |
| `src/app/iching/page.tsx` | Create | Main page: idle → casting → result state machine |
| `src/app/layout.tsx` | Modify | Add "Kinh Dịch" nav link |

## Parallelization Map

```
Task 1 (types)
  ├─► Task 2 (trung) ──────────┐
  ├─► Task 3 (hexagram tables) ─┤
  │                              ├─► Task 4 (casting engine) ─► Task 5 (API route) ──┐
  │                                                                                    │
  ├─► Task 6 (ImageDropZone) ──────────────────────────────────────────────────────── ├─► Task 9 (page + nav)
  ├─► Task 7 (HexagramResult) ──────────────────────────────────────────────────────── │
  └─► Task 8 (CoinCastAnimation) ──────────────────────────────────────────────────── ┘
```

**Parallel groups:**
- After Task 1: Tasks 2, 3, 6, 7, 8 can all run in parallel
- After Tasks 2+3: Task 4 (casting engine — imports from trung.ts and hexagram.ts)
- After Task 4: Task 5 (API route)
- After Tasks 5+6+7+8: Task 9 (page integration)

**Note:** Mobile nav is currently hidden (`hidden sm:flex`). The "Kinh Dịch" link follows this existing pattern — on mobile viewports, users reach `/iching` via direct URL. A mobile nav menu is a separate concern.

---

## Task 1: Types

**Files:**
- Create: `src/lib/iching/types.ts`

- [ ] **Step 1: Create types file**

```ts
// Line values from traditional coin casting
export type LineValue = 6 | 7 | 8 | 9

// Individual coin face: 0 = Yin (tails), 1 = Yang (heads)
export type CoinFace = 0 | 1

// Per-line coin result: 3 coins
export type CoinThrow = [CoinFace, CoinFace, CoinFace]

export interface TrigramData {
  index: number       // 0-7
  binary: string      // '000' to '111'
  symbol: string      // ☷ ☶ ☵ ☴ ☳ ☲ ☱ ☰
  name: string        // Vietnamese: Khôn, Cấn, etc.
  zh: string          // Chinese: 坤, 艮, etc.
}

export interface HexagramName {
  vi: string          // Vietnamese
  zh: string          // Chinese
  en: string          // English
}

export interface HexagramInfo {
  number: number      // King Wen number 1-64
  name: HexagramName
  upperTrigram: { symbol: string; name: string }
  lowerTrigram: { symbol: string; name: string }
}

export interface CastingResponse {
  lines: LineValue[]
  coins: CoinThrow[]
  primary: HexagramInfo
  changed: HexagramInfo | null
  timestamp: number
}

export interface CastingRequest {
  imageHash: string
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/iching/types.ts
git commit -m "feat(iching): add TypeScript types for coin casting"
```

---

## Task 2: TRUNG Constant

**Files:**
- Create: `src/lib/iching/trung.ts`

**Depends on:** Task 1

- [ ] **Step 1: Create trung constant**

```ts
/**
 * TRUNG — the soul string. Combined with image hash and timestamp
 * to seed hexagram generation. The spelling "eterenity" is intentional.
 * Server-only: this file should never be imported by client components.
 */
export const TRUNG = 'in eterenity out infinity'
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/iching/trung.ts
git commit -m "feat(iching): add TRUNG soul constant"
```

---

## Task 3: Hexagram Lookup Tables

**Files:**
- Create: `src/lib/iching/hexagram.ts`

**Depends on:** Task 1

- [ ] **Step 1: Create hexagram.ts with trigram table, King Wen sequence, and 64 hexagram names**

This file contains three data structures:

1. `TRIGRAMS` — array of 8 trigrams indexed 0-7, each with binary, symbol, Vietnamese name, Chinese name
2. `KING_WEN` — 8×8 number[][] table mapping [upper][lower] trigram indices to hexagram numbers 1-64
3. `HEXAGRAM_NAMES` — Record<number, HexagramName> mapping hexagram number to {vi, zh, en} names

And two lookup functions:

```ts
/** Convert 3 line values to a trigram index (0-7). Lines are bottom-to-top. */
export function linesToTrigramIndex(line1: number, line2: number, line3: number): number

/** Look up full hexagram info from 6 line values (bottom to top). */
export function lookupHexagram(lines: LineValue[]): HexagramInfo
```

The trigram table from the spec:

| Index | Binary | Symbol | VI | ZH |
|-------|--------|--------|-----|-----|
| 0 | 000 | ☷ | Khôn | 坤 |
| 1 | 001 | ☶ | Cấn | 艮 |
| 2 | 010 | ☵ | Khảm | 坎 |
| 3 | 011 | ☴ | Tốn | 巽 |
| 4 | 100 | ☳ | Chấn | 震 |
| 5 | 101 | ☲ | Ly | 離 |
| 6 | 110 | ☱ | Đoài | 兌 |
| 7 | 111 | ☰ | Càn | 乾 |

Binary mapping: each line is 0 (yin: values 6, 8) or 1 (yang: values 7, 9). Line 1 is the least significant bit.

The King Wen sequence table and all 64 hexagram names (vi, zh, en) must be complete and accurate. Reference the standard King Wen ordering.

- [ ] **Step 2: Verify the King Wen table manually**

Spot-check at least these known hexagrams:
- [upper=Càn(7), lower=Càn(7)] → #1 Càn/乾/Creative
- [upper=Khôn(0), lower=Khôn(0)] → #2 Khôn/坤/Receptive
- [upper=Khôn(0), lower=Càn(7)] → #11 Thái/泰/Peace
- [upper=Càn(7), lower=Khôn(0)] → #12 Bĩ/否/Standstill

- [ ] **Step 3: Commit**

```bash
git add src/lib/iching/hexagram.ts
git commit -m "feat(iching): add trigram table, King Wen sequence, and 64 hexagram names"
```

---

## Task 4: Casting Engine

**Files:**
- Create: `src/lib/iching/casting.ts`

**Depends on:** Task 1, Task 2, Task 3

- [ ] **Step 1: Implement the casting engine**

The module exports one main function:

```ts
import { createHash } from 'crypto'
import { TRUNG } from './trung'
import { lookupHexagram } from './hexagram'
import type { LineValue, CoinFace, CoinThrow, CastingResponse } from './types'

/**
 * Generate a hexagram from an image hash.
 * Algorithm:
 * 1. seed = SHA-256(imageHash + ":" + TRUNG + ":" + timestamp)
 * 2. Extract 18 bits from seed — 3 bits per line, 1 bit per coin
 * 3. Map coin sums to line values (6/7/8/9)
 * 4. Look up primary hexagram from King Wen table
 * 5. If moving lines exist, flip them and look up changed hexagram
 */
export function castHexagram(imageHash: string): CastingResponse
```

Implementation details:
- Use Node's `crypto.createHash('sha256')` for the seed hash
- Timestamp: `Date.now()`
- Bit extraction: convert hex hash to a Buffer, read bits 0-17
- For each line (0-5): bits [i*3], [i*3+1], [i*3+2] → 3 CoinFaces
- Sum coins: 0+0+0=0→6, 0+0+1 or 0+1+0 or 1+0+0=1→8, etc. Wait — correct mapping:
  - Sum 3 (all yang) → 9 (Old Yang)
  - Sum 2 → 7 (Young Yang)
  - Sum 1 → 8 (Young Yin)
  - Sum 0 (all yin) → 6 (Old Yin)
- Changed hexagram: flip lines where value is 6→7, 9→8. If no 6s or 9s, `changed` is null.

Also export a validation helper:

```ts
/** Validate imageHash is a non-empty hex string */
export function isValidImageHash(hash: unknown): hash is string
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/iching/casting.ts
git commit -m "feat(iching): implement casting engine with SHA-256 seed and coin mapping"
```

---

## Task 5: API Route

**Files:**
- Create: `src/app/api/iching/cast/route.ts`

**Depends on:** Task 4

- [ ] **Step 1: Create the POST handler**

Follow the pattern from `src/app/api/bazi/calculate/route.ts`:

```ts
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
```

- [ ] **Step 2: Smoke test with curl**

```bash
curl -X POST http://localhost:3000/api/iching/cast \
  -H 'Content-Type: application/json' \
  -d '{"imageHash":"a1b2c3d4e5f6"}'
```

Expected: JSON response with `lines`, `coins`, `primary`, `changed`, `timestamp` fields.

- [ ] **Step 3: Test validation**

```bash
curl -X POST http://localhost:3000/api/iching/cast \
  -H 'Content-Type: application/json' \
  -d '{"imageHash":""}'
```

Expected: 400 with `{ "error": "Invalid image hash" }`

- [ ] **Step 4: Commit**

```bash
git add src/app/api/iching/cast/route.ts
git commit -m "feat(iching): add /api/iching/cast POST route"
```

---

## Task 6: ImageDropZone Component

**Files:**
- Create: `src/components/iching/ImageDropZone.tsx`

**Depends on:** Task 1

- [ ] **Step 1: Create the drop zone component**

Props:
```ts
interface ImageDropZoneProps {
  onCasted: (result: CastingResponse) => void
}
```

Implementation:
- `'use client'` component
- Drag-and-drop area with dashed border, centered on dark background
- Hidden `<input type="file" accept="image/*">` triggered on click
- `onDragOver`, `onDrop` handlers — validate MIME type starts with `image/`
- On valid image:
  1. Create hidden `<canvas>`, draw image via `new Image()` + `ctx.drawImage()`
  2. Get pixel data: `ctx.getImageData(0, 0, w, h).data.buffer`
  3. Hash: `const hashBuffer = await crypto.subtle.digest('SHA-256', pixelData)`
  4. Convert to hex string
  5. POST to `/api/iching/cast` with `{ imageHash }`
  6. Call `onCasted(result)` with the response
- After image is selected, show a brief thumbnail preview of the image
- Preview fades out (opacity transition) as `onCasted` fires and page transitions to casting
- Loading state while hashing + API call
- Show error message if file is not an image (inline, above drop zone)
- Network errors: catch fetch failures, show "Casting failed, please try again" inline with the drop zone still visible (error is a sub-state of idle — handle entirely within this component)

- [ ] **Step 2: Commit**

```bash
git add src/components/iching/ImageDropZone.tsx
git commit -m "feat(iching): add ImageDropZone with client-side SHA-256 hashing"
```

---

## Task 7: HexagramResult Component

**Files:**
- Create: `src/components/iching/HexagramResult.tsx`

**Depends on:** Task 1

- [ ] **Step 1: Create the result display component**

Props:
```ts
interface HexagramResultProps {
  result: CastingResponse
  onCastAgain: () => void
}
```

Implementation:
- `'use client'` component
- If `result.changed` exists: two hexagrams side-by-side with 12px gap (mobile), 16px (desktop)
- If `result.changed` is null: single hexagram centered
- Each hexagram rendered as a `HexagramDiagram` (internal, not exported):
  - Label: "Bản Quái" or "Biến Quái"
  - Upper trigram label (symbol + name)
  - 6 lines top-to-bottom (line 6 at top, line 1 at bottom) with line numbers and values
  - Dashed divider between upper (lines 4-6) and lower (lines 1-3) trigrams
  - Lower trigram label (symbol + name)
  - Hexagram name: Chinese character (large), Vietnamese + number, English
- Moving lines (values 6 or 9): gold gradient + glow + ○ marker, on primary only
- "Gieo lại · Cast Again" button below — calls `onCastAgain`
- Responsive: line width 68px mobile, 88px desktop. Labels 8px mobile, 10px desktop.
- Reference the mockup at `.superpowers/brainstorm/13300-1774112796/result-mobile-v3.html` for exact styling

- [ ] **Step 2: Commit**

```bash
git add src/components/iching/HexagramResult.tsx
git commit -m "feat(iching): add HexagramResult with side-by-side display"
```

---

## Task 8: CoinCastAnimation Component

**Files:**
- Create: `src/components/iching/CoinCastAnimation.tsx`

**Depends on:** Task 1

- [ ] **Step 1: Create the coin casting animation component**

Props:
```ts
interface CoinCastAnimationProps {
  result: CastingResponse
  onComplete: () => void   // called when animation finishes or user skips
}
```

Implementation:
- `'use client'` component
- Dark full-width canvas background
- State: `currentRound` (0-5), advances automatically on timer
- Each round (~1.3s):
  1. Show 3 abstract circles (coins) — simple div with border-radius:50%
  2. Coins flip via CSS `rotateX` transform (0.4s)
  3. Land showing yin (solid circle) or yang (split circle) matching `result.coins[round]`
  4. After 0.3s pause, draw the corresponding line at the hexagram stack
  5. Lines build bottom to top: round 0 = Sơ hào (line 1), round 5 = Thượng hào (line 6)
  6. Moving lines (6 or 9) glow gold when drawn
- After all 6 rounds complete, call `onComplete()`
- "Skip" button (top-right corner): immediately calls `onComplete()`
- CSS transitions only — no canvas/WebGL. Use `transform` and `opacity` for performance.
- Coin design: ~40px circles. Yang side: solid fill. Yin side: circle with a line through it (simple yin/yang abstraction).

- [ ] **Step 2: Commit**

```bash
git add src/components/iching/CoinCastAnimation.tsx
git commit -m "feat(iching): add CoinCastAnimation with 6-round coin toss"
```

---

## Task 9: Page Integration + Navigation

**Files:**
- Create: `src/app/iching/page.tsx`
- Modify: `src/app/layout.tsx`

**Depends on:** Tasks 5, 6, 7, 8

- [ ] **Step 1: Create the page component**

```ts
'use client'

import { useState } from 'react'
import { ImageDropZone } from '@/components/iching/ImageDropZone'
import { CoinCastAnimation } from '@/components/iching/CoinCastAnimation'
import { HexagramResult } from '@/components/iching/HexagramResult'
import type { CastingResponse } from '@/lib/iching/types'

type PageState = 'idle' | 'casting' | 'result'

export default function IChing() {
  const [state, setState] = useState<PageState>('idle')
  const [result, setResult] = useState<CastingResponse | null>(null)

  const handleCasted = (res: CastingResponse) => {
    setResult(res)
    setState('casting')
  }

  const handleAnimationComplete = () => setState('result')

  const handleCastAgain = () => {
    setResult(null)
    setState('idle')
  }

  return (
    <div className="min-h-[calc(100vh-48px)] bg-[#0a0a0a]">
      {state === 'idle' && (
        <ImageDropZone onCasted={handleCasted} />
      )}
      {state === 'casting' && result && (
        <CoinCastAnimation result={result} onComplete={handleAnimationComplete} />
      )}
      {state === 'result' && result && (
        <HexagramResult result={result} onCastAgain={handleCastAgain} />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Add "Kinh Dịch" nav link to layout.tsx**

In `src/app/layout.tsx`, add to the nav alongside existing links:

```tsx
<a href="/iching" className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Kinh Dịch</a>
```

- [ ] **Step 3: End-to-end smoke test**

1. Navigate to `/iching`
2. Drop any image (screenshot)
3. Verify coin animation plays
4. Verify hexagram result displays with correct structure
5. Click "Gieo lại" — verify returns to drop zone
6. Test skip button during animation
7. Test on mobile viewport (393px width)

- [ ] **Step 4: Commit**

```bash
git add src/app/iching/page.tsx src/app/layout.tsx
git commit -m "feat(iching): add Kinh Dịch page with full casting flow and nav link"
```
