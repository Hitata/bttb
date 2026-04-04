import { HEAVENLY_STEMS, EARTHLY_BRANCHES, ELEMENT_ORDER } from './constants'
import type { FiveElement, ElementStrength, SeasonalState, StemRootedness, StemRoot, Faction } from './types'

// ===== Seasonal Strength (Vượng Tướng Hưu Tù Tử) =====
const SEASONAL_STATE_SCORES: Record<SeasonalState, number> = {
  'Vượng': 5, 'Tướng': 4, 'Hưu': 3, 'Tù': 2, 'Tử': 1,
}

/**
 * Get seasonal strength of all 5 elements based on month branch.
 *
 * The five states relative to month element:
 * - Vượng: same element (tỷ hòa)
 * - Tướng: produced by month element (month sinh target)
 * - Hưu: produces month element (target sinh month — energy drained)
 * - Tù: controls month element (target khắc month — fails)
 * - Tử: controlled by month element (month khắc target)
 *
 * Production cycle: Mộc→Hỏa→Thổ→Kim→Thủy→Mộc (indices +1 mod 5)
 * Control cycle: Mộc→Thổ→Thủy→Hỏa→Kim→Mộc (indices +2 mod 5)
 */
export function getSeasonalStrength(monthBranchIndex: number): ElementStrength[] {
  const monthElement = EARTHLY_BRANCHES[monthBranchIndex].element
  const monthIdx = ELEMENT_ORDER.indexOf(monthElement)

  return ELEMENT_ORDER.map(element => {
    const elIdx = ELEMENT_ORDER.indexOf(element)
    let state: SeasonalState

    if (elIdx === monthIdx) {
      state = 'Vượng'
    } else if (elIdx === (monthIdx + 1) % 5) {
      state = 'Tướng'  // Month produces this element
    } else if (elIdx === (monthIdx + 4) % 5) {
      state = 'Hưu'    // This element produces month (= resource for month)
    } else if (elIdx === (monthIdx + 2) % 5) {
      state = 'Tử'     // Month controls this element
    } else {
      state = 'Tù'     // This element controls month (= wealth relation to month)
    }

    return { element, state, score: SEASONAL_STATE_SCORES[state] }
  })
}

/**
 * Analyze rootedness of all 4 pillar stems.
 * A stem is "rooted" if any branch's hidden stems share the same ELEMENT.
 */
export function getStemRootedness(
  stems: number[],
  branches: number[],
): StemRootedness[] {
  return stems.map((stemIdx, pillarIdx) => {
    const stem = HEAVENLY_STEMS[stemIdx]
    const roots: StemRoot[] = []

    branches.forEach((branchIdx, bPillarIdx) => {
      const branch = EARTHLY_BRANCHES[branchIdx]
      branch.hiddenStems.forEach((hsIdx, hsPos) => {
        const hiddenStem = HEAVENLY_STEMS[hsIdx]
        if (hiddenStem.element === stem.element) {
          // Month branch (index 1) is always "near" — strongest root position
          const distance = Math.abs(pillarIdx - bPillarIdx)
          roots.push({
            pillarIndex: bPillarIdx,
            chiIndex: branchIdx,
            hiddenStemIndex: hsIdx,
            isChinhKhi: hsPos === 0,
            proximity: bPillarIdx === 1 ? 'near' : distance <= 1 ? 'near' : distance === 2 ? 'medium' : 'far',
          })
        }
      })
    })

    let rootStrength: StemRootedness['rootStrength'] = 'none'
    if (roots.length > 0) {
      const hasNearChinhKhi = roots.some(r => r.proximity === 'near' && r.isChinhKhi)
      const hasNear = roots.some(r => r.proximity === 'near')
      if (hasNearChinhKhi || roots.length >= 3) rootStrength = 'strong'
      else if (hasNear || roots.length >= 2) rootStrength = 'medium'
      else rootStrength = 'weak'
    }

    return {
      canIndex: stemIdx,
      pillarIndex: pillarIdx,
      canName: stem.name,
      element: stem.element,
      roots,
      isRooted: roots.length > 0,
      rootStrength,
    }
  })
}

/**
 * Group elements into competing factions and rank by strength.
 * "Thiên Can là Lãnh Đạo, Địa Chi là Nhân Viên"
 */
export function analyzeFactions(
  stems: number[],
  branches: number[],
  monthBranchIndex: number,
): Faction[] {
  const seasonal = getSeasonalStrength(monthBranchIndex)
  const rootedness = getStemRootedness(stems, branches)

  const factionMap = new Map<FiveElement, Faction>()
  for (const el of ELEMENT_ORDER) {
    factionMap.set(el, { element: el, leaders: [], supporters: [], strength: 0, rank: 0 })
  }

  // Add stem leaders
  stems.forEach((stemIdx, pillarIdx) => {
    const stem = HEAVENLY_STEMS[stemIdx]
    factionMap.get(stem.element)!.leaders.push({
      canIndex: stemIdx, pillarIndex: pillarIdx, name: stem.name,
    })
  })

  // Add branch supporters (by main element of branch)
  branches.forEach((branchIdx, pillarIdx) => {
    const branch = EARTHLY_BRANCHES[branchIdx]
    factionMap.get(branch.element)!.supporters.push({
      chiIndex: branchIdx, pillarIndex: pillarIdx, name: branch.name, type: 'chính khí',
    })
  })

  // Score factions
  for (const faction of factionMap.values()) {
    let score = 0
    for (const leader of faction.leaders) {
      const root = rootedness.find(r => r.canIndex === leader.canIndex && r.pillarIndex === leader.pillarIndex)
      if (root?.rootStrength === 'strong') score += 8
      else if (root?.rootStrength === 'medium') score += 5
      else if (root?.rootStrength === 'weak') score += 3
      else score += 1
    }
    if (faction.leaders.length === 2) score -= 1 // 2 leaders = competing
    score += faction.supporters.length * 2
    const seasonalInfo = seasonal.find(s => s.element === faction.element)
    if (seasonalInfo) score += seasonalInfo.score
    faction.strength = Math.max(0, score)
  }

  const sorted = [...factionMap.values()].sort((a, b) => b.strength - a.strength)
  sorted.forEach((f, i) => { f.rank = i + 1 })
  return sorted
}
