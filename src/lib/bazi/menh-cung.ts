import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './constants'
import type { ThaiMenhCung } from './types'

/**
 * Calculate Thai Cung (胎宮 - Fetal Palace) and Mệnh Cung (命宮 - Destiny Palace)
 *
 * Thai Cung: Based on month and hour branches
 * Formula: Thai Cung branch = (month branch + hour branch + 1) % 12
 *
 * Mệnh Cung: Based on year branch and birth month
 * Formula varies by tradition, using a common approach here
 */

/**
 * Compute Thai Cung
 * monthChiIndex: branch index of the month pillar
 * hourChiIndex: branch index of the hour pillar
 * yearCanIndex: stem index of the year pillar (for computing the stem)
 */
function computeThaiCung(
  monthChiIndex: number,
  hourChiIndex: number,
  yearCanIndex: number,
): { can: string; chi: string } {
  // Thai Cung branch: count from Tý to month branch, then from that to hour branch
  // Formula: (monthChi + hourChi) % 12 (with various traditions)
  // Common: ThaiCung = (monthBranch + hourBranch - 1 + 12) % 12
  // Another tradition: ThaiCung branch = 14 - monthBranch - hourBranch... mod 12
  // Using the widely used formula:
  const chiIndex = (monthChiIndex + hourChiIndex) % 12

  // Thai Cung stem: derived from year stem
  // Using the Five Tiger formula offset
  const yearCanMod = yearCanIndex % 5
  const baseOffset = (yearCanMod * 2 + 2) % 10
  // Month offset from Dần(2)
  const monthOffset = ((chiIndex - 2) % 12 + 12) % 12
  const canIndex = (baseOffset + monthOffset) % 10

  return {
    can: HEAVENLY_STEMS[canIndex].name,
    chi: EARTHLY_BRANCHES[chiIndex].name,
  }
}

/**
 * Compute Mệnh Cung
 * Uses the formula: MenhCung branch = (14 - monthBranch - hourBranch) % 12
 */
function computeMenhCung(
  monthChiIndex: number,
  hourChiIndex: number,
  yearCanIndex: number,
): { can: string; chi: string } {
  // Mệnh Cung branch
  const chiIndex = ((14 - monthChiIndex - hourChiIndex) % 12 + 12) % 12

  // Mệnh Cung stem
  const yearCanMod = yearCanIndex % 5
  const baseOffset = (yearCanMod * 2 + 2) % 10
  const monthOffset = ((chiIndex - 2) % 12 + 12) % 12
  const canIndex = (baseOffset + monthOffset) % 10

  return {
    can: HEAVENLY_STEMS[canIndex].name,
    chi: EARTHLY_BRANCHES[chiIndex].name,
  }
}

/**
 * Get both Thai Cung and Menh Cung
 */
export function getThaiMenhCung(
  monthChiIndex: number,
  hourChiIndex: number,
  yearCanIndex: number,
): ThaiMenhCung {
  return {
    thaiCung: computeThaiCung(monthChiIndex, hourChiIndex, yearCanIndex),
    menhCung: computeMenhCung(monthChiIndex, hourChiIndex, yearCanIndex),
  }
}
