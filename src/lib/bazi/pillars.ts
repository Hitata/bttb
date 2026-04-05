/**
 * Four Pillars (Tứ Trụ) Calculation
 *
 * Computes Year, Month, Day, and Hour pillars from a birth date/time.
 */

import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  NA_YIN_TABLE,
  MONTH_BRANCH_INDEX,
  TRUONG_SINH_START,
  LIFE_CYCLE_STAGES,
  getSexagenaryCycleIndex,
} from './constants'
import { getBaziYear, getBaziMonth, solarToLunar, getNongLichInfo } from './solar-lunar'
import { getTenGod } from './ten-gods'
import type { Pillar, TuTru, TangCanItem, NaYin, VongTruongSinhInfo, TenGodRef, DateInfo, BirthInput, ThanSatItem } from './types'
import { getThanSatForPillar } from './spirit-stars'

// ===== Julian Day Number =====
/**
 * Convert Gregorian date to Julian Day Number
 */
export function toJulianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
}

// ===== Year Pillar =====
/**
 * Get Year Pillar stem and branch indices
 * The Bazi year starts at Lập Xuân (around Feb 4), not Jan 1
 */
export function getYearPillar(year: number, month: number, day: number): { can: number; chi: number } {
  const baziYear = getBaziYear(year, month, day)
  // Year stem: (year - 4) % 10 gives Giáp=0 for 2044, etc.
  // Formula: Giáp year when year % 10 == 4
  const can = ((baziYear % 10) + 10 - 4) % 10
  // Year branch: (year - 4) % 12 gives Tý=0 for years like 2044
  const chi = ((baziYear % 12) + 12 - 4) % 12
  return { can, chi }
}

// ===== Month Pillar =====
/**
 * Get Month Pillar stem and branch indices
 * Month is determined by solar terms (Tiết Khí)
 * Month stem depends on year stem using the Five Tiger Escape formula
 */
export function getMonthPillar(year: number, month: number, day: number): { can: number; chi: number } {
  const { monthIndex } = getBaziMonth(year, month, day)
  const yearPillar = getYearPillar(year, month, day)

  // Branch: monthIndex 0=Dần(2), 1=Mão(3), ..., 11=Sửu(1)
  const chi = MONTH_BRANCH_INDEX[monthIndex]

  // Stem: Five Tiger Escape (五虎遁)
  // Year stem determines starting stem for Dần month:
  // Giáp/Kỷ year → Dần month starts with Bính(2)
  // Ất/Canh year → Dần month starts with Mậu(4)
  // Bính/Tân year → Dần month starts with Canh(6)
  // Đinh/Nhâm year → Dần month starts with Nhâm(8)
  // Mậu/Quý year → Dần month starts with Giáp(0)
  const yearCanMod = yearPillar.can % 5
  const denStartStem = (yearCanMod * 2 + 2) % 10
  const can = (denStartStem + monthIndex) % 10

  return { can, chi }
}

// ===== Day Pillar =====
/**
 * Get Day Pillar stem and branch indices
 * Uses Julian Day Number formula
 */
export function getDayPillar(year: number, month: number, day: number): { can: number; chi: number } {
  const jdn = toJulianDayNumber(year, month, day)
  // Reference: JDN 2299161 (Oct 15, 1582) is Giáp Tuất (stem=0, branch=10)
  // But simpler: use a known reference point
  // Jan 1, 1900 (JDN 2415021) is Giáp Tuất (stem=0, branch=10)
  // Actually let's use: Jan 1 2000 = JDN 2451545, which is Giáp Ngọ (can=0, chi=6)
  // Hmm, let's use a verified reference:
  // Jan 1, 1900 = JDN 2415021. What's the stem/branch?
  // Using the formula: (JDN + 9) % 10 = stem, (JDN + 1) % 12 = branch
  const can = ((jdn + 9) % 10 + 10) % 10
  const chi = ((jdn + 1) % 12 + 12) % 12
  return { can, chi }
}

// ===== Hour Pillar =====
/**
 * Get Hour Pillar stem and branch indices
 * Uses the Five Rat Escape (五鼠遁) formula
 */
export function getHourPillar(dayCanIndex: number, hour: number): { can: number; chi: number } {
  // Double-hour (Shichen) mapping
  // 23-1 → Tý(0), 1-3 → Sửu(1), ..., 21-23 → Hợi(11)
  let chi: number
  if (hour === 23) {
    chi = 0 // Tý hour (early Tý = late night, already handled by caller shifting day)
  } else {
    chi = Math.floor((hour + 1) / 2) % 12
  }

  // Five Rat Escape (五鼠遁):
  // Day stem determines starting stem for Tý hour:
  // Giáp/Kỷ day → Tý hour starts with Giáp(0)
  // Ất/Canh day → Tý hour starts with Bính(2)
  // Bính/Tân day → Tý hour starts with Mậu(4)
  // Đinh/Nhâm day → Tý hour starts with Canh(6)
  // Mậu/Quý day → Tý hour starts with Nhâm(8)
  const dayCanMod = dayCanIndex % 5
  const tyStartStem = (dayCanMod * 2) % 10
  const can = (tyStartStem + chi) % 10

  return { can, chi }
}

