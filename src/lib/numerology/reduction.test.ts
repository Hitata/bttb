import { describe, it, expect } from 'vitest'
import { digitSum, reduce, reduceStrict } from './reduction'
import { stripDiacritics, classifyLetters } from './vietnamese'

describe('digitSum', () => {
  it('sums digits of a single digit', () => {
    expect(digitSum(5)).toBe(5)
  })

  it('sums digits of a multi-digit number', () => {
    expect(digitSum(123)).toBe(6)
  })

  it('sums digits of a large number', () => {
    expect(digitSum(1992)).toBe(21)
  })

  it('handles zero', () => {
    expect(digitSum(0)).toBe(0)
  })

  it('handles negative numbers', () => {
    expect(digitSum(-123)).toBe(6)
  })
})

describe('reduce', () => {
  it('returns single digits as-is', () => {
    expect(reduce(7)).toBe(7)
  })

  it('reduces to single digit', () => {
    expect(reduce(38)).toBe(11) // 3+8=11 → master, preserved
    expect(reduce(14)).toBe(5) // 1+4=5
    expect(reduce(19)).toBe(1) // 1+9=10 → 1+0=1
  })

  it('preserves master number 11', () => {
    expect(reduce(11)).toBe(11)
    expect(reduce(29)).toBe(11) // 2+9=11
  })

  it('preserves master number 22', () => {
    expect(reduce(22)).toBe(22)
  })

  it('preserves master number 33', () => {
    expect(reduce(33)).toBe(33)
  })

  it('does not preserve 44 (not master)', () => {
    expect(reduce(44)).toBe(8) // 4+4=8
  })
})

describe('reduceStrict', () => {
  it('returns single digits as-is', () => {
    expect(reduceStrict(7)).toBe(7)
  })

  it('does NOT preserve master numbers', () => {
    expect(reduceStrict(11)).toBe(2)
    expect(reduceStrict(22)).toBe(4)
    expect(reduceStrict(33)).toBe(6)
  })

  it('reduces large numbers', () => {
    expect(reduceStrict(99)).toBe(9) // 9+9=18 → 1+8=9
  })
})

describe('stripDiacritics', () => {
  it('strips Vietnamese diacritics from Nguyễn', () => {
    expect(stripDiacritics('Nguyễn')).toBe('NGUYEN')
  })

  it('handles Đ/đ correctly', () => {
    expect(stripDiacritics('Đình')).toBe('DINH')
    expect(stripDiacritics('đức')).toBe('DUC')
  })

  it('handles plain ASCII', () => {
    expect(stripDiacritics('JOHN')).toBe('JOHN')
  })

  it('strips non-alpha characters', () => {
    expect(stripDiacritics('John-Paul')).toBe('JOHNPAUL')
  })

  it('handles common Vietnamese names', () => {
    expect(stripDiacritics('Văn')).toBe('VAN')
    expect(stripDiacritics('Thị')).toBe('THI')
    expect(stripDiacritics('Phước')).toBe('PHUOC')
    expect(stripDiacritics('Hồng')).toBe('HONG')
  })
})

describe('classifyLetters', () => {
  it('classifies vowels and consonants', () => {
    const original = ['J', 'O', 'H', 'N']
    const stripped = ['J', 'O', 'H', 'N']
    const result = classifyLetters(original, stripped)
    expect(result).toHaveLength(4)
    expect(result[0]).toEqual({
      letter: 'J',
      baseLetter: 'J',
      value: 1,
      type: 'consonant',
    })
    expect(result[1]).toEqual({
      letter: 'O',
      baseLetter: 'O',
      value: 6,
      type: 'vowel',
    })
  })

  it('treats Y as vowel', () => {
    const result = classifyLetters(['Y'], ['Y'])
    expect(result[0].type).toBe('vowel')
  })

  it('assigns correct Pythagorean values', () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const result = classifyLetters(letters, letters)
    const values = result.map((l) => l.value)
    expect(values).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6,
      7, 8,
    ])
  })
})
