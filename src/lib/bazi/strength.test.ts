import { describe, it, expect } from 'vitest'
import { getSeasonalStrength, getStemRootedness, analyzeFactions } from './strength'

describe('getSeasonalStrength', () => {
  it('returns Vượng for same element as month branch', () => {
    // Month Mão=3 (Mộc) → Mộc is Vượng
    const result = getSeasonalStrength(3)
    const moc = result.find(r => r.element === 'Mộc')
    expect(moc?.state).toBe('Vượng')
    expect(moc?.score).toBe(5)
  })

  it('returns Tướng for element produced by month', () => {
    // Mộc produces Hỏa → Hỏa is Tướng
    const result = getSeasonalStrength(3)
    expect(result.find(r => r.element === 'Hỏa')?.state).toBe('Tướng')
  })

  it('returns Tử for element controlled by month', () => {
    // Mộc khắc Thổ → Thổ is Tử
    const result = getSeasonalStrength(3)
    expect(result.find(r => r.element === 'Thổ')?.state).toBe('Tử')
  })

  it('returns correct full matrix for summer month', () => {
    // Month Ngọ=6 (Hỏa)
    const result = getSeasonalStrength(6)
    expect(result.find(r => r.element === 'Hỏa')?.state).toBe('Vượng')
    expect(result.find(r => r.element === 'Thổ')?.state).toBe('Tướng')
    expect(result.find(r => r.element === 'Mộc')?.state).toBe('Hưu')
    expect(result.find(r => r.element === 'Thủy')?.state).toBe('Tù')
    expect(result.find(r => r.element === 'Kim')?.state).toBe('Tử')
  })

  it('handles Thổ month correctly', () => {
    // Thìn=4 (Thổ)
    const result = getSeasonalStrength(4)
    expect(result.find(r => r.element === 'Thổ')?.state).toBe('Vượng')
    expect(result.find(r => r.element === 'Kim')?.state).toBe('Tướng')
    expect(result.find(r => r.element === 'Hỏa')?.state).toBe('Hưu')
    expect(result.find(r => r.element === 'Mộc')?.state).toBe('Tù')
    expect(result.find(r => r.element === 'Thủy')?.state).toBe('Tử')
  })
})

describe('getStemRootedness', () => {
  it('finds root for Giáp in Dần branch', () => {
    // Giáp=0 at year, Dần=2 at month has hiddenStems [0,2,4] — 0=Giáp (Mộc)
    const result = getStemRootedness([0, 2, 6, 8], [0, 2, 6, 9])
    const giap = result.find(r => r.canIndex === 0)
    expect(giap?.isRooted).toBe(true)
    expect(giap?.roots.length).toBeGreaterThan(0)
  })

  it('marks stem as unrooted when no matching hidden stems', () => {
    // Canh=6 (Kim) at pillar 2, branches: Tý(hiddenStems=[9]=Thủy), Mão([1]=Mộc), Ngọ([3,5]=Hỏa,Thổ), Hợi([8,0]=Thủy,Mộc) — no Kim
    const result = getStemRootedness([0, 2, 6, 8], [0, 3, 6, 11])
    const canh = result.find(r => r.canIndex === 6 && r.pillarIndex === 2)
    expect(canh?.isRooted).toBe(false)
    expect(canh?.rootStrength).toBe('none')
  })
})

describe('analyzeFactions', () => {
  it('identifies factions with leaders and supporters', () => {
    const result = analyzeFactions([0, 2, 6, 8], [2, 3, 6, 9], 3)
    const mocFaction = result.find(f => f.element === 'Mộc')
    expect(mocFaction).toBeDefined()
    expect(mocFaction!.leaders.length).toBeGreaterThan(0)
  })

  it('ranks factions by strength descending', () => {
    const result = analyzeFactions([0, 2, 6, 8], [2, 3, 6, 9], 3)
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].strength).toBeGreaterThanOrEqual(result[i + 1].strength)
    }
  })

  it('always returns 5 factions (one per element)', () => {
    const result = analyzeFactions([0, 2, 6, 8], [2, 3, 6, 9], 3)
    expect(result).toHaveLength(5)
  })
})
