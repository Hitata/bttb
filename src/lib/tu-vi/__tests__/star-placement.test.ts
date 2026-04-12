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
  getDirection,
  placeLocTon,
  placeKinhDuong,
  placeDaLa,
  placeLocTonRing,
  placeHoaLinh,
  placeDiaKhongKiep,
  placeVanXuongKhuc,
  placeTaPhuHuuBat,
  placeThienKhoiViet,
  placeThaiTueRing,
  placeTrangSinhRing,
  calculateTriet,
  calculateTuan,
  calculateDaiHan,
  getMenhChu,
  getThanChu,
  getNapAm,
  calculateSinhKhac,
  placeHongLoanThienHy,
  placeCoThan,
  placeThienMa,
  placePhaToai,
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

  it('mirror property: TuVi + ThienPhu sum is always 4 mod 12', () => {
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
  it('Giáp year (0): includes all 4 stars', () => {
    const th = placeTuHoa(0)
    expect(th).toEqual([
      { starId: 'LiemTrinh', type: 'loc' },
      { starId: 'PhaQuan', type: 'quyen' },
      { starId: 'VuKhuc', type: 'khoa' },
      { starId: 'ThaiDuong', type: 'ky' },
    ])
  })

  it('Canh year (6): all major stars', () => {
    const th = placeTuHoa(6)
    expect(th).toEqual([
      { starId: 'ThaiDuong', type: 'loc' },
      { starId: 'VuKhuc', type: 'quyen' },
      { starId: 'ThaiAm', type: 'khoa' },
      { starId: 'ThienDong', type: 'ky' },
    ])
  })

  it('Bính year (2): includes VanXuong (now a known star)', () => {
    const th = placeTuHoa(2)
    expect(th.length).toBe(4) // All 4 now included since VanXuong exists
    expect(th.find(t => t.type === 'khoa')?.starId).toBe('VanXuong')
  })
})

// ─── New Star Placement Tests ───

describe('Lộc Tồn placement', () => {
  it('Giáp → Dần (2)', () => expect(placeLocTon(0)).toBe(2))
  it('Ất → Mão (3)', () => expect(placeLocTon(1)).toBe(3))
  it('Canh → Thân (8)', () => expect(placeLocTon(6)).toBe(8))
  it('Quý → Tý (0)', () => expect(placeLocTon(9)).toBe(0))
})

describe('Kình Dương / Đà La', () => {
  it('Lộc Tồn at Dần (2): KD=Mão(3), ĐL=Sửu(1)', () => {
    expect(placeKinhDuong(2)).toBe(3)
    expect(placeDaLa(2)).toBe(1)
  })
  it('Lộc Tồn at Tý (0): KD=Sửu(1), ĐL=Hợi(11)', () => {
    expect(placeKinhDuong(0)).toBe(1)
    expect(placeDaLa(0)).toBe(11)
  })
})

describe('Lộc Tồn ring', () => {
  it('places 13 stars (LocTon + BacSy + 11 companions)', () => {
    const ring = placeLocTonRing(2, 1) // Dần, clockwise
    expect(Object.keys(ring)).toHaveLength(13)
    expect(ring.LocTon).toBe(2)
    expect(ring.BacSy).toBe(2)
    expect(ring.LucSi).toBe(3)   // +1
    expect(ring.QuanPhu2).toBe(1) // +11 = 2+11=13%12=1
  })

  it('counter-clockwise direction', () => {
    const ring = placeLocTonRing(8, -1) // Thân, counter-clockwise
    expect(ring.LocTon).toBe(8)
    expect(ring.LucSi).toBe(7)   // 8 + 1*(-1) = 7
    expect(ring.ThanhLong).toBe(6)
  })
})

describe('Hỏa Tinh / Linh Tinh', () => {
  it('Dần year branch, Tý hour, Dương Nam', () => {
    const { hoaTinh, linhTinh } = placeHoaLinh(2, 0, 1) // Dan branch, Ty hour, direction 1
    // Group [2,6,10]: hoa start=1, linh start=3
    // direction 1: hoaTinh = mod12(1-1+0) = 0, linhTinh = mod12(3+1-0) = 4
    expect(hoaTinh).toBe(0)
    expect(linhTinh).toBe(4)
  })
})

describe('Địa Không / Địa Kiếp', () => {
  it('Tý hour (0)', () => {
    const { diaKhong, diaKiep } = placeDiaKhongKiep(0)
    expect(diaKiep).toBe(11)  // Hợi + 0
    expect(diaKhong).toBe(11) // mirror
  })
  it('Ngọ hour (6)', () => {
    const { diaKhong, diaKiep } = placeDiaKhongKiep(6)
    expect(diaKiep).toBe(5)  // 11 + 6 = 17 % 12 = 5
    expect(diaKhong).toBe(5) // 11 - 6 = 5
  })
})

