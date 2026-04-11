# Numerology (Pythagorean) — Feature Design Spec

**Date:** 2026-04-11
**Status:** Draft
**System:** Pythagorean (first of potentially multiple numerology systems)

---

## 1. Overview

Add a Pythagorean numerology reading feature to the app. Users enter their **full birth name** and **date of birth** to receive a complete numerological profile: 6 core numbers, 3 cycle numbers, 4 challenge numbers, and 4 pinnacle numbers.

The feature follows the same architecture as bazi: dedicated calculation library, API routes, database models, and UI components with a collapsible sidebar form and tabbed results.

---

## 2. Input

```typescript
interface NumerologyInput {
  fullName: string;   // Full birth name (first + middle + last), space-separated
  birthYear: number;
  birthMonth: number; // 1-12
  birthDay: number;   // 1-31
}
```

**No gender required** — Pythagorean numerology is gender-neutral.

### Vietnamese Name Handling

Vietnamese diacritics are stripped using **Unicode NFD normalization**: decompose characters, then remove combining diacritical marks (Unicode category Mn). Special case: Đ/đ (D-stroke) maps to D/d before normalization since it's a distinct Unicode character, not a combining sequence.

This handles all Vietnamese vowel variants (ă, â, ê, ô, ơ, ư and all tone marks) correctly without an exhaustive lookup table.

Examples after stripping:
- Ă, Â → A (value 1)
- Đ → D (value 4)
- Ê → E (value 5)
- Ô, Ơ → O (value 6)
- Ư → U (value 3)
- Nguyễn → NGUYEN, Phước → PHUOC

### Y Vowel/Consonant Rules

Y is context-dependent:
- **Vowel** when it is the only vowel sound in a syllable (e.g., Ly, Thy, Huynh)
- **Consonant** when at the start of a syllable making a "y" sound with another vowel present (e.g., Yến — Y is consonant, ê is the vowel)

**Implementation approach:** For Vietnamese names, Y is almost always a vowel because Vietnamese syllable structure rarely uses Y as a consonant onset in the English sense. Default to vowel; provide a toggle if needed later.

---

## 3. Calculation Engine

All calculations live in `src/lib/numerology/`.

### 3.1 Master Numbers

**11, 22, 33** are master numbers. During reduction, if the digit sum equals a master number, stop reducing. This applies to all numbers EXCEPT challenge numbers (which always reduce to single digit).

### 3.2 Reduction Algorithm

```
digitSum(n):
  return sum of individual digits of n (no reduction, single pass)
  e.g. digitSum(1992) = 1+9+9+2 = 21

reduce(n):
  while n > 9 AND n not in {11, 22, 33}:
    n = digitSum(n)
  return n

reduceStrict(n):
  while n > 9:
    n = digitSum(n)
  return n    // always single digit, no master number preservation
```

`reduce()` preserves master numbers. `reduceStrict()` is used only for challenge numbers.

### 3.3 Pythagorean Letter Chart

```
1: A, J, S
2: B, K, T
3: C, L, U
4: D, M, V
5: E, N, W
6: F, O, X
7: G, P, Y
8: H, Q, Z
9: I, R
```

### 3.4 Core Numbers (from DOB)

#### Life Path Number

The primary number. Reduce month, day, year **separately**, then sum and reduce.

```
lifePathNumber(month, day, year):
  m = reduce(month)
  d = reduce(day)
  y = reduce(digitSum(year))
  return reduce(m + d + y)
```

Example: Dec 14, 1992 → reduce(12)=3, reduce(14)=5, reduce(1+9+9+2=21)=3 → reduce(3+5+3=11) → **11** (master)

#### Birthday Number

Simply the day of birth, reduced (preserving master numbers).

```
birthdayNumber(day):
  return reduce(day)
```

Examples: 7th → 7, 15th → 6, 22nd → 22 (master), 29th → 11 (master)

### 3.5 Name Numbers

All name-based numbers reduce **each name part separately** first, then sum the reduced parts and reduce again.

#### Expression / Destiny Number

