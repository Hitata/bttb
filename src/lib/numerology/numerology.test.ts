import { describe, it, expect } from 'vitest'
import { computeLifePath } from './life-path'
import { computeBirthday } from './birthday'
import {
  computeExpression,
  computeSoulUrge,
  computePersonality,
  getNameBreakdown,
} from './name-numbers'
import { computeMaturity } from './maturity'
import {
  computePersonalYear,
  computePersonalMonth,
  computePersonalDay,
} from './cycles'
import { computeChallenges } from './challenges'
import { computePinnacles } from './pinnacles'
import { computeNumerology } from './index'

describe('computeLifePath', () => {
  it('computes master number 11 for Dec 14, 1992', () => {
    const result = computeLifePath(12, 14, 1992)
    expect(result.value).toBe(11)
    expect(result.isMaster).toBe(true)
  })

  it('computes 1 for Oct 22, 1985', () => {
    const result = computeLifePath(10, 22, 1985)
    expect(result.value).toBe(1)
    expect(result.isMaster).toBe(false)
  })

  it('has correct name fields', () => {
    const result = computeLifePath(1, 1, 2000)
    expect(result.name).toBe('Life Path')
    expect(result.nameVi).toBe('Số Chủ Đạo')
  })
})

describe('computeBirthday', () => {
  it('returns single digit as-is', () => {
    expect(computeBirthday(7).value).toBe(7)
  })

  it('reduces 15 to 6', () => {
    expect(computeBirthday(15).value).toBe(6)
  })

  it('preserves master number 22', () => {
    const result = computeBirthday(22)
    expect(result.value).toBe(22)
    expect(result.isMaster).toBe(true)
  })

  it('reduces 29 to master 11', () => {
    const result = computeBirthday(29)
    expect(result.value).toBe(11)
    expect(result.isMaster).toBe(true)
  })
})

describe('computeExpression', () => {
  it('computes 6 for JOHN WILLIAM SMITH', () => {
    const result = computeExpression('JOHN WILLIAM SMITH')
    expect(result.value).toBe(6)
  })

  it('has correct name fields', () => {
    const result = computeExpression('JOHN')
    expect(result.name).toBe('Expression')
    expect(result.nameVi).toBe('Số Biểu Đạt')
  })
})

describe('computeSoulUrge', () => {
  it('computes 7 for JOHN WILLIAM SMITH', () => {
    // Vowels: O=6 | I,I,A=19→1 | I=9 → 6+1+9=16→7
    const result = computeSoulUrge('JOHN WILLIAM SMITH')
    expect(result.value).toBe(7)
  })
})

describe('computePersonality', () => {
  it('computes 8 for JOHN WILLIAM SMITH', () => {
    // Consonants: J,H,N=14→5 | W,L,L,M=15→6 | S,M,T,H=15→6 → 5+6+6=17→8
    const result = computePersonality('JOHN WILLIAM SMITH')
    expect(result.value).toBe(8)
  })
})

describe('getNameBreakdown', () => {
  it('breaks down name into parts with letter details', () => {
    const result = getNameBreakdown('JOHN')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('JOHN')
    expect(result[0].letters).toHaveLength(4)
    expect(result[0].total).toBe(20) // J=1+O=6+H=8+N=5=20
    expect(result[0].reduced).toBe(2) // 2+0=2
  })

  it('handles multi-part names', () => {
    const result = getNameBreakdown('JOHN SMITH')
    expect(result).toHaveLength(2)
  })
})

describe('computeMaturity', () => {
  it('reduces sum of life path and expression', () => {
    // LP=11, Expr=6 → 11+6=17 → 1+7=8
    const result = computeMaturity(11, 6)
    expect(result.value).toBe(8)
  })

  it('preserves master numbers', () => {
    // LP=9, Expr=2 → 9+2=11 → master
    const result = computeMaturity(9, 2)
    expect(result.value).toBe(11)
    expect(result.isMaster).toBe(true)
  })
})

describe('personal cycles', () => {
  it('computes personal year', () => {
    // Month=12, Day=14, Year=2026 → 12+14+2026 → reduce
    // 1+2+1+4+2+0+2+6=18 → 1+8=9
    const result = computePersonalYear(12, 14, 2026)
    expect(result).toBe(9)
  })

  it('computes personal month', () => {
    const result = computePersonalMonth(9, 4) // Apr
    expect(result).toBe(4) // 9+4=13→4
  })

  it('computes personal day', () => {
    const result = computePersonalDay(4, 10)
    expect(result).toBe(5) // 4+10=14→5
  })
})

