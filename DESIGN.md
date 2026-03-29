# BTTB Design System

---

## Philosophy

Warm, grounded, intentional. The palette draws from Claude's warm cream aesthetic and Vietnamese cultural elements (Ngu Hanh / Five Phases). All colors use **OKLCh** for perceptually uniform light/dark transitions.

---

## Color Tokens

All colors are CSS custom properties defined in `src/app/globals.css`.

### Primary

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--primary` | `oklch(0.58 0.14 42)` | `oklch(0.65 0.14 42)` | Terracotta — buttons, links, focus rings |
| `--primary-foreground` | `oklch(0.99 0.003 85)` | `oklch(0.155 0.005 85)` | Text on primary |

### Surfaces

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--background` | `oklch(0.965 0.007 85)` — warm cream | `oklch(0.155 0.005 85)` — warm near-black | Page background |
| `--card` | `oklch(0.993 0.004 85)` | `oklch(0.20 0.005 85)` | Card surfaces |
| `--popover` | same as card | same as card | Dropdowns, tooltips |

### Secondary & Muted

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--secondary` | `oklch(0.945 0.01 85)` | `oklch(0.26 0.006 85)` | Secondary buttons, tags |
| `--muted` | `oklch(0.925 0.01 85)` | `oklch(0.26 0.006 85)` | Disabled states, subtle fills |
| `--muted-foreground` | `oklch(0.52 0.012 80)` | `oklch(0.62 0.008 85)` | Placeholder text, captions |

### Borders & Input

| Token | Light | Dark |
|---|---|---|
| `--border` | `oklch(0.885 0.012 85)` | `oklch(1 0.005 85 / 10%)` |
| `--input` | `oklch(0.885 0.012 85)` | `oklch(1 0.005 85 / 15%)` |
| `--ring` | same as primary | same as primary |

### Feedback

| Token | Light | Dark |
|---|---|---|
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` |

### Charts

| Token | Hue | Light | Dark |
|---|---|---|---|
| `--chart-1` | Terracotta | `oklch(0.60 0.16 40)` | `oklch(0.70 0.14 40)` |
| `--chart-2` | Teal | `oklch(0.62 0.14 165)` | `oklch(0.68 0.12 165)` |
| `--chart-3` | Purple | `oklch(0.58 0.16 290)` | `oklch(0.65 0.14 290)` |
| `--chart-4` | Blue | `oklch(0.60 0.15 245)` | `oklch(0.68 0.13 245)` |
| `--chart-5` | Amber | `oklch(0.58 0.12 75)` | `oklch(0.65 0.10 75)` |

---

## Ngu Hanh (Five Phases) Colors

Domain-specific palette for Bazi and I Ching features. Defined as CSS variables, consumed via `src/lib/bazi/colors.ts`.

| Element | Vietnamese | Light base | Light soft | Dark base | Dark soft |
|---|---|---|---|---|---|
| Wood | Moc | `#2F7855` | `#5BAA7E` | `#4A9E72` | `#78C49E` |
| Fire | Hoa | `#C04838` | `#E08058` | `#D86050` | `#F0A080` |
| Earth | Tho | `#946820` | `#C89C4A` | `#C89E3C` | `#E0C070` |
| Water | Thuy | `#28687E` | `#5A9CB2` | `#4896AE` | `#7ABECE` |
| Metal | Kim | `#74706A` | `#B8B0A2` | `#98908A` | `#CBC4B8` |

### I Ching Accent

| Token | Light | Dark |
|---|---|---|
| `--iching-moving` | `#BD5D3A` | `#DA7756` |
| `--iching-moving-glow` | `rgba(189, 93, 58, 0.3)` | `rgba(218, 119, 86, 0.35)` |

---

## Typography

### Font Stack

```
--font-sans: "Be Vietnam Pro", "Roboto", "Open Sans", "Montserrat", "Inter", "Nunito", ui-sans-serif, system-ui, sans-serif
--font-mono: ui-monospace, "SFMono-Regular", "Menlo", "Consolas", monospace
```

### Primary: Be Vietnam Pro