All letters of full birth name.

```
expressionNumber(fullName):
  parts = splitBySpace(fullName)
  partSums = parts.map(part => reduce(sumLetterValues(part)))
  return reduce(sum(partSums))
```

#### Soul Urge / Heart's Desire Number

Vowels only (A, E, I, O, U, and Y when acting as vowel).

```
soulUrgeNumber(fullName):
  parts = splitBySpace(fullName)
  partSums = parts.map(part => reduce(sumLetterValues(vowelsOf(part))))
  return reduce(sum(partSums))
```

#### Personality Number

Consonants only (all non-vowel letters; Y follows rules in section 2).

```
personalityNumber(fullName):
  parts = splitBySpace(fullName)
  partSums = parts.map(part => reduce(sumLetterValues(consonantsOf(part))))
  return reduce(sum(partSums))
```

### 3.6 Derived Numbers

#### Maturity Number

```
maturityNumber(lifePath, expression):
  return reduce(lifePath + expression)
```

Uses already-reduced Life Path and Expression values.

### 3.7 Cycle Numbers

#### Personal Year

```
personalYear(birthMonth, birthDay, currentYear):
  m = reduce(birthMonth)
  d = reduce(birthDay)
  y = reduce(digitSum(currentYear))
  return reduce(m + d + y)
```

Starts January 1st of each year (Pythagorean convention).

#### Personal Month

```
personalMonth(personalYear, currentMonth):
  return reduce(personalYear + currentMonth)
```

#### Personal Day

```
personalDay(personalMonth, currentDay):
  return reduce(personalMonth + currentDay)
```

### 3.8 Challenge Numbers

**Always reduce to single digit — no master numbers.** Range: 0-8.

```
reduceStrict(n):
  while n > 9:
    n = sum of digits of n
  return n

challengeNumbers(month, day, year):
  m = reduceStrict(month)
  d = reduceStrict(day)
  y = reduceStrict(digitSum(year))

  first  = abs(m - d)
  second = abs(d - y)
  third  = abs(first - second)    // Main challenge
  fourth = abs(m - y)

  return { first, second, third, fourth }
```

#### Challenge Timing

Let `LP` = Life Path reduced to single digit (if master: 11→2, 22→4, 33→6):

```
First:  age 0  to (36 - LP)
Second: age (36 - LP + 1) to (36 - LP + 9)
Third:  overlaps first and second (runs from 0 to 36 - LP + 9) — main life challenge
Fourth: age (36 - LP + 10) to end of life
```

Example: Life Path 7 → First: 0-29, Second: 30-38, Third: 0-38, Fourth: 39+

### 3.9 Pinnacle Numbers

Use reduced (single digit or master) values of month, day, year.

```
pinnacleNumbers(month, day, year):
  m = reduce(month)
  d = reduce(day)
  y = reduce(digitSum(year))

  first  = reduce(m + d)
  second = reduce(d + y)
  third  = reduce(first + second)
  fourth = reduce(m + y)

  return { first, second, third, fourth }
```

#### Pinnacle Timing

Let `LP` = Life Path reduced to single digit (if master: 11→2, 22→4, 33→6):

```
First:  age 0  to (36 - LP)
Second: age (36 - LP + 1) to (36 - LP + 9)
Third:  age (36 - LP + 10) to (36 - LP + 18)
Fourth: age (36 - LP + 19) to end of life
```

Example: Life Path 4 → First: 0-32, Second: 33-41, Third: 42-50, Fourth: 51+

---

## 4. File Structure

### Calculation Library (`src/lib/numerology/`)

