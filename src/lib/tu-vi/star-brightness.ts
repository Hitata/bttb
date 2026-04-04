// Star brightness lookup table
// Major stars: full 12-position brightness
// Minor stars: partial brightness (some positions are 'binh' by default)
// Trung Châu school rules

import type { StarBrightness } from './types'

type B = StarBrightness
const M: B = 'mieu'
const V: B = 'vuong'
const D: B = 'dac'
const P: B = 'binh'
const H: B = 'ham'

// Full brightness tables: [starId, ...12 branch positions (Tý..Hợi)]
const BRIGHTNESS_TABLE: Record<string, readonly B[]> = {
  //                    Tý Sửu Dần  Mão Thìn Tỵ  Ngọ Mùi Thân Dậu Tuất Hợi
  TuVi:      [P, D, M, P, V, M, M, D, M, P, V, P],
  LiemTrinh: [V, D, V, H, M, H, V, D, V, H, M, H],
  ThienDong: [V, H, M, D, H, D, H, H, M, H, H, D],
  VuKhuc:    [V, M, V, D, M, H, V, M, V, D, M, H],
  ThaiDuong: [H, D, V, V, V, M, M, D, H, H, H, H],
  ThienCo:   [D, D, H, M, M, V, D, D, V, M, M, H],
  ThienPhu:  [V, M, V, D, D, M, V, M, V, D, D, M],
  ThaiAm:    [V, D, H, H, H, H, H, D, V, M, M, M],
  ThamLang:  [H, M, D, H, V, H, H, M, D, H, V, H],
  CuMon:     [V, H, V, M, H, H, V, H, D, M, H, D],
  ThienTuong:[V, D, M, H, V, D, V, D, M, H, V, D],
  ThienLuong:[V, D, V, V, M, H, M, D, V, H, M, H],
  ThatSat:   [M, D, M, H, H, V, M, D, M, H, H, V],
  PhaQuan:   [M, V, H, H, D, H, M, V, H, H, D, H],
  // Lục Sát
  DaLa:      [H, D, H, H, D, H, H, D, H, H, D, H],
  KinhDuong: [H, D, H, H, D, H, H, D, H, H, D, H],
  LinhTinh:  [H, H, D, D, D, D, D, H, H, H, H, H],
  HoaTinh:   [H, H, D, D, D, D, D, H, H, H, H, H],
  DiaKhong:  [H, H, D, H, H, D, H, H, D, H, H, D],
  DiaKiep:   [H, H, D, H, H, D, H, H, D, H, H, D],
  // Văn Xương / Văn Khúc
  VanXuong:  [H, D, H, D, H, D, H, D, H, H, D, D],
  VanKhuc:   [H, D, H, D, H, D, H, D, H, H, D, D],
  // Partial brightness (only certain positions have non-binh)
  DaiHao:    [P, P, D, D, P, P, P, P, D, D, P, P],
  TieuHao:   [P, P, D, D, P, P, P, P, D, D, P, P],
  ThienKhoc: [D, D, P, D, P, P, D, D, P, D, P, P],
  ThienHu:   [D, D, P, D, P, P, D, D, P, D, P, P],
  ThienMa:   [P, P, D, P, P, D, P, P, P, P, P, P],
  ThienHinh: [P, P, D, D, P, P, P, P, D, D, P, P],
  ThienRieu: [P, P, D, D, P, P, P, P, P, D, D, P],
}

export function getStarBrightness(starId: string, branchIndex: number): StarBrightness {
  const row = BRIGHTNESS_TABLE[starId]
  if (!row) return 'binh'
  return row[branchIndex % 12]
}

export const BRIGHTNESS_LABELS: Record<StarBrightness, { vi: string; symbol: string }> = {
  mieu: { vi: 'Miếu', symbol: '★★★' },
  vuong: { vi: 'Vượng', symbol: '★★' },
  dac: { vi: 'Đắc', symbol: '★' },
  binh: { vi: 'Bình', symbol: '' },
  ham: { vi: 'Hãm', symbol: '○' },
}
