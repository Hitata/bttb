# Design System Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Claude-inspired DESIGN.md system across the entire BTTB app — warm palette, ring shadows, editorial spacing, section alternation, restyled shadcn components.

**Architecture:** Foundation-up approach. First update CSS tokens and remove dark mode infrastructure, then restyle shadcn components to match DESIGN.md, then update the layout shell (header/nav), and finally restyle every page and domain component.

**Tech Stack:** Next.js 16, Tailwind CSS v4 (oxide), shadcn/ui (base-ui), Be Vietnam Pro font, CVA for variants

**Spec:** `docs/superpowers/specs/2026-04-12-design-system-overhaul.md`

---

### Task 1: Remove dark mode infrastructure

**Files:**
- Delete: `src/components/theme-toggle.tsx`
- Delete: `src/components/theme-provider.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `package.json`

- [ ] **Step 1: Remove ThemeProvider and ThemeToggle from layout**

In `src/app/layout.tsx`, remove the imports for `ThemeProvider` and `ThemeToggle`:
```tsx
// REMOVE these imports:
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
```

Remove the `<ThemeProvider>` wrapper around `<SessionProvider>` and remove `<ThemeToggle />` from the header:
```tsx
// BEFORE:
<ThemeProvider>
<SessionProvider>
  <header ...>
    ...
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <UserButton />
    </div>
  </header>
  ...
</SessionProvider>
</ThemeProvider>

// AFTER:
<SessionProvider>
  <header ...>
    ...
    <div className="flex items-center gap-2">
      <UserButton />
    </div>
  </header>
  ...
</SessionProvider>
```

Also remove `suppressHydrationWarning` from the `<html>` tag (it was needed for next-themes).

- [ ] **Step 2: Delete theme files**

Delete `src/components/theme-toggle.tsx` and `src/components/theme-provider.tsx`.

- [ ] **Step 3: Remove next-themes dependency**

Run: `npm uninstall next-themes`

- [ ] **Step 4: Verify the app builds**

Run: `npx next build 2>&1 | head -30`
Expected: Build succeeds with no import errors for theme-provider or theme-toggle.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "refactor: remove dark mode infrastructure (next-themes, ThemeProvider, ThemeToggle)"
```

---

### Task 2: Update CSS tokens in globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Remove dark variant and .dark block**

In `src/app/globals.css`:
- Remove the line `@custom-variant dark (&:is(.dark *));`
- Remove the entire `.dark { ... }` block (lines 120-183 approximately)

- [ ] **Step 2: Replace :root token values with DESIGN.md hex colors**

Replace the `:root` block's oklch values with exact hex values from DESIGN.md:

```css
:root {
  /* ── Claude-inspired warm palette ── */

  /* Ngũ Hành element colors — light mode */
  --element-wood: #2F7855;
  --element-wood-light: #5BAA7E;
  --element-fire: #C04838;
  --element-fire-light: #E08058;
  --element-earth: #946820;
  --element-earth-light: #C89C4A;
  --element-water: #28687E;
  --element-water-light: #5A9CB2;
  --element-metal: #74706A;
  --element-metal-light: #B8B0A2;

  /* I Ching moving-line accent */
  --iching-moving: #BD5D3A;
  --iching-moving-glow: rgba(189, 93, 58, 0.3);

  /* Surfaces */
  --background: #f5f4ed;
  --foreground: #141413;
  --card: #faf9f5;
  --card-foreground: #141413;
  --popover: #faf9f5;
  --popover-foreground: #141413;

  /* Primary — Terracotta Brand */
  --primary: #c96442;
  --primary-foreground: #faf9f5;

  /* Secondary & muted — Warm Sand */
  --secondary: #e8e6dc;
  --secondary-foreground: #4d4c48;
  --muted: #e8e6dc;
  --muted-foreground: #87867f;

  /* Accent — Warm Sand */
  --accent: #e8e6dc;
  --accent-foreground: #141413;

  /* Feedback */
  --destructive: #b53333;

  /* Borders & inputs — Border Cream */
  --border: #f0eee6;
  --input: #f0eee6;
  --ring: #d1cfc5;

  /* Extended semantic tokens */
  --foreground-secondary: #5e5d59;
  --foreground-tertiary: #87867f;
  --border-warm: #e8e6dc;
  --surface-dark: #30302e;
  --surface-deep: #141413;
  --text-on-dark: #faf9f5;
  --text-on-dark-secondary: #b0aea5;
  --focus-blue: #3898ec;
  --ring-subtle: #dedcd1; /* Corrected from DESIGN.md's #dedc01 (neon yellow typo) — fits the warm gray ring scale between #d1cfc5 and #c2c0b6 */
  --ring-deep: #c2c0b6;
  --coral-accent: #d97757;
  --dark-warm: #3d3d3a;

  /* Charts — warm palette */
  --chart-1: #c96442;
  --chart-2: #2F7855;
  --chart-3: #946820;
  --chart-4: #28687E;
  --chart-5: #BD5D3A;

  --radius: 0.5rem;
}
```

