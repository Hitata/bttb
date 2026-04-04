import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './constants'
import type { ChartRelationship, FiveElement } from './types'

// ===== Can Hợp (5 Stem Combinations) =====
const CAN_HOP_PAIRS: { pair: [number, number]; element: FiveElement }[] = [
  { pair: [0, 5], element: 'Thổ' },   // Giáp ↔ Kỷ → Thổ
  { pair: [1, 6], element: 'Kim' },    // Ất ↔ Canh → Kim
  { pair: [2, 7], element: 'Thủy' },   // Bính ↔ Tân → Thủy
  { pair: [3, 8], element: 'Mộc' },    // Đinh ↔ Nhâm → Mộc
  { pair: [4, 9], element: 'Hỏa' },    // Mậu ↔ Quý → Hỏa
]

// ===== Chi Xung (6 Branch Clashes) — 6 apart =====
const CHI_XUNG_PAIRS: [number, number][] = [
  [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11],
]

// ===== Chi Hình (Branch Punishments) =====
const HINH_VO_AN: number[] = [2, 5, 8]       // Dần, Tỵ, Thân
const HINH_VO_LE: [number, number] = [0, 3]  // Tý ↔ Mão
const HINH_TU_HINH: number[] = [4, 6, 9, 11] // Thìn, Ngọ, Dậu, Hợi

// ===== Chi Lục Hợp (6 Branch Harmonies) =====
const CHI_LUC_HOP_PAIRS: [number, number][] = [
  [0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7],
]

// ===== Tam Hợp (Three Harmonies) =====
const TAM_HOP_GROUPS: { branches: number[]; element: FiveElement; tuChinh: number }[] = [
  { branches: [11, 3, 7],  element: 'Mộc',  tuChinh: 3 },
  { branches: [2, 6, 10],  element: 'Hỏa',  tuChinh: 6 },
  { branches: [5, 9, 1],   element: 'Kim',   tuChinh: 9 },
  { branches: [8, 0, 4],   element: 'Thủy',  tuChinh: 0 },
]

// ===== Tam Hội (Three Meetings / Season Groups) =====
const TAM_HOI_GROUPS: { branches: number[]; element: FiveElement }[] = [
  { branches: [2, 3, 4],   element: 'Mộc' },
  { branches: [5, 6, 7],   element: 'Hỏa' },
  { branches: [8, 9, 10],  element: 'Kim' },
  { branches: [11, 0, 1],  element: 'Thủy' },
]

// ===== Helper: collect all indices where a value appears =====
function allIndicesOf(arr: number[], value: number): number[] {
  return arr.reduce<number[]>((acc, v, i) => {
    if (v === value) acc.push(i)
    return acc
  }, [])
}

// ===== 1. Can Hợp — adjacent stems only =====
export function findCanHop(stems: number[]): ChartRelationship[] {
  const results: ChartRelationship[] = []
  for (let i = 0; i < stems.length - 1; i++) {
    const a = stems[i]
    const b = stems[i + 1]
    for (const { pair, element } of CAN_HOP_PAIRS) {
      if ((a === pair[0] && b === pair[1]) || (a === pair[1] && b === pair[0])) {
        results.push({
          type: 'canHop',
          label: `Can Hợp: ${HEAVENLY_STEMS[a].name}–${HEAVENLY_STEMS[b].name} → ${element}`,
          indices: [i, i + 1],
          element,
        })
      }
    }
  }
  return results
}

// ===== 2. Chi Xung — all pairs =====
export function findChiXung(branches: number[]): ChartRelationship[] {
  const results: ChartRelationship[] = []
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const a = branches[i]
      const b = branches[j]
      for (const pair of CHI_XUNG_PAIRS) {
        if ((a === pair[0] && b === pair[1]) || (a === pair[1] && b === pair[0])) {
          results.push({
            type: 'chiXung',
            label: `Chi Xung: ${EARTHLY_BRANCHES[a].name}–${EARTHLY_BRANCHES[b].name}`,
            indices: [i, j],
          })
        }
      }
    }
  }
  return results
}

// ===== 3. Chi Hình — three sub-types =====
export function findChiHinh(branches: number[]): ChartRelationship[] {
  const results: ChartRelationship[] = []

  // Vô Ân: need 2+ of Dần(2), Tỵ(5), Thân(8)
  const voAnIndices: number[][] = HINH_VO_AN.map(v => allIndicesOf(branches, v))
  const voAnPresent = voAnIndices.filter(arr => arr.length > 0)
  if (voAnPresent.length >= 2) {
    const allIdx = voAnPresent.flat()
    const names = voAnPresent.map(arr => EARTHLY_BRANCHES[branches[arr[0]]].name).join('–')
    results.push({
      type: 'chiHinh',
      label: `Chi Hình Vô Ân: ${names}`,
      indices: allIdx.sort((a, b) => a - b),
    })
  }

  // Vô Lễ: Tý(0) and Mão(3) both present
  const tyIndices = allIndicesOf(branches, HINH_VO_LE[0])
  const maoIndices = allIndicesOf(branches, HINH_VO_LE[1])
  if (tyIndices.length > 0 && maoIndices.length > 0) {
    const allIdx = [...tyIndices, ...maoIndices].sort((a, b) => a - b)
    results.push({
      type: 'chiHinh',
      label: `Chi Hình Vô Lễ: ${EARTHLY_BRANCHES[0].name}–${EARTHLY_BRANCHES[3].name}`,
      indices: allIdx,
    })
  }

  // Tự Hình: same branch at 2+ positions (only for Thìn=4, Ngọ=6, Dậu=9, Hợi=11)
  for (const branchVal of HINH_TU_HINH) {
    const indices = allIndicesOf(branches, branchVal)
    if (indices.length >= 2) {
      results.push({
        type: 'chiHinh',
        label: `Chi Hình Tự Hình: ${EARTHLY_BRANCHES[branchVal].name}–${EARTHLY_BRANCHES[branchVal].name}`,
        indices,
      })
    }
  }

  return results
}

