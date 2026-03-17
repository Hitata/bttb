# Testing Patterns

**Analysis Date:** 2026-03-18

## Test Framework

**Status:** No testing framework configured or test files found in source.

**Not Detected:**
- No `jest.config.*` or `vitest.config.*` files in project root
- No test files (`.test.ts`, `.test.tsx`, `.spec.ts`, `.spec.tsx`) in `src/` directory
- No testing libraries listed in `package.json` devDependencies (Jest, Vitest, Testing Library, etc.)
- No test scripts in `package.json`

**Current State:**
- Project uses TypeScript for type safety but lacks automated testing infrastructure
- No test runner, assertion library, or mocking framework configured

## Required Setup for Testing

To add testing to this project, the following would need to be configured:

**Option 1: Vitest (Recommended for Next.js)**
```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom
```

**Option 2: Jest**
```bash
npm install -D jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom
```

## Test File Organization

**Recommended Pattern:**

For library/utility code:
```
src/lib/bazi/
├── solar-lunar.ts
├── solar-lunar.test.ts      # Co-located test
└── __tests__/
    └── solar-lunar.spec.ts  # Alternative: separate directory
```

For components:
```
src/components/bazi/
├── BirthInputForm.tsx
├── BirthInputForm.test.tsx  # Co-located test
└── __tests__/
    └── BirthInputForm.spec.tsx
```

**Recommended Naming:** `[module].test.ts` (co-located with source)

## Test Structure Pattern

**Example: Testing a utility function like `getTenGod`**

```typescript
import { describe, it, expect } from 'vitest'
import { getTenGod, getTenGodDescription } from '@/lib/bazi/ten-gods'

describe('getTenGod', () => {
  it('should return same-same (Tỷ Kiên) when daymaster and target are identical', () => {
    const result = getTenGod(0, 0) // Both Giáp
    expect(result).toEqual({ code: 'TK', name: 'Tỷ Kiên' })
  })

  it('should return Chính Tài for daymaster controlling target element', () => {
    const result = getTenGod(0, 2) // Giáp (Wood) controls Bính (Fire) - no, controls (Mậu) Earth
    // Verify correct Ten God relationship
    expect(result.code).toBeDefined()
  })

  it('should handle all 10 heavenly stems', () => {
    for (let i = 0; i < 10; i++) {
      const result = getTenGod(i, i)
      expect(result).toHaveProperty('code')
      expect(result).toHaveProperty('name')
    }
  })
})

describe('getTenGodDescription', () => {
  it('should return description for valid code', () => {
    const desc = getTenGodDescription('TK')
    expect(desc).toBeDefined()
    expect(desc?.content).toContain('Tỷ Kiên')
  })

  it('should return undefined for invalid code', () => {
    const desc = getTenGodDescription('INVALID')
    expect(desc).toBeUndefined()
  })
})
```

## Testing Patterns by Code Type

### Unit Tests: Calculation Functions

**Target files:** `src/lib/bazi/*.ts` (solar-lunar, pillars, ten-gods, luck-cycles, etc.)

**Pattern:**
- Test pure functions with known inputs and outputs
- Test edge cases (year boundaries, leap months, etc.)
- Test consistency of calculations

```typescript
describe('computeTuTru', () => {
  it('should compute correct four pillars for known date', () => {
    const input: BirthInput = {
      name: 'Test Person',
      gender: 'male',
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      minute: 0,
    }
    const result = computeTuTru(input)

    expect(result.tuTru.thienTru).toBeDefined()
    expect(result.tuTru.nguyetTru).toBeDefined()
    expect(result.tuTru.nhatTru).toBeDefined()
    expect(result.tuTru.thoiTru).toBeDefined()
  })

  it('should calculate correct daymaster index', () => {
    const input: BirthInput = { /* birth data */ }
    const { dayMasterIndex } = computeTuTru(input)

    expect(dayMasterIndex).toBeGreaterThanOrEqual(0)
    expect(dayMasterIndex).toBeLessThan(10)
  })
})
```

