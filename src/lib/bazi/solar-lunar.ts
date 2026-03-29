/**
 * Solar-Lunar Calendar Conversion
 *
 * Based on standard lunar calendar algorithms using lookup tables
 * for years 1900–2100. Also computes the 24 Solar Terms (Tiết Khí)
 * needed to determine month/year pillar boundaries.
 */

// ===== Lunar Calendar Lookup Table =====
// Each entry encodes lunar month lengths and leap month for a year.
// Format: 16-bit hex where bits 0-11 indicate month lengths (0=29d,1=30d),
// bits 12-15 indicate leap month (0=no leap). Last 4 bits = leap month index.
// Sourced from standard Chinese calendar data (1900-2100).
const LUNAR_INFO = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
  0x092e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a4d0,0x0d150,0x0f252,
  0x0d520,
]

const LUNAR_BASE_YEAR = 1900
// Jan 31, 1900 was the start of the first lunar month of year 1900

/**
 * Get number of days in a lunar year
 */
function lunarYearDays(y: number): number {
  let sum = 348
  const info = LUNAR_INFO[y - LUNAR_BASE_YEAR]
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (info & i) ? 1 : 0
  }
  return sum + leapMonthDays(y)
}

/**
 * Get leap month number (0 = no leap month)
 */
function leapMonth(y: number): number {
  return LUNAR_INFO[y - LUNAR_BASE_YEAR] & 0xf
}

/**
 * Get days in leap month (0 if no leap)
 */
function leapMonthDays(y: number): number {
  if (leapMonth(y) === 0) return 0
  return (LUNAR_INFO[y - LUNAR_BASE_YEAR] & 0x10000) ? 30 : 29
}

/**
 * Get days in a lunar month (1-indexed)
 */
function lunarMonthDays(y: number, m: number): number {
  return (LUNAR_INFO[y - LUNAR_BASE_YEAR] & (0x10000 >> m)) ? 30 : 29
}

/**
 * Convert solar date to lunar date
 */
export function solarToLunar(year: number, month: number, day: number): {
  lunarYear: number
  lunarMonth: number
  lunarDay: number
  isLeapMonth: boolean
} {
  // Base date: Jan 31 1900 = lunar 1/1/1900
  const baseDate = new Date(1900, 0, 31) // months are 0-indexed in JS
  const targetDate = new Date(year, month - 1, day)
  let offset = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000)

  let lunarYear = LUNAR_BASE_YEAR
  let temp = 0

  // Find lunar year
  for (let y = LUNAR_BASE_YEAR; y < 2101; y++) {
    temp = lunarYearDays(y)
    if (offset < temp) {
      lunarYear = y
      break
    }
    offset -= temp
  }

  // Find lunar month
  let lunarMonth = 1
  let isLeapMonth = false
  const leap = leapMonth(lunarYear)

  for (let m = 1; m <= 12; m++) {
    // Regular month
    let days: number
    if (leap > 0 && m === leap + 1 && !isLeapMonth) {
      // Check leap month first
      days = leapMonthDays(lunarYear)
      isLeapMonth = true
      m-- // re-check this month index after leap
    } else {
      days = lunarMonthDays(lunarYear, m)
      isLeapMonth = false
    }

    if (offset < days) {
      lunarMonth = m
      break
    }
    offset -= days
    lunarMonth = m
  }

  const lunarDay = offset + 1

  return { lunarYear, lunarMonth, lunarDay, isLeapMonth }
}

// ===== Solar Term Calculations =====
// Approximate dates for solar terms using the sun's ecliptic longitude
// Each term is 15° apart, starting from 315° (Lập Xuân ≈ Feb 4)

// More accurate: use a small perturbation formula
// For simplicity, use a lookup-based approach with average dates

/**
 * Calculate approximate Julian Day Number for a solar term
 * termIndex: 0=Tiểu Hàn, 1=Đại Hàn, 2=Lập Xuân, ...23=Đông Chí
 * year: Gregorian year
 */
function solarTermJD(year: number, termIndex: number): number {
  // Use the VSOP87 simplified formula
  const y = year + (termIndex * 15 + 285) / 360
  const jd = 2451259.428 + 365.2422 * (y - 2000)

  // Apply perturbation corrections
  const T = (y - 2000) / 100
  const L = 279.9348 + 360.00769 * (y - 2000)
  const radian = Math.PI / 180
  const correction =
    -0.0001 +
    0.16 * Math.sin((L + 109) * radian) +
    -0.01 * Math.sin(2 * L * radian)

  return jd + correction
}