- [ ] **Step 3: Remove sidebar tokens from @theme block and :root**

In the `@theme inline` block, remove all sidebar-related lines:
```css
/* REMOVE these from @theme: */
--color-sidebar-ring: var(--sidebar-ring);
--color-sidebar-border: var(--sidebar-border);
--color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
--color-sidebar-accent: var(--sidebar-accent);
--color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
--color-sidebar-primary: var(--sidebar-primary);
--color-sidebar-foreground: var(--sidebar-foreground);
--color-sidebar: var(--sidebar);
```

Remove the sidebar variables from `:root`:
```css
/* REMOVE these from :root: */
--sidebar: ...;
--sidebar-foreground: ...;
--sidebar-primary: ...;
--sidebar-primary-foreground: ...;
--sidebar-accent: ...;
--sidebar-accent-foreground: ...;
--sidebar-border: ...;
--sidebar-ring: ...;
```

- [ ] **Step 4: Add new Tailwind theme mappings for extended tokens**

In the `@theme inline` block, add mappings for the new semantic tokens:
```css
--color-foreground-secondary: var(--foreground-secondary);
--color-foreground-tertiary: var(--foreground-tertiary);
--color-border-warm: var(--border-warm);
--color-surface-dark: var(--surface-dark);
--color-surface-deep: var(--surface-deep);
--color-text-on-dark: var(--text-on-dark);
--color-text-on-dark-secondary: var(--text-on-dark-secondary);
--color-focus-blue: var(--focus-blue);
--color-ring-subtle: var(--ring-subtle);
--color-ring-deep: var(--ring-deep);
--color-coral-accent: var(--coral-accent);
--color-dark-warm: var(--dark-warm);
```

- [ ] **Step 5: Update radius scale in @theme block**

Replace the existing radius multipliers with exact values:
```css
--radius-sm: 0.25rem;
--radius-md: 0.375rem;
--radius-lg: 0.5rem;
--radius-xl: 0.75rem;
--radius-2xl: 1rem;
--radius-3xl: 1.5rem;
--radius-4xl: 2rem;
```

- [ ] **Step 6: Add section utility classes and prose overrides**

After the `@layer base` block, add:
```css
.section-light {
  background: var(--background);
  color: var(--foreground);
}

.section-dark {
  background: var(--surface-deep);
  color: var(--text-on-dark);
  --foreground: #faf9f5;
  --foreground-secondary: #b0aea5;
  --card: #30302e;
  --card-foreground: #faf9f5;
  --border: #30302e;
  --border-warm: #30302e;
  --muted: #30302e;
  --muted-foreground: #b0aea5;
  --accent: #30302e;
  --accent-foreground: #faf9f5;
  --ring: #30302e;

  /* Ngu Hanh dark element colors */
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

/* Prose in dark sections */
.section-dark .prose {
  --tw-prose-body: #b0aea5;
  --tw-prose-headings: #faf9f5;
  --tw-prose-links: #d97757;
  --tw-prose-bold: #faf9f5;
  --tw-prose-counters: #b0aea5;
  --tw-prose-bullets: #b0aea5;
  --tw-prose-hr: #30302e;
  --tw-prose-quotes: #faf9f5;
  --tw-prose-code: #faf9f5;
  --tw-prose-pre-bg: #30302e;
  --tw-prose-th-borders: #30302e;
  --tw-prose-td-borders: #30302e;
}
```

