# Coding Conventions

**Analysis Date:** 2026-03-18

## Naming Patterns

**Files:**
- Components: PascalCase with `.tsx` extension (e.g., `BirthInputForm.tsx`, `BaziPillarTable.tsx`)
- Library/utility modules: camelCase with `.ts` extension (e.g., `solar-lunar.ts`, `ten-gods.ts`)
- Pages: kebab-case with `.tsx` in app directory (e.g., `[id].tsx`, `page.tsx`)
- Config files: lowercase with extensions (e.g., `next.config.ts`, `eslint.config.mjs`)

**Functions:**
- Regular functions: camelCase (e.g., `computeBazi`, `getTenGod`, `solarToLunar`)
- React components: PascalCase (e.g., `BirthInputForm`, `BaziPillarTable`)
- Internal helpers: camelCase with leading underscore discouraged (e.g., `toJulianDayNumber`, `getYearPillar`)

**Variables:**
- State variables: camelCase (e.g., `name`, `setGender`, `isLoading`)
- Constants: UPPER_SNAKE_CASE for exported constants (e.g., `HEAVENLY_STEMS`, `EARTHLY_BRANCHES`, `NA_YIN_TABLE`)
- Boolean: `is`/`has`/`can` prefix pattern (e.g., `isLoading`, `error`)

**Types:**
- Exported interfaces: PascalCase with suffix for clarity (e.g., `BirthInput`, `BaziResult`, `TenGodRef`)
- Type unions: PascalCase (e.g., `FiveElement`, `Gender`, `Polarity`)
- Generic parameters: Single capital letter (e.g., `T`, `K`, `V`)

## Code Style

**Formatting:**
- No explicit Prettier config found; uses Next.js defaults
- Arrow functions for callbacks and React handlers (e.g., `onClick={e => setName(e.target.value)}`)
- Destructuring in function parameters where applicable
- Template literals for string interpolation

**Linting:**
- ESLint with `eslint-config-next` (core-web-vitals and TypeScript rules)
- Linting command: `npm run lint` (from `package.json`)
- Config: `eslint.config.mjs` - uses flat config format
- Next.js enforces best practices for React Server Components and imports

## Import Organization

**Order:**
1. External dependencies from npm/packages (`import NextAuth from "next-auth"`)
2. Relative imports from internal modules (`import { computeBazi } from '@/lib/bazi'`)
3. Type imports when needed (`import type { BirthInput } from '@/lib/bazi'`)

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Consistently used throughout codebase (e.g., `@/lib/bazi`, `@/components/ui`, `@/lib/utils`)

**Type Imports:**
- Prefix with `type` keyword for TypeScript-only imports (e.g., `import type { BaziResult } from './types'`)
- Reduces bundle size by excluding type definitions at runtime

## Error Handling

**Patterns:**
- API routes: Try-catch wrapping entire request handler
- Return `NextResponse.json({ error: 'message' }, { status: statusCode })`
- Client components: State-based error tracking with `error` state variable
- Throw `Error` with descriptive message for client-side error handling (e.g., `throw new Error('Calculation failed')`)
- Conditional rendering based on error state (e.g., `{error && <div>{error}</div>}`)

**Example from `route.ts`:**
```typescript
try {
  const input: BirthInput = { ... }
  const result = computeBazi(input)
  return NextResponse.json(result)
} catch (error) {
  console.error('Bazi calculation error:', error)
  return NextResponse.json({ error: 'Calculation failed' }, { status: 500 })
}
```

**Example from client component:**
```typescript
const [error, setError] = useState<string | null>(null)
try {
  // operation
  throw new Error(err.error || 'Calculation failed')
} catch (err) {
  setError(err instanceof Error ? err.message : 'Unknown error')
}
if (error) return <div>{error}</div>
```

## Logging

**Framework:** Native `console.error()` for error logging

**Patterns:**
- Only error logs used currently (e.g., `console.error('Bazi calculation error:', error)`)
- Used in API routes for debugging
- No structured logging library in place

## Comments

