# Pythagorean Numerology Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Pythagorean numerology feature with 9 number types, following the same architecture as the existing bazi feature.

**Architecture:** Calculation library in `src/lib/numerology/` with pure functions, API routes in `src/app/api/numerology/`, UI components in `src/components/numerology/`, and pages in `src/app/numerology/`. Database models follow existing BaziReading/BaziClient pattern with ClientProfile integration.

**Tech Stack:** Next.js 16, TypeScript, Prisma (PostgreSQL), Vitest, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-04-11-numerology-pythagorean-design.md`

---

## File Map

### New Files

| File | Responsibility |
|---|---|
| `src/lib/numerology/types.ts` | All TypeScript interfaces: `NumerologyInput`, `NumerologyResult`, `CoreNumber`, `Challenge`, `Pinnacle`, etc. |
| `src/lib/numerology/constants.ts` | Pythagorean letter chart (A=1..Z), master numbers set, `NumberMeaning` lookup for 1-9 and 11/22/33 |
| `src/lib/numerology/reduction.ts` | `digitSum()`, `reduce()`, `reduceStrict()` |
| `src/lib/numerology/vietnamese.ts` | `stripDiacritics()`, `classifyLetters()` — NFD normalization + Đ handling + vowel/consonant classification |
| `src/lib/numerology/life-path.ts` | `computeLifePath()` |
| `src/lib/numerology/birthday.ts` | `computeBirthday()` |
| `src/lib/numerology/name-numbers.ts` | `computeExpression()`, `computeSoulUrge()`, `computePersonality()` |
| `src/lib/numerology/maturity.ts` | `computeMaturity()` |
| `src/lib/numerology/cycles.ts` | `computePersonalYear()`, `computePersonalMonth()`, `computePersonalDay()` |
| `src/lib/numerology/challenges.ts` | `computeChallenges()` |
| `src/lib/numerology/pinnacles.ts` | `computePinnacles()` |
| `src/lib/numerology/index.ts` | `computeNumerology()` orchestrator, re-exports |
| `src/lib/numerology/reduction.test.ts` | Tests for reduction utilities |
| `src/lib/numerology/numerology.test.ts` | Integration tests for full computation |
| `src/app/api/numerology/calculate/route.ts` | POST — compute numerology from input |
| `src/app/api/numerology/readings/route.ts` | POST (save) + GET (list) readings |
| `src/app/api/numerology/readings/[id]/route.ts` | GET + PATCH + DELETE single reading |
| `src/app/api/numerology/clients/route.ts` | POST (save) + GET (list) clients |
| `src/app/api/numerology/clients/[id]/route.ts` | GET single client |
| `src/app/numerology/page.tsx` | Main calculator page |
| `src/app/numerology/[id]/page.tsx` | View saved reading |
| `src/app/numerology/clients/page.tsx` | Client management |
| `src/components/numerology/NumberCard.tsx` | Single number display card |
| `src/components/numerology/NumberBadge.tsx` | Styled number badge (master number styling) |
| `src/components/numerology/CoreNumbersPanel.tsx` | Grid of 6 core NumberCards |
| `src/components/numerology/NameBreakdown.tsx` | Letter-by-letter visual breakdown |
| `src/components/numerology/CyclesPanel.tsx` | Personal Year/Month/Day display |
| `src/components/numerology/ChallengesPanel.tsx` | 4 challenges with timeline |
| `src/components/numerology/PinnaclesPanel.tsx` | 4 pinnacles with timeline |

### Modified Files

| File | Change |
|---|---|
| `prisma/schema.prisma` | Add `NumerologyReading`, `NumerologyClient` models; add `numerologyClientId` to `ClientProfile`; add `numerologyReadings` to `User` |
| `src/lib/shared/auto-profile.ts` | Add `'numerology'` to `SystemType`; make `gender` optional in `ClientMatch`; add numerology matching branch |
| `src/components/app-nav.tsx` | Add "Thần Số" nav link |

---

## Task 1: Types and Constants

**Files:**
- Create: `src/lib/numerology/types.ts`
- Create: `src/lib/numerology/constants.ts`

- [ ] **Step 1: Create types.ts**

```typescript
// src/lib/numerology/types.ts

// ===== Input =====
export interface NumerologyInput {
  fullName: string
  birthYear: number
  birthMonth: number  // 1-12
  birthDay: number    // 1-31
}

// ===== Letter Classification =====
export type LetterType = 'vowel' | 'consonant'

export interface LetterBreakdown {
  letter: string          // Original letter (with diacritics)
  baseLetter: string      // Stripped letter (A-Z)
  value: number           // Pythagorean value (1-9)
  type: LetterType
}

export interface NamePartBreakdown {
  name: string            // Original name part
  letters: LetterBreakdown[]
  total: number           // Sum before reduction
  reduced: number         // After reduction
}

// ===== Core Numbers =====
export interface CoreNumber {
  name: string            // "Life Path", "Expression", etc.
  nameVi: string          // Vietnamese name
  value: number           // The reduced number (1-9 or 11/22/33)
  isMaster: boolean
  description: string
  calculation: string     // Human-readable calculation steps
}

// ===== Cycles =====
export interface PersonalCycle {
  personalYear: number
  personalMonth: number
  personalDay: number
  currentDate: string     // ISO date string
  yearMeaning: string
  monthMeaning: string
  dayMeaning: string
}

// ===== Challenges =====
export interface Challenge {
  number: number          // 0-8
  position: 'first' | 'second' | 'third' | 'fourth'
  label: string           // "Thử thách 1"
  startAge: number
  endAge: number | null   // null = rest of life
  isCurrent: boolean
  description: string
}

// ===== Pinnacles =====
export interface Pinnacle {
  number: number          // 1-9 or master
  position: 'first' | 'second' | 'third' | 'fourth'
  label: string           // "Đỉnh cao 1"
  startAge: number
  endAge: number | null   // null = rest of life
  isCurrent: boolean
  isMaster: boolean
  description: string
}

// ===== Full Result =====
export interface NumerologyResult {
  input: NumerologyInput
  nameBreakdown: NamePartBreakdown[]
  lifePath: CoreNumber
  birthday: CoreNumber
  expression: CoreNumber
  soulUrge: CoreNumber
  personality: CoreNumber
  maturity: CoreNumber
  cycles: PersonalCycle
  challenges: Challenge[]   // 4 items
  pinnacles: Pinnacle[]     // 4 items
}
```

- [ ] **Step 2: Create constants.ts with letter chart and number meanings**

```typescript
// src/lib/numerology/constants.ts

export const MASTER_NUMBERS = new Set([11, 22, 33])

// Pythagorean letter-to-number chart
export const LETTER_VALUES: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
}

// Vowels for Soul Urge calculation (Y handled separately)
export const VOWELS = new Set(['A', 'E', 'I', 'O', 'U'])

export interface NumberMeaning {
  number: number
  nameVi: string
  keywords: string[]
  general: string
  asLifePath: string
  asExpression: string
  asSoulUrge: string
  asPersonality: string
  asBirthday: string
  asMaturity: string
  asChallenge: string
  asPinnacle: string
  asPersonalYear: string
}