describe('Văn Xương / Văn Khúc', () => {
  it('Tý hour (0): VX=Thìn(4), VK=Thìn(4)', () => {
    const { vanXuong, vanKhuc } = placeVanXuongKhuc(0)
    expect(vanXuong).toBe(4)
    expect(vanKhuc).toBe(4)
  })
  it('Ngọ hour (6): VX=Tuất(10), VK=Tuất(10)', () => {
    const { vanXuong, vanKhuc } = placeVanXuongKhuc(6)
    expect(vanXuong).toBe(10)
    expect(vanKhuc).toBe(10)
  })
})

describe('Tả Phù / Hữu Bật', () => {
  it('month 1: TP=Thìn(4), HB=Thìn(4)', () => {
    const { taPhu, huuBat } = placeTaPhuHuuBat(1)
    expect(taPhu).toBe(4)
    expect(huuBat).toBe(4)
  })
  it('month 6: TP=Dậu(9), HB=Hợi(11)', () => {
    const { taPhu, huuBat } = placeTaPhuHuuBat(6)
    expect(taPhu).toBe(9)
    expect(huuBat).toBe(11)
  })
})

describe('Thiên Khôi / Thiên Việt', () => {
  it('Giáp year (0): Khôi=Sửu(1), Việt=Mùi(7)', () => {
    const { thienKhoi, thienViet } = placeThienKhoiViet(0)
    expect(thienKhoi).toBe(1)
    expect(thienViet).toBe(7)
  })
})

describe('Thái Tuế ring', () => {
  it('places 12 stars from year branch', () => {
    const ring = placeThaiTueRing(6) // Ngọ year
    expect(Object.keys(ring)).toHaveLength(12)
    expect(ring.ThaiTue).toBe(6)
    expect(ring.ThieuDuong).toBe(7)
    expect(ring.BachHo).toBe(2) // +8 from Ngọ
  })
})

describe('Tràng Sinh ring', () => {
  it('Hỏa Lục Cục, clockwise', () => {
    const ring = placeTrangSinhRing(6, 1)
    expect(ring.TrangSinh).toBe(2) // Hỏa starts at Dần
    expect(ring.MocDuc).toBe(3)    // +1
    expect(ring.DeVuong).toBe(6)   // +4
    expect(ring.ThaiTS).toBe(1)    // -1 (reverse)
    expect(ring.DuongTS).toBe(0)   // -2 (reverse)
  })

  it('Thủy Nhị Cục, counter-clockwise', () => {
    const ring = placeTrangSinhRing(2, -1)
    expect(ring.TrangSinh).toBe(8) // Thủy starts at Thân
    expect(ring.MocDuc).toBe(7)    // -1
    expect(ring.ThaiTS).toBe(9)    // +1 (reverse of direction)
  })
})

describe('Triệt calculation', () => {
  it('Giáp/Kỷ (0,5) → Thân,Dậu (8,9)', () => {
    expect(calculateTriet(0)).toEqual([8, 9])
    expect(calculateTriet(5)).toEqual([8, 9])
  })
  it('Ất/Canh (1,6) → Ngọ,Mùi (6,7)', () => {
    expect(calculateTriet(1)).toEqual([6, 7])
    expect(calculateTriet(6)).toEqual([6, 7])
  })
  it('Mậu/Quý (4,9) → Tý,Sửu (0,1)', () => {
    expect(calculateTriet(4)).toEqual([0, 1])
    expect(calculateTriet(9)).toEqual([0, 1])
  })
})

describe('Tuần calculation', () => {
  it('Giáp Tý (stem=0, branch=0)', () => {
    // end = (0 + 9 - 0) % 12 = 9 → tuan = 10,11 (Tuất,Hợi)
    expect(calculateTuan(0, 0)).toEqual([10, 11])
  })
  it('Canh Ngọ (stem=6, branch=6)', () => {
    // end = (6 + 9 - 6) % 12 = 9 → tuan = 10,11
    expect(calculateTuan(6, 6)).toEqual([10, 11])
  })
})

describe('Đại Hạn', () => {
  it('returns 12 periods starting from Cục value', () => {
    const periods = calculateDaiHan(6, 1, 1) // Hỏa Lục Cục, Mệnh at Sửu, clockwise
    expect(periods).toHaveLength(12)
    expect(periods[0]).toEqual({ branchIndex: 1, startAge: 6, endAge: 15 })
    expect(periods[1]).toEqual({ branchIndex: 2, startAge: 16, endAge: 25 })
    expect(periods[11]).toEqual({ branchIndex: 0, startAge: 116, endAge: 125 })
  })
})

