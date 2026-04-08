import { HEAVENLY_STEMS, EARTHLY_BRANCHES, ELEMENT_ORDER } from './constants'
import type {
  FiveElement, ElementStrength, SeasonalState, StemRootedness, StemRoot, Faction,
  PositionalInteraction, InteractionStrength, ChartRelationship,
  ExtremeDynamic, ExtremeDynamicType, CungVi,
} from './types'

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

// ===== Positional Interaction Priority (Ưu Tiên Tương Tác Theo Vị Trí) =====

const PILLAR_NAMES = ['Niên Trụ', 'Nguyệt Trụ', 'Nhật Trụ', 'Thời Trụ']

/**
 * Evaluate how position affects interaction strength.
 *
 * Rules from the knowledge base:
 * - Adjacent pillars (distance 1): strongest interaction
 * - 1 pillar apart (distance 2): weaker
 * - Blocked by middle pillar (year↔hour): weakest
 * - Special: month chi ↔ hour chi stronger than distance suggests
 * - Can→Chi influence > Chi→Can
 */
function getPositionalStrength(indices: number[]): { strength: InteractionStrength; note: string } {
  if (indices.length < 2) return { strength: 'weak', note: '' }

  const sorted = [...indices].sort((a, b) => a - b)
  const min = sorted[0]
  const max = sorted[sorted.length - 1]
  const distance = max - min

  // Special case: month(1) ↔ hour(3) — stronger than distance suggests
  if (min === 1 && max === 3) {
    return {
      strength: 'strong',
      note: 'Nguyệt Chi ↔ Thời Chi tương tác mạnh hơn khoảng cách thực tế',
    }
  }

  if (distance === 1) {
    return { strength: 'strongest', note: `${PILLAR_NAMES[min]}–${PILLAR_NAMES[max]} kề nhau, tương tác mạnh nhất` }
  }
  if (distance === 2) {
    return { strength: 'strong', note: `${PILLAR_NAMES[min]}–${PILLAR_NAMES[max]} cách 1 trụ, tương tác khá mạnh` }
  }
  // distance === 3 (year↔hour)
  return { strength: 'blocked', note: `${PILLAR_NAMES[min]}–${PILLAR_NAMES[max]} bị chặn bởi trụ giữa, tương tác yếu nhất` }
}

/**
 * Annotate existing relationships with positional interaction strength.
 */
export function getPositionalInteractions(relationships: ChartRelationship[]): PositionalInteraction[] {
  return relationships.map(rel => {
    const { strength, note } = getPositionalStrength(rel.indices)
    return {
      type: rel.type,
      label: rel.label,
      indices: rel.indices,
      positionalStrength: strength,
      positionalNote: note,
    }
  })
}

// ===== Extreme Element Dynamics (Ngũ Hành Thái Quá) =====

// Production cycle: element at index produces element at (index+1)%5
// Control cycle: element at index controls element at (index+2)%5
function produces(source: FiveElement, target: FiveElement): boolean {
  return (ELEMENT_ORDER.indexOf(source) + 1) % 5 === ELEMENT_ORDER.indexOf(target)
}
function controls(controller: FiveElement, target: FiveElement): boolean {
  return (ELEMENT_ORDER.indexOf(controller) + 2) % 5 === ELEMENT_ORDER.indexOf(target)
}

/**
 * Detect extreme element dynamics based on seasonal strength and faction analysis.
 *
 * - Phản Khắc: weak element tries to control strong → gets damaged
 * - Phản Sinh: overly strong element produces into weak receiver → overwhelms
 * - Suy Xung Vượng: weak clashing strong → stimulates strong further
 * - Hợp+Khắc: elements both harmonize and clash (Tỵ-Thân = Hỏa-Kim + Lục Hợp)
 */
