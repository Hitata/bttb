import { HEAVENLY_STEMS, ELEMENT_ORDER, TEN_GOD_NAMES, TEN_GOD_DESCRIPTIONS, getElementRelation } from './constants'
import type { TenGodRef, TenGodInfo } from './types'

/**
 * Get the Ten God relationship between the daymaster stem and a target stem
 */
export function getTenGod(dayMasterIndex: number, targetStemIndex: number): TenGodRef {
  const dm = HEAVENLY_STEMS[dayMasterIndex]
  const target = HEAVENLY_STEMS[targetStemIndex]

  const relation = getElementRelation(dm.element, target.element)
  const samePol = dm.polarity === target.polarity

  let key: string
  switch (relation) {
    case 'same':
      key = samePol ? 'same_same' : 'same_diff'
      break
    case 'produce':
      key = samePol ? 'produce_same' : 'produce_diff'
      break
    case 'wealth':
      key = samePol ? 'wealth_diff' : 'wealth_same'  // Note: same polarity = Thiên Tài (偏), diff = Chính Tài (正)
      break
    case 'power':
      key = samePol ? 'power_diff' : 'power_same'    // same polarity = Thất Sát (偏), diff = Chính Quan (正)
      break
    case 'resource':
      key = samePol ? 'resource_diff' : 'resource_same' // same polarity = Thiên Ấn (偏), diff = Chính Ấn (正)
      break
  }

  const info = TEN_GOD_NAMES[key]
  return { code: info.code, name: info.name }
}

/**
 * Get the abbreviation key for a Ten God name
 * E.g. "Tỷ Kiên" → "TK", "Thực Thần" → "TH"
 */
export function getTenGodKey(name: string): string {
  // Special case for Thực Thần
  if (name === 'Thực Thần') return 'TH'
  // General: first letter of each word
  const parts = name.split(' ')
  if (parts.length === 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

/**
 * Get full Ten God description by code
 */
export function getTenGodDescription(code: string): TenGodInfo | undefined {
  return TEN_GOD_DESCRIPTIONS.find(t => t.code === code)
}

/**
 * Get all Ten God relationships for the four pillars
 */
export function computeAllTenGods(dayMasterIndex: number, pillars: {
  yearCan: number
  monthCan: number
  hourCan: number
}): {
  year: TenGodRef
  month: TenGodRef
  day: TenGodRef
  hour: TenGodRef
} {
  return {
    year: getTenGod(dayMasterIndex, pillars.yearCan),
    month: getTenGod(dayMasterIndex, pillars.monthCan),
    day: getTenGod(dayMasterIndex, dayMasterIndex), // Day master to itself = Tỷ Kiên
    hour: getTenGod(dayMasterIndex, pillars.hourCan),
  }
}
