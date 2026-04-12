// Tử Vi Star Placement Algorithm — Trung Châu School
// Deterministic lookup tables + offset calculations
// Reference: doanguyen/lasotuvi (Python), Trung Châu tradition
// All indices are 0-based: stems 0-9, branches 0-11

import type { CucType, TuHoaType, Element, NapAmInfo, SinhKhacResult } from './types'

// ─── Utility ───
// Palace arithmetic in 0-11 range
function mod12(n: number): number {
  return ((n % 12) + 12) % 12
}

// ─── Mệnh Palace Assignment ───
export function assignMenhPalace(lunarMonth: number, hourIndex: number): number {
  return mod12((lunarMonth - 1) + 2 - hourIndex)
}

// Thân palace
export function assignThanPalace(lunarMonth: number, hourIndex: number): number {
  return mod12((lunarMonth - 1) + 2 + hourIndex)
}

// ─── Cục Calculation ───
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
export function placeTuViStar(cuc: CucType, lunarDay: number): number {
  let threshold = cuc
  let position = 2 // Dần = index 2
  while (threshold < lunarDay) {
    threshold += cuc
    position += 1
  }
  let diff = threshold - lunarDay
  if (diff % 2 === 1) diff = -diff
  return mod12(position + diff)
}

// ─── Tử Vi Group (6 stars) ───
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
    result[star] = mod12(tuViPos + offset)
  }
  return result
}

// ─── Thiên Phủ Derivation ───
export function deriveThienPhu(tuViPos: number): number {
  return mod12(4 - tuViPos)
}

// ─── Thiên Phủ Group (8 stars) ───
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
    result[star] = mod12(thienPhuPos + offset)
  }
  return result
}

// ─── Tứ Hóa (Four Transformations) ───
const TU_HOA_TABLE: readonly (readonly [string, string, string, string])[] = [
  ['LiemTrinh', 'PhaQuan', 'VuKhuc', 'ThaiDuong'],     // Giáp
  ['ThienCo', 'ThienLuong', 'TuVi', 'ThaiAm'],          // Ất
  ['ThienDong', 'ThienCo', 'VanXuong', 'LiemTrinh'],    // Bính
  ['ThaiAm', 'ThienDong', 'ThienCo', 'CuMon'],          // Đinh
  ['ThamLang', 'ThaiAm', 'HuuBat', 'ThienCo'],          // Mậu
  ['VuKhuc', 'ThamLang', 'ThienLuong', 'VanKhuc'],      // Kỷ
  ['ThaiDuong', 'VuKhuc', 'ThaiAm', 'ThienDong'],        // Canh (Trung Châu)
  ['CuMon', 'ThaiDuong', 'VanKhuc', 'VanXuong'],        // Tân
  ['ThienLuong', 'TuVi', 'ThienPhu', 'VuKhuc'],         // Nhâm
  ['PhaQuan', 'CuMon', 'ThaiAm', 'ThamLang'],           // Quý
] as const

const TU_HOA_TYPES: readonly TuHoaType[] = ['loc', 'quyen', 'khoa', 'ky'] as const

export function placeTuHoa(yearStemIndex: number): { starId: string; type: TuHoaType }[] {
  const row = TU_HOA_TABLE[yearStemIndex]
  return row.map((starId, i) => ({ starId, type: TU_HOA_TYPES[i] }))
}

// ─── Year Stem/Branch Index ───
export function getYearStemIndex(lunarYear: number): number {
  return (lunarYear - 4) % 10
}

export function getYearBranchIndex(lunarYear: number): number {
  return (lunarYear - 4) % 12
}

// ─── Âm/Dương direction ───
// Returns 1 (clockwise) or -1 (counter-clockwise)
// Dương Nam / Âm Nữ = 1, Âm Nam / Dương Nữ = -1
export function getDirection(yearStemIndex: number, gender: 'Nam' | 'Nữ'): 1 | -1 {
  const isYearDuong = yearStemIndex % 2 === 0
  const isMale = gender === 'Nam'
  return (isYearDuong === isMale) ? 1 : -1
}