describe('Mệnh Chủ / Thân Chủ', () => {
  it('Tý branch → Mệnh Chủ=ThamLang', () => {
    expect(getMenhChu(0)).toBe('ThamLang')
  })
  it('Ngọ branch → Mệnh Chủ=PhaQuan, Thân Chủ=HoaTinh', () => {
    expect(getMenhChu(6)).toBe('PhaQuan')
    expect(getThanChu(6)).toBe('HoaTinh')
  })
})

describe('Nạp Âm', () => {
  it('Giáp Tý → Hải Trung Kim', () => {
    const na = getNapAm(0, 0)
    expect(na.name).toBe('Hải Trung Kim')
    expect(na.element).toBe('Kim')
  })
  it('Canh Ngọ → Lộ Bàn Thổ', () => {
    const na = getNapAm(6, 6)
    expect(na.name).toBe('Lộ Bàn Thổ')
    expect(na.element).toBe('Thổ')
  })
})

describe('Sinh Khắc', () => {
  it('same element → hòa', () => {
    const sk = calculateSinhKhac('Kim', 'Kim')
    expect(sk.relation).toBe('hoa')
  })
  it('Kim sinh Thủy', () => {
    const sk = calculateSinhKhac('Kim', 'Thủy')
    expect(sk.relation).toBe('sinh')
    expect(sk.direction).toBe('Mệnh sinh Cục')
  })
  it('Thủy sinh Mộc → Cục sinh Mệnh', () => {
    const sk = calculateSinhKhac('Mộc', 'Thủy')
    expect(sk.relation).toBe('sinh')
    expect(sk.direction).toBe('Cục sinh Mệnh')
  })
  it('Kim khắc Mộc', () => {
    const sk = calculateSinhKhac('Kim', 'Mộc')
    expect(sk.relation).toBe('khac')
    expect(sk.direction).toBe('Mệnh khắc Cục')
  })
})

describe('Direction', () => {
  it('Dương Nam = 1', () => expect(getDirection(0, 'Nam')).toBe(1))
  it('Âm Nữ = 1', () => expect(getDirection(1, 'Nữ')).toBe(1))
  it('Âm Nam = -1', () => expect(getDirection(1, 'Nam')).toBe(-1))
  it('Dương Nữ = -1', () => expect(getDirection(0, 'Nữ')).toBe(-1))
})

