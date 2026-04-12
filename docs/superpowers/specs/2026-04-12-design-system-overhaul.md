# Full Visual Overhaul — Apply DESIGN.md

**Date:** 2026-04-12
**Scope:** Full app-wide visual overhaul applying the Claude-inspired DESIGN.md system to every page and component.

## Decisions

- **Typography:** Keep Be Vietnam Pro as the sole font family (no serif/sans split)
- **Dark mode:** Remove user-togglable dark mode entirely. Use editorial light/dark section alternation within pages instead.
- **Scope:** Every page and component including admin
- **Components:** Restyle shadcn/ui components to match DESIGN.md specifications (button variants, card styles, ring shadows)
- **Approach:** Foundation-up — tokens first, then components, then layout shell, then pages

---

## Phase 1: Design Tokens & CSS Foundation

### Changes to `globals.css`

**Remove:**
- `.dark` block entirely
- `@custom-variant dark (&:is(.dark *));` directive

**Replace oklch values with exact DESIGN.md hex values:**

| Token | Value | DESIGN.md Name |
|---|---|---|
| `--background` | `#f5f4ed` | Parchment |
| `--foreground` | `#141413` | Anthropic Near Black |
| `--card` | `#faf9f5` | Ivory |
| `--card-foreground` | `#141413` | Anthropic Near Black |
| `--popover` | `#faf9f5` | Ivory |
| `--popover-foreground` | `#141413` | Anthropic Near Black |
| `--primary` | `#c96442` | Terracotta Brand |
| `--primary-foreground` | `#faf9f5` | Ivory |
| `--secondary` | `#e8e6dc` | Warm Sand |
| `--secondary-foreground` | `#4d4c48` | Charcoal Warm |
| `--muted` | `#e8e6dc` | Warm Sand |
| `--muted-foreground` | `#87867f` | Stone Gray |
| `--accent` | `#e8e6dc` | Warm Sand |
| `--accent-foreground` | `#141413` | Anthropic Near Black |
| `--destructive` | `#b53333` | Error Crimson |
| `--border` | `#f0eee6` | Border Cream |
| `--input` | `#f0eee6` | Border Cream |
| `--ring` | `#d1cfc5` | Ring Warm |

**New semantic tokens:**

| Token | Value | DESIGN.md Name |
|---|---|---|
| `--foreground-secondary` | `#5e5d59` | Olive Gray |
| `--foreground-tertiary` | `#87867f` | Stone Gray |
| `--border-warm` | `#e8e6dc` | Border Warm |
| `--surface-dark` | `#30302e` | Dark Surface |
| `--surface-deep` | `#141413` | Deep Dark |
| `--text-on-dark` | `#faf9f5` | Ivory |
| `--text-on-dark-secondary` | `#b0aea5` | Warm Silver |
| `--focus-blue` | `#3898ec` | Focus Blue |
| `--ring-subtle` | `#dedc01` | Ring Subtle |
| `--ring-deep` | `#c2c0b6` | Ring Deep |
| `--coral-accent` | `#d97757` | Coral Accent |
| `--dark-warm` | `#3d3d3a` | Dark Warm |

**Add utility classes:**

```css
.section-light {
  background: #f5f4ed;
  color: #141413;
}

.section-dark {
  background: #141413;
  color: #faf9f5;
  /* Scoped token overrides for children */
  --foreground: #faf9f5;
  --foreground-secondary: #b0aea5;
  --card: #30302e;
  --card-foreground: #faf9f5;
  --border: #30302e;
  --border-warm: #30302e;
  --muted-foreground: #b0aea5;
}
```

**Update radius scale:**
- Base: 8px (`--radius: 0.5rem`)
- Tailwind scale: sm=4px, md=6px, lg=8px, xl=12px, 2xl=16px, 3xl=24px, 4xl=32px