- [ ] **Step 7: Verify build**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds. Note: In Tailwind v4, `dark:` classes in templates will be silently ignored now that `@custom-variant dark` is removed — they become no-ops, not errors. They will be cleaned up in Tasks 7-8.

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css && git commit -m "feat: update CSS tokens to DESIGN.md warm palette, add section utilities"
```

---

### Task 3: Restyle button component

**Files:**
- Modify: `src/components/ui/button.tsx`

- [ ] **Step 1: Rewrite button variants**

Replace the entire `buttonVariants` cva definition with:

```tsx
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-focus-blue focus-visible:ring-3 focus-visible:ring-focus-blue/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_0_0_1px_var(--primary)] hover:bg-primary/90 hover:shadow-[0_0_0_1px_var(--ring-deep)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_0_0_1px_var(--ring)] hover:bg-secondary/80 hover:shadow-[0_0_0_1px_var(--ring-deep)]",
        outline:
          "rounded-xl border-border bg-white text-foreground shadow-[0_0_0_1px_var(--border)] hover:bg-secondary hover:text-foreground",
        ghost:
          "text-foreground-secondary hover:bg-muted hover:text-foreground",
        dark:
          "bg-surface-dark text-text-on-dark shadow-[0_0_0_1px_var(--surface-dark)] hover:bg-surface-dark/90 hover:shadow-[0_0_0_1px_var(--ring-deep)]",
        destructive:
          "bg-destructive text-primary-foreground hover:bg-destructive/90",
        link: "text-dark-warm underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

Key changes:
- All `dark:` variants removed
- Ring shadows use `shadow-[0_0_0_1px_...]` pattern from DESIGN.md
- Focus rings use `--focus-blue` instead of generic ring
- Ghost uses `text-foreground-secondary` (Olive Gray)
- New `dark` variant for dark sections
- `link` uses `text-dark-warm`
- Active transform removed (no `active:translate-y-px`)

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | head -30`

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/button.tsx && git commit -m "feat: restyle button with DESIGN.md ring shadows and warm palette"
```

---

### Task 4: Restyle card component

**Files:**
- Modify: `src/components/ui/card.tsx`

- [ ] **Step 1: Update Card component with new variants**

Replace the Card component's className and add variant support:

```tsx
function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm" | "featured"
  variant?: "default" | "dark"
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden bg-card py-4 text-sm text-card-foreground border border-border has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        "rounded-lg data-[size=featured]:rounded-2xl",
        "data-[variant=dark]:bg-surface-dark data-[variant=dark]:text-text-on-dark data-[variant=dark]:border-surface-dark",
        className
      )}
      {...props}
    />
  )
}
```

Key changes:
- `ring-1 ring-foreground/10` replaced with `border border-border`
- `rounded-xl` → `rounded-lg` (8px), `featured` size gets `rounded-2xl` (16px)
- New `dark` variant for cards on dark sections
- Whisper shadow (`hover:shadow-[rgba(0,0,0,0.05)_0px_4px_24px]`) should be applied by consumers on interactive cards (e.g., link cards), not baked into the base Card component

- [ ] **Step 2: Update CardFooter to use border-warm**

```tsx
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-lg border-t border-border-warm bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  )
}
```

- [ ] **Step 3: Update CardContent and CardHeader padding to 24-32px**

Update CardContent:
```tsx
className={cn("px-6 group-data-[size=sm]/card:px-3", className)}
```

Update CardHeader:
```tsx
className={cn(
  "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-lg px-6 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
  className
)}
```

- [ ] **Step 4: Verify build**