// ===== 4. Chi Lục Hợp — all pairs =====
export function findChiLucHop(branches: number[]): ChartRelationship[] {
  const results: ChartRelationship[] = []
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const a = branches[i]
      const b = branches[j]
      for (const pair of CHI_LUC_HOP_PAIRS) {
        if ((a === pair[0] && b === pair[1]) || (a === pair[1] && b === pair[0])) {
          results.push({
            type: 'chiLucHop',
            label: `Chi Lục Hợp: ${EARTHLY_BRANCHES[a].name}–${EARTHLY_BRANCHES[b].name}`,
            indices: [i, j],
          })
        }
      }
    }
  }
  return results
}

// ===== 5. Tam Hợp — all 3 branches of a group present =====
export function findTamHop(branches: number[]): ChartRelationship[] {
  const results: ChartRelationship[] = []
  for (const group of TAM_HOP_GROUPS) {
    const indexSets = group.branches.map(v => allIndicesOf(branches, v))
    if (indexSets.every(s => s.length > 0)) {
      const allIdx = indexSets.flat().sort((a, b) => a - b)
      const names = group.branches.map(v => EARTHLY_BRANCHES[v].name).join('–')
      results.push({
        type: 'tamHop',
        label: `Tam Hợp ${group.element}: ${names}`,
        indices: allIdx,
        element: group.element,
      })
    }
  }
  return results
}

// ===== 6. Tam Hội — all 3 branches of a season group present =====
export function findTamHoi(branches: number[]): ChartRelationship[] {
  const results: ChartRelationship[] = []
  for (const group of TAM_HOI_GROUPS) {
    const indexSets = group.branches.map(v => allIndicesOf(branches, v))
    if (indexSets.every(s => s.length > 0)) {
      const allIdx = indexSets.flat().sort((a, b) => a - b)
      const names = group.branches.map(v => EARTHLY_BRANCHES[v].name).join('–')
      results.push({
        type: 'tamHoi',
        label: `Tam Hội ${group.element}: ${names}`,
        indices: allIdx,
        element: group.element,
      })
    }
  }
  return results
}

// ===== 7. Bán Hợp — 2 of 3 tam hợp branches, skip full tam hợp =====
export function findBanHop(branches: number[]): ChartRelationship[] {
  const results: ChartRelationship[] = []
  const fullTamHop = findTamHop(branches)

  for (const group of TAM_HOP_GROUPS) {
    // Skip if this group is already a full tam hợp
    if (fullTamHop.some(r => r.element === group.element)) continue

    const indexSets = group.branches.map(v => allIndicesOf(branches, v))
    const presentSets = indexSets.filter(s => s.length > 0)

    if (presentSets.length === 2) {
      const allIdx = presentSets.flat().sort((a, b) => a - b)
      const presentBranches = group.branches.filter(v => allIndicesOf(branches, v).length > 0)
      const hasTuChinh = presentBranches.includes(group.tuChinh)
      const names = presentBranches.map(v => EARTHLY_BRANCHES[v].name).join('–')

      results.push({
        type: 'banHop',
        label: `Bán Hợp ${group.element}: ${names}`,
        indices: allIdx,
        element: group.element,
        strength: hasTuChinh ? 'strong' : 'weak',
      })
    }
  }
  return results
}

// ===== 8. Bán Hội — 2 of 3 tam hội branches, skip full tam hội =====
export function findBanHoi(branches: number[]): ChartRelationship[] {
  const results: ChartRelationship[] = []
  const fullTamHoi = findTamHoi(branches)

  for (const group of TAM_HOI_GROUPS) {
    // Skip if this group is already a full tam hội
    if (fullTamHoi.some(r => r.element === group.element)) continue

    const indexSets = group.branches.map(v => allIndicesOf(branches, v))
    const presentSets = indexSets.filter(s => s.length > 0)

    if (presentSets.length === 2) {
      const allIdx = presentSets.flat().sort((a, b) => a - b)
      const presentBranches = group.branches.filter(v => allIndicesOf(branches, v).length > 0)
      const names = presentBranches.map(v => EARTHLY_BRANCHES[v].name).join('–')

      // Strong if the first two branches of the group (same element) are present
      // Weak if the middle branch is missing
      const hasFirst = allIndicesOf(branches, group.branches[0]).length > 0
      const hasSecond = allIndicesOf(branches, group.branches[1]).length > 0
      const strength = (hasFirst && hasSecond) ? 'strong' : 'weak'

      results.push({
        type: 'banHoi',
        label: `Bán Hội ${group.element}: ${names}`,
        indices: allIdx,
        element: group.element,
        strength,
      })
    }
  }
  return results
}

// ===== 9. Analyze all relationships =====
export function analyzeRelationships(stems: number[], branches: number[]): ChartRelationship[] {
  return [
    ...findTamHoi(branches),
    ...findTamHop(branches),
    ...findBanHoi(branches),
    ...findBanHop(branches),
    ...findCanHop(stems),
    ...findChiLucHop(branches),
    ...findChiXung(branches),
    ...findChiHinh(branches),
  ]
}