**Keep unchanged:**
- Ngu Hanh element colors (both sets kept for section-dark contexts)
- I Ching accent colors
- Chart palette colors
- Be Vietnam Pro font stack
- Tailwind v4 setup, shadcn imports, tw-animate-css

### Files to remove/modify

- **Delete:** `src/components/theme-toggle.tsx`
- **Delete:** `src/components/theme-provider.tsx`
- **Modify:** `src/app/layout.tsx` — remove ThemeProvider wrapper, remove ThemeToggle from header
- **Modify:** `package.json` — remove `next-themes` dependency
- **Modify:** `src/app/globals.css` — all token changes above

---

## Phase 2: shadcn Component Restyling

### Buttons (`src/components/ui/button.tsx`)

| Variant | Background | Text | Radius | Shadow |
|---|---|---|---|---|
| `default` | `#c96442` (Terracotta) | `#faf9f5` (Ivory) | 8px | `0 0 0 1px #c96442` |
| `secondary` | `#e8e6dc` (Warm Sand) | `#4d4c48` (Charcoal) | 8px | `0 0 0 1px #d1cfc5` |
| `outline` | `#ffffff` (White) | `#141413` (Near Black) | 12px | `0 0 0 1px #f0eee6` |
| `ghost` | transparent | `#5e5d59` (Olive Gray) | 8px | none |
| `dark` (new) | `#30302e` (Dark Surface) | `#faf9f5` (Ivory) | 8px | `0 0 0 1px #30302e` |
| `destructive` | `#b53333` (Error Crimson) | `#faf9f5` (Ivory) | 8px | — |
| `link` | transparent | `#3d3d3a` (Dark Warm) | — | — |

**States:**
- Hover: deeper ring color `#c2c0b6` (Ring Deep)
- Active/pressed: `inset 0 0 0 1px` at 15% opacity
- Focus: `#3898ec` (Focus Blue) ring — the only cool color
- Remove active transform/scale

### Cards (`src/components/ui/card.tsx`)

- Default: bg Ivory `#faf9f5`, border `1px solid #f0eee6`, radius 8px, padding 24-32px
- Add `featured` size variant: radius 16px
- Add `dark` variant: bg `#30302e`, border `#30302e`, text `#faf9f5`
- Hover/elevated: whisper shadow `rgba(0,0,0,0.05) 0px 4px 24px`

### Avatar (`src/components/ui/avatar.tsx`)

- Ring shadows instead of solid borders
- Fallback background: Warm Sand `#e8e6dc`

### Dropdown Menu (`src/components/ui/dropdown-menu.tsx`)

- Surface: Ivory `#faf9f5`
- Border: Border Cream `#f0eee6`
- Radius: 12px
- Item hover: Warm Sand `#e8e6dc`
- Separator: Border Cream `#f0eee6`

### Navigation Menu (`src/components/ui/navigation-menu.tsx`)

- Links: Near Black `#141413` default
- Hover: foreground-primary, no underline
- Dropdown content: Ivory surface, Border Cream border, 12px radius

---

## Phase 3: Layout Shell

### Header (`src/app/layout.tsx`)

- Remove `ThemeToggle` and `ThemeProvider`
- Background: Parchment `#f5f4ed` at 80% opacity with backdrop blur (keep existing blur)
- Border bottom: `1px solid #f0eee6` (Border Cream)
- Height: keep 48px (`h-12`)
- Logo "BBTB": weight 600, Near Black `#141413`
- Nav links: weight 400, `#141413` → hover stays `#141413`

### Mobile Nav (`src/components/mobile-nav.tsx`)

- Overlay: solid Parchment `#f5f4ed` background
- Touch targets: minimum 44px height per link
- Active route: Warm Sand `#e8e6dc` background

### Page Container

- `<main>` has no max-width — pages control their own width
- Pages compose full-width sections with `.section-light` / `.section-dark`
- Within sections: centered content at `max-width: 1200px`
- Section vertical padding: 80-120px for major sections

