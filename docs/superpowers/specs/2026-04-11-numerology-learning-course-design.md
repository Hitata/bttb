# Numerology Learning Course — 12-Lesson Curriculum

## Overview

A 12-lesson learning course for Pythagorean numerology at `/numerology/learn/[chapter]`. Covers the entire numerology system implemented in the app — from basic concepts through every core number, cycles, challenges, pinnacles, and full profile reading.

Follows the same pattern as the existing Tử Vi learn section (`/tu-vi/learn/[chapter]`): chapter-based navigation, Vietnamese-first content with English subtitles, prev/next navigation, and breadcrumbs.

## Relation to existing code

### Existing numerology system (already built)
- **Calculation library**: `src/lib/numerology/` — reduction, life-path, birthday, name-numbers, maturity, cycles, challenges, pinnacles
- **Constants**: `src/lib/numerology/constants.ts` — `NUMBER_MEANINGS` with full Vietnamese descriptions for numbers 0-9, 11, 22, 33 across all contexts (lifePath, expression, soulUrge, personality, birthday, maturity, challenge, pinnacle, personalYear)
- **Vietnamese handling**: `src/lib/numerology/vietnamese.ts` — diacritics stripping, letter classification
- **UI components**: `src/components/numerology/` — CoreNumbersPanel, NameBreakdown, CyclesPanel, ChallengesPanel, PinnaclesPanel, NumberBadge, NumberCard
- **Calculator page**: `src/app/numerology/page.tsx` — full working calculator with tabs

### Pattern to follow
- **Tử Vi learn section**: `src/app/tu-vi/learn/[chapter]/page.tsx` — single file with CHAPTERS record, chapter components, prev/next navigation, breadcrumbs

## Course Structure

### Lesson 1 — Số Học Là Gì? (What Is Numerology?)
- **Slug**: `so-hoc-la-gi`
- **Content**: Origins of Pythagorean numerology, core idea (numbers carry vibrational meaning), comparison table with other systems in the app (Tử Vi, I Ching, Human Design), why birthday + name are the inputs
- **Interactive**: None — introductory text only

### Lesson 2 — Cách Rút Gọn Số (How Number Reduction Works)
- **Slug**: `cach-rut-gon-so`
- **Content**: The fundamental operation — reduce multi-digit numbers to single digits via digit summing. Step-by-step examples. Introduction to Master Numbers (11, 22, 33) as the exception to reduction.
- **Interactive**: Mini reducer — user types a number, sees it reduce step by step (reuse `reduce()` and `digitSum()` from `src/lib/numerology/reduction.ts`)
- **References**: `MASTER_NUMBERS` from constants

### Lesson 3 — Số Đường Đời (Life Path Number)
- **Slug**: `so-duong-doi`
- **Content**: The most important number. Full calculation: reduce month, reduce day, reduce year digit sum, then reduce their sum. 2-3 worked examples with different dates. Common mistakes.
- **Interactive**: Inline Life Path calculator — birthday inputs → animated reduction showing each step (reuse `computeLifePath()`)
- **References**: `computeLifePath` from `src/lib/numerology/life-path.ts`

### Lesson 4 — 9 Nguyên Mẫu (The 9 Archetypes)
- **Slug**: `9-nguyen-mau`
- **Content**: Numbers 1-9 deep dive. Each archetype: Vietnamese name, keywords, core traits, strengths, shadow side. Visual identity per number.
- **Interactive**: Cards for each number with expand/collapse for details
- **References**: `NUMBER_MEANINGS[1-9]` from constants — use `nameVi`, `keywords`, `general`

### Lesson 5 — Số Bậc Thầy (Master Numbers 11, 22, 33)
- **Slug**: `so-bac-thay`
- **Content**: What makes master numbers special. The duality — master expression vs base number fallback (11↔2, 22↔4, 33↔6). Why carriers feel "different". Higher vibration = higher tension.
- **Interactive**: Comparison view — show master number alongside its base number
- **References**: `NUMBER_MEANINGS[11, 22, 33]` from constants, `MASTER_NUMBERS` set

### Lesson 6 — Số Ngày Sinh (Birthday Number)
- **Slug**: `so-ngay-sinh`
- **Content**: Simplest number — just the birth day, reduced. Represents natural talent/gift. All 31 possible birthdays → reduced number. How it complements or contrasts with Life Path.
- **Interactive**: Grid of 31 days showing their reduced values, grouped by result number
- **References**: `computeBirthday` from `src/lib/numerology/birthday.ts`

### Lesson 7 — Số Biểu Đạt (Expression Number)
- **Slug**: `so-bieu-dat`
- **Content**: First name-based number. The Pythagorean letter-value chart (A=1, B=2... I=9, J=1...). How Vietnamese names are handled (diacritics stripping). Full worked example with a Vietnamese name.
- **Interactive**: Letter chart reference + name input that shows letter→value mapping in real time (reuse `LETTER_VALUES`, `stripDiacritics`, `computeExpression`)
- **References**: `LETTER_VALUES` from constants, `stripDiacritics` from vietnamese.ts, `computeExpression` from name-numbers.ts