Run: `npx next build 2>&1 | head -30`

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/card.tsx && git commit -m "feat: restyle card with warm borders, DESIGN.md radius, dark variant"
```

---

### Task 5: Restyle avatar, dropdown menu, and navigation menu

**Files:**
- Modify: `src/components/ui/avatar.tsx`
- Modify: `src/components/ui/dropdown-menu.tsx`
- Modify: `src/components/ui/navigation-menu.tsx`

- [ ] **Step 1: Update avatar**

In `src/components/ui/avatar.tsx`, update the Avatar root className — remove `dark:after:mix-blend-lighten` and change border to ring shadow:

```tsx
className={cn(
  "group/avatar relative flex size-8 shrink-0 rounded-full select-none shadow-[0_0_0_1px_var(--ring)] data-[size=lg]:size-10 data-[size=sm]:size-6",
  className
)}
```

Update AvatarFallback to use Warm Sand background:
```tsx
className={cn(
  "flex size-full items-center justify-center rounded-full bg-secondary text-sm text-secondary-foreground group-data-[size=sm]/avatar:text-xs",
  className
)}
```

- [ ] **Step 2: Update dropdown menu**

In `src/components/ui/dropdown-menu.tsx`:

Update DropdownMenuContent popup className — change `ring-1 ring-foreground/10` to `border border-border` and add `rounded-xl`:
```
rounded-xl bg-popover p-1 text-popover-foreground shadow-md border border-border
```
(remove `ring-1 ring-foreground/10`)

Update DropdownMenuItem — remove `dark:data-[variant=destructive]:focus:bg-destructive/20`:
```tsx
className={cn(
  "group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
  className
)}
```

Update DropdownMenuSubContent — same `border border-border` change, `rounded-xl`.

- [ ] **Step 3: Update navigation menu**

In `src/components/ui/navigation-menu.tsx`:

Update `NavigationMenuPositioner` — in the `NavigationMenuPrimitive.Popup` className, replace `ring-1 ring-foreground/10` with `border border-border` and change `rounded-lg` to `rounded-xl`.

Update `NavigationMenuContent` — in the group-data viewport=false classes, replace `ring-1 ring-foreground/10` with `border border-border`.

- [ ] **Step 4: Verify build**

Run: `npx next build 2>&1 | head -30`

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/avatar.tsx src/components/ui/dropdown-menu.tsx src/components/ui/navigation-menu.tsx && git commit -m "feat: restyle avatar, dropdown, nav menu with warm palette and ring shadows"
```

---

### Task 6: Update layout shell (header + nav)

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/mobile-nav.tsx`
- Modify: `src/components/app-nav.tsx`

- [ ] **Step 1: Restyle header**

In `src/app/layout.tsx`, update the header className:

```tsx
<header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-border bg-[#f5f4ed]/80 px-4 backdrop-blur-sm lg:px-6">
```

Update logo weight:
```tsx
<Link href="/" className="text-sm font-semibold tracking-tight">BBTB</Link>
```

- [ ] **Step 2: Restyle mobile nav**

In `src/components/mobile-nav.tsx`:

Update the overlay panel background and touch targets:
```tsx
<div className="fixed left-0 right-0 top-12 z-50 border-b border-border bg-[#f5f4ed] shadow-lg">
  <nav className="flex flex-col px-4 py-2">
    {links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={`rounded-md px-3 py-3 text-sm font-medium transition-colors min-h-[44px] flex items-center ${
          pathname.startsWith(link.href)
            ? 'bg-secondary text-foreground'
            : 'text-foreground-secondary hover:bg-secondary/50'
        }`}
      >
        {link.label}
      </Link>
    ))}
  </nav>
</div>
```

Key changes:
- Background: solid Parchment `#f5f4ed`
- Touch targets: `min-h-[44px]` with `flex items-center`
- Active state: `bg-secondary` (Warm Sand) instead of `bg-accent`
- Inactive: `text-foreground-secondary` (Olive Gray)

- [ ] **Step 3: Update app-nav.tsx**

In `src/components/app-nav.tsx`, the dropdown menu items use inline classes. No `dark:` classes are present, but ensure hover/focus states use warm tokens. The file currently uses `hover:bg-accent hover:text-accent-foreground` which maps correctly to Warm Sand via the updated CSS tokens. No changes needed unless visual inspection reveals issues.

- [ ] **Step 4: Verify build and visually check in browser**

