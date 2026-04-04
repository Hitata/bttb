// 12 Palace definitions — fixed order Mệnh → Phụ Mẫu
// Palace names rotate into Earthly Branch positions based on Mệnh assignment

import type { EarthlyBranch } from './types'

export const EARTHLY_BRANCHES: readonly EarthlyBranch[] = [
  'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ',
  'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi',
] as const

export const HEAVENLY_STEMS = [
  'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu',
  'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý',
] as const

// Palace definitions in fixed order (counter-clockwise from Mệnh)
export const PALACE_NAMES = [
  { name: 'Mệnh', nameEn: 'Destiny', domain: 'Tính cách, bản mệnh, vận mệnh tổng quan' },
  { name: 'Huynh Đệ', nameEn: 'Siblings', domain: 'Anh chị em, bạn bè đồng trang lứa' },
  { name: 'Phu Thê', nameEn: 'Marriage', domain: 'Hôn nhân, đối tác, tình cảm' },
  { name: 'Tử Tức', nameEn: 'Children', domain: 'Con cái, sáng tạo, hậu duệ' },
  { name: 'Tài Bạch', nameEn: 'Wealth', domain: 'Tài chính, thu nhập, tiền bạc' },
  { name: 'Tật Ách', nameEn: 'Health', domain: 'Sức khỏe, bệnh tật, thể chất' },
  { name: 'Thiên Di', nameEn: 'Travel', domain: 'Di chuyển, xuất ngoại, quan hệ xã hội' },
  { name: 'Nô Bộc', nameEn: 'Staff', domain: 'Cấp dưới, nhân viên, người giúp đỡ' },
  { name: 'Quan Lộc', nameEn: 'Career', domain: 'Sự nghiệp, công danh, chức vụ' },
  { name: 'Điền Trạch', nameEn: 'Property', domain: 'Nhà cửa, bất động sản, gia sản' },
  { name: 'Phúc Đức', nameEn: 'Fortune', domain: 'Phúc đức, tâm linh, tổ tiên' },
  { name: 'Phụ Mẫu', nameEn: 'Parents', domain: 'Cha mẹ, học vấn, giáo dục' },
] as const

// Cục names and elements
export const CUC_INFO: Record<number, { name: string; element: string }> = {
  2: { name: 'Thủy Nhị Cục', element: 'Thủy' },
  3: { name: 'Mộc Tam Cục', element: 'Mộc' },
  4: { name: 'Kim Tứ Cục', element: 'Kim' },
  5: { name: 'Thổ Ngũ Cục', element: 'Thổ' },
  6: { name: 'Hỏa Lục Cục', element: 'Hỏa' },
}

// Map birth hour (0-23) to Earthly Branch index (0-11)
// Tý: 23-01, Sửu: 01-03, Dần: 03-05, ...
export function hourToBranchIndex(hour: number): number {
  // 23:00-00:59 = Tý (0), 01:00-02:59 = Sửu (1), etc.
  if (hour === 23) return 0
  return Math.floor((hour + 1) / 2)
}