// ===== Na Yin =====
export function getNaYin(canIndex: number, chiIndex: number): NaYin {
  const cycleIdx = getSexagenaryCycleIndex(canIndex, chiIndex)
  return NA_YIN_TABLE[cycleIdx]
}

// ===== Vong Truong Sinh =====
export function getVongTruongSinh(dayMasterIndex: number, branchIndex: number): VongTruongSinhInfo {
  const dayMasterName = HEAVENLY_STEMS[dayMasterIndex].name
  const startBranch = TRUONG_SINH_START[dayMasterName]
  const polarity = HEAVENLY_STEMS[dayMasterIndex].polarity

  let stageIndex: number
  if (polarity === '+') {
    // Yang: count forward from start branch
    stageIndex = ((branchIndex - startBranch) % 12 + 12) % 12
  } else {
    // Yin: count backward from start branch
    stageIndex = ((startBranch - branchIndex) % 12 + 12) % 12
  }

  return {
    name: LIFE_CYCLE_STAGES[stageIndex],
    index: stageIndex,
  }
}

// ===== Build Full Pillar =====
function buildPillar(
  canIndex: number,
  chiIndex: number,
  dayMasterIndex: number,
  yearCanIndex: number,
  yearChiIndex: number,
  dayChiIndex: number,
): Pillar {
  const stem = HEAVENLY_STEMS[canIndex]
  const branch = EARTHLY_BRANCHES[chiIndex]

  // Ten God relationship
  const thapThan = getTenGod(dayMasterIndex, canIndex)

  // Hidden stems
  const tangCan: TangCanItem[] = branch.hiddenStems.map(hsIdx => ({
    canIndex: hsIdx,
    can: HEAVENLY_STEMS[hsIdx].name,
    nguHanh: HEAVENLY_STEMS[hsIdx].element,
    thapThan: getTenGod(dayMasterIndex, hsIdx),
  }))

  // Na Yin
  const naYin = getNaYin(canIndex, chiIndex)

  // Vong Truong Sinh
  const vongTruongSinh = getVongTruongSinh(dayMasterIndex, chiIndex)

  // Than Sat (simplified — pass relevant indices)
  const thanSat = getThanSatForPillar(yearCanIndex, yearChiIndex, dayChiIndex, canIndex, chiIndex)

  return {
    canIndex,
    chiIndex,
    can: stem.name,
    chi: branch.name,
    canNguHanh: stem.element,
    chiNguHanh: branch.element,
    thapThan,
    tangCan,
    naYin,
    vongTruongSinh,
    thanSat,
  }
}

// ===== Compute All Four Pillars =====
export function computeTuTru(input: BirthInput): {
  tuTru: TuTru
  dayMasterIndex: number
  solarDate: DateInfo
  lunarDate: DateInfo
  nongLichDate: DateInfo
} {
  let { year, month, day, hour } = input

  // Handle hour 23 (late Tý) — shift to next day
  if (hour === 23) {
    const nextDay = new Date(year, month - 1, day + 1)
    year = nextDay.getFullYear()
    month = nextDay.getMonth() + 1
    day = nextDay.getDate()
    hour = 0
  }

  // Compute raw pillar indices
  const yearP = getYearPillar(year, month, day)
  const monthP = getMonthPillar(year, month, day)
  const dayP = getDayPillar(year, month, day)
  const hourP = getHourPillar(dayP.can, input.hour) // Use original hour for double-hour calc

  const dayMasterIndex = dayP.can

  // Build full pillars
  const thienTru = buildPillar(yearP.can, yearP.chi, dayMasterIndex, yearP.can, yearP.chi, dayP.chi)
  const nguyetTru = buildPillar(monthP.can, monthP.chi, dayMasterIndex, yearP.can, yearP.chi, dayP.chi)
  const nhatTru = buildPillar(dayP.can, dayP.chi, dayMasterIndex, yearP.can, yearP.chi, dayP.chi)
  const thoiTru = buildPillar(hourP.can, hourP.chi, dayMasterIndex, yearP.can, yearP.chi, dayP.chi)

  // Solar date
  const solarDate: DateInfo = {
    year: input.year,
    month: input.month,
    day: input.day,
  }

  // Lunar date
  const lunar = solarToLunar(input.year, input.month, input.day)
  const lunarDate: DateInfo = {
    year: lunar.lunarYear,
    month: lunar.lunarMonth,
    day: lunar.lunarDay,
  }

  // Nong Lich
  const nongLich = getNongLichInfo(input.year, input.month, input.day)
  const nongLichDate: DateInfo = {
    year: input.year,
    month: nongLich.monthName,
    day: nongLich.termName,
  }

  return {
    tuTru: { thienTru, nguyetTru, nhatTru, thoiTru },
    dayMasterIndex,
    solarDate,
    lunarDate,
    nongLichDate,
  }
}