export function analyzeExtremeDynamics(
  stems: number[],
  branches: number[],
  seasonalStrength: ElementStrength[],
  factions: Faction[],
  relationships: ChartRelationship[],
): ExtremeDynamic[] {
  const results: ExtremeDynamic[] = []
  const strengthMap = new Map(seasonalStrength.map(s => [s.element, s]))
  const factionMap = new Map(factions.map(f => [f.element, f]))

  function isStrong(el: FiveElement): boolean {
    const s = strengthMap.get(el)
    return s !== undefined && (s.state === 'Vượng' || s.state === 'Tướng')
  }
  function isWeak(el: FiveElement): boolean {
    const s = strengthMap.get(el)
    return s !== undefined && (s.state === 'Tù' || s.state === 'Tử')
  }

  // Check all pillar element pairs for extreme dynamics
  const pillarElements: { element: FiveElement; index: number; type: 'can' | 'chi' }[] = []
  stems.forEach((idx, i) => pillarElements.push({ element: HEAVENLY_STEMS[idx].element, index: i, type: 'can' }))
  branches.forEach((idx, i) => pillarElements.push({ element: EARTHLY_BRANCHES[idx].element, index: i, type: 'chi' }))

  // Check stem-level phản khắc and phản sinh
  for (let i = 0; i < stems.length; i++) {
    for (let j = i + 1; j < stems.length; j++) {
      const elA = HEAVENLY_STEMS[stems[i]].element
      const elB = HEAVENLY_STEMS[stems[j]].element
      if (elA === elB) continue

      // Phản Khắc: A controls B but A is weak, B is strong
      if (controls(elA, elB) && isWeak(elA) && isStrong(elB)) {
        results.push({
          type: 'phanKhac',
          label: `Phản Khắc: ${elA} khắc ${elB}`,
          description: `${elA} yếu cố khắc ${elB} vượng → ${elA} bị tổn thương ngược`,
          elements: [elA, elB],
          indices: [i, j],
        })
      }
      if (controls(elB, elA) && isWeak(elB) && isStrong(elA)) {
        results.push({
          type: 'phanKhac',
          label: `Phản Khắc: ${elB} khắc ${elA}`,
          description: `${elB} yếu cố khắc ${elA} vượng → ${elB} bị tổn thương ngược`,
          elements: [elB, elA],
          indices: [j, i],
        })
      }

      // Phản Sinh: A produces B but A is extremely strong, B is very weak
      if (produces(elA, elB) && isStrong(elA) && isWeak(elB)) {
        const fA = factionMap.get(elA)
        if (fA && fA.rank <= 2) {
          results.push({
            type: 'phanSinh',
            label: `Phản Sinh: ${elA} sinh ${elB}`,
            description: `${elA} quá vượng sinh ${elB} quá yếu → mẫu từ diệt tử, ${elB} bị ngập`,
            elements: [elA, elB],
            indices: [i, j],
          })
        }
      }
      if (produces(elB, elA) && isStrong(elB) && isWeak(elA)) {
        const fB = factionMap.get(elB)
        if (fB && fB.rank <= 2) {
          results.push({
            type: 'phanSinh',
            label: `Phản Sinh: ${elB} sinh ${elA}`,
            description: `${elB} quá vượng sinh ${elA} quá yếu → mẫu từ diệt tử, ${elA} bị ngập`,
            elements: [elB, elA],
            indices: [j, i],
          })
        }
      }
    }
  }

  // Suy Xung Vượng: check chi xung where one side is weak, other is strong
  for (const rel of relationships) {
    if (rel.type !== 'chiXung' || rel.indices.length < 2) continue
    const elA = EARTHLY_BRANCHES[branches[rel.indices[0]]].element
    const elB = EARTHLY_BRANCHES[branches[rel.indices[1]]].element
    if (isWeak(elA) && isStrong(elB)) {
      results.push({
        type: 'suyXungVuong',
        label: `Suy Xung Vượng: ${EARTHLY_BRANCHES[branches[rel.indices[0]]].name} xung ${EARTHLY_BRANCHES[branches[rel.indices[1]]].name}`,
        description: `${elA} suy xung ${elB} vượng → kích thêm ${elB}, ${elA} bị tán`,
        elements: [elA, elB],
        indices: rel.indices,
      })
    }
    if (isWeak(elB) && isStrong(elA)) {
      results.push({
        type: 'suyXungVuong',
        label: `Suy Xung Vượng: ${EARTHLY_BRANCHES[branches[rel.indices[1]]].name} xung ${EARTHLY_BRANCHES[branches[rel.indices[0]]].name}`,
        description: `${elB} suy xung ${elA} vượng → kích thêm ${elA}, ${elB} bị tán`,
        elements: [elB, elA],
        indices: [...rel.indices].reverse(),
      })
    }
  }

  // Hợp+Khắc coexistence: pairs that both harmonize (lục hợp) and clash/control
  // Classic example: Tỵ(5)-Thân(8) = Lục Hợp + elements Hỏa khắc Kim
  const lucHops = relationships.filter(r => r.type === 'chiLucHop')
  for (const hop of lucHops) {
    if (hop.indices.length < 2) continue
    const elA = EARTHLY_BRANCHES[branches[hop.indices[0]]].element
    const elB = EARTHLY_BRANCHES[branches[hop.indices[1]]].element
    if (controls(elA, elB) || controls(elB, elA)) {
      const controller = controls(elA, elB) ? elA : elB
      const controlled = controls(elA, elB) ? elB : elA
      results.push({
        type: 'hopKhac',
        label: `Hợp Khắc: ${EARTHLY_BRANCHES[branches[hop.indices[0]]].name}–${EARTHLY_BRANCHES[branches[hop.indices[1]]].name}`,
        description: `Vừa lục hợp vừa ${controller} khắc ${controlled} — quan hệ phức tạp, vừa hút vừa đẩy`,
        elements: [controller, controlled],
        indices: hop.indices,
      })
    }
  }

  return results
}

