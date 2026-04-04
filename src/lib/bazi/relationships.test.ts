import { describe, it, expect } from 'vitest'
import { findCanHop, findChiXung, findChiHinh, findChiLucHop, findTamHop, findTamHoi, findBanHop, findBanHoi, analyzeRelationships } from './relationships'

describe('findCanHop', () => {
  it('detects Giáp-Kỷ combination', () => {
    const result = findCanHop([0, 5, 2, 8])
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('canHop')
    expect(result[0].indices).toEqual([0, 1])
    expect(result[0].element).toBe('Thổ')
  })

  it('only detects adjacent stems', () => {
    const result = findCanHop([0, 2, 8, 5])
    expect(result).toHaveLength(0)
  })

  it('detects multiple combinations', () => {
    const result = findCanHop([2, 7, 3, 8])
    expect(result).toHaveLength(2)
  })
})

describe('findChiXung', () => {
  it('detects Tý-Ngọ clash', () => {
    const result = findChiXung([0, 3, 6, 10])
    expect(result).toHaveLength(1)
    expect(result[0].indices).toEqual([0, 2])
  })

  it('detects multiple clashes', () => {
    const result = findChiXung([2, 3, 8, 9])
    expect(result).toHaveLength(2)
  })
})

describe('findChiHinh', () => {
  it('detects Dần-Tỵ-Thân punishment', () => {
    const result = findChiHinh([2, 5, 8, 0])
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].type).toBe('chiHinh')
  })

  it('detects Tý-Mão punishment', () => {
    const result = findChiHinh([0, 3, 6, 9])
    const tyMao = result.find(r => r.label.includes('Vô Lễ'))
    expect(tyMao).toBeDefined()
  })

  it('detects self-punishment when same branch appears twice', () => {
    const result = findChiHinh([0, 3, 6, 6])
    const selfPunish = result.find(r => r.label.includes('Tự Hình'))
    expect(selfPunish).toBeDefined()
  })
})

describe('findChiLucHop', () => {
  it('detects Tý-Sửu harmony', () => {
    const result = findChiLucHop([0, 1, 6, 9])
    expect(result).toHaveLength(1)
    expect(result[0].indices).toEqual([0, 1])
  })

  it('detects harmony across non-adjacent pillars', () => {
    // Tý=0 at year, Sửu=1 at hour — not adjacent but still valid
    const result = findChiLucHop([0, 6, 9, 1])
    expect(result).toHaveLength(1)
    expect(result[0].indices).toEqual([0, 3])
  })
})

describe('findTamHop', () => {
  it('detects Hợi-Mão-Mùi wood harmony', () => {
    const result = findTamHop([11, 3, 7, 0])
    expect(result).toHaveLength(1)
    expect(result[0].element).toBe('Mộc')
  })

  it('returns empty when no tam hop present', () => {
    const result = findTamHop([0, 1, 2, 3])
    expect(result).toHaveLength(0)
  })
})

describe('findTamHoi', () => {
  it('detects Dần-Mão-Thìn wood meeting', () => {
    const result = findTamHoi([2, 3, 4, 0])
    expect(result).toHaveLength(1)
    expect(result[0].element).toBe('Mộc')
  })
})

describe('findBanHop', () => {
  it('detects strong half harmony with tứ chính', () => {
    const result = findBanHop([11, 3, 0, 9])
    expect(result).toHaveLength(1)
    expect(result[0].strength).toBe('strong')
  })

  it('detects weak half harmony without tứ chính', () => {
    const result = findBanHop([11, 7, 0, 9])
    expect(result).toHaveLength(1)
    expect(result[0].strength).toBe('weak')
  })
})

describe('findBanHoi', () => {
  it('detects strong half meeting with first two branches', () => {
    const result = findBanHoi([2, 3, 0, 9])
    expect(result).toHaveLength(1)
    expect(result[0].strength).toBe('strong')
  })
})

describe('tứ hành xung misconception guard', () => {
  it('Tý-Ngọ-Mão-Dậu produces exactly 2 xung pairs, not a special 4-way clash', () => {
    const result = findChiXung([0, 3, 6, 9])
    expect(result).toHaveLength(2)
  })
})

describe('analyzeRelationships', () => {
  it('returns combined results in correct order', () => {
    const result = analyzeRelationships([0, 5, 2, 8], [11, 3, 7, 0])
    expect(result.length).toBeGreaterThan(0)
    // Should find tam hop Mộc (Hợi-Mão-Mùi) and can hop Giáp-Kỷ at minimum
    expect(result.some(r => r.type === 'tamHop')).toBe(true)
    expect(result.some(r => r.type === 'canHop')).toBe(true)
  })
})