Run: `npm run dev` and check the header and mobile nav in the browser.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/components/mobile-nav.tsx src/components/app-nav.tsx && git commit -m "feat: restyle header and mobile nav with warm palette"
```

---

### Task 7: Remove dark: classes from domain components

**Files:**
- Modify: `src/components/bazi/StrengthPanel.tsx`
- Modify: `src/components/bazi/RelationshipsPanel.tsx`
- Modify: `src/components/numerology/NameBreakdown.tsx`
- Modify: `src/components/numerology/NumberBadge.tsx`
- Modify: `src/components/numerology/ChallengesPanel.tsx`
- Modify: `src/components/readings/ChatPanel.tsx`

- [ ] **Step 1: Clean StrengthPanel.tsx**

Open `src/components/bazi/StrengthPanel.tsx`. For each `dark:` class, remove it. Replace any `text-gray-500` with `text-muted-foreground` and `text-gray-400` with `text-foreground-tertiary`.

Strategy: search-and-remove all `dark:text-*`, `dark:bg-*` classes. Keep the light-mode semantic color classes (e.g., `text-green-600`, `bg-red-100`). Replace cool-toned grays:
- `text-gray-500` → `text-muted-foreground`
- `text-gray-400` → `text-foreground-tertiary`

- [ ] **Step 2: Clean RelationshipsPanel.tsx**

Same approach. Remove all `dark:` classes. Replace cool-toned fallbacks:
- `bg-gray-100` → `bg-secondary`
- `text-gray-800` → `text-foreground`

- [ ] **Step 3: Clean NameBreakdown.tsx**

Remove all `dark:` classes. Replace cool-toned slate:
- `bg-slate-100` → `bg-secondary`
- `text-slate-700` → `text-secondary-foreground`

- [ ] **Step 4: Clean NumberBadge.tsx and ChallengesPanel.tsx**

Remove all `dark:` classes. Keep warm-toned light-mode classes.

- [ ] **Step 5: Clean ChatPanel.tsx**

Remove `dark:prose-invert`. The `.section-dark .prose` CSS override handles dark contexts.

- [ ] **Step 6: Verify no remaining dark: or cool-gray issues in domain components**

Run:
```bash
grep -rE "(dark:|bg-slate|text-slate|bg-gray|text-gray|border-gray|bg-zinc|text-zinc|bg-neutral|bg-stone)" src/components/ --include="*.tsx" -l
```
Expected: No files returned. If any files are found in `src/components/human-design/`, `src/components/iching/`, `src/components/tu-vi/`, or `src/components/shared/`, apply the same cleanup.

- [ ] **Step 7: Verify build**

Run: `npx next build 2>&1 | tail -20`

- [ ] **Step 8: Commit**

```bash
git add src/components/bazi/ src/components/numerology/ src/components/readings/ && git commit -m "refactor: remove dark: classes and cool-toned grays from domain components"
```

---

### Task 8: Remove dark: classes from page files

**Files:**
- Modify: `src/app/bazi/page.tsx`
- Modify: `src/app/numerology/page.tsx`
- Modify: `src/app/readings/[tokenId]/page.tsx`
- Modify: `src/app/iching/history/[id]/page.tsx`
- Modify: `src/app/admin/readings/page.tsx`
- Modify: `src/app/human-design/chart/[id]/page.tsx`
- Modify: `src/app/numerology/learn/[chapter]/lessons/lesson-02.tsx`
- Modify: `src/app/numerology/learn/[chapter]/lessons/lesson-03.tsx`
- Modify: `src/app/numerology/learn/[chapter]/lessons/lesson-06.tsx`
- Modify: `src/app/numerology/learn/[chapter]/lessons/lesson-07.tsx`
- Modify: `src/app/numerology/learn/[chapter]/lessons/lesson-08.tsx`
- Modify: `src/app/numerology/learn/[chapter]/lessons/lesson-11.tsx`

- [ ] **Step 1: Remove dark: classes from bazi/page.tsx and numerology/page.tsx**

Remove `dark:border-red-900/50`, `dark:bg-red-950/20`, `dark:text-red-400` from both files. Keep the light-mode warning/error styling.

- [ ] **Step 2: Remove dark: classes from readings and history pages**

In `src/app/readings/[tokenId]/page.tsx`: remove `dark:text-amber-400`, `dark:text-purple-400`.
In `src/app/iching/history/[id]/page.tsx`: remove `dark:text-green-400`.

- [ ] **Step 3: Remove dark: classes from admin/readings/page.tsx**

Remove `dark:bg-[oklch(...)]` and `dark:text-[oklch(...)]` custom dark classes.

- [ ] **Step 4: Remove dark: classes from human-design/chart/[id]/page.tsx**

Remove `dark:text-teal-400`, `dark:text-amber-400`, `dark:bg-amber-950/30`.

- [ ] **Step 5: Remove dark: classes from numerology lesson files**

For each of the 6 lesson files (02, 03, 06, 07, 08, 11), remove all `dark:` variant classes. Keep the light-mode amber/rose/blue/orange/emerald styling.

- [ ] **Step 6: Verify no dark: classes remain**

Run: `grep -r "dark:" src/ --include="*.tsx" -l`
Expected: No files returned.

- [ ] **Step 7: Verify build**

Run: `npx next build 2>&1 | head -30`

- [ ] **Step 8: Commit**

```bash
git add src/app/ && git commit -m "refactor: remove all remaining dark: classes from page files"
```

---

### Task 9: Restyle homepage

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Redesign homepage with editorial layout and all module links**

Replace the entire homepage content with a hero section + feature card grid linking all modules:

```tsx
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <>
      {/* Hero Section */}
      <section className="section-light">
        <div className="mx-auto max-w-[1200px] px-4 py-20 text-center md:py-28">
          {session?.user ? (
            <>
              <h1 className="text-4xl font-semibold leading-[1.10] md:text-[52px]">
                Xin chào, {session.user.name}!
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-foreground-secondary">
                Chọn công cụ bên dưới để bắt đầu.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-semibold leading-[1.10] md:text-[52px]">
                Bát Tự Tử Bình
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-foreground-secondary">
                Công cụ phân tích Bát Tự, Tử Vi, Kinh Dịch và Human Design
              </p>
              <Link
                href="/signin"
                className="mt-8 inline-flex h-10 items-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_0_0_1px_var(--primary)] transition-colors hover:bg-primary/90"
              >
                Bắt Đầu
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="section-light">
        <div className="mx-auto max-w-[1200px] px-4 pb-20 md:pb-28">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/bazi", icon: "☰", title: "Bát Tự", desc: "Nhập ngày sinh để tính toán Tứ Trụ, Đại Vận, Thần Sát" },
              { href: "/iching", icon: "☯", title: "Kinh Dịch", desc: "Gieo quẻ và giải nghĩa Kinh Dịch" },
              { href: "/tu-vi", icon: "⭐", title: "Tử Vi", desc: "Tử Vi Đẩu Số — lá số và học lý thuyết" },
              { href: "/human-design", icon: "◎", title: "Human Design", desc: "Thiết Kế Con Người — bodygraph và khóa học" },
              { href: "/numerology", icon: "✦", title: "Thần Số Học", desc: "Phân tích số học Pythagorean" },
              { href: "/bazi/cases", icon: "★", title: "Celebrity Cases", desc: "Phân tích Bát Tự của các nhân vật nổi tiếng" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-lg border border-border bg-card p-8 text-center transition-shadow hover:shadow-[rgba(0,0,0,0.05)_0px_4px_24px]"
              >
                <div className="mb-4 text-3xl">{item.icon}</div>
                <h3 className="text-xl font-semibold leading-[1.20]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify in browser**

Run `npm run dev` and check the homepage layout, colors, and responsiveness.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx && git commit -m "feat: redesign homepage with editorial layout and all module links"
```

---

### Task 10: Restyle Bazi page

**Files:**
- Modify: `src/app/bazi/page.tsx`

- [ ] **Step 1: Read the current page**

Read `src/app/bazi/page.tsx` to understand the current structure. The page has a two-column layout with a sidebar form and results area.

- [ ] **Step 2: Apply warm palette classes**

Replace classes throughout the page:
- Container: wrap in `section-light`, use `max-w-[1200px] mx-auto`
- Form sidebar card: ensure it uses `bg-card border border-border rounded-lg`
- Section headers within results: use `text-xl font-semibold` (weight 600)
- Any hardcoded colors: replace with token-based classes
- Loading spinner: add `text-primary` class
- Error states: keep the light-mode red styling, remove `dark:` variants (already done in Task 8)

- [ ] **Step 3: Verify in browser**

Check the Bazi page form, results layout, and overall look.

- [ ] **Step 4: Commit**

```bash
git add src/app/bazi/page.tsx && git commit -m "feat: restyle bazi page with warm palette and editorial spacing"
```

---

### Task 11: Restyle Numerology page

**Files:**
- Modify: `src/app/numerology/page.tsx`

- [ ] **Step 1: Read and update the page**

Same approach as Bazi — wrap in `section-light`, apply warm token classes to the two-column layout, form card, tab buttons, results area.

Specific changes:
- Tab button container: `bg-secondary/50` → `bg-secondary`
- Active tab: style with `bg-card shadow-[0_0_0_1px_var(--border)]`
- Loading spinner: `text-primary`

- [ ] **Step 2: Verify in browser**

- [ ] **Step 3: Commit**

```bash
git add src/app/numerology/page.tsx && git commit -m "feat: restyle numerology page with warm palette"
```

---

### Task 12: Restyle I Ching page

**Files:**
- Modify: `src/app/iching/page.tsx`

- [ ] **Step 1: Read and update the page**

Apply warm palette:
- Idle state background: Parchment
- Drop zone: Ivory card with Border Cream border
- Result section: consider wrapping in `section-dark` for dramatic hexagram reveal
- Loading/casting state: warm background

- [ ] **Step 2: Verify in browser**

- [ ] **Step 3: Commit**

```bash
git add src/app/iching/page.tsx && git commit -m "feat: restyle iching page with warm palette and dark section reveal"
```

---

### Task 13: Restyle Tu Vi and Human Design pages

**Files:**
- Modify: `src/app/tu-vi/page.tsx`
- Modify: `src/app/human-design/page.tsx`
- Modify: `src/app/tu-vi/learn/[chapter]/page.tsx`
- Modify: `src/app/human-design/[chapter]/page.tsx`

- [ ] **Step 1: Restyle Tu Vi index page**

Read the page, then apply:
- Hero section: `section-light` with editorial spacing (py-20)
- Calculator CTA card: Terracotta button
- Chapter grid: Ivory cards, Border Cream borders, 8px radius, ring shadow hover
- Section padding: generous (py-16 between sections)

- [ ] **Step 2: Restyle Human Design index page**

Same pattern as Tu Vi.

- [ ] **Step 3: Restyle Tu Vi learn chapter page**

Apply editorial typography: `leading-relaxed` (1.60 line-height), `text-base` body, weight 600 section headings.

- [ ] **Step 4: Restyle Human Design chapter page**

Same editorial treatment.

- [ ] **Step 5: Verify pages in browser**

- [ ] **Step 6: Commit**

```bash
git add src/app/tu-vi/ src/app/human-design/ && git commit -m "feat: restyle tu-vi and human-design pages with warm editorial layout"
```

---

### Task 14: Restyle Admin pages

**Files:**
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/app/admin/readings/page.tsx`
- Modify: `src/app/admin/bazi-clients/page.tsx`
- Modify: `src/app/admin/tu-vi-clients/page.tsx`
- Modify: `src/app/admin/numerology-clients/page.tsx`
- Modify: `src/app/admin/clients/[id]/page.tsx`

- [ ] **Step 1: Read and restyle admin layout**

Apply warm palette to admin sub-navigation:
- Tab links: use `text-foreground-secondary` default, `bg-secondary text-foreground` for active
- Container: Parchment background

- [ ] **Step 2: Restyle admin login page**

Center an Ivory card on Parchment. Terracotta submit button. Warm input styling.

- [ ] **Step 3: Restyle admin readings page**

Tables: `border-border` row separators, `hover:bg-secondary` row hover. Remove any `dark:` oklch custom colors (already done in Task 8).

- [ ] **Step 4: Restyle client list pages (bazi, tu-vi, numerology)**

Same table treatment: warm borders, warm hover states.

- [ ] **Step 5: Restyle client detail page**

- [ ] **Step 6: Verify admin pages in browser**

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/ && git commit -m "feat: restyle admin pages with warm palette"
```

---

### Task 15: Restyle remaining pages

**Files:**
- Modify: `src/app/signin/page.tsx`
- Modify: `src/app/bazi/[id]/page.tsx`
- Modify: `src/app/bazi/cases/page.tsx`
- Modify: `src/app/bazi/cases/[slug]/page.tsx`
- Modify: `src/app/hexagrams/page.tsx`
- Modify: `src/app/iching/history/page.tsx`
- Modify: `src/app/iching/history/[id]/page.tsx`
- Modify: `src/app/human-design/chart/[id]/page.tsx`
- Modify: `src/app/human-design/calculator/page.tsx`
- Modify: `src/app/tu-vi/chart/[id]/page.tsx`
- Modify: `src/app/tu-vi/calculator/page.tsx`
- Modify: `src/app/numerology/[id]/page.tsx`
- Modify: `src/app/numerology/learn/page.tsx`
- Modify: `src/app/numerology/learn/[chapter]/page.tsx`
- Modify: `src/app/readings/[tokenId]/page.tsx`

- [ ] **Step 1: Read and restyle signin page**

Center card on Parchment, Terracotta button.

- [ ] **Step 2: Restyle bazi detail and cases pages**

Warm tokens, editorial spacing. Cases grid: Ivory cards, warm borders.

- [ ] **Step 3: Restyle hexagrams page**

Warm palette, editorial typography.

- [ ] **Step 4: Restyle iching history pages**

Warm palette tables and detail view.

- [ ] **Step 5: Restyle calculator and chart pages (HD, Tu Vi)**

Form inputs: Border Cream borders, 12px radius, Focus Blue rings. Charts: warm backgrounds.

- [ ] **Step 6: Restyle numerology detail, learn index, and lesson chapter page**

Editorial typography, warm cards.

- [ ] **Step 7: Restyle readings page**

Warm palette for the reading view.

- [ ] **Step 8: Verify all pages in browser**

Spot-check each route in the browser for correct colors, spacing, and no visual regressions.

- [ ] **Step 9: Commit**

```bash
git add src/app/ && git commit -m "feat: restyle remaining pages with warm palette and editorial spacing"
```

---

### Task 16: Restyle numerology lesson files

**Files:**
- Modify: `src/app/numerology/learn/[chapter]/lessons/lesson-01.tsx` through `lesson-12.tsx`

- [ ] **Step 1: Update lesson files**

For each of the 12 lesson files, apply warm palette:
- Background containers: use `bg-secondary` or `bg-card` instead of any cool-toned backgrounds
- Text colors: warm tokens
- Accent highlights: keep amber/rose/blue but ensure they're used consistently without `dark:` variants (already removed in Task 8)
- Editorial typography: line-height 1.60 for body, weight 600 for headings

- [ ] **Step 2: Verify in browser**

Spot-check a few lessons for correct styling.

- [ ] **Step 3: Commit**

```bash
git add src/app/numerology/learn/ && git commit -m "feat: restyle numerology lessons with warm palette"
```

---

### Task 17: Restyle BirthInputForm and shared components

**Files:**
- Modify: `src/components/shared/BirthInputForm.tsx`
- Modify: `src/components/auth/user-button.tsx`

- [ ] **Step 1: Update BirthInputForm inputs**

Read the file, then apply input styling from DESIGN.md:
- Input/select elements: ensure they use `border-border rounded-xl` (12px radius), `focus:border-focus-blue focus:ring-1 focus:ring-focus-blue/30`
- Labels: `text-foreground-secondary text-sm`

- [ ] **Step 2: Update UserButton**

Ensure the avatar and dropdown use warm palette tokens. No `dark:` classes should remain.

- [ ] **Step 3: Verify in browser**

Check the birth input form on the Bazi page.

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/ src/components/auth/ && git commit -m "feat: restyle BirthInputForm and auth components with warm palette"
```

---

### Task 18: Final verification sweep

- [ ] **Step 1: Search for any remaining dark: classes**

Run: `grep -r "dark:" src/ --include="*.tsx" --include="*.css" -l`
Expected: No results.

- [ ] **Step 2: Search for cool-toned Tailwind utilities**

Run: `grep -rE "(bg|text|border|ring)-(slate|gray|zinc|neutral|stone)-" src/ --include="*.tsx" -l`
Expected: No results (or only intentionally cool elements like the focus blue ring).

- [ ] **Step 3: Visual smoke test all major routes**

Open browser and visit each route:
- `/` (homepage)
- `/bazi` (calculator)
- `/iching` (coin casting)
- `/tu-vi` (chapter list)
- `/human-design` (chapter list)
- `/numerology` (calculator)
- `/admin` (login + dashboard)
- `/bazi/cases` (case list)
- `/hexagrams` (hexagram grid)

Verify: warm parchment background, Ivory cards, Terracotta buttons, no cool grays, consistent spacing.

- [ ] **Step 4: Check mobile responsiveness**

Resize browser to mobile width. Verify:
- Header logo and hamburger menu visible
- Mobile nav has 44px touch targets
- Cards stack to single column
- Typography readable at mobile sizes

- [ ] **Step 5: Final commit if any cleanup needed**

```bash
git add -A && git commit -m "fix: final design system cleanup"
```