| File | Exports | Purpose |
|---|---|---|
| `types.ts` | All interfaces and types | Type definitions |
| `constants.ts` | `LETTER_VALUES`, `MASTER_NUMBERS`, `NUMBER_MEANINGS` | Lookup tables and interpretations |
| `reduction.ts` | `reduce()`, `reduceStrict()`, `digitSum()` | Core reduction utilities |
| `vietnamese.ts` | `stripDiacritics()`, `classifyY()`, `getVowels()`, `getConsonants()` | Vietnamese name processing |
| `life-path.ts` | `computeLifePath()` | Life Path Number from DOB |
| `birthday.ts` | `computeBirthday()` | Birthday Number from day |
| `name-numbers.ts` | `computeExpression()`, `computeSoulUrge()`, `computePersonality()` | All name-derived numbers |
| `maturity.ts` | `computeMaturity()` | Maturity Number |
| `cycles.ts` | `computePersonalYear()`, `computePersonalMonth()`, `computePersonalDay()` | Personal cycle numbers |
| `challenges.ts` | `computeChallenges()` | 4 Challenge Numbers with timing |
| `pinnacles.ts` | `computePinnacles()` | 4 Pinnacle Numbers with timing |
| `index.ts` | `computeNumerology()` | Orchestrator — calls all modules, returns `NumerologyResult` |

### API Routes (`src/app/api/numerology/`)

| Route | Method | Purpose |
|---|---|---|
| `/api/numerology/calculate` | POST | Compute full numerology from input |
| `/api/numerology/readings` | POST | Save a reading |
| `/api/numerology/readings` | GET | List all readings |
| `/api/numerology/readings/[id]` | GET | Get single reading |
| `/api/numerology/readings/[id]` | PATCH | Update reading name |
| `/api/numerology/readings/[id]` | DELETE | Delete reading |
| `/api/numerology/clients` | POST | Save client (auto-computes) |
| `/api/numerology/clients` | GET | List clients (search) |
| `/api/numerology/clients/[id]` | GET | Get single client |

### Pages (`src/app/numerology/`)

| Path | Purpose |
|---|---|
| `/numerology` | Main calculator page (form + tabbed results) |
| `/numerology/[id]` | View saved reading |
| `/numerology/clients` | Client management |

### Components (`src/components/numerology/`)

| Component | Purpose |
|---|---|
| `CoreNumbersPanel.tsx` | Displays Life Path, Birthday, Expression, Soul Urge, Personality, Maturity |
| `NumberCard.tsx` | Reusable card for a single number with value, name, and meaning |
| `CyclesPanel.tsx` | Personal Year/Month/Day with current values |
| `ChallengesPanel.tsx` | 4 challenges with age ranges, current challenge highlighted |
| `PinnaclesPanel.tsx` | 4 pinnacles with age ranges, current pinnacle highlighted |
| `NameBreakdown.tsx` | Visual letter-by-letter breakdown showing vowels/consonants and values |
| `NumberBadge.tsx` | Styled badge showing a number (handles master number styling) |

---

## 5. Types

```typescript
// ===== Input =====
interface NumerologyInput {
  fullName: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
}

// ===== Letter Classification =====
type LetterType = 'vowel' | 'consonant';

interface LetterBreakdown {
  letter: string;          // Original letter (with diacritics)
  baseLetter: string;      // Stripped letter (A-Z)
  value: number;           // Pythagorean value (1-9)
  type: LetterType;        // Vowel or consonant
}

interface NamePartBreakdown {
  name: string;            // Original name part
  letters: LetterBreakdown[];
  total: number;           // Sum before reduction
  reduced: number;         // After reduction
}

// ===== Core Numbers =====
interface CoreNumber {
  name: string;            // "Life Path", "Expression", etc.
  nameVi: string;          // Vietnamese name
  value: number;           // The reduced number (1-9 or 11/22/33)
  isMaster: boolean;       // Is this a master number?
  description: string;     // Meaning/interpretation
  calculation: string;     // Human-readable calculation steps
}

// ===== Cycles =====
interface PersonalCycle {
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  currentDate: string;     // ISO date string for which these were computed
  yearMeaning: string;
  monthMeaning: string;
  dayMeaning: string;
}

// ===== Challenges =====
interface Challenge {
  number: number;          // 0-8
  position: 'first' | 'second' | 'third' | 'fourth';
  label: string;           // "Thử thách 1", etc.
  startAge: number;
  endAge: number | null;   // null = rest of life (4th challenge)
  isCurrent: boolean;      // Based on current age
  description: string;     // Meaning
}

// ===== Pinnacles =====
interface Pinnacle {
  number: number;          // 1-9 or master
  position: 'first' | 'second' | 'third' | 'fourth';
  label: string;           // "Đỉnh cao 1", etc.
  startAge: number;
  endAge: number | null;   // null = rest of life (4th pinnacle)
  isCurrent: boolean;      // Based on current age
  isMaster: boolean;
  description: string;     // Meaning
}

// ===== Full Result =====
interface NumerologyResult {
  input: NumerologyInput;

  // Name analysis
  nameBreakdown: NamePartBreakdown[];

  // Core numbers
  lifePath: CoreNumber;
  birthday: CoreNumber;
  expression: CoreNumber;
  soulUrge: CoreNumber;
  personality: CoreNumber;
  maturity: CoreNumber;

  // Cycles (for current date)
  cycles: PersonalCycle;

  // Life phases
  challenges: Challenge[];   // 4 items
  pinnacles: Pinnacle[];     // 4 items
}
```

