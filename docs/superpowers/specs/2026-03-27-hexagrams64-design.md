# Hexagrams 64 — Design Spec
**Date:** 2026-03-27

## Summary

Implement the existing `hexagrams64.html` as a proper Next.js page at `/hexagrams` and expose it via a "Học" dropdown in the app topbar using shadcn's NavigationMenu component.

---

## Files

### Create
- `src/app/hexagrams/page.tsx` — 64 Quẻ reference page (client component)
- `src/lib/hexagrams-data.ts` — HEXAGRAMS array extracted from hexagrams64.html (line 749+)
- `src/components/ui/navigation-menu.tsx` — installed via `npx shadcn@latest add navigation-menu`

### Modify
- `src/app/layout.tsx` — replace `<nav>` with NavigationMenu

---

## Topbar (layout.tsx)

Replace the existing `<nav className="hidden sm:flex ...">` with a shadcn `NavigationMenu`.

- "Bát Tự", "Cases", "Lá Số" become `NavigationMenuLink` items (same behavior as current `<a>` tags)
- "Học" becomes a `NavigationMenuTrigger` with a `NavigationMenuContent` dropdown containing a single item: "64 Quẻ" → `/hexagrams`
- Structure mirrors shadcn NavigationMenu conventions; easy to add more items under "Học" later
- Mobile: keep `hidden sm:flex` — no mobile nav change in scope

---

## Data (hexagrams-data.ts)

Extract the `HEXAGRAMS` array from `hexagrams64.html` (starts at line 749) as a typed export:

```ts
export interface Hexagram {
  num: number
  unicode: string
  cn: string
  vn: string
  pinyin: string
  upper: Trigram
  lower: Trigram
  element: string
  judgment: string
  description: string
}

export interface Trigram {
  cn: string
  name: string
  element: string
  lines: number[] // 1=yang, 0=yin, from top to bottom
}

export const HEXAGRAMS: Hexagram[] = [ ... ]
```

The data shape is inferred from the existing HTML. Trigram line arrays are derived from the existing rendering logic.

---

## Page (hexagrams/page.tsx)

**Client component** (`'use client'`). No auth required — public learning reference.

### Layout
- `container mx-auto max-w-5xl px-4 py-8` — matches other pages
- Page title: `<h1>` "64 Quẻ Kinh Dịch" with a subtitle in muted text

### Trigram Filter Tabs
- "Tất Cả" + 8 trigram buttons (☰ Càn, ☷ Khôn, etc.)
- Use `Button variant="outline"` for inactive, `Button variant="default"` for active tab
- Filters grid to hexagrams where upper or lower trigram matches selection

### View Toggle
- Grid view (default) / Circle view — toggle using two icon buttons (Grid2x2 / Circle from lucide-react)
- State: `useState<'grid' | 'circle'>('grid')`

### Grid View
- `grid grid-cols-8 gap-1` on desktop, `grid-cols-4` on mobile
- Each cell: `border rounded-lg p-2 cursor-pointer hover:bg-muted/50 transition-colors`
- Shows: hexagram number (tiny, muted), line symbol (6 bars), Chinese name, Vietnamese name
- Line bars: `<div>` elements — yang = `h-0.5 bg-foreground rounded`, yin = two `h-0.5 bg-foreground rounded` with a gap
- Colored by element using Tailwind text color classes

### Circle View
- SVG-based, 900px viewBox, hexagrams arranged in a circle
- Reuse the circle layout logic from hexagrams64.html (positions pre-calculated)
- Click still opens detail panel

### Detail Panel
- Opens below the grid when a hexagram is clicked (not a modal — inline expansion)
- Uses shadcn `Card` with `CardHeader`, `CardContent`
- Shows: number, unicode symbol, Chinese/Vietnamese/pinyin names, upper + lower trigram (with line bars), judgment text, description
- Close button (X) top-right of card

---

## Decisions Made

- **No auth required** — public reference page
- **No server component** — all data is static, imported from hexagrams-data.ts
- **No dark theme override** — uses app's default light/system theme (user chose B in design)
- **NavigationMenu replaces nav** — user chose option C; existing links preserved
- **Detail panel is inline** — not a modal or side drawer; simpler, no z-index complexity
- **Circle view** — preserved from original; SVG layout logic carried over
- **Mobile**: grid collapses to 4 columns; nav stays `hidden sm:flex` (no new mobile nav)