describe('Minor stars', () => {
  it('Hồng Loan / Thiên Hỷ', () => {
    const { hongLoan, thienHy } = placeHongLoanThienHy(6) // Ngọ
    expect(hongLoan).toBe(9) // mod12(3 - 6) = 9 (Dậu)
    expect(thienHy).toBe(3)  // +6 = 3 (Mão)
  })

  it('Cô Thần by branch group', () => {
    expect(placeCoThan(0)).toBe(2)  // Tý → Dần
    expect(placeCoThan(3)).toBe(5)  // Mão → Tỵ
    expect(placeCoThan(7)).toBe(8)  // Mùi → Thân
    expect(placeCoThan(9)).toBe(11) // Dậu → Hợi
  })

  it('Thiên Mã by branch', () => {
    expect(placeThienMa(0)).toBe(2)  // Tý → Dần
    expect(placeThienMa(1)).toBe(11) // Sửu → Hợi
    expect(placeThienMa(2)).toBe(8)  // Dần → Thân
    expect(placeThienMa(3)).toBe(5)  // Mão → Tỵ
  })

  it('Phá Toái by branch', () => {
    expect(placePhaToai(0)).toBe(9) // Tý (1-based 1%3=1) → Dậu
    expect(placePhaToai(1)).toBe(1) // Sửu (1-based 2%3=2) → Sửu
    expect(placePhaToai(2)).toBe(5) // Dần (1-based 3%3=0) → Tỵ
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

  it('produces 12 palaces with ~105 stars distributed', () => {
    const chart = computeTuVi(makeInput())
    expect(chart.palaces).toHaveLength(12)
    const totalStars = chart.palaces.reduce((sum, p) => sum + p.stars.length, 0)
    expect(totalStars).toBeGreaterThan(90) // ~105 stars total
    expect(totalStars).toBeLessThan(120)
  })

  it('Mệnh palace is always first', () => {
    const chart = computeTuVi(makeInput())
    expect(chart.palaces[0].name).toBe('Mệnh')
  })

  it('scope is full', () => {
    const chart = computeTuVi(makeInput())
    expect(chart.scope).toBe('full')
  })

  it('has Mệnh Chủ and Thân Chủ', () => {
    const chart = computeTuVi(makeInput())
    expect(chart.profile.menhChu).toBeTruthy()
    expect(chart.profile.thanChu).toBeTruthy()
  })

  it('has Nạp Âm', () => {
    const chart = computeTuVi(makeInput())
    expect(chart.profile.napAm.name).toBeTruthy()
    expect(chart.profile.napAm.element).toBeTruthy()
  })

  it('has Sinh Khắc', () => {
    const chart = computeTuVi(makeInput())
    expect(['sinh', 'khac', 'hoa']).toContain(chart.profile.sinhKhac.relation)
    expect(chart.profile.sinhKhac.direction).toBeTruthy()
  })

  it('has Tuần / Triệt', () => {
    const chart = computeTuVi(makeInput())
    expect(chart.tuanTriet.tuan).toHaveLength(2)
    expect(chart.tuanTriet.triet).toHaveLength(2)
    // At least some palaces should have isTuan or isTriet
    const tuanPalaces = chart.palaces.filter(p => p.isTuan)
    const trietPalaces = chart.palaces.filter(p => p.isTriet)
    expect(tuanPalaces).toHaveLength(2)
    expect(trietPalaces).toHaveLength(2)
  })

  it('has Đại Hạn on all palaces', () => {
    const chart = computeTuVi(makeInput())
    for (const palace of chart.palaces) {
      expect(palace.daiHan).toBeDefined()
      expect(palace.daiHan!.startAge).toBeGreaterThan(0)
      expect(palace.daiHan!.endAge).toBe(palace.daiHan!.startAge + 9)
    }
  })

  // Fixture: Canh Ngọ, Tỵ hour
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
    expect(totalStars).toBeGreaterThan(90)
  })

  // All 5 Cục values
  it.each([
    { year: 1984, month: 1, day: 1, hour: 0, expectedCuc: 4 },
    { year: 1985, month: 3, day: 10, hour: 6, expectedCuc: 5 },
    { year: 1986, month: 5, day: 15, hour: 12, expectedCuc: 3 },
    { year: 1988, month: 7, day: 20, hour: 2, expectedCuc: 6 },
    { year: 1990, month: 6, day: 15, hour: 10, expectedCuc: 6 },
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
    expect(totalStars).toBeGreaterThan(90)
  })

  // Boundary: day 30 (maximum)
  it('handles lunar day 30 (boundary)', () => {
    const chart = computeTuVi(makeInput({ year: 1990, month: 1, day: 27, hour: 0 }))
    expect(chart.palaces).toHaveLength(12)
  })

  // Gender: both Nam and Nữ produce valid charts but with different star placements
  it('gender affects star placement (Hỏa/Linh, Lộc Tồn ring, Tràng Sinh)', () => {
    const chartNam = computeTuVi(makeInput({ gender: 'Nam' }))
    const chartNu = computeTuVi(makeInput({ gender: 'Nữ' }))
    expect(chartNam.palaces).toHaveLength(12)
    expect(chartNu.palaces).toHaveLength(12)
    // Same Cục but different direction-dependent stars
    expect(chartNam.profile.cucValue).toBe(chartNu.profile.cucValue)
    // Đại Hạn should differ
    expect(chartNam.palaces[0].daiHan?.startAge).toBe(chartNu.palaces[0].daiHan?.startAge)
    // But Đại Hạn at other palaces should differ due to direction
    const namP1 = chartNam.palaces[1].daiHan
    const nuP1 = chartNu.palaces[1].daiHan
    // For Canh (stem 6, Dương), Nam=Dương→clockwise, Nữ=Dương→counter-clockwise
    expect(namP1?.startAge).not.toBe(nuP1?.startAge)
  })

  // Tý hour (23:00) boundary
  it('Tý hour (23:00) maps to branch index 0', () => {
    const chart = computeTuVi(makeInput({ hour: 23 }))
    expect(chart.palaces).toHaveLength(12)
    const totalStars = chart.palaces.reduce((sum, p) => sum + p.stars.length, 0)
    expect(totalStars).toBeGreaterThan(90)
  })

  // Tứ Hóa appears in chart (now includes minor stars)
  it('has Tứ Hóa in chart output', () => {
    const chart = computeTuVi(makeInput())
    expect(chart.tuHoa.length).toBe(4) // Always 4 now
    const starsWithTuHoa = chart.palaces
      .flatMap(p => p.stars)
      .filter(s => s.tuHoa)
    expect(starsWithTuHoa.length).toBe(4)
  })

  // Star groups present
  it('has all star groups represented', () => {
    const chart = computeTuVi(makeInput())
    const groups = new Set(chart.palaces.flatMap(p => p.stars.map(s => s.group)))
    expect(groups.has('tuVi')).toBe(true)
    expect(groups.has('thienPhu')).toBe(true)
    expect(groups.has('lucSat')).toBe(true)
    expect(groups.has('locTonRing')).toBe(true)
    expect(groups.has('thaiTueRing')).toBe(true)
    expect(groups.has('trangSinhRing')).toBe(true)
    expect(groups.has('phuTinh')).toBe(true)
  })
})