export const NUMBER_MEANINGS: Record<number, NumberMeaning> = {
  1: {
    number: 1,
    nameVi: 'Số Lãnh Đạo',
    keywords: ['độc lập', 'sáng tạo', 'tiên phong', 'quyết đoán'],
    general: 'Năng lượng khởi đầu, độc lập và lãnh đạo. Người mang số 1 có ý chí mạnh mẽ, tự tin và luôn muốn dẫn đầu.',
    asLifePath: 'Con đường của người tiên phong — bạn đến để dẫn dắt, không phải đi theo. Bài học lớn nhất là tin vào bản thân và dám đứng một mình.',
    asExpression: 'Tài năng tự nhiên trong việc khởi xướng, lãnh đạo và đưa ra quyết định. Bạn thể hiện bản thân tốt nhất khi được tự chủ.',
    asSoulUrge: 'Trong thâm tâm, bạn khao khát sự độc lập và cơ hội để thể hiện cá tính riêng.',
    asPersonality: 'Bạn toát ra vẻ tự tin, quyết đoán và năng động. Người khác nhìn bạn như một người lãnh đạo tự nhiên.',
    asBirthday: 'Sinh vào ngày mang năng lượng số 1 cho bạn khả năng sáng tạo và độc lập bẩm sinh.',
    asMaturity: 'Khi trưởng thành, bạn sẽ ngày càng tự tin hơn và tìm thấy con đường riêng của mình.',
    asChallenge: 'Thử thách về sự ích kỷ hoặc thiếu tự tin. Cần học cách cân bằng giữa độc lập và hợp tác.',
    asPinnacle: 'Giai đoạn khởi đầu mới, tự lập và phát triển cá nhân mạnh mẽ.',
    asPersonalYear: 'Năm khởi đầu chu kỳ mới. Thời điểm gieo hạt, bắt đầu dự án và đặt nền móng.',
  },
  2: {
    number: 2,
    nameVi: 'Số Hợp Tác',
    keywords: ['hòa hợp', 'nhạy cảm', 'ngoại giao', 'kiên nhẫn'],
    general: 'Năng lượng cân bằng, hợp tác và trực giác. Người mang số 2 giỏi lắng nghe, hòa giải và tạo sự hài hòa.',
    asLifePath: 'Con đường của người hòa giải — bạn đến để kết nối và tạo sự hài hòa. Bài học lớn nhất là kiên nhẫn và tin vào quá trình.',
    asExpression: 'Tài năng tự nhiên trong ngoại giao, hợp tác và đọc hiểu cảm xúc người khác.',
    asSoulUrge: 'Bạn khao khát hòa bình, tình yêu và sự kết nối sâu sắc với người khác.',
    asPersonality: 'Bạn toát ra sự dịu dàng, đáng tin cậy và dễ gần. Người khác cảm thấy an toàn bên bạn.',
    asBirthday: 'Sinh vào ngày mang năng lượng số 2 cho bạn khả năng ngoại giao và trực giác nhạy bén.',
    asMaturity: 'Khi trưởng thành, bạn sẽ trở nên khéo léo hơn trong các mối quan hệ.',
    asChallenge: 'Thử thách về sự thiếu quyết đoán hoặc quá phụ thuộc. Cần học cách đứng vững lập trường.',
    asPinnacle: 'Giai đoạn hợp tác, phát triển các mối quan hệ và học cách kiên nhẫn.',
    asPersonalYear: 'Năm hợp tác và chờ đợi. Thời điểm nuôi dưỡng các mối quan hệ và lắng nghe trực giác.',
  },
  3: {
    number: 3,
    nameVi: 'Số Sáng Tạo',
    keywords: ['biểu đạt', 'vui vẻ', 'nghệ thuật', 'giao tiếp'],
    general: 'Năng lượng sáng tạo, biểu đạt và niềm vui. Người mang số 3 có khiếu nghệ thuật, giao tiếp tốt và lạc quan.',
    asLifePath: 'Con đường của người nghệ sĩ — bạn đến để sáng tạo và truyền cảm hứng. Bài học lớn nhất là tập trung năng lượng sáng tạo.',
    asExpression: 'Tài năng tự nhiên trong giao tiếp, viết lách, nghệ thuật và giải trí.',
    asSoulUrge: 'Bạn khao khát được thể hiện bản thân và mang niềm vui đến cho người khác.',
    asPersonality: 'Bạn toát ra sự vui vẻ, hấp dẫn và lôi cuốn. Người khác bị thu hút bởi sự sôi nổi của bạn.',
    asBirthday: 'Sinh vào ngày mang năng lượng số 3 cho bạn tài ăn nói và óc sáng tạo.',
    asMaturity: 'Khi trưởng thành, bạn sẽ tìm được phương tiện sáng tạo phù hợp để thể hiện bản thân.',
    asChallenge: 'Thử thách về sự phân tán hoặc hời hợt. Cần học cách tập trung và hoàn thành những gì đã bắt đầu.',
    asPinnacle: 'Giai đoạn biểu đạt sáng tạo mạnh mẽ và mở rộng giao tiếp xã hội.',
    asPersonalYear: 'Năm sáng tạo và giao tiếp. Thời điểm mở rộng mạng lưới xã hội và theo đuổi đam mê nghệ thuật.',
  },
  4: {
    number: 4,
    nameVi: 'Số Ổn Định',
    keywords: ['kỷ luật', 'thực tế', 'chăm chỉ', 'nền tảng'],
    general: 'Năng lượng ổn định, kỷ luật và xây dựng. Người mang số 4 đáng tin cậy, có phương pháp và kiên trì.',
    asLifePath: 'Con đường của người xây dựng — bạn đến để tạo nền tảng vững chắc. Bài học lớn nhất là kiên nhẫn và có hệ thống.',
    asExpression: 'Tài năng tự nhiên trong tổ chức, quản lý và biến ý tưởng thành hiện thực cụ thể.',
    asSoulUrge: 'Bạn khao khát sự ổn định, trật tự và cảm giác an toàn trong cuộc sống.',
    asPersonality: 'Bạn toát ra sự đáng tin cậy, nghiêm túc và có trách nhiệm. Người khác tin tưởng bạn.',
    asBirthday: 'Sinh vào ngày mang năng lượng số 4 cho bạn tính kỷ luật và khả năng làm việc bền bỉ.',
    asMaturity: 'Khi trưởng thành, bạn sẽ xây dựng được nền tảng vững chắc cho cuộc sống.',
    asChallenge: 'Thử thách về sự cứng nhắc hoặc bảo thủ. Cần học cách linh hoạt và đón nhận thay đổi.',
    asPinnacle: 'Giai đoạn xây dựng nền tảng, làm việc chăm chỉ và thiết lập cấu trúc.',
    asPersonalYear: 'Năm làm việc và xây dựng. Thời điểm đặt nền móng, tổ chức lại và chú trọng sức khỏe.',
  },
  5: {
    number: 5,
    nameVi: 'Số Tự Do',
    keywords: ['thay đổi', 'phiêu lưu', 'linh hoạt', 'tò mò'],
    general: 'Năng lượng tự do, thay đổi và khám phá. Người mang số 5 yêu tự do, thích phiêu lưu và thích nghi nhanh.',
    asLifePath: 'Con đường của người phiêu lưu — bạn đến để trải nghiệm cuộc sống đa dạng. Bài học lớn nhất là tự do có trách nhiệm.',
    asExpression: 'Tài năng tự nhiên trong việc thích nghi, giao tiếp đa văn hóa và nắm bắt cơ hội.',
    asSoulUrge: 'Bạn khao khát tự do, sự đa dạng và những trải nghiệm mới mẻ.',
    asPersonality: 'Bạn toát ra sự năng động, quyến rũ và linh hoạt. Người khác thấy bạn thú vị và đầy sức sống.',
    asBirthday: 'Sinh vào ngày mang năng lượng số 5 cho bạn tính linh hoạt và khả năng thích nghi.',
    asMaturity: 'Khi trưởng thành, bạn sẽ tìm thấy tự do thực sự thông qua kỷ luật bản thân.',
    asChallenge: 'Thử thách về sự thiếu kiên trì hoặc nghiện kích thích. Cần học cách cam kết và bền bỉ.',
    asPinnacle: 'Giai đoạn thay đổi lớn, du lịch, mở rộng tầm nhìn và tự do cá nhân.',
    asPersonalYear: 'Năm thay đổi và tự do. Thời điểm du lịch, thử nghiệm và đón nhận những điều bất ngờ.',
  },
  6: {
    number: 6,
    nameVi: 'Số Trách Nhiệm',
    keywords: ['yêu thương', 'gia đình', 'chăm sóc', 'hài hòa'],
    general: 'Năng lượng yêu thương, trách nhiệm và phục vụ. Người mang số 6 có lòng nhân ái, yêu gia đình và cộng đồng.',
    asLifePath: 'Con đường của người chăm sóc — bạn đến để yêu thương và chịu trách nhiệm. Bài học lớn nhất là cân bằng giữa cho đi và nhận lại.',
    asExpression: 'Tài năng tự nhiên trong việc chăm sóc, tư vấn, dạy dỗ và tạo ra môi trường hài hòa.',
    asSoulUrge: 'Bạn khao khát sự hòa thuận trong gia đình và được yêu thương, trân trọng.',
    asPersonality: 'Bạn toát ra sự ấm áp, đáng tin cậy và bao dung. Người khác tìm đến bạn khi cần sự an ủi.',
    asBirthday: 'Sinh vào ngày mang năng lượng số 6 cho bạn tấm lòng nhân hậu và tinh thần trách nhiệm.',
    asMaturity: 'Khi trưởng thành, bạn sẽ trở thành trụ cột tinh thần cho gia đình và cộng đồng.',
    asChallenge: 'Thử thách về sự hy sinh quá mức hoặc kiểm soát. Cần học cách buông bỏ và cho phép người khác tự trưởng thành.',
    asPinnacle: 'Giai đoạn tập trung vào gia đình, trách nhiệm và phục vụ cộng đồng.',
    asPersonalYear: 'Năm gia đình và trách nhiệm. Thời điểm chăm sóc nhà cửa, gia đình và các mối quan hệ thân thiết.',
  },
  7: {
    number: 7,
    nameVi: 'Số Tâm Linh',
    keywords: ['trí tuệ', 'nội tâm', 'phân tích', 'tìm kiếm'],
    general: 'Năng lượng trí tuệ, tâm linh và khám phá nội tâm. Người mang số 7 có tư duy sâu sắc, thích nghiên cứu và tìm kiếm chân lý.',
    asLifePath: 'Con đường của người tìm kiếm — bạn đến để hiểu biết sâu sắc về cuộc sống. Bài học lớn nhất là tin vào trực giác và chấp nhận bí ẩn.',
    asExpression: 'Tài năng tự nhiên trong nghiên cứu, phân tích, viết lách chuyên sâu và tư duy chiến lược.',
    asSoulUrge: 'Bạn khao khát sự hiểu biết sâu sắc, không gian riêng tư và kết nối tâm linh.',
    asPersonality: 'Bạn toát ra sự bí ẩn, thông thái và thanh lịch. Người khác cảm thấy bạn khó tiếp cận nhưng đáng kính trọng.',
    asBirthday: 'Sinh vào ngày mang năng lượng số 7 cho bạn trí tuệ phân tích và chiều sâu nội tâm.',
    asMaturity: 'Khi trưởng thành, bạn sẽ đạt được sự bình an nội tâm thông qua hiểu biết.',
    asChallenge: 'Thử thách về sự cô lập hoặc hoài nghi quá mức. Cần học cách mở lòng và chia sẻ.',
    asPinnacle: 'Giai đoạn tĩnh lặng, nghiên cứu, phát triển tâm linh và tìm kiếm nội tâm.',
    asPersonalYear: 'Năm suy ngẫm và nghiên cứu. Thời điểm đi sâu vào bên trong, học hỏi và phát triển tâm linh.',
  },
  8: {
    number: 8,
    nameVi: 'Số Quyền Lực',
    keywords: ['thành công', 'tài chính', 'quyền lực', 'thành tựu'],
    general: 'Năng lượng quyền lực, thành công vật chất và quản lý. Người mang số 8 có tham vọng, khả năng kinh doanh và quản lý tài chính.',
    asLifePath: 'Con đường của người kinh doanh — bạn đến để đạt thành tựu vật chất và tinh thần. Bài học lớn nhất là sử dụng quyền lực một cách khôn ngoan.',
    asExpression: 'Tài năng tự nhiên trong kinh doanh, quản lý, tổ chức và đạt mục tiêu lớn.',
    asSoulUrge: 'Bạn khao khát thành công, sự công nhận và khả năng tạo ra ảnh hưởng lớn.',
    asPersonality: 'Bạn toát ra sự mạnh mẽ, tự tin và thành đạt. Người khác thấy bạn là người có tầm ảnh hưởng.',
    asBirthday: 'Sinh vào ngày mang năng lượng số 8 cho bạn tham vọng và khả năng quản lý bẩm sinh.',
    asMaturity: 'Khi trưởng thành, bạn sẽ đạt được vị trí có ảnh hưởng và thành công tài chính.',
    asChallenge: 'Thử thách về tham lam hoặc lạm quyền. Cần học cách cân bằng giữa vật chất và tinh thần.',
    asPinnacle: 'Giai đoạn đạt thành tựu tài chính, thăng tiến và xây dựng di sản.',
    asPersonalYear: 'Năm thành tựu và tài chính. Thời điểm thu hoạch, đầu tư và mở rộng kinh doanh.',
  },
  9: {
    number: 9,
    nameVi: 'Số Nhân Đạo',
    keywords: ['từ bi', 'hoàn thành', 'phụng sự', 'trí tuệ'],
    general: 'Năng lượng hoàn thành, từ bi và phụng sự nhân loại. Người mang số 9 có tầm nhìn rộng, lòng bác ái và trí tuệ.',
    asLifePath: 'Con đường của nhà nhân đạo — bạn đến để phụng sự và cho đi. Bài học lớn nhất là buông bỏ và tin vào vũ trụ.',
    asExpression: 'Tài năng tự nhiên trong nghệ thuật, giảng dạy, chữa lành và hoạt động nhân đạo.',
    asSoulUrge: 'Bạn khao khát tạo ra sự khác biệt cho thế giới và giúp đỡ những người kém may mắn.',
    asPersonality: 'Bạn toát ra sự từ bi, thanh tao và đầy cảm hứng. Người khác thấy bạn là người lý tưởng.',
    asBirthday: 'Sinh vào ngày mang năng lượng số 9 cho bạn lòng nhân ái và tầm nhìn rộng lớn.',
    asMaturity: 'Khi trưởng thành, bạn sẽ tìm thấy ý nghĩa cuộc sống qua phụng sự và cho đi.',
    asChallenge: 'Thử thách về sự mất mát hoặc hy sinh. Cần học cách buông bỏ quá khứ và đón nhận hiện tại.',
    asPinnacle: 'Giai đoạn hoàn thành, buông bỏ và phụng sự ở tầm rộng lớn.',
    asPersonalYear: 'Năm hoàn thành và buông bỏ. Thời điểm kết thúc chu kỳ cũ, dọn dẹp và chuẩn bị cho khởi đầu mới.',
  },
  11: {
    number: 11,
    nameVi: 'Số Trực Giác Bậc Thầy',
    keywords: ['trực giác', 'linh cảm', 'truyền cảm hứng', 'khai sáng'],
    general: 'Master Number — năng lượng trực giác siêu phàm, tầm nhìn tâm linh và khả năng truyền cảm hứng. Số 11 mang rung động cao nhất của số 2.',
    asLifePath: 'Con đường của người khai sáng — bạn mang sứ mệnh truyền cảm hứng và nâng cao nhận thức. Bài học: làm chủ trực giác mà không mất kết nối thực tế.',
    asExpression: 'Tài năng đặc biệt trong lĩnh vực tâm linh, nghệ thuật, truyền thông và truyền cảm hứng cho đám đông.',
    asSoulUrge: 'Bạn khao khát khai sáng, truyền cảm hứng và kết nối với chiều không gian cao hơn.',
    asPersonality: 'Bạn toát ra ánh sáng đặc biệt — người khác cảm nhận được năng lượng mạnh mẽ và truyền cảm hứng từ bạn.',
    asBirthday: 'Sinh vào ngày 11 hoặc ngày giảm về 11 cho bạn trực giác phi thường.',
    asMaturity: 'Khi trưởng thành, bạn sẽ trở thành nguồn sáng dẫn đường cho nhiều người.',
    asChallenge: 'Thử thách về sự lo lắng quá mức hoặc mất cân bằng năng lượng. Cần học cách nối đất.',
    asPinnacle: 'Giai đoạn thức tỉnh tâm linh, phát triển trực giác và truyền cảm hứng.',
    asPersonalYear: 'Năm đặc biệt với trực giác mạnh mẽ. Chú ý đến giấc mơ, linh cảm và những dấu hiệu từ vũ trụ.',
  },
  22: {
    number: 22,
    nameVi: 'Số Kiến Trúc Sư Bậc Thầy',
    keywords: ['tầm nhìn lớn', 'xây dựng', 'di sản', 'hiện thực hóa'],
    general: 'Master Number — năng lượng xây dựng ở tầm vĩ mô, biến tầm nhìn thành hiện thực. Số 22 mang rung động cao nhất của số 4.',
    asLifePath: 'Con đường của kiến trúc sư vĩ đại — bạn đến để xây dựng di sản lâu dài cho nhân loại. Bài học: biến giấc mơ lớn thành hiện thực cụ thể.',
    asExpression: 'Tài năng đặc biệt trong việc tổ chức quy mô lớn, xây dựng hệ thống và hiện thực hóa tầm nhìn.',
    asSoulUrge: 'Bạn khao khát tạo ra di sản vĩ đại — thứ gì đó vượt qua bản thân và tồn tại mãi.',
    asPersonality: 'Bạn toát ra sự uy quyền tự nhiên và khả năng biến điều không thể thành có thể.',
    asBirthday: 'Sinh vào ngày 22 cho bạn tiềm năng đặc biệt trong xây dựng và tổ chức.',
    asMaturity: 'Khi trưởng thành, bạn sẽ bước vào vai trò xây dựng ở tầm ảnh hưởng rất lớn.',
    asChallenge: 'Thử thách về áp lực quá lớn hoặc không tin vào tầm nhìn. Cần học cách chia nhỏ giấc mơ lớn.',
    asPinnacle: 'Giai đoạn xây dựng ở tầm vĩ mô — những thành tựu để lại dấu ấn lâu dài.',
    asPersonalYear: 'Năm hiện thực hóa tầm nhìn lớn. Thời điểm xây dựng nền móng cho di sản.',
  },
  33: {
    number: 33,
    nameVi: 'Số Thầy Giáo Bậc Thầy',
    keywords: ['phụng sự', 'chữa lành', 'hy sinh', 'yêu thương vô điều kiện'],
    general: 'Master Number — năng lượng phụng sự nhân loại ở cấp độ cao nhất, yêu thương vô điều kiện. Số 33 mang rung động cao nhất của số 6.',
    asLifePath: 'Con đường của bậc thầy chữa lành — bạn đến để nâng đỡ nhân loại bằng tình yêu vô điều kiện. Rất hiếm và đầy thử thách.',
    asExpression: 'Tài năng đặc biệt trong chữa lành, giảng dạy, tư vấn và nâng đỡ tinh thần người khác ở cấp độ sâu.',
    asSoulUrge: 'Bạn khao khát chữa lành thế giới và mang tình yêu vô điều kiện đến cho mọi người.',
    asPersonality: 'Bạn toát ra sự thánh thiện, từ bi và khả năng chữa lành. Người khác cảm thấy được an ủi khi ở bên bạn.',
    asBirthday: 'Sinh vào ngày giảm về 33 cho bạn sứ mệnh phụng sự đặc biệt.',
    asMaturity: 'Khi trưởng thành, bạn sẽ trở thành nguồn chữa lành và truyền cảm hứng cho cộng đồng lớn.',
    asChallenge: 'Thử thách về sự hy sinh quá mức. Cần học cách chăm sóc bản thân trước khi chăm sóc người khác.',
    asPinnacle: 'Giai đoạn phụng sự ở cấp độ cao nhất — chữa lành và nâng đỡ nhân loại.',
    asPersonalYear: 'Năm phụng sự và yêu thương vô điều kiện. Thời điểm cho đi và chữa lành.',
  },
  0: {
    number: 0,
    nameVi: 'Thử Thách Tự Do',
    keywords: ['lựa chọn', 'tất cả hoặc không', 'tự do'],
    general: 'Thử thách số 0 — bạn phải đối mặt với tất cả các thử thách hoặc không có thử thách nào cụ thể. Đây là thử thách của sự lựa chọn tự do.',
    asLifePath: '',
    asExpression: '',
    asSoulUrge: '',
    asPersonality: '',
    asBirthday: '',
    asMaturity: '',
    asChallenge: 'Thử thách Tự Do — không có thử thách cụ thể, hoặc tất cả đều là thử thách. Bạn có quyền lựa chọn con đường riêng.',
    asPinnacle: '',
    asPersonalYear: '',
  },
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/numerology/types.ts src/lib/numerology/constants.ts
git commit -m "feat(numerology): add types and constants for Pythagorean system"
```

---

## Task 2: Reduction Utilities + Tests

**Files:**
- Create: `src/lib/numerology/reduction.ts`
- Create: `src/lib/numerology/reduction.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/lib/numerology/reduction.test.ts
import { describe, it, expect } from 'vitest'
import { digitSum, reduce, reduceStrict } from './reduction'

describe('digitSum', () => {
  it('sums digits of a number', () => {
    expect(digitSum(1992)).toBe(21)
    expect(digitSum(38)).toBe(11)
    expect(digitSum(7)).toBe(7)
  })
})

describe('reduce', () => {
  it('reduces to single digit', () => {
    expect(reduce(38)).toBe(2)   // 38 → 11 → master, wait no: 3+8=11 → master
    expect(reduce(48)).toBe(3)   // 4+8=12 → 1+2=3
    expect(reduce(7)).toBe(7)
  })

  it('preserves master number 11', () => {
    expect(reduce(11)).toBe(11)
    expect(reduce(29)).toBe(11)  // 2+9=11
    expect(reduce(38)).toBe(11)  // 3+8=11
  })

  it('preserves master number 22', () => {
    expect(reduce(22)).toBe(22)
  })

  it('preserves master number 33', () => {
    expect(reduce(33)).toBe(33)
  })

  it('does not preserve 44', () => {
    expect(reduce(44)).toBe(8)  // 4+4=8
  })
})

describe('reduceStrict', () => {
  it('always reduces to single digit', () => {
    expect(reduceStrict(11)).toBe(2)
    expect(reduceStrict(22)).toBe(4)
    expect(reduceStrict(33)).toBe(6)
    expect(reduceStrict(38)).toBe(2) // 3+8=11 → 1+1=2
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/numerology/reduction.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement reduction.ts**

```typescript
// src/lib/numerology/reduction.ts
import { MASTER_NUMBERS } from './constants'

/** Sum individual digits of a number (single pass, no reduction) */
export function digitSum(n: number): number {
  let sum = 0
  let val = Math.abs(n)
  while (val > 0) {
    sum += val % 10
    val = Math.floor(val / 10)
  }
  return sum
}

/** Reduce to single digit, preserving master numbers (11, 22, 33) */
export function reduce(n: number): number {
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = digitSum(n)
  }
  return n
}

/** Reduce to single digit — no master number preservation */
export function reduceStrict(n: number): number {
  while (n > 9) {
    n = digitSum(n)
  }
  return n
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/numerology/reduction.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/numerology/reduction.ts src/lib/numerology/reduction.test.ts
git commit -m "feat(numerology): add reduction utilities with tests"
```

---

## Task 3: Vietnamese Name Processing

**Files:**
- Create: `src/lib/numerology/vietnamese.ts`

- [ ] **Step 1: Add Vietnamese tests to reduction.test.ts (or a new file)**

Add these tests to `src/lib/numerology/reduction.test.ts`:

```typescript
import { stripDiacritics, classifyLetters } from './vietnamese'

describe('stripDiacritics', () => {
  it('strips Vietnamese diacritics', () => {
    expect(stripDiacritics('Nguyễn')).toBe('NGUYEN')
    expect(stripDiacritics('Phước')).toBe('PHUOC')
    expect(stripDiacritics('Đình')).toBe('DINH')
  })

  it('handles plain ASCII', () => {
    expect(stripDiacritics('John')).toBe('JOHN')
  })
})

describe('classifyLetters', () => {
  it('classifies vowels and consonants', () => {
    const result = classifyLetters('JOHN')
    expect(result.find(l => l.baseLetter === 'O')?.type).toBe('vowel')
    expect(result.find(l => l.baseLetter === 'J')?.type).toBe('consonant')
  })

  it('treats Y as vowel by default', () => {
    const result = classifyLetters('LY')
    expect(result.find(l => l.baseLetter === 'Y')?.type).toBe('vowel')
  })

  it('assigns correct Pythagorean values', () => {
    const result = classifyLetters('AJS')
    expect(result.every(l => l.value === 1)).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/numerology/reduction.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement vietnamese.ts**

```typescript
// src/lib/numerology/vietnamese.ts
import { LETTER_VALUES, VOWELS } from './constants'
import type { LetterBreakdown } from './types'

/** Strip Vietnamese diacritics using NFD normalization. Returns uppercase A-Z. */
export function stripDiacritics(str: string): string {
  // Handle Đ/đ first (it's a separate Unicode char, not a combining sequence)
  const replaced = str.replace(/Đ/g, 'D').replace(/đ/g, 'd')
  // NFD decompose then strip combining marks
  return replaced
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
}

/**
 * Classify each letter as vowel or consonant with Pythagorean values.
 * Y is treated as vowel by default (standard for Vietnamese names).
 * Input should be an already-stripped uppercase string (A-Z only).
 */
export function classifyLetters(stripped: string): LetterBreakdown[] {
  return Array.from(stripped).map(baseLetter => ({
    letter: baseLetter,
    baseLetter,
    value: LETTER_VALUES[baseLetter] ?? 0,
    type: (VOWELS.has(baseLetter) || baseLetter === 'Y') ? 'vowel' : 'consonant',
  }))
}

/**
 * Process a full name: strip diacritics, classify letters, return breakdown per name part.
 * Preserves original letters alongside base letters for display.
 */
export function processName(originalName: string): { stripped: string; parts: string[] } {
  const stripped = stripDiacritics(originalName)
  const parts = stripped.split(/\s+/).filter(Boolean)
  return { stripped, parts }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/numerology/reduction.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/numerology/vietnamese.ts src/lib/numerology/reduction.test.ts
git commit -m "feat(numerology): add Vietnamese name processing"
```

---

## Task 4: Core Number Calculations (Life Path, Birthday, Name Numbers, Maturity)

**Files:**
- Create: `src/lib/numerology/life-path.ts`
- Create: `src/lib/numerology/birthday.ts`
- Create: `src/lib/numerology/name-numbers.ts`
- Create: `src/lib/numerology/maturity.ts`
- Create: `src/lib/numerology/numerology.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/lib/numerology/numerology.test.ts
import { describe, it, expect } from 'vitest'
import { computeLifePath } from './life-path'
import { computeBirthday } from './birthday'
import { computeExpression, computeSoulUrge, computePersonality } from './name-numbers'
import { computeMaturity } from './maturity'

describe('computeLifePath', () => {
  it('computes Life Path with master number 11', () => {
    // Dec 14, 1992: reduce(12)=3, reduce(14)=5, reduce(21)=3 → 3+5+3=11
    const result = computeLifePath(12, 14, 1992)
    expect(result.value).toBe(11)
    expect(result.isMaster).toBe(true)
  })

  it('computes Life Path 1', () => {
    // Oct 22, 1985: reduce(10)=1, reduce(22)=22, reduce(23)=5 → 1+22+5=28 → 10 → 1
    const result = computeLifePath(10, 22, 1985)
    expect(result.value).toBe(1)
  })

  it('preserves master number in day', () => {
    // Month 11 stays 11, day 22 stays 22
    const result = computeLifePath(11, 22, 2000)
    // 11 + 22 + 2 = 35 → 8
    expect(result.value).toBe(8)
  })
})

describe('computeBirthday', () => {
  it('returns single digit', () => {
    expect(computeBirthday(7).value).toBe(7)
  })

  it('reduces day', () => {
    expect(computeBirthday(15).value).toBe(6) // 1+5=6
  })

  it('preserves master 22', () => {
    expect(computeBirthday(22).value).toBe(22)
    expect(computeBirthday(22).isMaster).toBe(true)
  })

  it('preserves master 11', () => {
    expect(computeBirthday(11).value).toBe(11)
    expect(computeBirthday(29).value).toBe(11) // 2+9=11
  })
})

describe('computeExpression', () => {
  it('computes JOHN WILLIAM SMITH = 6', () => {
    // JOHN: 1+6+8+5=20→2, WILLIAM: 5+9+3+3+9+1+4=34→7, SMITH: 1+4+9+2+8=24→6
    // 2+7+6=15→6
    const result = computeExpression('John William Smith')
    expect(result.value).toBe(6)
  })
})

describe('computeSoulUrge', () => {
  it('computes vowels only', () => {
    // JOHN: O=6, WILLIAM: I+I+A=9+9+1=19→10→1, SMITH: I=9
    // wait — need Y rule. WILLIAM has no Y. 
    // JOHN vowels: O(6) → reduce=6
    // WILLIAM vowels: I(9)+I(9)+A(1)=19 → reduce=1 (wait 1+9=10→1)
    // SMITH vowels: I(9) → reduce=9
    // 6+1+9=16→7
    const result = computeSoulUrge('John William Smith')
    expect(result.value).toBe(7)
  })
})

describe('computePersonality', () => {
  it('computes consonants only', () => {
    // JOHN consonants: J(1)+H(8)+N(5)=14→5
    // WILLIAM consonants: W(5)+L(3)+L(3)+M(4)=15→6
    // SMITH consonants: S(1)+M(4)+T(2)+H(8)=15→6
    // 5+6+6=17→8
    const result = computePersonality('John William Smith')
    expect(result.value).toBe(8)
  })
})

describe('computeMaturity', () => {
  it('sums Life Path and Expression', () => {
    const result = computeMaturity(7, 5)
    expect(result.value).toBe(3) // 7+5=12→3
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/numerology/numerology.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement life-path.ts**

```typescript
// src/lib/numerology/life-path.ts
import { reduce, digitSum } from './reduction'
import { MASTER_NUMBERS, NUMBER_MEANINGS } from './constants'
import type { CoreNumber } from './types'

export function computeLifePath(month: number, day: number, year: number): CoreNumber {
  const m = reduce(month)
  const d = reduce(day)
  const y = reduce(digitSum(year))
  const value = reduce(m + d + y)

  const meaning = NUMBER_MEANINGS[value]
  return {
    name: 'Life Path',
    nameVi: 'Số Chủ Đạo',
    value,
    isMaster: MASTER_NUMBERS.has(value),
    description: meaning?.asLifePath ?? meaning?.general ?? '',
    calculation: `reduce(${month})=${m} + reduce(${day})=${d} + reduce(${year}→${digitSum(year)})=${y} = ${m + d + y} → ${value}`,
  }
}
```

- [ ] **Step 4: Implement birthday.ts**

```typescript
// src/lib/numerology/birthday.ts
import { reduce } from './reduction'
import { MASTER_NUMBERS, NUMBER_MEANINGS } from './constants'
import type { CoreNumber } from './types'

export function computeBirthday(day: number): CoreNumber {
  const value = reduce(day)
  const meaning = NUMBER_MEANINGS[value]
  return {
    name: 'Birthday',
    nameVi: 'Số Ngày Sinh',
    value,
    isMaster: MASTER_NUMBERS.has(value),
    description: meaning?.asBirthday ?? meaning?.general ?? '',
    calculation: `reduce(${day}) = ${value}`,
  }
}
```

- [ ] **Step 5: Implement name-numbers.ts**

```typescript
// src/lib/numerology/name-numbers.ts
import { reduce } from './reduction'
import { LETTER_VALUES, MASTER_NUMBERS, NUMBER_MEANINGS } from './constants'
import { stripDiacritics, classifyLetters } from './vietnamese'
import type { CoreNumber, NamePartBreakdown } from './types'

function sumLetterValues(letters: string): number {
  return Array.from(letters).reduce((sum, ch) => sum + (LETTER_VALUES[ch] ?? 0), 0)
}

export function getNameBreakdown(fullName: string): NamePartBreakdown[] {
  const stripped = stripDiacritics(fullName)
  const originalParts = fullName.trim().split(/\s+/)
  const strippedParts = stripped.split(/\s+/).filter(Boolean)

  return strippedParts.map((part, i) => {
    const letters = classifyLetters(part)
    const total = letters.reduce((sum, l) => sum + l.value, 0)
    return {
      name: originalParts[i] ?? part,
      letters,
      total,
      reduced: reduce(total),
    }
  })
}

export function computeExpression(fullName: string): CoreNumber {
  const stripped = stripDiacritics(fullName)
  const parts = stripped.split(/\s+/).filter(Boolean)
  const partSums = parts.map(part => reduce(sumLetterValues(part)))
  const total = partSums.reduce((a, b) => a + b, 0)
  const value = reduce(total)
  const meaning = NUMBER_MEANINGS[value]

  return {
    name: 'Expression',
    nameVi: 'Số Vận Mệnh',
    value,
    isMaster: MASTER_NUMBERS.has(value),
    description: meaning?.asExpression ?? meaning?.general ?? '',
    calculation: parts.map((p, i) => `${p}=${partSums[i]}`).join(' + ') + ` = ${total} → ${value}`,
  }
}

export function computeSoulUrge(fullName: string): CoreNumber {
  const stripped = stripDiacritics(fullName)
  const parts = stripped.split(/\s+/).filter(Boolean)

  const partSums = parts.map(part => {
    const letters = classifyLetters(part)
    const vowels = letters.filter(l => l.type === 'vowel')
    const sum = vowels.reduce((s, l) => s + l.value, 0)
    return reduce(sum)
  })

  const total = partSums.reduce((a, b) => a + b, 0)
  const value = reduce(total)
  const meaning = NUMBER_MEANINGS[value]

  return {
    name: 'Soul Urge',
    nameVi: 'Số Linh Hồn',
    value,
    isMaster: MASTER_NUMBERS.has(value),
    description: meaning?.asSoulUrge ?? meaning?.general ?? '',
    calculation: `Vowels: ${partSums.join(' + ')} = ${total} → ${value}`,
  }
}

export function computePersonality(fullName: string): CoreNumber {
  const stripped = stripDiacritics(fullName)
  const parts = stripped.split(/\s+/).filter(Boolean)

  const partSums = parts.map(part => {
    const letters = classifyLetters(part)
    const consonants = letters.filter(l => l.type === 'consonant')
    const sum = consonants.reduce((s, l) => s + l.value, 0)
    return reduce(sum)
  })

  const total = partSums.reduce((a, b) => a + b, 0)
  const value = reduce(total)
  const meaning = NUMBER_MEANINGS[value]

  return {
    name: 'Personality',
    nameVi: 'Số Nhân Cách',
    value,
    isMaster: MASTER_NUMBERS.has(value),
    description: meaning?.asPersonality ?? meaning?.general ?? '',
    calculation: `Consonants: ${partSums.join(' + ')} = ${total} → ${value}`,
  }
}
```

- [ ] **Step 6: Implement maturity.ts**

```typescript
// src/lib/numerology/maturity.ts
import { reduce } from './reduction'
import { MASTER_NUMBERS, NUMBER_MEANINGS } from './constants'
import type { CoreNumber } from './types'

export function computeMaturity(lifePathValue: number, expressionValue: number): CoreNumber {
  const value = reduce(lifePathValue + expressionValue)
  const meaning = NUMBER_MEANINGS[value]
  return {
    name: 'Maturity',
    nameVi: 'Số Trưởng Thành',
    value,
    isMaster: MASTER_NUMBERS.has(value),
    description: meaning?.asMaturity ?? meaning?.general ?? '',
    calculation: `Life Path(${lifePathValue}) + Expression(${expressionValue}) = ${lifePathValue + expressionValue} → ${value}`,
  }
}
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx vitest run src/lib/numerology/numerology.test.ts`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/lib/numerology/life-path.ts src/lib/numerology/birthday.ts src/lib/numerology/name-numbers.ts src/lib/numerology/maturity.ts src/lib/numerology/numerology.test.ts
git commit -m "feat(numerology): add core number calculations with tests"
```

---

## Task 5: Cycles, Challenges, and Pinnacles

**Files:**
- Create: `src/lib/numerology/cycles.ts`
- Create: `src/lib/numerology/challenges.ts`
- Create: `src/lib/numerology/pinnacles.ts`
- Modify: `src/lib/numerology/numerology.test.ts`

- [ ] **Step 1: Add tests to numerology.test.ts**

```typescript
import { computePersonalYear, computePersonalMonth, computePersonalDay } from './cycles'
import { computeChallenges } from './challenges'
import { computePinnacles } from './pinnacles'

describe('computePersonalYear', () => {
  it('computes personal year', () => {
    // March 25, year 2026: reduce(3)=3, reduce(25)=7, reduce(2026→10)=1 → 3+7+1=11
    expect(computePersonalYear(3, 25, 2026)).toBe(11)
  })
})

describe('computePersonalMonth', () => {
  it('computes personal month', () => {
    // Personal year 5, October (10): 5+10=15→6
    expect(computePersonalMonth(5, 10)).toBe(6)
  })
})

describe('computePersonalDay', () => {
  it('computes personal day', () => {
    // Personal month 6, day 23: 6+23=29→11
    expect(computePersonalDay(6, 23)).toBe(11)
  })
})

describe('computeChallenges', () => {
  it('computes 4 challenge numbers', () => {
    // Sep 26, 1969: M=9, D=8, Y=7
    // first=|9-8|=1, second=|8-7|=1, third=|1-1|=0, fourth=|9-7|=2
    const result = computeChallenges(9, 26, 1969, 4) // lifePath=4 for timing
    expect(result).toHaveLength(4)
    expect(result[0].number).toBe(1)
    expect(result[1].number).toBe(1)
    expect(result[2].number).toBe(0)
    expect(result[3].number).toBe(2)
  })

  it('computes age ranges based on life path', () => {
    const result = computeChallenges(9, 26, 1969, 7) // LP=7 → first ends at 29
    expect(result[0].startAge).toBe(0)
    expect(result[0].endAge).toBe(29)     // 36-7=29
    expect(result[1].startAge).toBe(30)
    expect(result[1].endAge).toBe(38)
  })
})

describe('computePinnacles', () => {
  it('computes 4 pinnacle numbers', () => {
    // March 14, 1985: M=3, D=5, Y=5
    // first=3+5=8, second=5+5=10→1, third=8+1=9, fourth=3+5=8
    const result = computePinnacles(3, 14, 1985, 4) // LP=4
    expect(result).toHaveLength(4)
    expect(result[0].number).toBe(8)
    expect(result[1].number).toBe(1)
    expect(result[2].number).toBe(9)
    expect(result[3].number).toBe(8)
  })

  it('computes age ranges based on life path', () => {
    const result = computePinnacles(3, 14, 1985, 4) // LP=4 → first ends at 32
    expect(result[0].startAge).toBe(0)
    expect(result[0].endAge).toBe(32)   // 36-4=32
    expect(result[1].startAge).toBe(33)
    expect(result[1].endAge).toBe(41)
    expect(result[2].startAge).toBe(42)
    expect(result[2].endAge).toBe(50)
    expect(result[3].startAge).toBe(51)
    expect(result[3].endAge).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/numerology/numerology.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement cycles.ts**

```typescript
// src/lib/numerology/cycles.ts
import { reduce, digitSum } from './reduction'

export function computePersonalYear(birthMonth: number, birthDay: number, currentYear: number): number {
  const m = reduce(birthMonth)
  const d = reduce(birthDay)
  const y = reduce(digitSum(currentYear))
  return reduce(m + d + y)
}

export function computePersonalMonth(personalYear: number, currentMonth: number): number {
  return reduce(personalYear + currentMonth)
}

export function computePersonalDay(personalMonth: number, currentDay: number): number {
  return reduce(personalMonth + currentDay)
}
```

- [ ] **Step 4: Implement challenges.ts**

```typescript
// src/lib/numerology/challenges.ts
import { reduceStrict, digitSum } from './reduction'
import { NUMBER_MEANINGS } from './constants'
import type { Challenge } from './types'

export function computeChallenges(
  month: number, day: number, year: number,
  lifePathValue: number,
): Challenge[] {
  const m = reduceStrict(month)
  const d = reduceStrict(day)
  const y = reduceStrict(digitSum(year))

  const first = Math.abs(m - d)
  const second = Math.abs(d - y)
  const third = Math.abs(first - second)
  const fourth = Math.abs(m - y)

  // Timing: reduce master LP to single digit
  const lp = lifePathValue > 9 ? reduceStrict(lifePathValue) : lifePathValue
  const firstEnd = 36 - lp

  const numbers = [first, second, third, fourth]
  const positions: Challenge['position'][] = ['first', 'second', 'third', 'fourth']
  const labels = ['Thử thách 1', 'Thử thách 2', 'Thử thách 3 (chính)', 'Thử thách 4']

  const currentAge = new Date().getFullYear() - (new Date().getFullYear() - 30) // placeholder — real age computed in orchestrator

  const ranges: { start: number; end: number | null }[] = [
    { start: 0, end: firstEnd },
    { start: firstEnd + 1, end: firstEnd + 9 },
    { start: 0, end: firstEnd + 9 },  // third overlaps first and second
    { start: firstEnd + 10, end: null },
  ]

  return numbers.map((num, i) => ({
    number: num,
    position: positions[i],
    label: labels[i],
    startAge: ranges[i].start,
    endAge: ranges[i].end,
    isCurrent: false, // set by orchestrator based on actual age
    description: NUMBER_MEANINGS[num]?.asChallenge ?? '',
  }))
}
```

- [ ] **Step 5: Implement pinnacles.ts**

```typescript
// src/lib/numerology/pinnacles.ts
import { reduce, reduceStrict, digitSum } from './reduction'
import { MASTER_NUMBERS, NUMBER_MEANINGS } from './constants'
import type { Pinnacle } from './types'

export function computePinnacles(
  month: number, day: number, year: number,
  lifePathValue: number,
): Pinnacle[] {
  const m = reduce(month)
  const d = reduce(day)
  const y = reduce(digitSum(year))

  const first = reduce(m + d)
  const second = reduce(d + y)
  const third = reduce(first + second)
  const fourth = reduce(m + y)

  // Timing: reduce master LP to single digit
  const lp = lifePathValue > 9 ? reduceStrict(lifePathValue) : lifePathValue
  const firstEnd = 36 - lp

  const numbers = [first, second, third, fourth]
  const positions: Pinnacle['position'][] = ['first', 'second', 'third', 'fourth']
  const labels = ['Đỉnh cao 1', 'Đỉnh cao 2', 'Đỉnh cao 3', 'Đỉnh cao 4']

  const ranges: { start: number; end: number | null }[] = [
    { start: 0, end: firstEnd },
    { start: firstEnd + 1, end: firstEnd + 9 },
    { start: firstEnd + 10, end: firstEnd + 18 },
    { start: firstEnd + 19, end: null },
  ]

  return numbers.map((num, i) => ({
    number: num,
    position: positions[i],
    label: labels[i],
    startAge: ranges[i].start,
    endAge: ranges[i].end,
    isCurrent: false, // set by orchestrator
    isMaster: MASTER_NUMBERS.has(num),
    description: NUMBER_MEANINGS[num]?.asPinnacle ?? '',
  }))
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/lib/numerology/numerology.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/numerology/cycles.ts src/lib/numerology/challenges.ts src/lib/numerology/pinnacles.ts src/lib/numerology/numerology.test.ts
git commit -m "feat(numerology): add cycles, challenges, and pinnacles calculations"
```

---

## Task 6: Orchestrator (index.ts)

**Files:**
- Create: `src/lib/numerology/index.ts`
- Modify: `src/lib/numerology/numerology.test.ts`

- [ ] **Step 1: Add integration test**

```typescript
import { computeNumerology } from './index'

describe('computeNumerology (integration)', () => {
  it('computes full result for Dec 14, 1992, Nguyen Van Anh', () => {
    const result = computeNumerology({
      fullName: 'Nguyễn Văn Anh',
      birthYear: 1992,
      birthMonth: 12,
      birthDay: 14,
    })

    expect(result.lifePath.value).toBe(11)
    expect(result.birthday.value).toBe(5)
    expect(result.nameBreakdown).toHaveLength(3)
    expect(result.challenges).toHaveLength(4)
    expect(result.pinnacles).toHaveLength(4)
    expect(result.cycles.personalYear).toBeGreaterThan(0)
  })

  it('includes name breakdown with letter details', () => {
    const result = computeNumerology({
      fullName: 'John Smith',
      birthYear: 1990,
      birthMonth: 1,
      birthDay: 1,
    })

    expect(result.nameBreakdown[0].name).toBe('John')
    expect(result.nameBreakdown[0].letters).toHaveLength(4)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/numerology/numerology.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement index.ts**

```typescript
// src/lib/numerology/index.ts
import { computeLifePath } from './life-path'
import { computeBirthday } from './birthday'
import { computeExpression, computeSoulUrge, computePersonality, getNameBreakdown } from './name-numbers'
import { computeMaturity } from './maturity'
import { computePersonalYear, computePersonalMonth, computePersonalDay } from './cycles'
import { computeChallenges } from './challenges'
import { computePinnacles } from './pinnacles'
import { NUMBER_MEANINGS } from './constants'
import type { NumerologyInput, NumerologyResult } from './types'

export type * from './types'
export { NUMBER_MEANINGS, MASTER_NUMBERS, LETTER_VALUES } from './constants'

export function computeNumerology(input: NumerologyInput): NumerologyResult {
  const { fullName, birthYear, birthMonth, birthDay } = input

  // Core numbers
  const lifePath = computeLifePath(birthMonth, birthDay, birthYear)
  const birthday = computeBirthday(birthDay)
  const expression = computeExpression(fullName)
  const soulUrge = computeSoulUrge(fullName)
  const personality = computePersonality(fullName)
  const maturity = computeMaturity(lifePath.value, expression.value)

  // Name breakdown
  const nameBreakdown = getNameBreakdown(fullName)

  // Cycles (for today)
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const currentDay = now.getDate()

  const personalYear = computePersonalYear(birthMonth, birthDay, currentYear)
  const personalMonth = computePersonalMonth(personalYear, currentMonth)
  const personalDay = computePersonalDay(personalMonth, currentDay)

  const yearMeaning = NUMBER_MEANINGS[personalYear]
  const monthMeaning = NUMBER_MEANINGS[personalMonth]
  const dayMeaning = NUMBER_MEANINGS[personalDay]

  // Challenges & Pinnacles
  const currentAge = currentYear - birthYear
  const challenges = computeChallenges(birthMonth, birthDay, birthYear, lifePath.value)
  const pinnacles = computePinnacles(birthMonth, birthDay, birthYear, lifePath.value)

  // Set isCurrent flags
  for (const c of challenges) {
    c.isCurrent = currentAge >= c.startAge && (c.endAge === null || currentAge <= c.endAge)
  }
  for (const p of pinnacles) {
    p.isCurrent = currentAge >= p.startAge && (p.endAge === null || currentAge <= p.endAge)
  }

  return {
    input,
    nameBreakdown,
    lifePath,
    birthday,
    expression,
    soulUrge,
    personality,
    maturity,
    cycles: {
      personalYear,
      personalMonth,
      personalDay,
      currentDate: now.toISOString().split('T')[0],
      yearMeaning: yearMeaning?.asPersonalYear ?? '',
      monthMeaning: monthMeaning?.asPersonalYear ?? '', // reuse year meanings for now
      dayMeaning: dayMeaning?.asPersonalYear ?? '',
    },
    challenges,
    pinnacles,
  }
}
```

- [ ] **Step 4: Run all numerology tests**

Run: `npx vitest run src/lib/numerology/`
Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/numerology/index.ts src/lib/numerology/numerology.test.ts
git commit -m "feat(numerology): add orchestrator with full integration test"
```

---

## Task 7: Database Models

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `src/lib/shared/auto-profile.ts`

- [ ] **Step 1: Add models to schema.prisma**

Add after existing models in `prisma/schema.prisma`:

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

model NumerologyClient {
  id             String   @id @default(cuid())
  fullName       String
  birthYear      Int
  birthMonth     Int
  birthDay       Int
  lifePathNumber Int
  chartSummary   String
  fullChart      String   // JSON NumerologyResult
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  clientProfile  ClientProfile?

  @@index([fullName])
}
```

Add to `User` model:

```prisma
  numerologyReadings  NumerologyReading[]
```

Add to `ClientProfile` model:

```prisma
  numerologyClientId  String?              @unique
  numerologyClient    NumerologyClient?    @relation(fields: [numerologyClientId], references: [id])
```

- [ ] **Step 2: Update auto-profile.ts**

In `src/lib/shared/auto-profile.ts`:

1. Change `SystemType` to include `'numerology'`
2. Make `gender` optional in `ClientMatch`
3. Add numerology matching branch
4. Add numerology link field

The key changes:
- `type SystemType = 'bazi' | 'tuvi' | 'hd' | 'numerology'`
- `gender?: string` in `ClientMatch` (make optional)
- Skip gender-based matching when gender is undefined
- Add `numerologyClient` to the OR clause matching by `fullName`+birth date
- Map `'numerology'` → `'numerologyClientId'`

- [ ] **Step 3: Run migration**

```bash
npx prisma migrate dev --name add-numerology-models
```

- [ ] **Step 4: Verify Prisma client generation**

```bash
npx prisma generate
```

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/ src/lib/shared/auto-profile.ts
git commit -m "feat(numerology): add database models and update auto-profile"
```

---

## Task 8: API Routes

**Files:**
- Create: `src/app/api/numerology/calculate/route.ts`
- Create: `src/app/api/numerology/readings/route.ts`
- Create: `src/app/api/numerology/readings/[id]/route.ts`
- Create: `src/app/api/numerology/clients/route.ts`
- Create: `src/app/api/numerology/clients/[id]/route.ts`

- [ ] **Step 1: Create calculate route**

```typescript
// src/app/api/numerology/calculate/route.ts
import { NextResponse } from 'next/server'
import { computeNumerology } from '@/lib/numerology'
import type { NumerologyInput } from '@/lib/numerology'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, birthYear, birthMonth, birthDay } = body

    if (!fullName || !birthYear || !birthMonth || !birthDay) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, birthYear, birthMonth, birthDay' },
        { status: 400 },
      )
    }

    const input: NumerologyInput = {
      fullName: String(fullName).trim(),
      birthYear: Number(birthYear),
      birthMonth: Number(birthMonth),
      birthDay: Number(birthDay),
    }

    const result = computeNumerology(input)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Numerology calculation error:', error)
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create readings routes**

Follow the exact same pattern as `src/app/api/bazi/readings/route.ts` and `src/app/api/bazi/readings/[id]/route.ts`, but use `NumerologyReading` model with `fullName` instead of `name`+`gender`, and no hour/minute fields.

```typescript
// src/app/api/numerology/readings/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { fullName, birthYear, birthMonth, birthDay, result } = body

    const slug = `${fullName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`

    const reading = await prisma.numerologyReading.create({
      data: {
        userId: session.user.id,
        fullName,
        birthYear: Number(birthYear),
        birthMonth: Number(birthMonth),
        birthDay: Number(birthDay),
        result: JSON.stringify(result),
        slug,
      },
    })

    return NextResponse.json({ id: reading.id, slug })
  } catch (error) {
    console.error('Save numerology reading error:', error)
    return NextResponse.json({ error: 'Failed to save reading' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const readings = await prisma.numerologyReading.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        birthYear: true,
        birthMonth: true,
        birthDay: true,
        slug: true,
        isPublic: true,
        createdAt: true,
      },
    })
    return NextResponse.json(readings)
  } catch (error) {
    console.error('List numerology readings error:', error)
    return NextResponse.json({ error: 'Failed to list readings' }, { status: 500 })
  }
}
```

```typescript
// src/app/api/numerology/readings/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const reading = await prisma.numerologyReading.findUnique({ where: { id } })
    if (!reading) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ ...reading, result: JSON.parse(reading.result) })
  } catch (error) {
    console.error('Get numerology reading error:', error)
    return NextResponse.json({ error: 'Failed to get reading' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { fullName } = await request.json()
    const updated = await prisma.numerologyReading.update({
      where: { id },
      data: { fullName },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update numerology reading error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.numerologyReading.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete numerology reading error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Create clients routes**

```typescript
// src/app/api/numerology/clients/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeNumerology } from '@/lib/numerology'
import { findOrCreateProfile } from '@/lib/shared/auto-profile'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, birthYear, birthMonth, birthDay } = body

    const result = await prisma.$transaction(async (tx) => {
      const numerologyResult = computeNumerology({
        fullName,
        birthYear: Number(birthYear),
        birthMonth: Number(birthMonth),
        birthDay: Number(birthDay),
      })

      const chartSummary = `Life Path ${numerologyResult.lifePath.value} | Expression ${numerologyResult.expression.value} | Soul Urge ${numerologyResult.soulUrge.value}`

      const client = await tx.numerologyClient.create({
        data: {
          fullName,
          birthYear: Number(birthYear),
          birthMonth: Number(birthMonth),
          birthDay: Number(birthDay),
          lifePathNumber: numerologyResult.lifePath.value,
          chartSummary,
          fullChart: JSON.stringify(numerologyResult),
        },
      })

      const profileId = await findOrCreateProfile(tx, 'numerology', client.id, {
        name: fullName,
        birthYear: Number(birthYear),
        birthMonth: Number(birthMonth),
        birthDay: Number(birthDay),
      })

      return { id: client.id, profileId, lifePathNumber: numerologyResult.lifePath.value, chartSummary }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Save numerology client error:', error)
    return NextResponse.json({ error: 'Failed to save client' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    const clients = await prisma.numerologyClient.findMany({
      where: q ? { fullName: { contains: q } } : undefined,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        birthYear: true,
        birthMonth: true,
        birthDay: true,
        lifePathNumber: true,
        chartSummary: true,
        createdAt: true,
      },
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('List numerology clients error:', error)
    return NextResponse.json({ error: 'Failed to list clients' }, { status: 500 })
  }
}
```

```typescript
// src/app/api/numerology/clients/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await prisma.numerologyClient.findUnique({ where: { id } })
    if (!client) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ ...client, fullChart: JSON.parse(client.fullChart) })
  } catch (error) {
    console.error('Get numerology client error:', error)
    return NextResponse.json({ error: 'Failed to get client' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/numerology/
git commit -m "feat(numerology): add API routes for calculate, readings, and clients"
```

---

## Task 9: UI Components

**Files:**
- Create: `src/components/numerology/NumberBadge.tsx`
- Create: `src/components/numerology/NumberCard.tsx`
- Create: `src/components/numerology/CoreNumbersPanel.tsx`
- Create: `src/components/numerology/NameBreakdown.tsx`
- Create: `src/components/numerology/CyclesPanel.tsx`
- Create: `src/components/numerology/ChallengesPanel.tsx`
- Create: `src/components/numerology/PinnaclesPanel.tsx`

- [ ] **Step 1: Create NumberBadge**

A styled badge that renders a number with special styling for master numbers (11, 22, 33). Use existing Tailwind patterns from the codebase.

- Master numbers: gold/amber background with ring
- Regular numbers: muted background

- [ ] **Step 2: Create NumberCard**

A card component displaying one core number:
- NumberBadge (large, centered)
- Vietnamese name + English name
- Description text
- Optional expandable detail (for calculation steps)

- [ ] **Step 3: Create CoreNumbersPanel**

Grid of 6 NumberCards (Life Path, Birthday, Expression, Soul Urge, Personality, Maturity). Use `grid-cols-2 md:grid-cols-3` layout.

- [ ] **Step 4: Create NameBreakdown**

Visual letter grid:
- Each letter displayed in a small box
- Pythagorean value below each letter
- Vowels in one color (e.g., blue), consonants in another (e.g., slate)
- Name parts separated visually
- Show subtotal → reduced value per part
- Show final total → reduced value

- [ ] **Step 5: Create CyclesPanel**

Display Personal Year/Month/Day:
- 3 NumberBadges in a row
- Labels: "Năm Cá Nhân", "Tháng Cá Nhân", "Ngày Cá Nhân"
- Current date shown
- Meaning text below each

- [ ] **Step 6: Create ChallengesPanel**

Horizontal timeline with 4 segments:
- Each segment shows challenge number, age range, and description
- Current challenge highlighted with ring/border
- Third challenge (main) visually distinct (spans width of first two)

- [ ] **Step 7: Create PinnaclesPanel**

Same timeline layout as ChallengesPanel:
- 4 segments with pinnacle number, age range
- Current pinnacle highlighted
- Master numbers get gold styling via NumberBadge

- [ ] **Step 8: Commit**

```bash
git add src/components/numerology/
git commit -m "feat(numerology): add UI components"
```

---

## Task 10: Pages and Navigation

**Files:**
- Create: `src/app/numerology/page.tsx`
- Create: `src/app/numerology/[id]/page.tsx`
- Create: `src/app/numerology/clients/page.tsx`
- Modify: `src/components/app-nav.tsx`

- [ ] **Step 1: Create main numerology page**

Follow `src/app/bazi/page.tsx` pattern exactly:
- Suspense wrapper
- `useSearchParams` for auto-loading from URL (`?name=X&y=YYYY&m=MM&d=DD`)
- Left sidebar: form (fullName, birthYear, birthMonth, birthDay) — use a simpler form since no gender/hour/minute needed
- Right content: tabbed results
- Tab names: "Con Số Chủ Đạo", "Chu Kỳ", "Thử Thách", "Đỉnh Cao"
- Save Reading / Save Client buttons
- Dynamic imports for result panels
- Form collapses after calculation

Key difference from bazi: simpler form (no gender, no hour/minute, no birthplace). Just fullName + date fields.

- [ ] **Step 2: Create reading view page**

`src/app/numerology/[id]/page.tsx` — fetch reading from API, display same panels. Read-only.

- [ ] **Step 3: Create clients page**

`src/app/numerology/clients/page.tsx` — list clients with search, click to load chart. Follow `src/app/bazi/clients/page.tsx` pattern.

- [ ] **Step 4: Add navigation link**

In `src/components/app-nav.tsx`, add a "Thần Số" link pointing to `/numerology`. Place it after "Bát Tự":

```tsx
<NavigationMenuItem>
  <NavigationMenuLink
    render={<Link href="/numerology" />}
    className={navigationMenuTriggerStyle()}
  >
    Thần Số
  </NavigationMenuLink>
</NavigationMenuItem>
```

- [ ] **Step 5: Commit**

```bash
git add src/app/numerology/ src/components/app-nav.tsx
git commit -m "feat(numerology): add pages and navigation"
```

---

## Task 11: Manual Smoke Test

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test calculator**

1. Navigate to `/numerology`
2. Enter name "Nguyễn Văn Anh", DOB Dec 14, 1992
3. Verify Life Path = 11 (master), Birthday = 5
4. Check all 4 tabs render correctly
5. Verify name breakdown shows correct vowel/consonant classification

- [ ] **Step 3: Test save flows**

1. Save as client → verify appears in `/numerology/clients`
2. Click client → verify chart reloads
3. Save as reading (if logged in) → verify in `/numerology/[id]`

- [ ] **Step 4: Test share URL**

1. Copy share link
2. Open in new tab
3. Verify auto-loads with correct data

- [ ] **Step 5: Test Vietnamese names with diacritics**

Enter "Trần Phước Thịnh" and verify diacritics are stripped correctly in name breakdown.

- [ ] **Step 6: Commit any fixes**

```bash
git add -A
git commit -m "fix(numerology): smoke test fixes"
```
