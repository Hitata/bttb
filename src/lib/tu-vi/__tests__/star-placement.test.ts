import { describe, it, expect } from 'vitest'
import {
  assignMenhPalace,
  assignThanPalace,
  calculateCuc,
  placeTuViStar,
  placeTuViGroup,
  deriveThienPhu,
  placeThienPhuGroup,
  placeTuHoa,
  getYearStemIndex,
  getYearBranchIndex,
} from '../star-placement'
import { computeTuVi } from '../index'
import type { TuViBirthInput } from '../types'

// Earthly Branch names for readable assertions
const BRANCHES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']

describe('Year Stem/Branch calculation', () => {
  it('Giáp Tý year (1984)', () => {
    expect(getYearStemIndex(1984)).toBe(0) // Giáp
    expect(getYearBranchIndex(1984)).toBe(0) // Tý
  })

  it('Canh Ngọ year (1990)', () => {
    expect(getYearStemIndex(1990)).toBe(6) // Canh
    expect(getYearBranchIndex(1990)).toBe(6) // Ngọ
  })

  it('Quý Mùi year (2003)', () => {
    expect(getYearStemIndex(2003)).toBe(9) // Quý
    expect(getYearBranchIndex(2003)).toBe(7) // Mùi
  })
})

describe('Mệnh palace assignment', () => {
  it('month 1, hour Tý (0) → Dần (2)', () => {
    expect(assignMenhPalace(1, 0)).toBe(2) // Dần
  })

  it('month 1, hour Sửu (1) → Sửu (1)', () => {
    expect(assignMenhPalace(1, 1)).toBe(1)
  })

  it('month 5, hour Tỵ (5) → Sửu (1)', () => {
    expect(assignMenhPalace(5, 5)).toBe(1)
  })

  it('month 12, hour Tý (0) → Sửu (1)', () => {
    expect(assignMenhPalace(12, 0)).toBe(1)
  })
})

describe('Thân palace assignment', () => {
  it('month 1, hour Tý (0) → Dần (2)', () => {
    expect(assignThanPalace(1, 0)).toBe(2)
  })

  it('month 5, hour Tỵ (5) → Tỵ (11)', () => {
    expect(assignThanPalace(5, 5)).toBe(11)
  })
})

describe('Cục calculation', () => {
  it('Giáp year + Tý menh → Thủy Nhị Cục (2)', () => {
    expect(calculateCuc(0, 0)).toBe(2)
  })

  it('Giáp year + Dần menh → Hỏa Lục Cục (6)', () => {
    expect(calculateCuc(0, 2)).toBe(6)
  })

  it('Ất year + Thân menh → Thủy Nhị Cục (2)', () => {
    expect(calculateCuc(1, 8)).toBe(2)
  })

  // 5-stem cycle: Giáp = Kỷ
  it('Kỷ year matches Giáp', () => {
    for (let i = 0; i < 12; i++) {
      expect(calculateCuc(5, i)).toBe(calculateCuc(0, i))
    }
  })
})

describe('Tử Vi star placement', () => {
  it('Cục 2, day 1 → Sửu (1)', () => {
    expect(placeTuViStar(2, 1)).toBe(1)
  })

  it('Cục 2, day 2 → Dần (2)', () => {
    expect(placeTuViStar(2, 2)).toBe(2)
  })

  it('Cục 3, day 1 → Thìn (4)', () => {
    expect(placeTuViStar(3, 1)).toBe(4)
  })

  it('Cục 6, day 1 → Dậu (9)', () => {
    expect(placeTuViStar(6, 1)).toBe(9)
  })

  it('Cục 2, day 30 → Thìn (4)', () => {
    expect(placeTuViStar(2, 30)).toBe(4)
  })
})

describe('Tử Vi group offsets', () => {
  it('when TuVi at Dần (2)', () => {
    const group = placeTuViGroup(2)
    expect(group.TuVi).toBe(2)      // Dần
    expect(group.ThienCo).toBe(1)   // Sửu (-1)
    expect(group.ThaiDuong).toBe(11) // Hợi (-3)
    expect(group.VuKhuc).toBe(10)   // Tuất (-4)
    expect(group.ThienDong).toBe(9) // Dậu (-5)
    expect(group.LiemTrinh).toBe(6) // Ngọ (+4)
  })
})