// ─── Lộc Tồn Position ───
// Lộc Tồn position by year stem (0-based)
const LOC_TON_BY_STEM: readonly number[] = [
  2,  // Giáp → Dần
  3,  // Ất → Mão
  5,  // Bính → Tỵ
  6,  // Đinh → Ngọ
  5,  // Mậu → Tỵ
  6,  // Kỷ → Ngọ
  8,  // Canh → Thân
  9,  // Tân → Dậu
  11, // Nhâm → Hợi
  0,  // Quý → Tý
] as const

export function placeLocTon(yearStemIndex: number): number {
  return LOC_TON_BY_STEM[yearStemIndex]
}

// ─── Kình Dương / Đà La ───
export function placeKinhDuong(locTonPos: number): number {
  return mod12(locTonPos + 1)
}

export function placeDaLa(locTonPos: number): number {
  return mod12(locTonPos - 1)
}

// ─── Lộc Tồn Ring (12 stars from Lộc Tồn, direction by gender) ───
const LOC_TON_RING_IDS = [
  'BacSy', 'LucSi', 'ThanhLong', 'TieuHao', 'TuongQuan',
  'TauThu', 'PhiLiem', 'HyThan', 'BenhPhu', 'DaiHao', 'PhucBinh', 'QuanPhu2',
] as const

export function placeLocTonRing(locTonPos: number, direction: 1 | -1): Record<string, number> {
  const result: Record<string, number> = { LocTon: locTonPos }
  // Bác Sỹ is at same position as Lộc Tồn
  result.BacSy = locTonPos
  // Remaining 11 stars at offsets 1-11 in direction
  for (let i = 1; i < LOC_TON_RING_IDS.length; i++) {
    result[LOC_TON_RING_IDS[i]] = mod12(locTonPos + i * direction)
  }
  return result
}

// ─── Hỏa Tinh / Linh Tinh ───
// Starting palaces by year branch groups (0-based branches)
// chiNam groups: [2,6,10]=Dan/Than/Tuat, [0,4,8]=Ty/Thin/Than, [5,9,1]=Ty/Dau/Suu, [11,3,7]=Hoi/Mao/Mui
const HOA_LINH_STARTS: readonly { branches: readonly number[]; hoa: number; linh: number }[] = [
  { branches: [2, 6, 10], hoa: 1, linh: 3 },   // Sửu, Mão
  { branches: [0, 4, 8],  hoa: 2, linh: 10 },   // Dần, Tuất
  { branches: [5, 9, 1],  hoa: 10, linh: 3 },   // Tuất, Mão
  { branches: [11, 3, 7], hoa: 9, linh: 10 },    // Dậu, Tuất
] as const

export function placeHoaLinh(
  yearBranchIndex: number,
  hourIndex: number,
  direction: 1 | -1,
): { hoaTinh: number; linhTinh: number } {
  const group = HOA_LINH_STARTS.find(g => g.branches.includes(yearBranchIndex))!
  let hoaTinh: number
  let linhTinh: number

  if (direction === -1) {
    // Âm Nam / Dương Nữ
    hoaTinh = mod12(group.hoa + 1 - hourIndex)
    linhTinh = mod12(group.linh - 1 + hourIndex)
  } else {
    // Dương Nam / Âm Nữ
    hoaTinh = mod12(group.hoa - 1 + hourIndex)
    linhTinh = mod12(group.linh + 1 - hourIndex)
  }
  return { hoaTinh, linhTinh }
}

// ─── Địa Không / Địa Kiếp ───
export function placeDiaKhongKiep(hourIndex: number): { diaKhong: number; diaKiep: number } {
  const diaKiep = mod12(11 + hourIndex) // Hợi + hour (0-based, so 11 + hour)
  const diaKhong = mod12(11 - hourIndex) // mirror
  return { diaKhong, diaKiep }
}

// ─── Văn Xương / Văn Khúc ───
export function placeVanXuongKhuc(hourIndex: number): { vanXuong: number; vanKhuc: number } {
  const vanKhuc = mod12(4 + hourIndex)   // Thìn + hour
  const vanXuong = mod12(4 - hourIndex)  // mirror through Sửu-Mùi
  return { vanXuong, vanKhuc }
}

// ─── Tả Phù / Hữu Bật ───
export function placeTaPhuHuuBat(lunarMonth: number): { taPhu: number; huuBat: number } {
  const taPhu = mod12(4 + lunarMonth - 1)   // Thìn + month-1
  const huuBat = mod12(4 - lunarMonth + 1)  // mirror
  return { taPhu, huuBat }
}