### Component Tests

**Target files:** `src/components/**/*.tsx`

**Pattern:**
- Test user interactions (form submissions, clicks)
- Test conditional rendering
- Test prop handling and default values

```typescript
import { render, screen, userEvent } from '@testing-library/react'
import { BirthInputForm } from '@/components/bazi/BirthInputForm'

describe('BirthInputForm', () => {
  it('should render all input fields', () => {
    const mockSubmit = vi.fn()
    render(
      <BirthInputForm onSubmit={mockSubmit} isLoading={false} />
    )

    expect(screen.getByLabelText(/Họ và tên/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Giới tính/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Năm sinh/)).toBeInTheDocument()
  })

  it('should call onSubmit with form data when submitted', async () => {
    const mockSubmit = vi.fn()
    const user = userEvent.setup()

    render(
      <BirthInputForm onSubmit={mockSubmit} isLoading={false} />
    )

    await user.type(screen.getByPlaceholderText(/Nhập họ tên/), 'John Doe')
    await user.click(screen.getByRole('button', { name: /Lập Lá Số/ }))

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'John Doe' })
    )
  })

  it('should disable submit button when isLoading is true', () => {
    render(
      <BirthInputForm onSubmit={vi.fn()} isLoading={true} />
    )

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should use initialValues when provided', () => {
    render(
      <BirthInputForm
        onSubmit={vi.fn()}
        isLoading={false}
        initialValues={{ name: 'Jane Smith', year: 1995 }}
      />
    )

    expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1995')).toBeInTheDocument()
  })
})
```

### Integration Tests

**Target files:** `src/app/api/**/*.ts` (API routes)

**Pattern:**
- Test full request-response cycle
- Test error handling and validation
- Test database interactions (if applicable)

```typescript
import { POST } from '@/app/api/bazi/calculate/route'

describe('POST /api/bazi/calculate', () => {
  it('should return BaziResult for valid input', async () => {
    const request = new Request('http://localhost/api/bazi/calculate', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Person',
        gender: 'male',
        year: 1990,
        month: 1,
        day: 1,
        hour: 12,
        minute: 0,
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data).toHaveProperty('tutru')
    expect(data).toHaveProperty('daivan')
    expect(data).toHaveProperty('compass')
  })

  it('should return 400 for missing required fields', async () => {
    const request = new Request('http://localhost/api/bazi/calculate', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Person' }), // missing gender, year, month, day
    })

    const response = await POST(request)
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data).toHaveProperty('error')
  })

  it('should return 500 on calculation error', async () => {
    // Mock a scenario that causes an error
    const request = new Request('http://localhost/api/bazi/calculate', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test',
        gender: 'invalid', // Invalid gender
        year: 1990,
        month: 1,
        day: 1,
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(500)
  })
})
```

## Mocking

**Framework:** Vitest has built-in `vi` mock utilities; Jest uses `jest.mock()`

**Patterns:**

### Mocking Modules
```typescript
import { vi } from 'vitest'
import { computeBazi } from '@/lib/bazi'

vi.mock('@/lib/bazi', () => ({
  computeBazi: vi.fn(() => ({ /* mock result */ }))
}))
```

### Mocking Functions
```typescript
const mockSubmit = vi.fn()
const mockCalculate = vi.fn().mockResolvedValue({ /* result */ })
const mockError = vi.fn().mockRejectedValue(new Error('Failed'))

expect(mockSubmit).toHaveBeenCalledWith(expectedArg)
expect(mockCalculate).toHaveBeenCalledTimes(1)
```

**What to Mock:**
- External API calls
- Date/time (for consistent test results)
- Database queries
- Navigation functions

**What NOT to Mock:**
- Pure utility functions (solar-lunar conversions, ten-god calculations)
- Constants (HEAVENLY_STEMS, EARTHLY_BRANCHES)
- Core business logic (prefer integration testing)