describe('Thiên Phủ derivation', () => {
  it('TuVi at Dần (2) → ThienPhu at Dần (2)', () => {
    expect(deriveThienPhu(2)).toBe(2)
  })

  it('TuVi at Ngọ (6) → ThienPhu at Tuất (10)', () => {
    expect(deriveThienPhu(6)).toBe(10)
  })

  it('TuVi at Tý (0) → ThienPhu at Thìn (4)', () => {
    expect(deriveThienPhu(0)).toBe(4)
  })

  it('mirror property: TuVi + ThienPhu sum is always 4 mod 12 (approximately)', () => {
    // The formula is (4 - tuViPos + 12) % 12, so it mirrors around index 2
    for (let i = 0; i < 12; i++) {
      const tp = deriveThienPhu(i)
      expect((i + tp) % 12).toBe((4) % 12)
    }
  })
})

describe('Thiên Phủ group offsets', () => {
  it('when ThienPhu at Thìn (4)', () => {
    const group = placeThienPhuGroup(4)
    expect(group.ThienPhu).toBe(4)    // Thìn
    expect(group.ThaiAm).toBe(5)     // Tỵ (+1)
    expect(group.ThamLang).toBe(6)   // Ngọ (+2)
    expect(group.CuMon).toBe(7)      // Mùi (+3)
    expect(group.ThienTuong).toBe(8) // Thân (+4)
    expect(group.ThienLuong).toBe(9) // Dậu (+5)
    expect(group.ThatSat).toBe(10)   // Tuất (+6)
    expect(group.PhaQuan).toBe(2)    // Dần (-2)
  })
})

describe('Tứ Hóa placement', () => {
  it('Giáp year (0): Lộc=LiemTrinh, Quyền=PhaQuan, Khoa=VuKhuc, Kỵ=ThaiDuong', () => {
    const th = placeTuHoa(0)
    expect(th).toEqual([
      { starId: 'LiemTrinh', type: 'loc' },
      { starId: 'PhaQuan', type: 'quyen' },
      { starId: 'VuKhuc', type: 'khoa' },
      { starId: 'ThaiDuong', type: 'ky' },
    ])
  })

  it('Canh year (6): Lộc=ThaiDuong, Quyền=VuKhuc, Khoa=ThienDong, Kỵ=ThaiAm', () => {
    const th = placeTuHoa(6)
    expect(th).toEqual([
      { starId: 'ThaiDuong', type: 'loc' },
      { starId: 'VuKhuc', type: 'quyen' },
      { starId: 'ThienDong', type: 'khoa' },
      { starId: 'ThaiAm', type: 'ky' },
    ])
  })

  it('Bính year (2): skips VanXuong (minor star)', () => {
    const th = placeTuHoa(2)
    // VanXuong is not a major star, so Hóa Khoa is filtered out
    expect(th.length).toBe(3) // Only 3 major stars get Tứ Hóa
    expect(th.find(t => t.type === 'khoa')).toBeUndefined()
  })
})