// ─── Thiên Khôi / Thiên Việt ───
// By year stem (0-based)
const THIEN_KHOI_BY_STEM: readonly number[] = [
  1,  // Giáp → Sửu
  0,  // Ất → Tý
  11, // Bính → Hợi
  9,  // Đinh → Dậu
  7,  // Mậu → Mùi
  0,  // Kỷ → Tý
  7,  // Canh → Mùi
  6,  // Tân → Ngọ
  5,  // Nhâm → Tỵ
  3,  // Quý → Mão
] as const

export function placeThienKhoiViet(yearStemIndex: number): { thienKhoi: number; thienViet: number } {
  const thienKhoi = THIEN_KHOI_BY_STEM[yearStemIndex]
  // Mirror through Thìn-Tuất axis: (4 + (4 - khoi)) = (8 - khoi)
  const thienViet = mod12(8 - thienKhoi)
  return { thienKhoi, thienViet }
}

// ─── Thái Tuế Ring (12 stars from year branch) ───
const THAI_TUE_RING_IDS = [
  'ThaiTue', 'ThieuDuong', 'TangMon', 'ThieuAm',
  'QuanPhu3', 'TuPhu', 'TuePha', 'LongDuc',
  'BachHo', 'PhucDuc2', 'DieuKhach', 'TrucPhu',
] as const

export function placeThaiTueRing(yearBranchIndex: number): Record<string, number> {
  const result: Record<string, number> = {}
  for (let i = 0; i < THAI_TUE_RING_IDS.length; i++) {
    result[THAI_TUE_RING_IDS[i]] = mod12(yearBranchIndex + i)
  }
  return result
}

// ─── Tràng Sinh Ring (12 stars) ───
// Starting position by Cục element
function getTrangSinhStart(cuc: CucType): number {
  switch (cuc) {
    case 6: return 2   // Hỏa → Dần
    case 4: return 5   // Kim → Tỵ
    case 2: return 8   // Thủy → Thân
    case 5: return 8   // Thổ → Thân
    case 3: return 11  // Mộc → Hợi
  }
}

const TRANG_SINH_RING_IDS = [
  'TrangSinh', 'MocDuc', 'QuanDoi', 'LamQuan', 'DeVuong', 'Suy',
  'BenhTS', 'TuTS', 'MoTS', 'TuyetTS', 'ThaiTS', 'DuongTS',
] as const

export function placeTrangSinhRing(cuc: CucType, direction: 1 | -1): Record<string, number> {
  const start = getTrangSinhStart(cuc)
  const result: Record<string, number> = {}
  for (let i = 0; i < 10; i++) {
    result[TRANG_SINH_RING_IDS[i]] = mod12(start + i * direction)
  }
  // Thai and Duong go in REVERSE direction
  result.ThaiTS = mod12(start - 1 * direction)
  result.DuongTS = mod12(start - 2 * direction)
  return result
}

// ─── Tuần / Triệt ───
export function calculateTriet(yearStemIndex: number): [number, number] {
  // canNam 0-based: 0,5 → (8,9), 1,6 → (6,7), 2,7 → (4,5), 3,8 → (2,3), 4,9 → (0,1)
  const group = yearStemIndex % 5
  const first = mod12(8 - group * 2)
  return [first, mod12(first + 1)]
}

export function calculateTuan(yearStemIndex: number, yearBranchIndex: number): [number, number] {
  // End of Tuần = branch + (9 - stem) → then Tuần occupies next two palaces
  const endTuan = mod12(yearBranchIndex + 9 - yearStemIndex)
  const tuan1 = mod12(endTuan + 1)
  const tuan2 = mod12(tuan1 + 1)
  return [tuan1, tuan2]
}

// ─── Đại Hạn (Major Periods) ───
export function calculateDaiHan(
  cucValue: CucType,
  menhBranchIndex: number,
  direction: 1 | -1,
): { branchIndex: number; startAge: number; endAge: number }[] {
  const periods: { branchIndex: number; startAge: number; endAge: number }[] = []
  for (let i = 0; i < 12; i++) {
    const branchIndex = mod12(menhBranchIndex + i * direction)
    const startAge = cucValue + i * 10
    periods.push({
      branchIndex,
      startAge,
      endAge: startAge + 9,
    })
  }
  return periods
}