### Lesson 8 — Linh Hồn & Nhân Cách (Soul Urge & Personality)
- **Slug**: `linh-hon-va-nhan-cach`
- **Content**: Vowels = Soul Urge (inner desire), Consonants = Personality (outer mask). Why this split matters. How Y is handled (default vowel). Worked example showing vowel/consonant separation.
- **Interactive**: Name input that highlights vowels vs consonants in different colors, shows separate sums (reuse `computeSoulUrge`, `computePersonality`, `VOWELS`)
- **References**: `VOWELS` from constants, `classifyLetters` from vietnamese.ts

### Lesson 9 — Số Trưởng Thành (Maturity Number)
- **Slug**: `so-truong-thanh`
- **Content**: Life Path + Expression = Maturity. Represents energy that emerges in the second half of life (~35+). How it complements or redirects the Life Path. Interpretation guidance.
- **Interactive**: Show the formula visually: LP box + Expression box → Maturity result
- **References**: `computeMaturity` from `src/lib/numerology/maturity.ts`

### Lesson 10 — Chu Kỳ Cá Nhân (Personal Cycles)
- **Slug**: `chu-ky-ca-nhan`
- **Content**: Personal Year (birthday + current year → 9-year cycle), Personal Month (finer granularity), Personal Day. What each cycle year (1-9) means. Practical timing advice.
- **Interactive**: Personal Year calculator — enter birthday, see current cycle position + meaning (reuse `computePersonalYear`, `computePersonalMonth`, `computePersonalDay`)
- **References**: `computePersonalCycles` from `src/lib/numerology/cycles.ts`, `NUMBER_MEANINGS[*].asPersonalYear`

### Lesson 11 — Thử Thách & Đỉnh Cao (Challenges & Pinnacles)
- **Slug**: `thu-thach-va-dinh-cao`
- **Content**: 4 Challenges (areas of growth, from subtraction of birth date components) and 4 Pinnacles (life peaks, from addition). Both mapped to age ranges based on Life Path. How to read the timeline.
- **Interactive**: Timeline visualization showing the 4 challenge/pinnacle periods with age ranges
- **References**: `computeChallenges` from challenges.ts, `computePinnacles` from pinnacles.ts

### Lesson 12 — Đọc Hồ Sơ Số Học (Reading a Full Profile)
- **Slug**: `doc-ho-so-so-hoc`
- **Content**: Pulling it all together. How to synthesize: Life Path (who you are) + Expression (how you express) + Soul Urge (what you want) + Personality (how others see you) + Birthday (natural gift) + Maturity (where you're headed) + Cycles (current timing) + Challenges/Pinnacles (life phases). 2-3 example full readings. Reading order and prioritization.
- **Interactive**: Link to the full calculator ("Now try it yourself → /numerology")
- **References**: All modules

## Technical Design

### File structure
```
src/app/numerology/learn/
  page.tsx              # Index page listing all 12 lessons
  [chapter]/
    page.tsx            # CHAPTERS record, layout, navigation
    lessons/            # Individual lesson components (one per file)
      lesson-01.tsx     # Số Học Là Gì?
      lesson-02.tsx     # Cách Rút Gọn Số
      ...etc
```

The CHAPTERS record, layout, and navigation live in `[chapter]/page.tsx` (following the Tử Vi pattern), but each lesson's content is extracted into its own file under `lessons/` to keep files manageable at 12 lessons.

The index page (`/numerology/learn`) lists all 12 lessons with their titles and a brief description for discoverability.

### Chapter data structure
```typescript
const CHAPTERS: Record<string, {
  title: { vn: string; en: string }
  prev?: { slug: string; title: string }
  next?: { slug: string; title: string }
  Content: () => React.ReactNode
}> = { ... }
```

### Navigation
- Breadcrumbs: `Thần Số Học / Học / [Lesson Title]`
- Prev/next links at bottom of each lesson
- Last lesson links to `/numerology` calculator

### Interactive elements
All interactive elements use existing library functions — no new calculation logic needed:
- `reduce()`, `digitSum()` for reduction demos
- `computeLifePath()` for inline calculator
- `LETTER_VALUES`, `stripDiacritics()`, `classifyLetters()` for name demos
- `computePersonalYear/Month/Day()` for cycle calculator
- `NUMBER_MEANINGS` for all archetype descriptions

### Styling
- Same aesthetic as Tử Vi learn section: clean, readable, card-based
- Consistent number colors/identity across lessons
- `'use client'` directive for interactive components
- Responsive: works on mobile with same patterns as existing learn section

## Phases

### Phase 1 — Lessons 1-4 (Fundamentals)
Route setup, chapter navigation, intro + reduction + Life Path + archetypes. This gives users enough to understand the core concept.

### Phase 2 — Lessons 5-8 (Deeper Numbers)  
Master numbers, birthday, expression, soul urge/personality. Covers all the individual number types.

### Phase 3 — Lessons 9-12 (Advanced)
Maturity, cycles, challenges/pinnacles, full profile synthesis. Completes the course.

## Entry points

Add a "Học" (Learn) link to the numerology page sidebar, similar to how Tử Vi links to its learn section. This should be added to the numerology page's left sidebar near the existing "Khách" (Clients) link. The link points to `/numerology/learn` (the index page).
