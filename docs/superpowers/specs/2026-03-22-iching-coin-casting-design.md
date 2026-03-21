# I Ching Coin Casting — Design Spec

Feature: Kinh Dịch (擲錢法) coin casting via image-seeded hexagram generation.

Scope: Casting flow only — image in, hexagram out. No interpretation layer.

## Route

`/iching` — new tab "Kinh Dịch" in the header navigation, added to `layout.tsx`.

## User Flow

Three states:

1. **Idle** — Dark immersive full-width canvas with a centered drop zone. User drags and drops an image (typically a screenshot) or clicks to browse. The image serves as entropy — any image works.
2. **Casting** — Immersive coin animation plays: 6 rounds of 3 abstract yin/yang coins tossed, building the hexagram line by line from bottom (Sơ hào) to top (Thượng hào). A "Skip" button is available to jump straight to the result. The animation is purely presentational — the backend has already computed the result.
3. **Result** — Primary hexagram (Bản Quái) with moving lines glowing gold with ○ markers. If moving lines exist, the changed hexagram (Biến Quái) is displayed side-by-side at equal visual weight. If no moving lines (all stable), only the primary hexagram is shown, centered. "Gieo lại · Cast Again" button resets to idle state.

## Architecture — Hybrid (Client hash, Server cast)

### Client Side
1. User drops/selects image
2. Image drawn to hidden `<canvas>` to extract pixel data
3. Pixel buffer hashed via `crypto.subtle.digest('SHA-256', pixelBuffer)` → hex string
4. `POST /api/iching/cast` with `{ imageHash: "abc123..." }` (tiny payload)
5. Receive result, play animation (or skip), render hexagrams

### Server Side
1. Receive `{ imageHash }` from client. Validate: must be a non-empty hex string (reject with 400 + `{ error: string }` otherwise).
2. Combine: `seed = SHA-256(imageHash + ":" + TRUNG + ":" + timestamp)`
   - Timestamp is `Date.now()` (millisecond precision). Provides per-cast uniqueness so the same image cast multiple times yields different results. The spelling "eterenity" in TRUNG is intentional.
3. Extract coin values from the 256-bit seed hash. Use the first 18 bits — 3 bits per line, 1 bit per coin:
   - Line 1: bits [0, 1, 2] → coin 1, coin 2, coin 3
   - Line 2: bits [3, 4, 5] → coin 1, coin 2, coin 3
   - ...
   - Line 6: bits [15, 16, 17] → coin 1, coin 2, coin 3
   - Each bit: 1 = Yang (heads), 0 = Yin (tails)
4. Per-line sum of 3 coins maps to traditional values:
   - 3 Yang = 9 (Lão Dương / Old Yang — moving)
   - 2 Yang + 1 Yin = 7 (Thiếu Dương / Young Yang — stable)
   - 1 Yang + 2 Yin = 8 (Thiếu Âm / Young Yin — stable)
   - 3 Yin = 6 (Lão Âm / Old Yin — moving)
5. Preserves real coin probability distribution: 9 and 6 at 12.5%, 7 and 8 at 37.5%
6. Lines 1-3 → lower trigram, Lines 4-6 → upper trigram → King Wen lookup → hexagram number
7. Changed hexagram: flip moving lines (6→7, 9→8), look up again. If no moving lines exist, `changed` is `null`.
8. Return full result including per-line coin faces for the animation

### TRUNG Constant

`"in eterenity out infinity"` — hardcoded in `src/lib/iching/trung.ts`. Server-only, not exposed to client bundle. Not editable, not per-user.

### API Response Shape

```ts
interface CastingResponse {
  lines: LineValue[]              // [7, 8, 9, 7, 6, 8] — bottom to top
  coins: [number, number, number][] // per-line coin faces (0=yin, 1=yang) for animation
  primary: {
    number: number                // King Wen number (1-64)
    name: { vi: string; zh: string; en: string }
    upperTrigram: { symbol: string; name: string }  // e.g. { symbol: '☷', name: 'Khôn' }
    lowerTrigram: { symbol: string; name: string }
  }
  changed: {                      // null if no moving lines
    number: number
    name: { vi: string; zh: string; en: string }
    upperTrigram: { symbol: string; name: string }
    lowerTrigram: { symbol: string; name: string }
  } | null
  timestamp: number
}

type LineValue = 6 | 7 | 8 | 9
```

## File Structure