// ─── Mệnh Chủ / Thân Chủ ───
// Indexed by year branch (0-based)
const MENH_CHU: readonly string[] = [
  'ThamLang',  // Tý
  'CuMon',     // Sửu
  'LocTon',    // Dần
  'VanKhuc',   // Mão
  'LiemTrinh', // Thìn
  'VuKhuc',    // Tỵ
  'PhaQuan',   // Ngọ
  'VuKhuc',    // Mùi
  'LiemTrinh', // Thân
  'VanKhuc',   // Dậu
  'LocTon',    // Tuất
  'CuMon',     // Hợi
] as const

const THAN_CHU: readonly string[] = [
  'LinhTinh',   // Tý
  'ThienTuong',  // Sửu
  'ThienLuong',  // Dần
  'ThienDong',   // Mão
  'VanXuong',    // Thìn
  'ThienCo',     // Tỵ
  'HoaTinh',     // Ngọ
  'ThienTuong',  // Mùi
  'ThienLuong',  // Thân
  'ThienDong',   // Dậu
  'VanXuong',    // Tuất
  'ThienCo',     // Hợi
] as const

export function getMenhChu(yearBranchIndex: number): string {
  return MENH_CHU[yearBranchIndex]
}

export function getThanChu(yearBranchIndex: number): string {
  return THAN_CHU[yearBranchIndex]
}

// ─── Nạp Âm ───
const NAP_AM_ELEMENTS: readonly Element[] = [
  'Kim', 'Thủy', 'Hỏa', 'Thổ', 'Mộc',
  'Kim', 'Thủy', 'Hỏa', 'Thổ', 'Mộc',
  'Kim', 'Thủy', 'Hỏa', 'Thổ', 'Mộc',
  'Kim', 'Thủy', 'Hỏa', 'Thổ', 'Mộc',
  'Kim', 'Thủy', 'Hỏa', 'Thổ', 'Mộc',
  'Kim', 'Thủy', 'Hỏa', 'Thổ', 'Mộc',
] as const

const NAP_AM_NAMES: readonly string[] = [
  'Hải Trung Kim',    // 0: Giáp Tý, Ất Sửu
  'Giản Hạ Thủy',     // 1: Bính Tý, Đinh Sửu
  'Tích Lịch Hỏa',    // 2: Mậu Tý, Kỷ Sửu
  'Bích Thượng Thổ',   // 3: Canh Tý, Tân Sửu
  'Tang Đố Mộc',       // 4: Nhâm Tý, Quý Sửu
  'Đại Khê Thủy',      // 5: Giáp Dần, Ất Mão
  'Lô Trung Hỏa',     // 6: Bính Dần, Đinh Mão
  'Thành Đầu Thổ',    // 7: Mậu Dần, Kỷ Mão
  'Tùng Bá Mộc',      // 8: Canh Dần, Tân Mão
  'Kim Bạch Kim',      // 9: Nhâm Dần, Quý Mão
  'Phú Đăng Hỏa',     // 10: Giáp Thìn, Ất Tỵ
  'Sa Trung Thổ',      // 11: Bính Thìn, Đinh Tỵ
  'Đại Lâm Mộc',       // 12: Mậu Thìn, Kỷ Tỵ
  'Bạch Lạp Kim',      // 13: Canh Thìn, Tân Tỵ
  'Tràng Lưu Thủy',    // 14: Nhâm Thìn, Quý Tỵ
  'Sa Trung Kim',      // 15: Giáp Ngọ, Ất Mùi
  'Thiên Hà Thủy',     // 16: Bính Ngọ, Đinh Mùi
  'Thiên Thượng Hỏa',  // 17: Mậu Ngọ, Kỷ Mùi
  'Lộ Bàn Thổ',        // 18: Canh Ngọ, Tân Mùi
  'Dương Liễu Mộc',    // 19: Nhâm Ngọ, Quý Mùi
  'Tuyền Trung Thủy',  // 20: Giáp Thân, Ất Dậu
  'Sơn Hạ Hỏa',       // 21: Bính Thân, Đinh Dậu
  'Đại Trạch Thổ',     // 22: Mậu Thân, Kỷ Dậu
  'Thạch Lựu Mộc',    // 23: Canh Thân, Tân Dậu
  'Kiếm Phong Kim',    // 24: Nhâm Thân, Quý Dậu
  'Sơn Đầu Hỏa',      // 25: Giáp Tuất, Ất Hợi
  'Ốc Thượng Thổ',     // 26: Bính Tuất, Đinh Hợi
  'Bình Địa Mộc',      // 27: Mậu Tuất, Kỷ Hợi
  'Xoa Xuyến Kim',     // 28: Canh Tuất, Tân Hợi
  'Đại Hải Thủy',      // 29: Nhâm Tuất, Quý Hợi
] as const

