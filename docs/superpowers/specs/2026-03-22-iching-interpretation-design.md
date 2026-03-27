# I Ching Interpretation Layer — Design Spec

Feature: Static hexagram interpretation display + prompt generator for Claude chat, backed by DB-stored hexagram reference data.

Scope: Display pre-written interpretation text from the `iching-foundation` skill's 64-hexagram reference. Add nuclear hexagram computation. Generate a copyable prompt for deeper AI reading via Claude chat.

Builds on: `docs/superpowers/specs/2026-03-22-iching-coin-casting-design.md`

## DB Schema

New Prisma model added to `prisma/schema.prisma`:

```prisma
model Hexagram {
  number        Int     @id          // King Wen number 1-64
  nameVi        String               // "Càn"
  nameZh        String               // "乾"
  nameEn        String               // "The Creative"
  structure     String               // "☰ Heaven over ☰ Heaven | Kim over Kim"
  nuclearNumber Int                   // Nuclear hexagram King Wen number
  energyState   String               // Energy state description
  physicist     String               // Mode 1: energy mechanics text
  sage          String               // Mode 2: traditional wisdom text
  advisor       String               // Mode 3: practical guidance text
  balance       String               // Balance assessment text
}
```

Note: `upperTrigram` and `lowerTrigram` are NOT stored in the DB — they are already derivable from the hexagram number via the existing `TRIGRAMS` + `KING_WEN` tables in `hexagram.ts`. No need to duplicate.

All text fields store the full pre-written interpretation from the skill's reference files. No markdown rendering needed — plain text with line breaks.

## Seed Script

`prisma/seed-hexagrams.ts` — parses the two reference markdown files and inserts all 64 hexagram records.

**Data source files** (copied into the project from the `iching-foundation.skill` archive):
- `prisma/data/64-hexagrams-part1.md` (hexagrams 1–32)
- `prisma/data/64-hexagrams-part2.md` (hexagrams 33–64)

**Parsing logic:** Each hexagram entry follows this exact markdown format:
```
## Hexagram 1 — ䷀ Qián / Càn / THE CREATIVE
**Structure**: ☰ Heaven over ☰ Heaven | Kim over Kim
**Nuclear Hexagram**: 1 (Càn — self-similar at all scales)
**Energy State**: [text]

**Physicist**: [text]

**Sage**: [text]

**Advisor**: [text]

**Balance**: [text]

---
```

**Heading format:** `## Hexagram N — [unicode symbol] [Pinyin] / [Vietnamese] / [ENGLISH]`
- The em-dash (—) separates number from the rest
- Three name fields separated by ` / `
- Field 1 = Pinyin (discard — not stored in DB)
- Field 2 = Vietnamese → `nameVi`
- Field 3 = English (UPPERCASE) → `nameEn`

**`nameZh` source:** The Chinese character name (e.g. "乾") is NOT in the markdown headings. Source it from the existing `HEXAGRAM_NAMES` constant in `src/lib/iching/hexagram.ts`, which already has all 64 Chinese names. The seed script should import this.

**Preamble:** Part 1 has a "How to Read Each Entry" section before Hexagram 1. Skip everything before the first `## Hexagram N` heading.

**Section parsing:** Split on `## Hexagram` boundaries, then regex-extract each `**FieldName**: ` section. The `**Structure**` field is extracted verbatim.

**Nuclear number parsing:** From `**Nuclear Hexagram**: N (Name — ...)`, extract just the number N.

**Validation:** Throw on any parse failure. After seeding, assert `records.length === 64`.

The seed script runs via `npx prisma db seed`. Configure in `package.json`:
```json
"prisma": { "seed": "npx tsx prisma/seed-hexagrams.ts" }
```

## Nuclear Hexagram Computation

Added to the casting engine (`src/lib/iching/casting.ts` and `src/lib/iching/hexagram.ts`).

**Algorithm:**
- Lower nuclear trigram = lines [2, 3, 4] (1-indexed, from the primary hexagram)
- Upper nuclear trigram = lines [3, 4, 5]
- Apply `linesToTrigramIndex()` to each set of 3 lines
- Look up in King Wen table → nuclear hexagram number

**New function in `hexagram.ts`:**
```ts
export function computeNuclearNumber(lines: LineValue[]): number
```

The existing `linesToTrigramIndex()` already handles all four `LineValue` types correctly (7/9→yang, 6/8→yin), so no explicit conversion is needed before calling it.

**Updated types in `types.ts`:**
```ts
export interface HexagramInfo {
  number: number
  name: HexagramName
  upperTrigram: { symbol: string; name: string }
  lowerTrigram: { symbol: string; name: string }
  nuclearNumber: number           // NEW
}
```

**Updated `CastingResponse`:** The `primary` and `changed` HexagramInfo objects now each include `nuclearNumber`. No separate top-level field needed.

**Updated `castHexagram()`:** Calls `computeNuclearNumber()` for both primary and changed hexagrams.

## API

### New: `GET /api/iching/hexagrams?numbers=1,23,44`

Returns multiple hexagram records from the DB in a single request.

**File:** `src/app/api/iching/hexagrams/route.ts`

**Query param:** `numbers` — comma-separated King Wen numbers (1-64)