```
src/
├── app/
│   ├── iching/
│   │   └── page.tsx              # Main page — idle/casting/result states
│   └── api/
│       └── iching/
│           └── cast/
│               └── route.ts      # POST handler
├── components/
│   └── iching/
│       ├── ImageDropZone.tsx      # Drag-and-drop + click-to-browse + client SHA-256
│       ├── CoinCastAnimation.tsx  # 6-round × 3-coin immersive animation + skip
│       └── HexagramResult.tsx     # Side-by-side primary + changed hexagram
└── lib/
    └── iching/
        ├── trung.ts              # TRUNG constant (server-only)
        ├── casting.ts            # Hash combining, PRNG, line generation
        ├── hexagram.ts           # Trigram/hexagram lookup tables, King Wen sequence
        └── types.ts              # CastingResponse, LineValue, HexagramData types
```

## Component Details

### `ImageDropZone`
- Centered drop area with dashed border on dark canvas
- Accepts drag-and-drop and click-to-browse (file input, `accept="image/*"`)
- Rejects non-image files with a brief user-facing message
- On image received: draws to hidden canvas, reads pixels, hashes, calls API
- Brief image preview that fades as transition to casting begins

### `CoinCastAnimation`
- Receives `coins` array and `lines` array from API response
- 6 rounds, each round:
  - 3 abstract circles (coins) with yin/yang markings flip via CSS transforms
  - Coins land matching the `coins[round]` values
  - After coins settle, the corresponding line draws at the hexagram stack
  - Moving lines (6 or 9) pulse/glow when drawn
- Lines build bottom to top (Sơ hào → Thượng hào)
- "Skip" button in corner — click jumps to result state
- Total animation: ~8-10 seconds uninterrupted
- Coins are simple abstract circles — one side yin marking, other side yang marking

### `HexagramResult`
- If moving lines exist: two hexagrams side-by-side, small gap (12px mobile, 16px desktop), no arrow
- If no moving lines: single hexagram centered
- Each hexagram shows:
  - Label (Bản Quái / Biến Quái)
  - Upper trigram label with symbol and name
  - 6 lines with line numbers and values
  - Dashed divider between trigrams
  - Lower trigram label with symbol and name
  - Hexagram name in Chinese, Vietnamese, and English with number
- Moving lines: gold gradient + glow + ○ marker (on primary hexagram only)
- "Gieo lại · Cast Again" button below

## Error Handling

- **Client:** Invalid file type (non-image) → brief inline message "Please drop an image file". Network failure → "Casting failed, please try again" with retry option.
- **Server:** Missing or malformed `imageHash` → 400 + `{ error: "Invalid image hash" }`. All other errors → 500 + `{ error: "Casting failed" }`.
- **Page state:** Error is a sub-state of idle — the drop zone remains visible with an error message above it, allowing the user to try again immediately.

## Responsive Design

- **Mobile-first**, optimized for iPhone 15-17 Pro (393pt width)
- Side-by-side layout on ALL screen sizes
- Mobile: 68px line width, 12px gap, 8px labels
- Desktop (≥640px): 88px line width, 16px gap, 10px labels
- Touch-friendly: 48px minimum tap target on button
- System font stack for native iOS feel

## Hexagram Data

### Trigram Table (8 trigrams)

| Index | Binary | Symbol | Name (VI) | Name (ZH) |
|-------|--------|--------|-----------|-----------|
| 0 | 000 | ☷ | Khôn | 坤 |
| 1 | 001 | ☶ | Cấn | 艮 |
| 2 | 010 | ☵ | Khảm | 坎 |
| 3 | 011 | ☴ | Tốn | 巽 |
| 4 | 100 | ☳ | Chấn | 震 |
| 5 | 101 | ☲ | Ly | 離 |
| 6 | 110 | ☱ | Đoài | 兌 |
| 7 | 111 | ☰ | Càn | 乾 |

### King Wen Sequence

Standard 8×8 lookup table mapping (upper trigram index, lower trigram index) → hexagram number (1-64). This is a well-known fixed table — to be stored in `hexagram.ts`.

### Hexagram Names

64 entries with Vietnamese, Chinese, and English names. Minimal data needed for the casting result display. To be stored in `hexagram.ts` as a lookup by King Wen number.

## Navigation

Add "Kinh Dịch" link to the header nav in `layout.tsx`, alongside existing "Bát Tự", "Cases", "Lá Số" links. Route: `/iching`.

## Out of Scope

- Hexagram interpretation texts (Thoán, Hào từ, Đại Tượng)
- Saving/history of castings
- User authentication requirements
- Integration with Bazi calculations
- The `hexagrams64.html` static file in project root (not used)