export function getNapAm(yearStemIndex: number, yearBranchIndex: number): NapAmInfo {
  // 60-year cycle index: each pair of branches maps to 5 nap am entries
  // branchPair = floor(branch / 2), stemPair = floor(stem / 2)
  // napAmIndex = branchPair * 5 + stemPair
  const branchPair = Math.floor(yearBranchIndex / 2)
  const stemPair = Math.floor(yearStemIndex / 2)
  const idx = branchPair * 5 + stemPair
  return {
    name: NAP_AM_NAMES[idx],
    element: NAP_AM_ELEMENTS[idx],
  }
}

// ─── Sinh Khắc ───
// Element indices: Kim=0, Mộc=1, Thủy=2, Hỏa=3, Thổ=4
const ELEMENT_INDEX: Record<string, number> = {
  'Kim': 0, 'Mộc': 1, 'Thủy': 2, 'Hỏa': 3, 'Thổ': 4,
}

// sinh cycle: Kim→Thủy→Mộc→Hỏa→Thổ→Kim
// khac cycle: Kim→Mộc, Mộc→Thổ, Thổ→Thủy, Thủy→Hỏa, Hỏa→Kim
const SINH_TARGET: readonly number[] = [2, 3, 1, 4, 0] // Kim sinh Thủy, Mộc sinh Hỏa, ...
const KHAC_TARGET: readonly number[] = [1, 4, 3, 0, 2] // Kim khắc Mộc, Mộc khắc Thổ, ...

export function calculateSinhKhac(menhElement: string, cucElement: string): SinhKhacResult {
  const a = ELEMENT_INDEX[menhElement]
  const b = ELEMENT_INDEX[cucElement]

  if (a === b) {
    return { relation: 'hoa', direction: 'Mệnh hòa Cục', description: 'Cùng hành, hòa hợp tương trợ' }
  }
  if (SINH_TARGET[a] === b) {
    return { relation: 'sinh', direction: 'Mệnh sinh Cục', description: 'Mệnh sinh Cục, hao tổn nguyên khí nhưng thuận lợi' }
  }
  if (SINH_TARGET[b] === a) {
    return { relation: 'sinh', direction: 'Cục sinh Mệnh', description: 'Cục sinh Mệnh, được trợ lực, thuận lợi nhất' }
  }
  if (KHAC_TARGET[a] === b) {
    return { relation: 'khac', direction: 'Mệnh khắc Cục', description: 'Mệnh khắc Cục, chủ động nhưng gây mâu thuẫn' }
  }
  return { relation: 'khac', direction: 'Cục khắc Mệnh', description: 'Cục khắc Mệnh, bị áp chế, bất lợi' }
}

// ─── Minor Stars ───

// Long Trì / Phượng Các
export function placeLongTriPhuongCac(yearBranchIndex: number): { longTri: number; phuongCac: number } {
  const longTri = mod12(4 + yearBranchIndex)   // Thìn + chiNam
  const phuongCac = mod12(4 - yearBranchIndex) // mirror
  return { longTri, phuongCac }
}

// Tam Thai / Bát Tọa
export function placeTamThaiBatToa(lunarMonth: number, lunarDay: number): { tamThai: number; batToa: number } {
  const tamThai = mod12(4 + lunarMonth + lunarDay - 2)
  const batToa = mod12(4 - lunarMonth - lunarDay + 2)
  return { tamThai, batToa }
}

