import { HEAVENLY_STEMS, EARTHLY_BRANCHES, getSexagenaryCycleIndex } from './constants'
import { getTenGod } from './ten-gods'
import { getNaYin } from './pillars'
import { getVongTruongSinh } from './life-cycle'
import { getThanSatForPillar } from './spirit-stars'
import { getSolarTermDates, getBaziMonth } from './solar-lunar'
import type { DaiVanCycle, ChuKyYear, Gender, TangCanItem } from './types'

/**
 * Calculate Đại Vận (Grand Luck Cycles)
 *
 * Starting age is determined by counting days from birth to the next/previous
 * major solar term (Jie Qi), divided by 3 (each day = 4 months).
 *
 * Direction: Male + Yang year stem = forward, Male + Yin year stem = backward
 *            Female + Yang year stem = backward, Female + Yin year stem = forward
 */
export function computeDaiVan(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  gender: Gender,
  yearCanIndex: number,
  yearChiIndex: number,
  monthCanIndex: number,
  monthChiIndex: number,
  dayMasterIndex: number,
  dayChiIndex: number,
): { startAge: number; cycles: DaiVanCycle[] } {
  const yearStemPolarity = HEAVENLY_STEMS[yearCanIndex].polarity

  // Determine direction
  const isForward = (gender === 'male' && yearStemPolarity === '+') ||
                    (gender === 'female' && yearStemPolarity === '-')

  // Calculate starting age
  // Count days to next (forward) or previous (backward) Jie Qi
  const terms = getSolarTermDates(birthYear)
  const birthDateNum = birthMonth * 100 + birthDay

  // Major solar term indices: 0(Tiểu Hàn), 2(Lập Xuân), 4(Kinh Trập), 6(Thanh Minh)...
  // These are at even indices in the 24 terms but we need "Jie" (節) terms specifically
  // Jie terms: indices 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22
  const jieTermIndices = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]

  let daysDiff = 0
  if (isForward) {
    // Find next Jie Qi after birth date
    let found = false
    for (const idx of jieTermIndices) {
      const termNum = terms[idx].month * 100 + terms[idx].day
      if (termNum > birthDateNum) {
        // Count days between birth and this term
        const birthDate = new Date(birthYear, birthMonth - 1, birthDay)
        const termDate = new Date(birthYear, terms[idx].month - 1, terms[idx].day)
        daysDiff = Math.floor((termDate.getTime() - birthDate.getTime()) / 86400000)
        found = true
        break
      }
    }
    if (!found) {
      // Next year's first Jie term
      const nextTerms = getSolarTermDates(birthYear + 1)
      const birthDate = new Date(birthYear, birthMonth - 1, birthDay)
      const termDate = new Date(birthYear + 1, nextTerms[0].month - 1, nextTerms[0].day)
      daysDiff = Math.floor((termDate.getTime() - birthDate.getTime()) / 86400000)
    }
  } else {
    // Find previous Jie Qi before birth date
    let found = false
    for (let i = jieTermIndices.length - 1; i >= 0; i--) {
      const idx = jieTermIndices[i]
      const termNum = terms[idx].month * 100 + terms[idx].day
      if (termNum <= birthDateNum) {
        const birthDate = new Date(birthYear, birthMonth - 1, birthDay)
        const termDate = new Date(birthYear, terms[idx].month - 1, terms[idx].day)
        daysDiff = Math.floor((birthDate.getTime() - termDate.getTime()) / 86400000)
        found = true
        break
      }
    }
    if (!found) {
      // Previous year's last Jie term
      const prevTerms = getSolarTermDates(birthYear - 1)
      const lastIdx = jieTermIndices[jieTermIndices.length - 1]
      const birthDate = new Date(birthYear, birthMonth - 1, birthDay)
      const termDate = new Date(birthYear - 1, prevTerms[lastIdx].month - 1, prevTerms[lastIdx].day)
      daysDiff = Math.floor((birthDate.getTime() - termDate.getTime()) / 86400000)
    }
  }

  // Starting age: 3 days = 1 year, rounded
  const startAge = Math.round(daysDiff / 3)

  // Generate 9 cycles
  const cycles: DaiVanCycle[] = []
  let currentCan = monthCanIndex
  let currentChi = monthChiIndex

  for (let i = 0; i < 9; i++) {
    // Move to next/previous stem-branch pair
    if (i > 0 || true) {
      if (i > 0) {
        if (isForward) {
          currentCan = (currentCan + 1) % 10
          currentChi = (currentChi + 1) % 12
        } else {
          currentCan = (currentCan + 9) % 10  // -1 mod 10
          currentChi = (currentChi + 11) % 12 // -1 mod 12
        }
      }
    }

    const stem = HEAVENLY_STEMS[currentCan]
    const branch = EARTHLY_BRANCHES[currentChi]

    const tangCan: TangCanItem[] = branch.hiddenStems.map(hsIdx => ({
      canIndex: hsIdx,
      can: HEAVENLY_STEMS[hsIdx].name,
      nguHanh: HEAVENLY_STEMS[hsIdx].element,
      thapThan: getTenGod(dayMasterIndex, hsIdx),
    }))

    cycles.push({
      startAge: startAge + i * 10,
      startYear: birthYear + startAge + i * 10,
      canIndex: currentCan,
      chiIndex: currentChi,
      can: stem.name,
      chi: branch.name,
      thapThan: getTenGod(dayMasterIndex, currentCan),
      tangCan,
      naYin: getNaYin(currentCan, currentChi),
      vongTruongSinh: getVongTruongSinh(dayMasterIndex, currentChi),
      thanSat: getThanSatForPillar(yearCanIndex, yearChiIndex, dayChiIndex, currentCan, currentChi),
    })
  }

  return { startAge, cycles }
}

/**
 * Generate the 90-year Chu Kỳ Đại Vận grid
 */
export function computeChuKy(
  birthYear: number,
  startAge: number,
  cycles: DaiVanCycle[],
): ChuKyYear[] {
  const years: ChuKyYear[] = []

  for (let cycleIdx = 0; cycleIdx < cycles.length; cycleIdx++) {
    const cycle = cycles[cycleIdx]
    for (let yearOffset = 0; yearOffset < 10; yearOffset++) {
      const year = cycle.startYear + yearOffset
      const age = cycle.startAge + yearOffset

      // Year pillar for this year
      const yearCanIdx = ((year % 10) + 10 - 4) % 10
      const yearChiIdx = ((year % 12) + 12 - 4) % 12

      years.push({
        year,
        age,
        canIndex: yearCanIdx,
        chiIndex: yearChiIdx,
        canChi: `${HEAVENLY_STEMS[yearCanIdx].name} ${EARTHLY_BRANCHES[yearChiIdx].name}`,
        cycleIndex: cycleIdx,
      })
    }
  }

  return years
}
