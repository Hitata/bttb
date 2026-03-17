/**
 * Bazi Calculation Engine - Main Entry Point
 *
 * Orchestrates all calculation modules to produce a complete BaziResult.
 */

import { computeTuTru } from './pillars'
import { computeDaiVan, computeChuKy } from './luck-cycles'
import { getCompassDirections } from './compass'
import { getThaiMenhCung } from './menh-cung'
import { getThanSatAnnual } from './spirit-stars'
import { getTenGod } from './ten-gods'
import { getNaYin } from './pillars'
import { getVongTruongSinh } from './life-cycle'
import { getThanSatForPillar } from './spirit-stars'
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './constants'
import type { BaziResult, BirthInput, CurrentYearData, TangCanItem } from './types'

export { generateRawDataForAI, getRandomQuestions, DESTINY_QUESTIONS } from './raw-data-generator'
export { HEAVENLY_STEMS, EARTHLY_BRANCHES, ELEMENT_COLORS, ELEMENT_BG_COLORS, TEN_GOD_DESCRIPTIONS } from './constants'
export type * from './types'

/**
 * Compute a complete Bazi chart from birth input
 */
export function computeBazi(input: BirthInput): BaziResult {
  // 1. Compute Four Pillars
  const { tuTru, dayMasterIndex, solarDate, lunarDate, nongLichDate } = computeTuTru(input)

  // 2. Compute Đại Vận (Luck Cycles)
  const yearCanIndex = tuTru.thienTru.canIndex
  const yearChiIndex = tuTru.thienTru.chiIndex
  const monthCanIndex = tuTru.nguyetTru.canIndex
  const monthChiIndex = tuTru.nguyetTru.chiIndex
  const dayChiIndex = tuTru.nhatTru.chiIndex

  const { startAge, cycles } = computeDaiVan(
    input.year, input.month, input.day,
    input.gender,
    yearCanIndex, yearChiIndex,
    monthCanIndex, monthChiIndex,
    dayMasterIndex, dayChiIndex,
  )

  // 3. Compute Chu Ky (90-year grid)
  const chuKy = computeChuKy(input.year, startAge, cycles)

  // 4. Current Year data
  const currentYearNum = new Date().getFullYear()
  const currentYear = computeCurrentYear(currentYearNum, dayMasterIndex, yearCanIndex, yearChiIndex, dayChiIndex, cycles)

  // 5. Compass directions
  const compass = [getCompassDirections(dayMasterIndex)]

  // 6. Annual Than Sat
  const thansat = getThanSatAnnual(yearCanIndex, yearChiIndex, dayMasterIndex, dayChiIndex)

  // 7. Thai Menh Cung
  const thaiMenhCung = getThaiMenhCung(monthChiIndex, tuTru.thoiTru.chiIndex, yearCanIndex)

  return {
    date: {
      solar: solarDate,
      lunar: lunarDate,
      nongLich: nongLichDate,
    },
    tutru: tuTru,
    dayMasterIndex,
    daivan: {
      startAge,
      cycles,
      chuKy,
      currentYear,
    },
    compass,
    thansat,
    thaiMenhCung,
  }
}

/**
 * Compute current year pillar data
 */
function computeCurrentYear(
  year: number,
  dayMasterIndex: number,
  yearCanIndex: number,
  yearChiIndex: number,
  dayChiIndex: number,
  cycles: ReturnType<typeof computeDaiVan>['cycles'],
): CurrentYearData {
  const canIdx = ((year % 10) + 10 - 4) % 10
  const chiIdx = ((year % 12) + 12 - 4) % 12

  const stem = HEAVENLY_STEMS[canIdx]
  const branch = EARTHLY_BRANCHES[chiIdx]

  const tangCan: TangCanItem[] = branch.hiddenStems.map(hsIdx => ({
    canIndex: hsIdx,
    can: HEAVENLY_STEMS[hsIdx].name,
    nguHanh: HEAVENLY_STEMS[hsIdx].element,
    thapThan: getTenGod(dayMasterIndex, hsIdx),
  }))

  // Find active cycle
  let activeCycleIndex = 0
  for (let i = 0; i < cycles.length; i++) {
    if (year >= cycles[i].startYear && (i === cycles.length - 1 || year < cycles[i + 1].startYear)) {
      activeCycleIndex = i
      break
    }
  }

  return {
    year,
    can: stem.name,
    chi: branch.name,
    canIndex: canIdx,
    chiIndex: chiIdx,
    yearCanNguHanh: stem.element,
    yearChiNguHanh: branch.element,
    yearCanThapThan: getTenGod(dayMasterIndex, canIdx),
    tangCan,
    naYin: getNaYin(canIdx, chiIdx),
    vongTruongSinh: getVongTruongSinh(dayMasterIndex, chiIdx),
    thanSat: getThanSatForPillar(yearCanIndex, yearChiIndex, dayChiIndex, canIdx, chiIdx),
  }
}

/**
 * Compute pillar data for a specific year (for the clickable grid)
 */
export function computeYearPillar(
  year: number,
  dayMasterIndex: number,
  yearCanIndex: number,
  yearChiIndex: number,
  dayChiIndex: number,
): CurrentYearData {
  return computeCurrentYear(year, dayMasterIndex, yearCanIndex, yearChiIndex, dayChiIndex, [])
}