- **Source:** Google Fonts
- **Subsets:** latin, latin-ext, vietnamese
- **Weights:** 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Display:** swap
- **Why:** Native Vietnamese diacritics support + clean geometric forms

### Scale

Standard Tailwind type scale. Common usage:

| Class | Size | Where |
|---|---|---|
| `text-xs` | 0.75rem / 12px | Badges, fine print |
| `text-sm` | 0.875rem / 14px | Body text, cards (default) |
| `text-base` | 1rem / 16px | Larger body, descriptions |
| `text-lg`+ | 1.125rem+ | Headings |

---

## Spacing

Tailwind 4 default scale (4px base unit). No custom overrides.

| Value | Size | Common use |
|---|---|---|
| `1` | 4px | Tight gaps |
| `2` | 8px | Inline spacing, small gaps |
| `3` | 12px | Component internal padding |
| `4` | 16px | Standard padding, card content |
| `6` | 24px | Section spacing |
| `8` | 32px | Large section gaps |

---

## Border Radius

Single source token with calculated variants:

```
--radius: 0.625rem (10px)
```

| Tailwind class | Calculation | Result |
|---|---|---|
| `rounded-sm` | `radius * 0.6` | 6px |
| `rounded-md` | `radius * 0.8` | 8px |
| `rounded-lg` | `radius` | 10px |
| `rounded-xl` | `radius * 1.4` | 14px |
| `rounded-2xl` | `radius * 1.8` | 18px |
| `rounded-3xl` | `radius * 2.2` | 22px |
| `rounded-4xl` | `radius * 2.6` | 26px |

---

## Elevation

| Level | Class | Usage |
|---|---|---|
| Flat | — | Cards (use `ring-1 ring-foreground/10` instead) |
| Low | `shadow` | Small dropdowns |
| Medium | `shadow-md` | Dropdown menus |
| High | `shadow-lg` | Nested menus, popovers |

---

## Components

Built on **shadcn/ui** (base-nova style) + **Base UI** primitives + **CVA**.

### Button

**Variants:** `default` | `outline` | `secondary` | `ghost` | `destructive` | `link`
**Sizes:** `xs` (h-6) | `sm` (h-7) | `default` (h-8) | `lg` (h-9) | `icon` | `icon-xs` | `icon-sm` | `icon-lg`

### Card

Compound component: `Card` > `CardHeader` + `CardContent` + `CardFooter`
**Sizes:** `default` | `sm`

### Avatar

**Sizes:** `sm` (24px) | `default` (32px) | `lg` (40px)
Supports `AvatarGroup` + `AvatarGroupCount`.

### Navigation

`NavigationMenu` with `align="start"` default. Trigger style: `h-9 rounded-lg px-2.5`.

### Dropdown Menu

Full compound menu with submenus, checkbox items, radio items, separators, shortcuts.

---

## Interactive States

### Focus

```
focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring
```

All interactive elements use a 3px ring at 50% opacity of `--ring` (primary color).

### Transitions

- Default: `transition-all`
- Fast: `duration-100` (menus, hover)
- Medium: `duration-300` (theme changes)

### Animations

- Menu open/close: `animate-in` / `animate-out` with slide + zoom
- Loading: `animate-spin`

---

## Dark Mode

Managed by `next-themes` with `attribute="class"` and `defaultTheme="system"`.

Toggle component: `src/components/theme-toggle.tsx` (Sun/Moon icons via Lucide).

**Strategy:** Every color token has a `.dark` override. OKLCh hue channels stay constant — only lightness shifts. This keeps the warm identity consistent across modes.

---

## Icons

**Library:** Lucide React (`lucide-react`)
**Default size:** 16px (`size-4`) via button base styles
**Variants in buttons:** `data-[icon=inline-start]` / `data-[icon=inline-end]` for padding adjustments

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js (RSC) |
| CSS | Tailwind CSS 4 |
| Tokens | CSS custom properties in `globals.css` |
| Components | shadcn/ui (base-nova) + Base UI |
| Variants | class-variance-authority (CVA) |
| Class merge | clsx + tailwind-merge (`cn()` utility) |
| Theming | next-themes |
| Icons | Lucide React |
| Animations | tw-animate-css |