/**
 * Convert Julian Day Number to Gregorian date
 */
function jdToGregorian(jd: number): { year: number; month: number; day: number } {
  const z = Math.floor(jd + 0.5)
  const a = Math.floor((z - 1867216.25) / 36524.25)
  const A = z + 1 + a - Math.floor(a / 4)
  const B = A + 1524
  const C = Math.floor((B - 122.1) / 365.25)
  const D = Math.floor(365.25 * C)
  const E = Math.floor((B - D) / 30.6001)

  const day = B - D - Math.floor(30.6001 * E)
  const month = E < 14 ? E - 1 : E - 13
  const year = month > 2 ? C - 4716 : C - 4715

  return { year, month, day }
}

/**
 * Get all 24 solar term dates for a year
 * Returns array of {month, day} for terms starting from Tiểu Hàn
 */
export function getSolarTermDates(year: number): { month: number; day: number }[] {
  const terms: { month: number; day: number }[] = []

  // Terms 0-1 (Tiểu Hàn, Đại Hàn) belong to previous year's cycle
  // but calendar year = this year
  for (let i = 0; i < 24; i++) {
    // Adjust: terms 0-5 use the current year,
    // terms 6-23 also current year
    const jd = solarTermJD(year, i)
    const { month, day } = jdToGregorian(jd)
    terms.push({ month, day })
  }

  return terms
}

/**
 * Get the Jie Qi (major solar term) index for a given date
 * Returns the month index in the Bazi system (0=Dần month, starting from Lập Xuân)
 * The month boundary terms are at indices 2,4,6,8,10,12,14,16,18,20,22,0
 * in the 24 solar terms array.
 */
export function getBaziMonth(year: number, month: number, day: number): {
  monthIndex: number // 0-11 where 0=Dần month
  solarTermName: string
} {
  // Get solar terms for this year and previous year (for Tiểu Hàn crossover)
  const terms = getSolarTermDates(year)
  const prevTerms = getSolarTermDates(year - 1)

  // Major solar terms that start each Bazi month (Jie, 節)
  // Index in the 24-term array: 2=Lập Xuân, 4=Kinh Trập, 6=Thanh Minh, ...
  // Bazi months: Dần(2)=Lập Xuân, Mão(3)=Kinh Trập, ..., Sửu(1)=Tiểu Hàn

  // Check which Bazi month the date falls in
  // Start from Tiểu Hàn of current year backwards

  // Build ordered list of month-start dates
  interface MonthStart {
    year: number
    month: number
    day: number
    baziMonth: number
    termName: string
  }

  const monthStarts: MonthStart[] = []

  // Previous year's Đại Tuyết (term index 22) - month 11 (Tý)
  monthStarts.push({ year: year - 1, ...prevTerms[22], baziMonth: 10, termName: 'Đại Tuyết' })
  // Previous year's Tiểu Hàn (term index 0 of current year is this year's)
  // Actually Tiểu Hàn is term 0, belongs to early January
  monthStarts.push({ year, ...terms[0], baziMonth: 11, termName: 'Tiểu Hàn' })
  // Lập Xuân (term 2) - month 1 (Dần)
  monthStarts.push({ year, ...terms[2], baziMonth: 0, termName: 'Lập Xuân' })
  // Kinh Trập (term 4) - month 2 (Mão)
  monthStarts.push({ year, ...terms[4], baziMonth: 1, termName: 'Kinh Trập' })
  // Thanh Minh (term 6)
  monthStarts.push({ year, ...terms[6], baziMonth: 2, termName: 'Thanh Minh' })
  // Lập Hạ (term 8)
  monthStarts.push({ year, ...terms[8], baziMonth: 3, termName: 'Lập Hạ' })
  // Mang Chủng (term 10)
  monthStarts.push({ year, ...terms[10], baziMonth: 4, termName: 'Mang Chủng' })
  // Tiểu Thử (term 12)
  monthStarts.push({ year, ...terms[12], baziMonth: 5, termName: 'Tiểu Thử' })
  // Lập Thu (term 14)
  monthStarts.push({ year, ...terms[14], baziMonth: 6, termName: 'Lập Thu' })
  // Bạch Lộ (term 16)
  monthStarts.push({ year, ...terms[16], baziMonth: 7, termName: 'Bạch Lộ' })
  // Hàn Lộ (term 18)
  monthStarts.push({ year, ...terms[18], baziMonth: 8, termName: 'Hàn Lộ' })
  // Lập Đông (term 20)
  monthStarts.push({ year, ...terms[20], baziMonth: 9, termName: 'Lập Đông' })
  // Đại Tuyết (term 22)
  monthStarts.push({ year, ...terms[22], baziMonth: 10, termName: 'Đại Tuyết' })

  // Find which period the date falls into
  const dateNum = month * 100 + day

  for (let i = monthStarts.length - 1; i >= 0; i--) {
    const ms = monthStarts[i]
    if (ms.year === year) {
      const msNum = ms.month * 100 + ms.day
      if (dateNum >= msNum) {
        return { monthIndex: ms.baziMonth, solarTermName: ms.termName }
      }
    } else if (ms.year === year - 1) {
      // Previous year term — date is before Tiểu Hàn
      return { monthIndex: ms.baziMonth, solarTermName: ms.termName }
    }
  }

  // Default: before Tiểu Hàn means still in previous year's Đại Tuyết month
  return { monthIndex: 10, solarTermName: 'Đại Tuyết' }
}

