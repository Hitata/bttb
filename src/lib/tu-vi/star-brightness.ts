// Star brightness lookup table — 14 major stars × 12 Earthly Branch positions
// Trung Châu school rules
// Row = star (indexed by STAR_ORDER), Column = branch position (0=Tý..11=Hợi)

import type { StarBrightness } from './types'

type B = StarBrightness
const M: B = 'mieu'
const V: B = 'vuong'
const D: B = 'dac'
const P: B = 'binh'   // bình
const H: B = 'ham'

// Star order matches MAJOR_STARS in star-descriptions.ts
const STAR_IDS = [
  'TuVi', 'LiemTrinh', 'ThienDong', 'VuKhuc', 'ThaiDuong', 'ThienCo',
  'ThienPhu', 'ThaiAm', 'ThamLang', 'CuMon', 'ThienTuong', 'ThienLuong',
  'ThatSat', 'PhaQuan',
] as const

// [starIndex][branchIndex] → brightness
const TABLE: readonly (readonly B[])[] = [
  //         Tý Sửu Dần  Mão Thìn Tỵ  Ngọ Mùi Thân Dậu Tuất Hợi
  /* TuVi     */ [P, D, M, P, V, M, M, D, M, P, V, P],
  /* LiemTrinh*/ [V, D, V, H, M, H, V, D, V, H, M, H],
  /* ThienDong*/ [V, H, M, D, H, D, H, H, M, H, H, D],
  /* VuKhuc   */ [V, M, V, D, M, H, V, M, V, D, M, H],
  /* ThaiDuong*/ [H, D, V, V, V, M, M, D, H, H, H, H],
  /* ThienCo  */ [D, D, H, M, M, V, D, D, V, M, M, H],
  /* ThienPhu */ [V, M, V, D, D, M, V, M, V, D, D, M],
  /* ThaiAm   */ [V, D, H, H, H, H, H, D, V, M, M, M],
  /* ThamLang */ [H, M, D, H, V, H, H, M, D, H, V, H],
  /* CuMon    */ [V, H, V, M, H, H, V, H, D, M, H, D],
  /* ThienTuong*/ [V, D, M, H, V, D, V, D, M, H, V, D],
  /* ThienLuong*/ [V, D, V, V, M, H, M, D, V, H, M, H],
  /* ThatSat  */ [M, D, M, H, H, V, M, D, M, H, H, V],
  /* PhaQuan  */ [M, V, H, H, D, H, M, V, H, H, D, H],
] as const

export function getStarBrightness(starId: string, branchIndex: number): StarBrightness {
  const starIdx = STAR_IDS.indexOf(starId as typeof STAR_IDS[number])
  if (starIdx === -1) return 'binh'
  return TABLE[starIdx][branchIndex % 12]
}

export const BRIGHTNESS_LABELS: Record<StarBrightness, { vi: string; symbol: string }> = {
  mieu: { vi: 'Miếu', symbol: '★★★' },
  vuong: { vi: 'Vượng', symbol: '★★' },
  dac: { vi: 'Đắc', symbol: '★' },
  binh: { vi: 'Bình', symbol: '' },
  ham: { vi: 'Hãm', symbol: '○' },
}
