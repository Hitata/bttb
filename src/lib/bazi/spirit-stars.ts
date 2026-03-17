import type { ThanSatItem, ThanSatAnnual } from './types'
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './constants'

/**
 * Thần Sát (Spirit Stars / Auxiliary Stars)
 *
 * These are derived from various combinations of year/day stems and branches.
 * Each star has specific rules for when it appears.
 */

// ===== Quý Nhân (Noble Person) =====
// Based on Day Stem
const QUY_NHAN_TABLE: Record<number, number[]> = {
  0: [1, 7],  // Giáp → Sửu, Mùi
  1: [0, 8],  // Ất → Tý, Thân
  2: [9, 11], // Bính → Dậu, Hợi
  3: [11, 9], // Đinh → Hợi, Dậu
  4: [1, 7],  // Mậu → Sửu, Mùi
  5: [0, 8],  // Kỷ → Tý, Thân
  6: [7, 1],  // Canh → Mùi, Sửu
  7: [6, 2],  // Tân → Ngọ, Dần
  8: [5, 3],  // Nhâm → Tỵ, Mão
  9: [5, 3],  // Quý → Tỵ, Mão
}

// ===== Hoa Cái (Canopy Star) =====
// Based on Year Branch: Tý→Thìn, Sửu→Tỵ, Dần→Ngọ...
// Formula: (yearBranch + 4) % 12 gives something close but not exact
// Actual: grouped by trinity:
// Thân-Tý-Thìn → Thìn(4), Dần-Ngọ-Tuất → Tuất(10),
// Tỵ-Dậu-Sửu → Sửu(1), Hợi-Mão-Mùi → Mùi(7)
const HOA_CAI_TABLE: Record<number, number> = {
  0: 4,   // Tý → Thìn
  1: 1,   // Sửu → Sửu
  2: 10,  // Dần → Tuất
  3: 7,   // Mão → Mùi
  4: 4,   // Thìn → Thìn
  5: 1,   // Tỵ → Sửu
  6: 10,  // Ngọ → Tuất
  7: 7,   // Mùi → Mùi
  8: 4,   // Thân → Thìn
  9: 1,   // Dậu → Sửu
  10: 10, // Tuất → Tuất
  11: 7,  // Hợi → Mùi
}

// ===== Đào Hoa (Peach Blossom) =====
// Based on Year/Day Branch trinity:
// Thân-Tý-Thìn → Dậu(9), Dần-Ngọ-Tuất → Mão(3),
// Tỵ-Dậu-Sửu → Ngọ(6), Hợi-Mão-Mùi → Tý(0)
const DAO_HOA_TABLE: Record<number, number> = {
  0: 9,   // Tý → Dậu
  1: 6,   // Sửu → Ngọ
  2: 3,   // Dần → Mão
  3: 0,   // Mão → Tý
  4: 9,   // Thìn → Dậu
  5: 6,   // Tỵ → Ngọ
  6: 3,   // Ngọ → Mão
  7: 0,   // Mùi → Tý
  8: 9,   // Thân → Dậu
  9: 6,   // Dậu → Ngọ
  10: 3,  // Tuất → Mão
  11: 0,  // Hợi → Tý
}

// ===== Dịch Mã (Traveling Horse) =====
// Thân-Tý-Thìn → Dần(2), Dần-Ngọ-Tuất → Thân(8),
// Tỵ-Dậu-Sửu → Hợi(11), Hợi-Mão-Mùi → Tỵ(5)
const DICH_MA_TABLE: Record<number, number> = {
  0: 2,   1: 11,  2: 8,   3: 5,
  4: 2,   5: 11,  6: 8,   7: 5,
  8: 2,   9: 11,  10: 8,  11: 5,
}

// ===== Không Vong (Void) =====
// Based on Day Pillar's sexagenary cycle
// Every cycle of 10 days has 2 "empty" branches
function getKhongVong(dayCanIndex: number, dayChiIndex: number): number[] {
  // Find the starting point of the 10-day cycle
  const cycleStart = ((dayChiIndex - dayCanIndex) % 12 + 12) % 12
  // The two void branches are the ones left out
  const void1 = (cycleStart + 10) % 12
  const void2 = (cycleStart + 11) % 12
  return [void1, void2]
}

/**
 * Compute Than Sat for a single pillar position
 */
export function getThanSatForPillar(
  yearCanIndex: number,
  yearChiIndex: number,
  dayChiIndex: number,
  pillarCanIndex: number,
  pillarChiIndex: number,
): ThanSatItem[] {
  const stars: ThanSatItem[] = []

  // Quý Nhân — based on day stem, check if pillar branch matches
  const quyNhanBranches = QUY_NHAN_TABLE[pillarCanIndex] || []
  // Check against year branch
  if (quyNhanBranches.includes(pillarChiIndex)) {
    stars.push({ name: 'Thiên Ất Quý Nhân', type: 'good' })
  }

  // Hoa Cái — based on year branch
  if (HOA_CAI_TABLE[yearChiIndex] === pillarChiIndex) {
    stars.push({ name: 'Hoa Cái', type: 'neutral' })
  }

  // Đào Hoa — based on year branch
  if (DAO_HOA_TABLE[yearChiIndex] === pillarChiIndex) {
    stars.push({ name: 'Đào Hoa', type: 'neutral' })
  }

  // Dịch Mã — based on year branch
  if (DICH_MA_TABLE[yearChiIndex] === pillarChiIndex) {
    stars.push({ name: 'Dịch Mã', type: 'good' })
  }

  // Không Vong — based on day pillar
  // (We'd need the actual day can/chi to compute this, but we have dayChiIndex)
  // This is a simplified version

  return stars
}

/**
 * Compute annual Than Sat table
 */
export function getThanSatAnnual(
  yearCanIndex: number,
  yearChiIndex: number,
  dayCanIndex: number,
  dayChiIndex: number,
): ThanSatAnnual[] {
  const results: ThanSatAnnual[] = []

  // Thiên Ất Quý Nhân
  const qnBranches = QUY_NHAN_TABLE[dayCanIndex] || []
  if (qnBranches.length >= 2) {
    results.push({
      name: 'Thiên Ất Quý Nhân',
      day: EARTHLY_BRANCHES[qnBranches[0]].name + ', ' + EARTHLY_BRANCHES[qnBranches[1]].name,
      year: qnBranches.map(b => EARTHLY_BRANCHES[b].name).join(', '),
    })
  }

  // Đào Hoa
  const daoHoaBranch = DAO_HOA_TABLE[yearChiIndex]
  results.push({
    name: 'Đào Hoa',
    day: EARTHLY_BRANCHES[DAO_HOA_TABLE[dayChiIndex]].name,
    year: EARTHLY_BRANCHES[daoHoaBranch].name,
  })

  // Dịch Mã
  const dichMaBranch = DICH_MA_TABLE[yearChiIndex]
  results.push({
    name: 'Dịch Mã',
    day: EARTHLY_BRANCHES[DICH_MA_TABLE[dayChiIndex]].name,
    year: EARTHLY_BRANCHES[dichMaBranch].name,
  })

  // Hoa Cái
  const hoaCaiBranch = HOA_CAI_TABLE[yearChiIndex]
  results.push({
    name: 'Hoa Cái',
    day: EARTHLY_BRANCHES[HOA_CAI_TABLE[dayChiIndex]].name,
    year: EARTHLY_BRANCHES[hoaCaiBranch].name,
  })

  return results
}