**Response shape:** `HexagramData[]`
```ts
// This type matches the Prisma Hexagram model
interface HexagramData {
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

Add `HexagramData` to `src/lib/iching/types.ts`.

**Error handling:** 400 if `numbers` param is missing or contains invalid values. Returns empty array for numbers not found.

### Updated: `POST /api/iching/cast`

Response now includes `nuclearNumber` in both `primary` and `changed` HexagramInfo objects (backward compatible — new field added).

## Components

### `InterpretationDisplay`

**File:** `src/components/iching/InterpretationDisplay.tsx`

**Props:**
```ts
interface InterpretationDisplayProps {
  primaryNumber: number
  changedNumber: number | null
  nuclearNumber: number
}
```

**Behavior:**
- Fetches hexagram data from `/api/iching/hexagrams?numbers=N,N,N` (single batch request) for primary, changed (if exists), and nuclear hexagrams
- Displays in collapsible sections (collapsed by default to avoid overwhelming):
  - **Primary Hexagram** (expanded by default)
    - Energy State
    - Physicist
    - Sage
    - Advisor
    - Balance
  - **Changed Hexagram** (if exists, collapsed)
    - Same sections
  - **Nuclear Hexagram** (Hỗ Quái) (collapsed)
    - Same sections
- Dark immersive styling matching the casting page (#0a0a0a background)
- Section headers include hexagram name (Vi + Zh + En) and number
- Text rendered with preserved line breaks (whitespace-pre-line)

### `PromptGenerator`

**File:** `src/components/iching/PromptGenerator.tsx`

**Props:**
```ts
interface PromptGeneratorProps {
  result: CastingResponse
  primaryData: HexagramData | null    // fetched from batch API
  changedData: HexagramData | null
  nuclearData: HexagramData | null    // nuclear hexagram data — provides nuclearName for prompt
}
```

**Behavior:**
- Renders a "Copy prompt for Claude" button
- On click, builds a structured prompt string and copies to clipboard:

```
Tôi vừa gieo quẻ Kinh Dịch bằng phép gieo đồng tiền (擲錢法).

## Kết quả Gieo Quẻ

Các hào (từ dưới lên): [7, 8, 9, 7, 6, 8]
- Hào 1 (Sơ hào): [value] — [Thiếu Dương/Thiếu Âm/Lão Dương/Lão Âm]
- ...
- Hào 6 (Thượng hào): [value] — [type]

Hào biến: [list of moving line positions, or "Không có"]

## Bản Quái (Primary Hexagram)
#[number] [nameVi] ([nameZh]) — [nameEn]
Cấu trúc: [structure]
Hỗ quái: #[nuclearNumber] [nuclearName]

## Biến Quái (Changed Hexagram)
#[number] [nameVi] ([nameZh]) — [nameEn]
[or "Không có biến quái (tất cả hào đều tĩnh)"]

---

Hãy dùng skill iching-foundation để luận giải đầy đủ theo quy trình 7 bước:
1. Xác định Quẻ
2. Phân tích Cấu trúc (trigram, Ngũ Hành, vị trí hào)
3. Phân tích Hào biến
4. Luận giải Ba lớp (Nhà Vật lý / Minh triết / Cố vấn)
5. Bản đồ Xu hướng (Primary → Changed → Nuclear)
6. Đánh giá Cân bằng
7. Tổng hợp
```

- Shows "Copied!" feedback for 2 seconds after clicking
- Button styled consistently with the "Gieo lại" button

### `HexagramResult` (Updated)

The existing component is extended to render `InterpretationDisplay` and `PromptGenerator` below the hexagram line diagrams.

The component now fetches hexagram data from the API after receiving the casting result, and passes it to the child components.

## Page Flow

The `/iching` page flow remains: `idle → casting → result`

The result state now shows:
1. Hexagram line diagrams (existing — primary + changed side-by-side)
2. Interpretation sections (collapsible, from DB)
3. Prompt generator (copy button)
4. "Gieo lại" button (existing)

## File Map

```
prisma/
├── schema.prisma                      # Add Hexagram model
├── data/
│   ├── 64-hexagrams-part1.md          # Copied from skill (hexagrams 1–32)
│   └── 64-hexagrams-part2.md          # Copied from skill (hexagrams 33–64)
└── seed-hexagrams.ts                  # Parse markdown → insert 64 records

src/lib/iching/
├── types.ts                           # Add nuclearNumber to HexagramInfo
├── hexagram.ts                        # Add computeNuclearNumber()
└── casting.ts                         # Use computeNuclearNumber() in castHexagram()

src/app/api/iching/
└── hexagrams/route.ts                 # GET batch hexagrams from DB

src/components/iching/
├── InterpretationDisplay.tsx           # Collapsible interpretation sections
├── PromptGenerator.tsx                 # Copy-paste prompt builder
└── HexagramResult.tsx                  # Updated to include new components
```

## Out of Scope

- AI-generated interpretation (future — "Ask for deeper reading" button)
- Question input field before casting (future)
- Saving readings/history to DB
- Line-specific interpretation text (Hào từ per line — future)
- Interpretation protocol steps 2c (line position correctness analysis) and 2d (nuclear hexagram deep analysis) as computed features — these are left to the Claude chat prompt