---

## 6. Database Models

### NumerologyReading

Follows the same pattern as `BaziReading`.

```prisma
model NumerologyReading {
  id         String   @id @default(cuid())
  userId     String?
  user       User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName   String
  birthYear  Int
  birthMonth Int
  birthDay   Int
  result     String   // JSON NumerologyResult
  slug       String?  @unique
  isPublic   Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([userId])
}
```

### NumerologyClient

Follows the same pattern as `BaziClient`.

```prisma
model NumerologyClient {
  id             String   @id @default(cuid())
  fullName       String
  birthYear      Int
  birthMonth     Int
  birthDay       Int
  lifePathNumber Int              // e.g. 7, 11, 22
  chartSummary   String           // e.g. "Life Path 7 | Expression 5 | Soul Urge 3"
  fullChart      String           // JSON NumerologyResult
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  clientProfile  ClientProfile?

  @@index([fullName])
}
```

### ClientProfile Update

Add `numerologyClientId` to `ClientProfile`:

```prisma
model ClientProfile {
  // ... existing fields ...
  numerologyClientId  String?              @unique
  numerologyClient    NumerologyClient?    @relation(fields: [numerologyClientId], references: [id])
}
```

### User Model Update

Add relation for numerology readings:

```prisma
model User {
  // ... existing fields ...
  numerologyReadings  NumerologyReading[]
}
```

### auto-profile.ts Update

Add `'numerology'` to the `SystemType` union. Required changes:

1. **Make `gender` optional in `ClientMatch`**: Change `gender: string` to `gender?: string` since numerology has no gender field.
2. **Skip gender matching when absent**: When `gender` is undefined, match by name + birth date only (no gender filter).
3. **Add numerology branch**: Add a `numerologyClient` matching clause in the `OR` array that matches by `fullName` (mapped to `name` field pattern) + `birthYear` + `birthMonth` + `birthDay`.
4. **Add link field**: Map `system === 'numerology'` to `'numerologyClientId'`.

When a numerology client matches an existing profile that already has bazi/tuvi/hd clients, the gender is available from those linked clients for display purposes — no data is lost.

---

## 7. UI Design

### Page Layout

Same as bazi: collapsible sidebar form on the left, tabbed results on the right.

#### Form Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| Full Name | text input | Yes | Placeholder: "Họ tên khai sinh" |
| Birth Year | number select | Yes | Range: 1900-current year |
| Birth Month | number select | Yes | 1-12 |
| Birth Day | number select | Yes | 1-31 |

#### Result Tabs

| Tab | Component | Content |
|---|---|---|
| **Con Số Chủ Đạo** | `CoreNumbersPanel` | 6 core numbers in a grid of `NumberCard` components |
| **Chu Kỳ** | `CyclesPanel` | Personal Year/Month/Day for today |
| **Thử Thách** | `ChallengesPanel` | 4 challenges with timeline, current highlighted |
| **Đỉnh Cao** | `PinnaclesPanel` | 4 pinnacles with timeline, current highlighted |

