import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './constants'
import type { CompassData, CompassDirection } from './types'

/**
 * Compute Feng Shui compass directions (Phương Hướng)
 * Based on the day stem
 *
 * Each day stem has 4 good and 4 bad directions.
 * This uses the Ba Trạch (八宅) / East-West system.
 */

interface DirectionInfo {
  name: string
  compass: string
  zodiac: string
  fiveElements: string
}

// Good/Bad directions based on day stem's Kua number equivalent
// Simplified mapping using traditional Bazi compass rules
const COMPASS_TABLE: Record<number, { good: DirectionInfo[]; bad: DirectionInfo[] }> = {
  // Giáp (Wood Yang)
  0: {
    good: [
      { name: 'Sinh Khí', compass: 'Đông Nam (135°)', zodiac: 'Tỵ-Ngọ', fiveElements: 'Mộc' },
      { name: 'Thiên Y', compass: 'Đông (90°)', zodiac: 'Mão', fiveElements: 'Mộc' },
      { name: 'Diên Niên', compass: 'Nam (180°)', zodiac: 'Ngọ', fiveElements: 'Hỏa' },
      { name: 'Phục Vị', compass: 'Bắc (0°)', zodiac: 'Tý', fiveElements: 'Thủy' },
    ],
    bad: [
      { name: 'Tuyệt Mệnh', compass: 'Tây Nam (225°)', zodiac: 'Mùi-Thân', fiveElements: 'Thổ' },
      { name: 'Ngũ Quỷ', compass: 'Đông Bắc (45°)', zodiac: 'Sửu-Dần', fiveElements: 'Thổ' },
      { name: 'Lục Sát', compass: 'Tây Bắc (315°)', zodiac: 'Tuất-Hợi', fiveElements: 'Kim' },
      { name: 'Họa Hại', compass: 'Tây (270°)', zodiac: 'Dậu', fiveElements: 'Kim' },
    ],
  },
  // Ất (Wood Yin) - same group as Giáp
  1: {
    good: [
      { name: 'Sinh Khí', compass: 'Đông Nam (135°)', zodiac: 'Tỵ-Ngọ', fiveElements: 'Mộc' },
      { name: 'Thiên Y', compass: 'Đông (90°)', zodiac: 'Mão', fiveElements: 'Mộc' },
      { name: 'Diên Niên', compass: 'Nam (180°)', zodiac: 'Ngọ', fiveElements: 'Hỏa' },
      { name: 'Phục Vị', compass: 'Bắc (0°)', zodiac: 'Tý', fiveElements: 'Thủy' },
    ],
    bad: [
      { name: 'Tuyệt Mệnh', compass: 'Tây Nam (225°)', zodiac: 'Mùi-Thân', fiveElements: 'Thổ' },
      { name: 'Ngũ Quỷ', compass: 'Đông Bắc (45°)', zodiac: 'Sửu-Dần', fiveElements: 'Thổ' },
      { name: 'Lục Sát', compass: 'Tây Bắc (315°)', zodiac: 'Tuất-Hợi', fiveElements: 'Kim' },
      { name: 'Họa Hại', compass: 'Tây (270°)', zodiac: 'Dậu', fiveElements: 'Kim' },
    ],
  },
  // Bính (Fire Yang)
  2: {
    good: [
      { name: 'Sinh Khí', compass: 'Nam (180°)', zodiac: 'Ngọ', fiveElements: 'Hỏa' },
      { name: 'Thiên Y', compass: 'Đông Nam (135°)', zodiac: 'Tỵ-Ngọ', fiveElements: 'Hỏa' },
      { name: 'Diên Niên', compass: 'Đông (90°)', zodiac: 'Mão', fiveElements: 'Mộc' },
      { name: 'Phục Vị', compass: 'Bắc (0°)', zodiac: 'Tý', fiveElements: 'Thủy' },
    ],
    bad: [
      { name: 'Tuyệt Mệnh', compass: 'Tây (270°)', zodiac: 'Dậu', fiveElements: 'Kim' },
      { name: 'Ngũ Quỷ', compass: 'Tây Bắc (315°)', zodiac: 'Tuất-Hợi', fiveElements: 'Kim' },
      { name: 'Lục Sát', compass: 'Tây Nam (225°)', zodiac: 'Mùi-Thân', fiveElements: 'Thổ' },
      { name: 'Họa Hại', compass: 'Đông Bắc (45°)', zodiac: 'Sửu-Dần', fiveElements: 'Thổ' },
    ],
  },
  // Đinh (Fire Yin)
  3: {
    good: [
      { name: 'Sinh Khí', compass: 'Nam (180°)', zodiac: 'Ngọ', fiveElements: 'Hỏa' },
      { name: 'Thiên Y', compass: 'Đông Nam (135°)', zodiac: 'Tỵ-Ngọ', fiveElements: 'Hỏa' },
      { name: 'Diên Niên', compass: 'Đông (90°)', zodiac: 'Mão', fiveElements: 'Mộc' },
      { name: 'Phục Vị', compass: 'Bắc (0°)', zodiac: 'Tý', fiveElements: 'Thủy' },
    ],
    bad: [
      { name: 'Tuyệt Mệnh', compass: 'Tây (270°)', zodiac: 'Dậu', fiveElements: 'Kim' },
      { name: 'Ngũ Quỷ', compass: 'Tây Bắc (315°)', zodiac: 'Tuất-Hợi', fiveElements: 'Kim' },
      { name: 'Lục Sát', compass: 'Tây Nam (225°)', zodiac: 'Mùi-Thân', fiveElements: 'Thổ' },
      { name: 'Họa Hại', compass: 'Đông Bắc (45°)', zodiac: 'Sửu-Dần', fiveElements: 'Thổ' },
    ],
  },
  // Mậu (Earth Yang)
  4: {
    good: [
      { name: 'Sinh Khí', compass: 'Tây Nam (225°)', zodiac: 'Mùi-Thân', fiveElements: 'Thổ' },
      { name: 'Thiên Y', compass: 'Tây (270°)', zodiac: 'Dậu', fiveElements: 'Kim' },
      { name: 'Diên Niên', compass: 'Tây Bắc (315°)', zodiac: 'Tuất-Hợi', fiveElements: 'Kim' },
      { name: 'Phục Vị', compass: 'Đông Bắc (45°)', zodiac: 'Sửu-Dần', fiveElements: 'Thổ' },
    ],
    bad: [
      { name: 'Tuyệt Mệnh', compass: 'Bắc (0°)', zodiac: 'Tý', fiveElements: 'Thủy' },
      { name: 'Ngũ Quỷ', compass: 'Đông (90°)', zodiac: 'Mão', fiveElements: 'Mộc' },
      { name: 'Lục Sát', compass: 'Nam (180°)', zodiac: 'Ngọ', fiveElements: 'Hỏa' },
      { name: 'Họa Hại', compass: 'Đông Nam (135°)', zodiac: 'Tỵ-Ngọ', fiveElements: 'Hỏa' },
    ],
  },
  // Kỷ (Earth Yin)
  5: {
    good: [
      { name: 'Sinh Khí', compass: 'Đông Bắc (45°)', zodiac: 'Sửu-Dần', fiveElements: 'Thổ' },
      { name: 'Thiên Y', compass: 'Tây (270°)', zodiac: 'Dậu', fiveElements: 'Kim' },
      { name: 'Diên Niên', compass: 'Tây Bắc (315°)', zodiac: 'Tuất-Hợi', fiveElements: 'Kim' },
      { name: 'Phục Vị', compass: 'Tây Nam (225°)', zodiac: 'Mùi-Thân', fiveElements: 'Thổ' },
    ],
    bad: [
      { name: 'Tuyệt Mệnh', compass: 'Đông Nam (135°)', zodiac: 'Tỵ-Ngọ', fiveElements: 'Hỏa' },
      { name: 'Ngũ Quỷ', compass: 'Đông (90°)', zodiac: 'Mão', fiveElements: 'Mộc' },
      { name: 'Lục Sát', compass: 'Nam (180°)', zodiac: 'Ngọ', fiveElements: 'Hỏa' },
      { name: 'Họa Hại', compass: 'Bắc (0°)', zodiac: 'Tý', fiveElements: 'Thủy' },
    ],
  },
  // Canh (Metal Yang)
  6: {
    good: [
      { name: 'Sinh Khí', compass: 'Tây Bắc (315°)', zodiac: 'Tuất-Hợi', fiveElements: 'Kim' },
      { name: 'Thiên Y', compass: 'Tây Nam (225°)', zodiac: 'Mùi-Thân', fiveElements: 'Thổ' },
      { name: 'Diên Niên', compass: 'Đông Bắc (45°)', zodiac: 'Sửu-Dần', fiveElements: 'Thổ' },
      { name: 'Phục Vị', compass: 'Tây (270°)', zodiac: 'Dậu', fiveElements: 'Kim' },
    ],
    bad: [
      { name: 'Tuyệt Mệnh', compass: 'Nam (180°)', zodiac: 'Ngọ', fiveElements: 'Hỏa' },
      { name: 'Ngũ Quỷ', compass: 'Đông Nam (135°)', zodiac: 'Tỵ-Ngọ', fiveElements: 'Hỏa' },
      { name: 'Lục Sát', compass: 'Đông (90°)', zodiac: 'Mão', fiveElements: 'Mộc' },
      { name: 'Họa Hại', compass: 'Bắc (0°)', zodiac: 'Tý', fiveElements: 'Thủy' },
    ],
  },
  // Tân (Metal Yin)
  7: {
    good: [
      { name: 'Sinh Khí', compass: 'Tây (270°)', zodiac: 'Dậu', fiveElements: 'Kim' },
      { name: 'Thiên Y', compass: 'Đông Bắc (45°)', zodiac: 'Sửu-Dần', fiveElements: 'Thổ' },
      { name: 'Diên Niên', compass: 'Tây Nam (225°)', zodiac: 'Mùi-Thân', fiveElements: 'Thổ' },
      { name: 'Phục Vị', compass: 'Tây Bắc (315°)', zodiac: 'Tuất-Hợi', fiveElements: 'Kim' },
    ],
    bad: [
      { name: 'Tuyệt Mệnh', compass: 'Đông (90°)', zodiac: 'Mão', fiveElements: 'Mộc' },
      { name: 'Ngũ Quỷ', compass: 'Nam (180°)', zodiac: 'Ngọ', fiveElements: 'Hỏa' },
      { name: 'Lục Sát', compass: 'Bắc (0°)', zodiac: 'Tý', fiveElements: 'Thủy' },
      { name: 'Họa Hại', compass: 'Đông Nam (135°)', zodiac: 'Tỵ-Ngọ', fiveElements: 'Hỏa' },
    ],
  },
  // Nhâm (Water Yang)
  8: {
    good: [
      { name: 'Sinh Khí', compass: 'Bắc (0°)', zodiac: 'Tý', fiveElements: 'Thủy' },
      { name: 'Thiên Y', compass: 'Nam (180°)', zodiac: 'Ngọ', fiveElements: 'Hỏa' },
      { name: 'Diên Niên', compass: 'Đông Nam (135°)', zodiac: 'Tỵ-Ngọ', fiveElements: 'Mộc' },
      { name: 'Phục Vị', compass: 'Đông (90°)', zodiac: 'Mão', fiveElements: 'Mộc' },
    ],
    bad: [
      { name: 'Tuyệt Mệnh', compass: 'Đông Bắc (45°)', zodiac: 'Sửu-Dần', fiveElements: 'Thổ' },
      { name: 'Ngũ Quỷ', compass: 'Tây Nam (225°)', zodiac: 'Mùi-Thân', fiveElements: 'Thổ' },
      { name: 'Lục Sát', compass: 'Tây (270°)', zodiac: 'Dậu', fiveElements: 'Kim' },
      { name: 'Họa Hại', compass: 'Tây Bắc (315°)', zodiac: 'Tuất-Hợi', fiveElements: 'Kim' },
    ],
  },
  // Quý (Water Yin)
  9: {
    good: [
      { name: 'Sinh Khí', compass: 'Đông (90°)', zodiac: 'Mão', fiveElements: 'Mộc' },
      { name: 'Thiên Y', compass: 'Bắc (0°)', zodiac: 'Tý', fiveElements: 'Thủy' },
      { name: 'Diên Niên', compass: 'Nam (180°)', zodiac: 'Ngọ', fiveElements: 'Hỏa' },
      { name: 'Phục Vị', compass: 'Đông Nam (135°)', zodiac: 'Tỵ-Ngọ', fiveElements: 'Mộc' },
    ],
    bad: [
      { name: 'Tuyệt Mệnh', compass: 'Tây Bắc (315°)', zodiac: 'Tuất-Hợi', fiveElements: 'Kim' },
      { name: 'Ngũ Quỷ', compass: 'Tây (270°)', zodiac: 'Dậu', fiveElements: 'Kim' },
      { name: 'Lục Sát', compass: 'Đông Bắc (45°)', zodiac: 'Sửu-Dần', fiveElements: 'Thổ' },
      { name: 'Họa Hại', compass: 'Tây Nam (225°)', zodiac: 'Mùi-Thân', fiveElements: 'Thổ' },
    ],
  },
}

export function getCompassDirections(dayCanIndex: number): CompassData {
  const data = COMPASS_TABLE[dayCanIndex]
  if (!data) {
    return { good: [], bad: [] }
  }
  return data
}