// Ân Quang / Thiên Quý
export function placeAnQuangThienQuy(vanXuongPos: number, lunarDay: number): { anQuang: number; thienQuy: number } {
  const anQuang = mod12(vanXuongPos + lunarDay - 2)
  const thienQuy = mod12(4 - anQuang + 4) // mirror through Sửu-Mùi → (2+2-anQuang) but actually (1+1 - anQuang) 0-based
  // Actually mirror formula: dichCung(2, 2 - pos) in 1-based = (1 + 1 - pos) 0-based = mod12(2 - anQuang) ...
  // Let me recalculate: Python: dichCung(2, 2 - viTriAnQuang) = (2 + 2 - pos) mod 12 (1-based) = (4 - pos) 1-based
  // 0-based: (4 - 1 - (anQuang)) = (3 - anQuang)... no.
  // 1-based result = (4 - pos1based) mod12. pos1based = anQuang+1. So result1based = (4 - anQuang - 1) mod12 = (3 - anQuang) mod12
  // 0-based result = result1based - 1 = (2 - anQuang) mod12
  const thienQuyCorrected = mod12(2 - anQuang)
  return { anQuang, thienQuy: thienQuyCorrected }
}

// Thiên Khốc / Thiên Hư
export function placeThienKhocHu(yearBranchIndex: number): { thienKhoc: number; thienHu: number } {
  const thienHu = mod12(6 + yearBranchIndex)   // Ngọ + chiNam forward
  const thienKhoc = mod12(6 - yearBranchIndex) // Ngọ - chiNam backward
  return { thienKhoc, thienHu }
}

// Thiên Đức / Nguyệt Đức (same palace as Tử Phù and Phúc Đức in Thái Tuế ring)
// ThienDuc at PhucDuc2 position (+9 from ThaiTue), NguyetDuc at TuPhu position (+5)

// Thiên Tài / Thiên Thọ
export function placeThienTaiTho(menhPos: number, thanPos: number, yearBranchIndex: number): { thienTai: number; thienTho: number } {
  const thienTai = mod12(menhPos + yearBranchIndex)
  const thienTho = mod12(thanPos + yearBranchIndex)
  return { thienTai, thienTho }
}

// Hồng Loan / Thiên Hỷ
export function placeHongLoanThienHy(yearBranchIndex: number): { hongLoan: number; thienHy: number } {
  const hongLoan = mod12(3 - yearBranchIndex) // Mão backward
  const thienHy = mod12(hongLoan + 6)         // opposite
  return { hongLoan, thienHy }
}

// Thiên Hình
export function placeThienHinh(lunarMonth: number): number {
  return mod12(9 + lunarMonth - 1) // Dậu + month-1
}

// Thiên Riêu (offset from Thiên Hình)
export function placeThienRieu(thienHinhPos: number): number {
  return mod12(thienHinhPos + 4)
}

// Thiên Y (same palace as Thiên Riêu)
export function placeThienY(thienRieuPos: number): number {
  return thienRieuPos
}

// Cô Thần by year branch group
export function placeCoThan(yearBranchIndex: number): number {
  if ([11, 0, 1].includes(yearBranchIndex)) return 2  // Dần
  if ([2, 3, 4].includes(yearBranchIndex)) return 5   // Tỵ
  if ([5, 6, 7].includes(yearBranchIndex)) return 8   // Thân
  return 11 // Hợi (branches 8,9,10)
}

// Quả Tú
export function placeQuaTu(coThanPos: number): number {
  return mod12(coThanPos - 4)
}

// Thiên Mã by year branch
export function placeThienMa(yearBranchIndex: number): number {
  // chiNam % 4 pattern (1-based): 1→Dan, 2→Hoi, 3→Than, 0→Ty
  // 0-based: 0→2, 1→11, 2→8, 3→5, 4→2, 5→11, 6→8, 7→5, 8→2, 9→11, 10→8, 11→5
  const lookup = [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5]
  return lookup[yearBranchIndex]
}

// Hoa Cái (from Thiên Mã +2)
export function placeHoaCai(thienMaPos: number): number {
  return mod12(thienMaPos + 2)
}

// Kiếp Sát (from Thiên Mã +3)
export function placeKiepSat(thienMaPos: number): number {
  return mod12(thienMaPos + 3)
}

// Đào Hoa (from Kiếp Sát +4)
export function placeDaoHoa(kiepSatPos: number): number {
  return mod12(kiepSatPos + 4)
}

