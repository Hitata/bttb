import { LETTER_VALUES, NUMBER_MEANINGS, MASTER_NUMBERS } from './constants'
import { reduce } from './reduction'
import { stripDiacritics, classifyLetters } from './vietnamese'
import type { CoreNumber, NamePartBreakdown } from './types'

/**
 * Break down a full name into parts with letter classifications and values.
 */
export function getNameBreakdown(fullName: string): NamePartBreakdown[] {
  const parts = fullName.trim().split(/\s+/)
  return parts.map((part) => {
    const stripped = stripDiacritics(part)
    const originalChars = [...part].filter((ch) => {
      const normalized = ch
        .replace(/Đ/g, 'D')
        .replace(/đ/g, 'd')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
      return normalized.length > 0
    })
    const strippedChars = [...stripped]
    const letters = classifyLetters(originalChars, strippedChars)
    const total = letters.reduce((sum, l) => sum + l.value, 0)
    const reduced = reduce(total)
    return { name: part, letters, total, reduced }
  })
}

/**
 * Expression number: sum of ALL letter values, reduce per part then sum.
 */
export function computeExpression(fullName: string): CoreNumber {
  const breakdown = getNameBreakdown(fullName)
  const partValues = breakdown.map((p) => p.reduced)
  const total = partValues.reduce((a, b) => a + b, 0)
  const value = reduce(total)
  const meaning = NUMBER_MEANINGS[value]

  return {
    name: 'Expression',
    nameVi: 'Số Biểu Đạt',
    value,
    isMaster: MASTER_NUMBERS.has(value),
    description: meaning?.asExpression || meaning?.general || '',
    calculation: `Parts: [${partValues.join(', ')}] = ${total} → ${value}`,
  }
}

/**
 * Soul Urge number: sum of VOWEL values only, reduce per part then sum.
 */
export function computeSoulUrge(fullName: string): CoreNumber {
  const breakdown = getNameBreakdown(fullName)
  const partValues = breakdown.map((p) => {
    const vowelTotal = p.letters
      .filter((l) => l.type === 'vowel')
      .reduce((sum, l) => sum + l.value, 0)
    return reduce(vowelTotal)
  })
  const total = partValues.reduce((a, b) => a + b, 0)
  const value = reduce(total)
  const meaning = NUMBER_MEANINGS[value]

  return {
    name: 'Soul Urge',
    nameVi: 'Số Linh Hồn',
    value,
    isMaster: MASTER_NUMBERS.has(value),
    description: meaning?.asSoulUrge || meaning?.general || '',
    calculation: `Vowel parts: [${partValues.join(', ')}] = ${total} → ${value}`,
  }
}

/**
 * Personality number: sum of CONSONANT values only, reduce per part then sum.
 */
export function computePersonality(fullName: string): CoreNumber {
  const breakdown = getNameBreakdown(fullName)
  const partValues = breakdown.map((p) => {
    const consonantTotal = p.letters
      .filter((l) => l.type === 'consonant')
      .reduce((sum, l) => sum + l.value, 0)
    return reduce(consonantTotal)
  })
  const total = partValues.reduce((a, b) => a + b, 0)
  const value = reduce(total)
  const meaning = NUMBER_MEANINGS[value]

  return {
    name: 'Personality',
    nameVi: 'Số Nhân Cách',
    value,
    isMaster: MASTER_NUMBERS.has(value),
    description: meaning?.asPersonality || meaning?.general || '',
    calculation: `Consonant parts: [${partValues.join(', ')}] = ${total} → ${value}`,
  }
}