// ===== Cung Vị (Palace Positions) & Life Stages =====

const CUNG_VI_DATA: CungVi[] = [
  {
    pillarIndex: 0,
    pillarName: 'Niên Trụ',
    canDomain: 'Cha (nội)',
    chiDomain: 'Mẹ (nội)',
    lifeDomain: 'Gia đình gốc, tổ tiên, bối cảnh xuất thân',
    ageRange: '0–17 tuổi',
    ageDescription: 'Giai đoạn ảnh hưởng của cha mẹ, gia đình',
  },
  {
    pillarIndex: 1,
    pillarName: 'Nguyệt Trụ',
    canDomain: 'Anh chị em (cùng cha)',
    chiDomain: 'Anh chị em (cùng mẹ)',
    lifeDomain: 'Xã hội, sự nghiệp, giao tiếp, cha mẹ (cung phụ mẫu)',
    ageRange: '18–35 tuổi',
    ageDescription: 'Giai đoạn hình thành xã hội, lập nghiệp',
  },
  {
    pillarIndex: 2,
    pillarName: 'Nhật Trụ',
    canDomain: 'Bản thân (nhật chủ)',
    chiDomain: 'Vợ/Chồng (phối ngẫu)',
    lifeDomain: 'Bản thân, hôn nhân, tâm hồn',
    ageRange: '36–53 tuổi',
    ageDescription: 'Giai đoạn tự chủ, đỉnh cao sự nghiệp',
  },
  {
    pillarIndex: 3,
    pillarName: 'Thời Trụ',
    canDomain: 'Con (trai)',
    chiDomain: 'Con (gái)',
    lifeDomain: 'Con cái, di sản, tuổi già',
    ageRange: '54+ tuổi',
    ageDescription: 'Giai đoạn hưởng phúc, di sản cho đời sau',
  },
]

/**
 * Get Cung Vị mapping — which pillar represents which life area.
 * This is a static mapping, always the same for all charts.
 */
export function getCungVi(): CungVi[] {
  return CUNG_VI_DATA
}