## Fixtures and Factories

**Test Data Location:** Recommended: `src/__tests__/fixtures/` or `src/__tests__/factories/`

**Birth Input Factory:**
```typescript
// src/__tests__/factories/birth-input.factory.ts
import { BirthInput, Gender } from '@/lib/bazi'

export function createBirthInput(overrides?: Partial<BirthInput>): BirthInput {
  return {
    name: 'Test Person',
    gender: 'male' as Gender,
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    ...overrides,
  }
}

// Usage in tests:
const input = createBirthInput({ year: 2000, name: 'Jane Doe' })
```

**Known Results Fixture:**
```typescript
// src/__tests__/fixtures/known-results.ts
export const KNOWN_BAZI_RESULTS = {
  '1990-01-01-12-00': {
    dayMasterIndex: 3,
    tutru: { /* known pillar data */ },
    // ... complete expected result
  },
  '2000-05-15-08-30': {
    dayMasterIndex: 7,
    // ...
  },
}
```

## Coverage

**Currently:** No coverage tracking configured

**Recommended Setup:**
```json
{
  "test": "vitest",
  "test:coverage": "vitest --coverage",
  "test:watch": "vitest --watch"
}
```

**Coverage Target Recommendations:**
- Utility functions: 100%
- Components: 80%+
- API routes: 90%+
- Overall project: 75%+

**View Coverage:**
```bash
npm run test:coverage
# Generates coverage report in coverage/ directory
```

## Test Types & Scope

### Unit Tests
- **Scope:** Individual functions in isolation
- **Files:** `src/lib/bazi/*.ts` (all calculation modules)
- **Approach:** Pure function testing with known inputs/outputs
- **Example:** Testing `getTenGod()`, `getDayPillar()`, `solarToLunar()`

### Integration Tests
- **Scope:** Multiple modules working together
- **Files:** `src/lib/bazi/index.ts` (orchestration), API routes
- **Approach:** Test `computeBazi()` end-to-end with various inputs
- **Example:** Full chart calculation from birth input

### Component Tests
- **Scope:** React component behavior and rendering
- **Files:** `src/components/**/*.tsx`
- **Approach:** Test user interactions, prop variations, state changes
- **Example:** Form submission, conditional rendering, loading states

### E2E Tests
- **Status:** Not configured
- **Recommended Tools:** Playwright, Cypress
- **Scope:** Full user flows (input → calculation → display → save)

## Common Patterns

### Async Testing

```typescript
it('should load data asynchronously', async () => {
  render(<MyComponent />)

  // Wait for async operation
  const result = await screen.findByText('Data loaded')
  expect(result).toBeInTheDocument()
})

it('should handle async errors', async () => {
  const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))

  render(<MyComponent onFetch={mockFetch} />)

  await screen.findByText('Error: Network error')
})
```

### Testing Type Safety

```typescript
// For testing TypeScript interfaces
describe('Type checks', () => {
  it('BirthInput should require all fields', () => {
    // This would fail TypeScript compilation if wrong:
    const invalid: BirthInput = {
      name: 'Test',
      // @ts-expect-error - missing fields
    }
  })
})
```

### Testing Constants

```typescript
describe('HEAVENLY_STEMS', () => {
  it('should have exactly 10 stems', () => {
    expect(HEAVENLY_STEMS).toHaveLength(10)
  })

  it('should each have valid properties', () => {
    HEAVENLY_STEMS.forEach(stem => {
      expect(stem.index).toBeGreaterThanOrEqual(0)
      expect(stem.index).toBeLessThan(10)
      expect(stem.name).toBeDefined()
      expect(stem.element).toMatch(/Kim|Mộc|Hỏa|Thổ|Thủy/)
      expect(stem.polarity).toMatch(/\+|-/)
    })
  })
})
```

---

*Testing analysis: 2026-03-18*