// Phá Toái by year branch
export function placePhaToai(yearBranchIndex: number): number {
  // 1-based: chiNam%3==0→Ty(6), ==1→Dau(10), ==2→Suu(2)
  // 0-based branch: (branch+1)%3
  const b1 = yearBranchIndex + 1 // to 1-based
  const r = b1 % 3
  if (r === 0) return 5  // Tỵ (1-based 6, 0-based 5)
  if (r === 1) return 9  // Dậu (1-based 10, 0-based 9)
  return 1               // Sửu (1-based 2, 0-based 1)
}

// Thiên Quan / Thiên Phúc by year stem
const THIEN_QUAN_BY_STEM: readonly number[] = [7, 4, 5, 2, 3, 9, 11, 9, 10, 6]
const THIEN_PHUC_BY_STEM: readonly number[] = [9, 8, 0, 11, 3, 2, 6, 5, 6, 5]

export function placeThienQuanPhuc(yearStemIndex: number): { thienQuan: number; thienPhuc: number } {
  return {
    thienQuan: THIEN_QUAN_BY_STEM[yearStemIndex],
    thienPhuc: THIEN_PHUC_BY_STEM[yearStemIndex],
  }
}

// Lưu Hà / Thiên Trù by year stem
const LUU_HA_BY_STEM: readonly number[] = [9, 10, 7, 4, 5, 6, 8, 3, 11, 2]
const THIEN_TRU_BY_STEM: readonly number[] = [5, 6, 0, 5, 6, 8, 2, 6, 9, 10]

export function placeLuuHaThienTru(yearStemIndex: number): { luuHa: number; thienTru: number } {
  return {
    luuHa: LUU_HA_BY_STEM[yearStemIndex],
    thienTru: THIEN_TRU_BY_STEM[yearStemIndex],
  }
}

// Văn Tinh / Đường Phù / Quốc Ấn (chain from Kình Dương)
export function placeVanTinhDuongPhuQuocAn(kinhDuongPos: number): { vanTinh: number; duongPhu: number; quocAn: number } {
  const vanTinh = mod12(kinhDuongPos + 2)
  const duongPhu = mod12(vanTinh + 2)
  const quocAn = mod12(duongPhu + 3)
  return { vanTinh, duongPhu, quocAn }
}

// Thai Phụ / Phong Cáo (from Văn Khúc)
export function placeThaiPhuPhongCao(vanKhucPos: number): { thaiPhu: number; phongCao: number } {
  return {
    thaiPhu: mod12(vanKhucPos + 2),
    phongCao: mod12(vanKhucPos - 2),
  }
}

// Thiên Giải / Địa Giải / Giải Thần
export function placeGiaiThan(lunarMonth: number, taPhuPos: number): { thienGiai: number; diaGiai: number; giaiThan: number } {
  const thienGiai = mod12(8 + (lunarMonth - 1) * 2)  // Thân + 2*(month-1)
  const diaGiai = mod12(taPhuPos + 3)
  // Giải Thần at same palace as Phượng Các
  return { thienGiai, diaGiai, giaiThan: -1 } // giaiThan set separately at phuongCac position
}

// Thiên Không (same position as Thiếu Dương in Thái Tuế ring = yearBranch + 1)
export function placeThienKhong(yearBranchIndex: number): number {
  return mod12(yearBranchIndex + 1)
}

// Thiên La / Địa Võng (always fixed)
export const THIEN_LA = 4  // Thìn
export const DIA_VONG = 10 // Tuất

// Thiên Thương / Thiên Sứ (relative to Mệnh)
export function placeThienThuongSu(menhPos: number): { thienThuong: number; thienSu: number } {
  // Thiên Thương at Nô Bộc (Mệnh - 7 counter-clockwise = Mệnh + 5 clockwise in palace order)
  // But palace order is counter-clockwise, so Nô Bộc is palace index 7
  // The branch position = menhPos - 7 (since palaces go counter-clockwise)
  // Actually: Nô Bộc is 7 palaces from Mệnh counter-clockwise, so branch = menhPos - 7
  const thienThuong = mod12(menhPos - 7)
  // Thiên Sứ at Tật Ách = 5 palaces counter-clockwise from Mệnh
  const thienSu = mod12(menhPos - 5)
  return { thienThuong, thienSu }
}

// Đẩu Quân
export function placeDauQuan(yearBranchIndex: number, lunarMonth: number, hourIndex: number): number {
  return mod12(yearBranchIndex - lunarMonth + hourIndex)
}