### NumberCard Design

Each core number is displayed as a card:
- Large number display (master numbers get special styling — gold/prominent)
- Vietnamese name + English name
- Short interpretation text
- For name-based numbers: expandable section showing letter-by-letter breakdown

### NameBreakdown Component

Visual letter grid showing:
- Each letter of the name
- Its Pythagorean value below
- Vowels highlighted in one color, consonants in another
- Subtotals per name part
- Reduction steps shown

### Challenges/Pinnacles Timeline

Horizontal timeline visualization:
- 4 segments representing the 4 phases
- Age ranges labeled on each segment
- Current phase highlighted/pulsing
- Number displayed prominently in each segment

---

## 8. Number Meanings (Constants)

Each number 1-9 and master numbers 11, 22, 33 needs:
- **Vietnamese name** (e.g., "Con Số Lãnh Đạo" for 1)
- **Keywords** (3-4 words capturing the essence)
- **Short description** (2-3 sentences)
- **Contextual descriptions** for each position (Life Path meaning differs from Expression meaning)

This will be stored in `constants.ts` as a structured lookup table:

```typescript
interface NumberMeaning {
  number: number;
  nameVi: string;
  keywords: string[];
  general: string;
  asLifePath: string;
  asExpression: string;
  asSoulUrge: string;
  asPersonality: string;
  asBirthday: string;
  asMaturity: string;
  asChallenge: string;
  asPinnacle: string;
  asPersonalYear: string;
}
```

---

## 9. Navigation

Add "Thần Số" (Numerology) link to `AppNav` component, alongside the existing Bát Tự link.

---

## 10. Save / Share Flow

Same pattern as bazi:
- **Save Reading** button → POST `/api/numerology/readings` → stores `NumerologyResult` JSON
- **Save Client** button → POST `/api/numerology/clients` → stores client + auto-links `ClientProfile`
- **Share URL** → `/numerology?name=X&y=YYYY&m=MM&d=DD` — form auto-fills from URL params

---

## 11. Input Validation

- **Name**: Must be non-empty after trimming. Strip numbers and special characters, keep only letters and spaces.
- **Birth date**: Validate month (1-12), day (1-31), year (1900-current). Reject invalid dates (e.g., Feb 30).
- Validation happens at the API route level, consistent with existing bazi routes.

---

## 12. Test Reference Cases

Use these known examples to validate the calculation engine (Vitest, matching existing `*.test.ts` pattern):

### Case 1: December 14, 1992, name "Nguyen Van Anh"
- Life Path: reduce(3 + 5 + 3) = reduce(11) = **11**
- Birthday: reduce(14) = **5**

### Case 2: October 22, 1985, name "John William Smith"
- Life Path: reduce(1 + 22 + 5) = reduce(28) = reduce(10) = **1**
- Birthday: **22** (master)
- Expression: reduce(2 + 7 + 6) = reduce(15) = **6**

### Case 3: Challenge number 0
- September 26, 1969: M=9, D=8, Y=7
- Challenges: |9-8|=1, |8-7|=1, |1-1|=**0**, |9-7|=2

### Edge cases to test:
- Vietnamese names with heavy diacritics (Nguyễn Phước Thịnh)
- Single-part names (Madonna)
- Master numbers 11, 22, 33 at each position
- Day 11 and day 22 as birthday numbers

---

## 13. Future Considerations (Not in V1)

- Chaldean numerology system (separate calculation engine, compare side-by-side)
- Compatibility analysis between two people's numerology
- Cross-system analysis (numerology + bazi for same person via ClientProfile)
- Name change analysis (compare birth name vs current name)
- Karmic debt numbers (13, 14, 16, 19)
- Detailed yearly forecasts beyond personal year

---

## 14. Implementation Order

1. Calculation library (`src/lib/numerology/`) — all pure functions with tests
2. Database models (Prisma schema + migration)
3. API routes
4. UI components
5. Pages + navigation integration
6. Save/client/share functionality
