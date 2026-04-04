// Tử Vi Đẩu Số Calculator — Main Entry Point
//
// computeTuVi: birth input → complete Tử Vi chart
// Pure function pipeline: validate → lunar convert → place stars → assign brightness

import type {
  TuViBirthInput, TuViChart, Palace, Star,
  EarthlyBranch, HeavenlyStem, TuHoaType,
} from './types'
import { solarToLunar } from '../bazi/solar-lunar'
import { EARTHLY_BRANCHES, HEAVENLY_STEMS, PALACE_NAMES, CUC_INFO, hourToBranchIndex } from './palace-data'
import { STAR_BY_ID } from './star-descriptions'
import { getStarBrightness } from './star-brightness'
import {
  assignMenhPalace, assignThanPalace, calculateCuc,
  placeTuViStar, placeTuViGroup, deriveThienPhu, placeThienPhuGroup,
  placeTuHoa, getYearStemIndex, getYearBranchIndex,
} from './star-placement'

export type { TuViBirthInput, TuViChart, Palace, Star } from './types'
export type { StarBrightness, CucType, TuHoaType, EarthlyBranch } from './types'

export function computeTuVi(input: TuViBirthInput): TuViChart {
  // 1. Convert solar → lunar
  const lunar = solarToLunar(input.year, input.month, input.day)

  // Handle leap month: normalize to preceding regular month (Trung Châu)
  const effectiveLunarMonth = lunar.lunarMonth

  // 2. Determine year stem/branch from lunar year
  const yearStemIndex = getYearStemIndex(lunar.lunarYear)
  const yearBranchIndex = getYearBranchIndex(lunar.lunarYear)
  const yearStem = HEAVENLY_STEMS[yearStemIndex] as HeavenlyStem
  const yearBranch = EARTHLY_BRANCHES[yearBranchIndex] as EarthlyBranch

  // 3. Map birth hour to Earthly Branch index
  const hourIndex = hourToBranchIndex(input.hour)

  // Determine Âm/Dương of year stem (even index = Dương, odd = Âm)
  const isYearDuong = yearStemIndex % 2 === 0

  // Gender affects Mệnh palace rotation (not used in basic assignment,
  // but relevant for đại hạn direction — Phase 2)
  // Dương Nam / Âm Nữ = clockwise, Âm Nam / Dương Nữ = counter-clockwise

  // 4. Assign Mệnh and Thân palace positions
  const menhPos = assignMenhPalace(effectiveLunarMonth, hourIndex)
  const thanPos = assignThanPalace(effectiveLunarMonth, hourIndex)

  // 5. Calculate Cục
  const cuc = calculateCuc(yearStemIndex, menhPos)
  const cucInfo = CUC_INFO[cuc]

  // 6. Place all 14 major stars
  const tuViPos = placeTuViStar(cuc, lunar.lunarDay)
  const tuViGroupPositions = placeTuViGroup(tuViPos)
  const thienPhuPos = deriveThienPhu(tuViPos)
  const thienPhuGroupPositions = placeThienPhuGroup(thienPhuPos)

  const allStarPositions: Record<string, number> = {
    ...tuViGroupPositions,
    ...thienPhuGroupPositions,
  }

  // 7. Place Tứ Hóa
  const tuHoaAssignments = placeTuHoa(yearStemIndex)
  const tuHoaMap = new Map<string, TuHoaType>()
  for (const { starId, type } of tuHoaAssignments) {
    tuHoaMap.set(starId, type)
  }

  // 8. Build 12 palaces with stars and brightness
  const palaces: Palace[] = []
  for (let i = 0; i < 12; i++) {
    // Palace position = (menhPos + i) wraps around for palace ordering
    // Palace 0 (Mệnh) goes to menhPos, Palace 1 (Huynh Đệ) goes counter-clockwise
    const branchIndex = ((menhPos - i) % 12 + 12) % 12
    const palaceDef = PALACE_NAMES[i]

    // Find which stars land in this branch position
    const starsInPalace: Star[] = []
    for (const [starId, starPos] of Object.entries(allStarPositions)) {
      if (starPos === branchIndex) {
        const info = STAR_BY_ID[starId]
        if (info) {
          starsInPalace.push({
            id: starId,
            name: info.name,
            nameEn: info.nameEn,
            group: info.group,
            element: info.element,
            brightness: getStarBrightness(starId, branchIndex),
            tuHoa: tuHoaMap.get(starId),
          })
        }
      }
    }

    palaces.push({
      position: branchIndex,
      earthlyBranch: EARTHLY_BRANCHES[branchIndex],
      name: palaceDef.name,
      nameEn: palaceDef.nameEn,
      domain: palaceDef.domain,
      stars: starsInPalace,
    })
  }

  // Build Tứ Hóa summary
  const tuHoa = tuHoaAssignments.map(({ starId, type }) => ({
    type,
    starId,
    starName: STAR_BY_ID[starId]?.name ?? starId,
  }))

  return {
    input,
    lunar: {
      lunarYear: lunar.lunarYear,
      lunarMonth: lunar.lunarMonth,
      lunarDay: lunar.lunarDay,
      isLeapMonth: lunar.isLeapMonth,
    },
    profile: {
      menhElement: cucInfo.element,
      cucName: cucInfo.name,
      cucValue: cuc,
      menhPalaceIndex: 0, // Mệnh is always palace[0]
      thanPalaceIndex: palaces.findIndex(p => p.position === thanPos),
      yearStem,
      yearBranch,
    },
    palaces,
    tuHoa,
    scope: 'chinh-tinh',
  }
}
