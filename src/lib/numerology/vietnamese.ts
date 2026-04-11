import { LETTER_VALUES, VOWELS } from './constants'
import type { LetterBreakdown, LetterType } from './types'

/**
 * Strip Vietnamese diacritics from a string.
 * Handles Đ/đ → D/d first, then NFD normalize and strip combining marks.
 * Returns uppercase A-Z only.
 */
export function stripDiacritics(str: string): string {
  return str
    .replace(/Đ/g, 'D')
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
}

/**
 * Classify each letter as vowel or consonant with Pythagorean values.
 * Y defaults to vowel.
 */
export function classifyLetters(
  originalChars: string[],
  strippedChars: string[]
): LetterBreakdown[] {
  const result: LetterBreakdown[] = []
  for (let i = 0; i < strippedChars.length; i++) {
    const baseLetter = strippedChars[i]
    const value = LETTER_VALUES[baseLetter]
    if (value === undefined) continue
    const type: LetterType = VOWELS.has(baseLetter) ? 'vowel' : 'consonant'
    result.push({
      letter: originalChars[i] || baseLetter,
      baseLetter,
      value,
      type,
    })
  }
  return result
}

/**
 * Process a full name: strip diacritics, split by space, return parts.
 */
export function processName(originalName: string): {
  parts: string[]
  strippedParts: string[]
} {
  const parts = originalName.trim().split(/\s+/)
  const strippedParts = parts.map(stripDiacritics)
  return { parts, strippedParts }
}