describe('computeChallenges', () => {
  it('computes [1, 1, 0, 2] for Sep 26, 1969', () => {
    // Need life path for timing. Sep 26, 1969:
    // m=9, d=8, y=7 → 9+8+7=24→6
    const lp = computeLifePath(9, 26, 1969)
    const challenges = computeChallenges(9, 26, 1969, lp.value)
    expect(challenges.map((c) => c.number)).toEqual([1, 1, 0, 2])
  })

  it('has correct position labels', () => {
    const lp = computeLifePath(9, 26, 1969)
    const challenges = computeChallenges(9, 26, 1969, lp.value)
    expect(challenges[0].position).toBe('first')
    expect(challenges[1].position).toBe('second')
    expect(challenges[2].position).toBe('third')
    expect(challenges[3].position).toBe('fourth')
  })

  it('challenge 0 has a description', () => {
    const lp = computeLifePath(9, 26, 1969)
    const challenges = computeChallenges(9, 26, 1969, lp.value)
    const zeroChallenge = challenges.find((c) => c.number === 0)
    expect(zeroChallenge).toBeDefined()
    expect(zeroChallenge!.description).toBeTruthy()
  })
})

describe('computePinnacles', () => {
  it('computes [8, 1, 9, 8] for Mar 14, 1985 with LP=4', () => {
    const pinnacles = computePinnacles(3, 14, 1985, 4)
    expect(pinnacles.map((p) => p.number)).toEqual([8, 1, 9, 8])
  })

  it('first pinnacle ends at 32 for LP=4', () => {
    const pinnacles = computePinnacles(3, 14, 1985, 4)
    expect(pinnacles[0].endAge).toBe(32)
  })

  it('has correct timing sequence', () => {
    const pinnacles = computePinnacles(3, 14, 1985, 4)
    // firstEnd = 36-4 = 32
    expect(pinnacles[0].startAge).toBe(0)
    expect(pinnacles[0].endAge).toBe(32)
    expect(pinnacles[1].startAge).toBe(33)
    expect(pinnacles[1].endAge).toBe(41)
    expect(pinnacles[2].startAge).toBe(42)
    expect(pinnacles[2].endAge).toBe(50)
    expect(pinnacles[3].startAge).toBe(51)
    expect(pinnacles[3].endAge).toBeNull()
  })
})

describe('computeNumerology integration', () => {
  it('computes full numerology for Nguyễn Văn Anh, Dec 14, 1992', () => {
    const result = computeNumerology(
      {
        fullName: 'Nguyễn Văn Anh',
        birthYear: 1992,
        birthMonth: 12,
        birthDay: 14,
      },
      new Date(2026, 3, 10) // Apr 10, 2026
    )

    // Life path: reduce(12) + reduce(14) + reduce(digitSum(1992))
    // = 3 + 5 + 3 = 11 (master)
    expect(result.lifePath.value).toBe(11)
    expect(result.lifePath.isMaster).toBe(true)

    // Birthday: reduce(14) = 5
    expect(result.birthday.value).toBe(5)

    // Name breakdown should have 3 parts
    expect(result.nameBreakdown).toHaveLength(3)

    // Verify input is preserved
    expect(result.input.fullName).toBe('Nguyễn Văn Anh')
    expect(result.input.birthYear).toBe(1992)

    // Cycles should have current date
    expect(result.cycles.currentDate).toBe('2026-04-10')

    // Should have 4 challenges and 4 pinnacles
    expect(result.challenges).toHaveLength(4)
    expect(result.pinnacles).toHaveLength(4)

    // At age 33 (born 1992, current 2026), check isCurrent flags
    // LP=11, reduceStrict(11)=2, firstEnd=36-2=34
    // Age 33 is <= 34, so first challenge/pinnacle should be current
    expect(result.challenges[0].isCurrent).toBe(true) // 0-34
    expect(result.challenges[2].isCurrent).toBe(true) // third: 0-43
    expect(result.pinnacles[0].isCurrent).toBe(true) // 0-34

    // Maturity = reduce(lifePath + expression)
    expect(result.maturity).toBeDefined()
    expect(result.maturity.name).toBe('Maturity')
  })

  it('handles pure ASCII names', () => {
    const result = computeNumerology({
      fullName: 'JOHN WILLIAM SMITH',
      birthYear: 1985,
      birthMonth: 10,
      birthDay: 22,
    })

    expect(result.expression.value).toBe(6)
    expect(result.soulUrge.value).toBe(7)
    expect(result.personality.value).toBe(8)
    expect(result.lifePath.value).toBe(1)
    expect(result.birthday.value).toBe(22)
    expect(result.birthday.isMaster).toBe(true)
  })
})