/**
 * Check if a date is before Lập Xuân (Start of Spring)
 * If so, the Bazi year is the previous year
 */
export function getBaziYear(year: number, month: number, day: number): number {
  const terms = getSolarTermDates(year)
  const lapXuan = terms[2] // Lập Xuân is term index 2

  const dateNum = month * 100 + day
  const lapXuanNum = lapXuan.month * 100 + lapXuan.day

  return dateNum < lapXuanNum ? year - 1 : year
}

/**
 * Get Nong Lich (agricultural calendar) info for a date
 */
export function getNongLichInfo(year: number, month: number, day: number): {
  termName: string
  monthName: string
} {
  const terms = getSolarTermDates(year)
  const dateNum = month * 100 + day

  // Find the most recent solar term
  let lastTermIdx = 0
  for (let i = 23; i >= 0; i--) {
    const termNum = terms[i].month * 100 + terms[i].day
    if (dateNum >= termNum) {
      lastTermIdx = i
      break
    }
  }

  const SOLAR_TERM_NAMES = [
    'Tiểu Hàn', 'Đại Hàn', 'Lập Xuân', 'Vũ Thủy',
    'Kinh Trập', 'Xuân Phân', 'Thanh Minh', 'Cốc Vũ',
    'Lập Hạ', 'Tiểu Mãn', 'Mang Chủng', 'Hạ Chí',
    'Tiểu Thử', 'Đại Thử', 'Lập Thu', 'Xử Thử',
    'Bạch Lộ', 'Thu Phân', 'Hàn Lộ', 'Sương Giáng',
    'Lập Đông', 'Tiểu Tuyết', 'Đại Tuyết', 'Đông Chí',
  ]

  // Nong lich month names correspond to solar term pairs
  const NONG_LICH_MONTHS = [
    'Tháng Chạp', 'Tháng Chạp',   // Tiểu Hàn, Đại Hàn
    'Tháng Giêng', 'Tháng Giêng', // Lập Xuân, Vũ Thủy
    'Tháng Hai', 'Tháng Hai',     // Kinh Trập, Xuân Phân
    'Tháng Ba', 'Tháng Ba',       // Thanh Minh, Cốc Vũ
    'Tháng Tư', 'Tháng Tư',       // Lập Hạ, Tiểu Mãn
    'Tháng Năm', 'Tháng Năm',     // Mang Chủng, Hạ Chí
    'Tháng Sáu', 'Tháng Sáu',     // Tiểu Thử, Đại Thử
    'Tháng Bảy', 'Tháng Bảy',     // Lập Thu, Xử Thử
    'Tháng Tám', 'Tháng Tám',     // Bạch Lộ, Thu Phân
    'Tháng Chín', 'Tháng Chín',   // Hàn Lộ, Sương Giáng
    'Tháng Mười', 'Tháng Mười',   // Lập Đông, Tiểu Tuyết
    'Tháng M.Một', 'Tháng M.Một', // Đại Tuyết, Đông Chí
  ]

  return {
    termName: SOLAR_TERM_NAMES[lastTermIdx],
    monthName: NONG_LICH_MONTHS[lastTermIdx],
  }
}
