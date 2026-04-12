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
| `--ring-subtle` | `#dedcd1` | Ring Subtle (corrected — DESIGN.md value `#dedc01` is neon yellow, likely a typo) |
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
- Override the Tailwind multipliers in `@theme` to produce exact target values:
  - `--radius-sm`: 4px (0.25rem)
  - `--radius-md`: 6px (0.375rem)
  - `--radius-lg`: 8px (0.5rem) — same as base
  - `--radius-xl`: 12px (0.75rem)
  - `--radius-2xl`: 16px (1rem)
  - `--radius-3xl`: 24px (1.5rem)
  - `--radius-4xl`: 32px (2rem)
- Note: This is a global cascade — current base is 0.625rem (10px). All existing `rounded-*` usage will shrink slightly.

### Typography Scale (Be Vietnam Pro adaptation)

Since we're using a single sans-serif font instead of DESIGN.md's serif/sans split, all heading weights shift to 600 (instead of serif 500) for comparable visual presence.

| Role | Size | Weight | Line Height | Notes |
|---|---|---|---|---|
| Display / Hero | 64px (4rem) | 600 | 1.10 | Maximum impact |
| Section Heading | 52px (3.25rem) | 600 | 1.20 | Feature section anchors |
| Sub-heading Large | 36px (2.25rem) | 600 | 1.30 | Secondary section markers |
| Sub-heading | 32px (2rem) | 600 | 1.10 | Card titles, feature names |
| Sub-heading Small | 25px (1.56rem) | 600 | 1.20 | Smaller section titles |
| Feature Title | 20px (1.25rem) | 600 | 1.20 | Small feature headings |
| Body Large | 20px (1.25rem) | 400 | 1.60 | Intro paragraphs |
| Body / Nav | 17px (1.06rem) | 400–500 | 1.00–1.60 | Navigation links, UI text |
| Body Standard | 16px (1rem) | 400–500 | 1.25–1.60 | Standard body, button text |
| Body Small | 15px (0.94rem) | 400–500 | 1.00–1.60 | Compact body text |
| Caption | 14px (0.88rem) | 400 | 1.43 | Metadata, descriptions |
| Label | 12px (0.75rem) | 400–500 | 1.25–1.60 | Badges, small labels (letter-spacing 0.12px) |
| Overline | 10px (0.63rem) | 400 | 1.60 | Uppercase overline labels (letter-spacing 0.5px) |

### dark: Class Removal Strategy

When the `.dark` block and `@custom-variant dark` are removed, all `dark:` Tailwind classes across the codebase become inert dead code. This must be handled explicitly:

1. **Search all files in `src/` for `dark:` class usage**
2. For each instance, **remove the `dark:` variant class**
3. **Audit the remaining light-mode class** — if it uses a cool-toned Tailwind default (e.g., `bg-slate-100`, `text-gray-500`), replace with the warm palette token equivalent (e.g., `bg-secondary`, `text-muted-foreground`)
4. For components that will render inside `.section-dark` wrappers, ensure they use **token-based Tailwind classes** (`bg-card`, `text-foreground`, `border-border`) rather than hardcoded color utilities, so the scoped CSS variable overrides take effect

### Ngu Hanh Dark Element Colors

The dark-mode element color variants currently live in the `.dark` block. Move them into the `.section-dark` utility class:

```css
.section-dark {
  /* ...existing token overrides... */
  --element-wood: #4A9E72;
  --element-wood-light: #78C49E;
  --element-fire: #D86050;
  --element-fire-light: #F0A080;
  --element-earth: #C89E3C;
  --element-earth-light: #E0C070;
  --element-water: #4896AE;
  --element-water-light: #7ABECE;
  --element-metal: #98908A;
  --element-metal-light: #CBC4B8;
  --iching-moving: #DA7756;
  --iching-moving-glow: rgba(218, 119, 86, 0.35);
}
```

### Sidebar Tokens

The 7 sidebar tokens (`--sidebar`, `--sidebar-foreground`, etc.) are currently unused by any page. Remove them from `:root` and the `@theme` block to reduce token surface area. If a sidebar is added later, tokens can be re-introduced.

**Keep unchanged:**
- Ngu Hanh element colors (light set at `:root`, dark set in `.section-dark`)
- I Ching accent colors (light at `:root`, dark in `.section-dark`)
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

### Inputs & Forms

- Background: Parchment `#f5f4ed` or white `#ffffff`
- Text: Near Black `#141413`
- Padding: compact vertical (~6px 12px)
- Border: `1px solid #f0eee6` (Border Cream)
- Focus: ring with Focus Blue `#3898ec` border-color — the only cool color moment
- Radius: 12px (generously rounded per DESIGN.md)
- Applies to: BirthInputForm, admin login, search inputs, select dropdowns

### Tailwind Typography Plugin

For prose content (e.g., `ChatPanel.tsx` reading responses, learning page content):
- Remove `dark:prose-invert` classes
- Add a `.section-dark .prose` override in globals.css that inverts prose colors to Ivory/Warm Silver
- Ensure prose links use Coral Accent `#d97757` in dark sections

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

### Domain component modifications

All files under these directories need: (1) remove `dark:` variant classes, (2) replace cool-toned Tailwind utilities (slate, gray, blue, zinc, neutral, stone) with warm design-system tokens.

- `src/components/bazi/*.tsx` — StrengthPanel, RelationshipsPanel, BaziPillarTable, DaiVanSection, FengShuiCompass, ThanSatTable, ThaiMenhCung, EnergyColorProfile, RawDataExport, CurrentYearPanel, etc.
- `src/components/numerology/*.tsx` — NumberBadge, NameBreakdown, ChallengesPanel, CoreNumbersPanel, CyclesPanel, PinnaclesPanel, etc.
- `src/components/human-design/*.tsx` — BodygraphSvg, ProfileMatrix, CenterDetailCard, LineArchetypeStack, etc.
- `src/components/iching/*.tsx` — ImageDropZone, CoinCastAnimation, HexagramResult, etc.
- `src/components/tu-vi/*.tsx` — TuViChart, PalaceDetail, TuViPromptGenerator, etc.
- `src/components/readings/*.tsx` — ChatPanel (including prose-invert handling), etc.
- `src/components/shared/*.tsx` — BirthInputForm, etc.
- `src/components/auth/*.tsx` — UserButton, SessionProvider (remove ThemeProvider import if referenced)

### Page modifications
- `src/app/page.tsx`
- `src/app/bazi/page.tsx`
- `src/app/tu-vi/page.tsx`
- `src/app/tu-vi/learn/[chapter]/page.tsx`
- `src/app/iching/page.tsx`
- `src/app/human-design/page.tsx`
- `src/app/numerology/page.tsx`
- `src/app/numerology/learn/page.tsx`
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
