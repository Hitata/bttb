// Tử Vi Star Placement Algorithm — Trung Châu School
// Deterministic lookup tables + offset calculations
// Reference: doanguyen/lasotuvi (Python), Trung Châu tradition

import type { CucType, TuHoaType } from './types'

// ─── Mệnh Palace Assignment ───
// Formula: menhPosition = (month - 1 + 2 - hourIndex + 12) % 12
// month: lunar month 1-12, hourIndex: 0=Tý..11=Hợi
export function assignMenhPalace(lunarMonth: number, hourIndex: number): number {
  return ((lunarMonth - 1) + 2 - hourIndex + 12) % 12
}

// Thân palace: menhPosition = (month - 1 + 2 + hourIndex) % 12
export function assignThanPalace(lunarMonth: number, hourIndex: number): number {
  return ((lunarMonth - 1) + 2 + hourIndex) % 12
}

// ─── Cục Calculation ───
// CUC_TABLE[stemIndex][branchIndex] → Cục value (2,3,4,5,6)
// stemIndex: 0=Giáp..9=Quý, branchIndex: 0=Tý..11=Hợi
// 5-stem cycle: Giáp=Kỷ, Ất=Canh, Bính=Tân, Đinh=Nhâm, Mậu=Quý
const CUC_TABLE: readonly (readonly CucType[])[] = [
  [2, 2, 6, 6, 3, 3, 5, 5, 4, 4, 6, 6], // Giáp
  [6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 5, 5], // Ất
  [5, 5, 3, 3, 2, 2, 4, 4, 6, 6, 3, 3], // Bính
  [3, 3, 4, 4, 6, 6, 2, 2, 5, 5, 4, 4], // Đinh
  [4, 4, 2, 2, 5, 5, 6, 6, 3, 3, 2, 2], // Mậu
  [2, 2, 6, 6, 3, 3, 5, 5, 4, 4, 6, 6], // Kỷ
  [6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 5, 5], // Canh
  [5, 5, 3, 3, 2, 2, 4, 4, 6, 6, 3, 3], // Tân
  [3, 3, 4, 4, 6, 6, 2, 2, 5, 5, 4, 4], // Nhâm
  [4, 4, 2, 2, 5, 5, 6, 6, 3, 3, 2, 2], // Quý
] as const

export function calculateCuc(yearStemIndex: number, menhBranchIndex: number): CucType {
  return CUC_TABLE[yearStemIndex][menhBranchIndex]
}

// ─── Tử Vi Star Position ───
// Algorithm: divide lunar day by Cục, advance from Dần (index 2)
// Odd remainder → backward, even remainder → forward
export function placeTuViStar(cuc: CucType, lunarDay: number): number {
  let threshold = cuc
  let position = 2 // Dần = index 2
  while (threshold < lunarDay) {
    threshold += cuc
    position += 1
  }
  let diff = threshold - lunarDay
  if (diff % 2 === 1) diff = -diff
  return ((position + diff) % 12 + 12) % 12
}

// ─── Tử Vi Group Offsets ───
// From Tử Vi's position, place 5 companion stars at fixed offsets
const TUVI_GROUP_OFFSETS: Record<string, number> = {
  ThienCo: -1,
  ThaiDuong: -3,
  VuKhuc: -4,
  ThienDong: -5,
  LiemTrinh: 4,
}

export function placeTuViGroup(tuViPos: number): Record<string, number> {
  const result: Record<string, number> = { TuVi: tuViPos }
  for (const [star, offset] of Object.entries(TUVI_GROUP_OFFSETS)) {
    result[star] = ((tuViPos + offset) % 12 + 12) % 12
  }
  return result
}

// ─── Thiên Phủ Derivation ───
// Mirrors Tử Vi across the Dần-Thân axis
export function deriveThienPhu(tuViPos: number): number {
  return (4 - tuViPos + 12) % 12
}

// ─── Thiên Phủ Group Offsets ───
// From Thiên Phủ's position, place 7 companion stars
const THIEN_PHU_GROUP_OFFSETS: Record<string, number> = {
  ThaiAm: 1,
  ThamLang: 2,
  CuMon: 3,
  ThienTuong: 4,
  ThienLuong: 5,
  ThatSat: 6,
  PhaQuan: -2,
}

export function placeThienPhuGroup(thienPhuPos: number): Record<string, number> {
  const result: Record<string, number> = { ThienPhu: thienPhuPos }
  for (const [star, offset] of Object.entries(THIEN_PHU_GROUP_OFFSETS)) {
    result[star] = ((thienPhuPos + offset) % 12 + 12) % 12
  }
  return result
}

// ─── Tứ Hóa (Four Transformations) ───
// TU_HOA[yearStemIndex] = [Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ]
const TU_HOA_TABLE: readonly (readonly [string, string, string, string])[] = [
  ['LiemTrinh', 'PhaQuan', 'VuKhuc', 'ThaiDuong'],     // Giáp
  ['ThienCo', 'ThienLuong', 'TuVi', 'ThaiAm'],          // Ất
  ['ThienDong', 'ThienCo', 'VanXuong', 'LiemTrinh'],    // Bính (VanXuong = minor star)
  ['ThaiAm', 'ThienDong', 'ThienCo', 'CuMon'],          // Đinh
  ['ThamLang', 'ThaiAm', 'HuuBat', 'ThienCo'],          // Mậu (HuuBat = minor star)
  ['VuKhuc', 'ThamLang', 'ThienLuong', 'VanKhuc'],      // Kỷ (VanKhuc = minor star)
  ['ThaiDuong', 'VuKhuc', 'ThienDong', 'ThaiAm'],       // Canh
  ['CuMon', 'ThaiDuong', 'VanKhuc', 'VanXuong'],        // Tân (minor stars)
  ['ThienLuong', 'TuVi', 'ThienPhu', 'VuKhuc'],         // Nhâm
  ['PhaQuan', 'CuMon', 'ThaiAm', 'ThamLang'],           // Quý
] as const

const TU_HOA_TYPES: readonly TuHoaType[] = ['loc', 'quyen', 'khoa', 'ky'] as const

// 14 major star IDs that can receive Tứ Hóa
const MAJOR_STAR_IDS = new Set([
  'TuVi', 'LiemTrinh', 'ThienDong', 'VuKhuc', 'ThaiDuong', 'ThienCo',
  'ThienPhu', 'ThaiAm', 'ThamLang', 'CuMon', 'ThienTuong', 'ThienLuong',
  'ThatSat', 'PhaQuan',
])

export function placeTuHoa(yearStemIndex: number): { starId: string; type: TuHoaType }[] {
  const row = TU_HOA_TABLE[yearStemIndex]
  const result: { starId: string; type: TuHoaType }[] = []
  for (let i = 0; i < 4; i++) {
    const starId = row[i]
    // Only include Tứ Hóa for the 14 major stars in Phase 1
    if (MAJOR_STAR_IDS.has(starId)) {
      result.push({ starId, type: TU_HOA_TYPES[i] })
    }
  }
  return result
}

// ─── Year Stem Index ───
// Compute Heavenly Stem index (0-9) from lunar year
export function getYearStemIndex(lunarYear: number): number {
  return (lunarYear - 4) % 10
}

// ─── Year Branch Index ───
// Compute Earthly Branch index (0-11) from lunar year
export function getYearBranchIndex(lunarYear: number): number {
  return (lunarYear - 4) % 12
}