**When to Comment:**
- Complex algorithms and calculations benefit from comments (see `solar-lunar.ts` with lunar calendar lookup table explanations)
- Formula explanations (e.g., Five Tiger Escape in `pillars.ts`)
- Data structure documentation inline with field descriptions

**JSDoc/TSDoc:**
- Block comments with `/**` for functions
- Single-line descriptions for exported functions
- Parameter documentation optional in simple cases
- Example from `ten-gods.ts`:

```typescript
/**
 * Get the Ten God relationship between the daymaster stem and a target stem
 */
export function getTenGod(dayMasterIndex: number, targetStemIndex: number): TenGodRef {
  ...
}
```

- Comments within data structures to document fields:

```typescript
export interface Stem {
  index: number
  name: string        // Vietnamese: "Giáp"
  romaji: string      // Pinyin: "Jia"
  zh: string          // Chinese: "甲"
  element: FiveElement
  polarity: Polarity
  color: string       // Tailwind class: "text-green-600"
}
```

## Function Design

**Size:** Most functions under 50 lines; orchestration functions may be longer (e.g., `computeBazi` with 80 lines)

**Parameters:**
- Use object parameters for multiple related values (e.g., `DaiVanCycle`, `BirthInput`)
- Type all parameters with TypeScript types
- Avoid parameters beyond 5; use interfaces instead

**Return Values:**
- Typed return values required
- Return objects for multiple related values
- Early returns for error conditions or guards

**Example from `index.ts`:**
```typescript
export function computeBazi(input: BirthInput): BaziResult {
  const { tuTru, dayMasterIndex, solarDate, lunarDate, nongLichDate } = computeTuTru(input)
  // ... orchestrate other computations
  return {
    date: { solar: solarDate, lunar: lunarDate, nongLich: nongLichDate },
    tutru: tuTru,
    dayMasterIndex,
    daivan: { startAge, cycles, chuKy, currentYear },
    compass,
    thansat,
    thaiMenhCung,
  }
}
```

## Module Design

**Exports:**
- Explicit named exports for functions and types
- Default exports used for React components in some cases
- Re-export pattern for convenience (`export { ... } from './module'`)

**Barrel Files:**
- `src/lib/bazi/index.ts` re-exports main functions and all types for convenience
- Allows `import { computeBazi, HEAVENLY_STEMS } from '@/lib/bazi'`

**Example from `index.ts`:**
```typescript
export { generateRawDataForAI, getRandomQuestions, DESTINY_QUESTIONS } from './raw-data-generator'
export { HEAVENLY_STEMS, EARTHLY_BRANCHES, ELEMENT_COLORS, ELEMENT_BG_COLORS, TEN_GOD_DESCRIPTIONS } from './constants'
export type * from './types'
```

## React Patterns

**Component Structure:**
- Client components marked with `'use client'` directive when using hooks
- Functional components only (no class components)
- Props interface at top of file with suffix (e.g., `BirthInputFormProps`)

**State Management:**
- `useState` for local component state (e.g., form inputs, loading, error states)
- Props drilling for passing data between components
- No global state management library in use

**Example from `BirthInputForm.tsx`:**
```typescript
'use client'

interface BirthInputFormProps {
  onSubmit: (data: BirthInput) => void
  isLoading: boolean
  initialValues?: Partial<BirthInput>
}

export function BirthInputForm({ onSubmit, isLoading, initialValues }: BirthInputFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [gender, setGender] = useState<Gender>(initialValues?.gender ?? 'male')
  // ...
}
```

## Styling

**Framework:** Tailwind CSS with class-variance-authority for component variants

**Patterns:**
- className with `cn()` utility for conditional classes (from `lib/utils.ts`)
- Class variants using CVA for component design systems
- shadcn/ui components for base UI elements

**Example from `button.tsx`:**
```typescript
const buttonVariants = cva('group/button inline-flex ...', {
  variants: {
    variant: { default: "bg-primary text-primary-foreground", outline: "border-border ..." },
    size: { default: "h-8 gap-1.5 px-2.5", xs: "h-6 gap-1 ..." },
  },
  defaultVariants: { variant: "default", size: "default" },
})

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

---

*Convention analysis: 2026-03-18*