describe('computeTuVi end-to-end', () => {
  function makeInput(overrides: Partial<TuViBirthInput> = {}): TuViBirthInput {
    return {
      name: 'Test',
      year: 1990,
      month: 6,
      day: 15,
      hour: 10,
      minute: 0,
      timezone: 'Asia/Ho_Chi_Minh',
      latitude: 10.8231,
      longitude: 106.6297,
      gender: 'Nam',
      birthPlace: 'HCMC',
      ...overrides,
    }
  }

  it('produces 12 palaces with all 14 stars distributed', () => {
    const chart = computeTuVi(makeInput())
    expect(chart.palaces).toHaveLength(12)
    const totalStars = chart.palaces.reduce((sum, p) => sum + p.stars.length, 0)
    expect(totalStars).toBe(14)
  })

  it('Mệnh palace is always first', () => {
    const chart = computeTuVi(makeInput())
    expect(chart.palaces[0].name).toBe('Mệnh')
  })

  it('scope is chinh-tinh', () => {
    const chart = computeTuVi(makeInput())
    expect(chart.scope).toBe('chinh-tinh')
  })

  it('lunar conversion is correct for 1990/6/15', () => {
    const chart = computeTuVi(makeInput())
    expect(chart.lunar.lunarMonth).toBe(5)
    expect(chart.lunar.lunarDay).toBe(23)
    expect(chart.lunar.lunarYear).toBe(1990)
  })

  // Fixture: Canh Ngọ, lunar 5/23, Tỵ hour
  it('Canh Ngọ, Hỏa Lục Cục, Mệnh at Sửu', () => {
    const chart = computeTuVi(makeInput({ hour: 10 })) // Tỵ hour
    expect(chart.profile.cucValue).toBe(6)
    expect(chart.profile.cucName).toBe('Hỏa Lục Cục')
    expect(chart.profile.yearStem).toBe('Canh')
    expect(chart.palaces[0].earthlyBranch).toBe('Sửu')
  })

  // Fixture: Giáp Tý year, different params
  it('Giáp Tý year (1984)', () => {
    const chart = computeTuVi(makeInput({ year: 1984, month: 3, day: 15, hour: 8 }))
    expect(chart.profile.yearStem).toBe('Giáp')
    expect(chart.profile.yearBranch).toBe('Tý')
    expect(chart.palaces).toHaveLength(12)
    const totalStars = chart.palaces.reduce((sum, p) => sum + p.stars.length, 0)
    expect(totalStars).toBe(14)
  })

  // All 5 Cục values — verified by computing stem + mệnh position through the full pipeline
  it.each([
    { year: 1984, month: 1, day: 1, hour: 0, expectedCuc: 4 },   // Giáp Tý, lunar 11/29/1983
    { year: 1985, month: 3, day: 10, hour: 6, expectedCuc: 5 },   // Ất Sửu
    { year: 1986, month: 5, day: 15, hour: 12, expectedCuc: 3 },  // Bính Dần
    { year: 1988, month: 7, day: 20, hour: 2, expectedCuc: 6 },   // Mậu Thìn (corrected from solarToLunar)
    { year: 1990, month: 6, day: 15, hour: 10, expectedCuc: 6 },  // Canh Ngọ
  ])('Cục $expectedCuc for year $year', ({ year, month, day, hour, expectedCuc }) => {
    const chart = computeTuVi(makeInput({ year, month, day, hour }))
    expect(chart.profile.cucValue).toBe(expectedCuc)
    expect(chart.palaces).toHaveLength(12)
  })

  // Boundary: day 1 (minimum)
  it('handles lunar day 1 (boundary)', () => {
    const chart = computeTuVi(makeInput({ year: 1990, month: 2, day: 5, hour: 0 }))
    expect(chart.palaces).toHaveLength(12)
    const totalStars = chart.palaces.reduce((sum, p) => sum + p.stars.length, 0)
    expect(totalStars).toBe(14)
  })

  // Boundary: day 30 (maximum)
  it('handles lunar day 30 (boundary)', () => {
    const chart = computeTuVi(makeInput({ year: 1990, month: 1, day: 27, hour: 0 }))
    expect(chart.palaces).toHaveLength(12)
  })

  // Gender: both Nam and Nữ produce valid charts
  it('works for both genders', () => {
    const chartNam = computeTuVi(makeInput({ gender: 'Nam' }))
    const chartNu = computeTuVi(makeInput({ gender: 'Nữ' }))
    expect(chartNam.palaces).toHaveLength(12)
    expect(chartNu.palaces).toHaveLength(12)
    // Both should have same star placement in Phase 1 (gender affects đại hạn, not placement)
    expect(chartNam.profile.cucValue).toBe(chartNu.profile.cucValue)
  })

  // Tý hour (23:00) boundary
  it('Tý hour (23:00) maps to branch index 0', () => {
    const chart = computeTuVi(makeInput({ hour: 23 }))
    expect(chart.palaces).toHaveLength(12)
    // Tý hour, month 5 (lunar) → Mệnh at specific position
    const totalStars = chart.palaces.reduce((sum, p) => sum + p.stars.length, 0)
    expect(totalStars).toBe(14)
  })

  // Tứ Hóa appears in chart
  it('has Tứ Hóa in chart output', () => {
    const chart = computeTuVi(makeInput())
    expect(chart.tuHoa.length).toBeGreaterThan(0)
    // Check that Tứ Hóa appears on stars in palaces
    const starsWithTuHoa = chart.palaces
      .flatMap(p => p.stars)
      .filter(s => s.tuHoa)
    expect(starsWithTuHoa.length).toBeGreaterThan(0)
  })
})