---

## Phase 4: Page Redesigns

### Homepage (`src/app/page.tsx`)

- **Hero section** (`.section-light`): full-width Parchment, centered headline at 36px weight 500, subtitle in Olive Gray at 20px line-height 1.60, Terracotta CTA if not signed in
- **Feature cards**: 3-column grid (1 on mobile), Ivory cards with Border Cream, 8px radius, ring shadow hover, 32px padding, all 6 modules linked (Bazi, Tu Vi, I Ching, Human Design, Numerology, Cases)
- Section vertical padding: 80-100px

### Module Index Pages

**Bazi (`src/app/bazi/page.tsx`) & Numerology (`src/app/numerology/page.tsx`):**
- Two-column layout stays structurally the same
- Sidebar form: Ivory card, Border Cream border, 8px radius
- Results: inherit new card styling, section headers weight 500, 20-25px
- Tables: warm borders, no cool grays

**Tu Vi (`src/app/tu-vi/page.tsx`) & Human Design (`src/app/human-design/page.tsx`):**
- Hero card restyled with Terracotta CTA
- Chapter grids: Ivory cards, ring shadows, warm borders, 8px radius

**I Ching (`src/app/iching/page.tsx`):**
- Drop zone and casting animation: Parchment/dark section colors
- Hexagram result: dark section for dramatic reveal

**Admin (`src/app/admin/`):**
- Parchment background, Ivory cards, warm borders
- Tables: Border Cream separators, Warm Sand hover
- Login: centered Ivory card, Terracotta submit
- Admin nav: Warm Sand active state

### Learning Pages

- Editorial treatment: line-height 1.60, 16-17px body text
- Section headings: weight 500
- Chapter navigation: warm-toned prev/next

### Cross-cutting Patterns

- Loading spinners: Terracotta color
- Empty states: Warm Sand icon container
- Content links: Olive Gray / Dark Warm, no underline, hover → Near Black
- Focus rings: `#3898ec` everywhere for accessibility

---

## Files Affected

### Deleted
- `src/components/theme-toggle.tsx`
- `src/components/theme-provider.tsx`

### Core modifications
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/avatar.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/navigation-menu.tsx`
- `src/components/app-nav.tsx`
- `src/components/mobile-nav.tsx`

### Page modifications
- `src/app/page.tsx`
- `src/app/bazi/page.tsx`
- `src/app/tu-vi/page.tsx`
- `src/app/tu-vi/learn/[chapter]/page.tsx`
- `src/app/iching/page.tsx`
- `src/app/human-design/page.tsx`
- `src/app/numerology/page.tsx`
- `src/app/numerology/learn/[chapter]/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/layout.tsx`
- `src/app/admin/readings/page.tsx`
- `src/app/admin/bazi-clients/page.tsx`
- `src/app/admin/tu-vi-clients/page.tsx`
- `src/app/admin/numerology-clients/page.tsx`
- `src/app/signin/page.tsx`
- `src/app/bazi/[id]/page.tsx`
- `src/app/bazi/cases/page.tsx`
- `src/app/bazi/cases/[slug]/page.tsx`
- `src/app/hexagrams/page.tsx`
- `src/app/iching/history/page.tsx`
- `src/app/iching/history/[id]/page.tsx`
- `src/app/human-design/[chapter]/page.tsx`
- `src/app/human-design/chart/[id]/page.tsx`
- `src/app/human-design/calculator/page.tsx`
- `src/app/tu-vi/chart/[id]/page.tsx`
- `src/app/tu-vi/calculator/page.tsx`
- `src/app/numerology/[id]/page.tsx`
- `src/app/numerology/learn/[chapter]/lessons/*.tsx` (12 files)
- `src/app/readings/[tokenId]/page.tsx`
- `src/app/admin/clients/[id]/page.tsx`

### Dependency changes
- Remove `next-themes` from `package.json`
