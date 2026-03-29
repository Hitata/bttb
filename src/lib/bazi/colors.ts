import type { FiveElement } from './types'

/**
 * Ngũ Hành Color System
 *
 * Single source of truth: CSS custom properties in globals.css
 * This file only maps FiveElement names → CSS var references.
 */

export const ELEMENT_INFO: Record<FiveElement, {
  vn: string
  zh: string
  en: string
  hantu: string
}> = {
  'Mộc': { vn: 'Mộc', zh: '木', en: 'Wood', hantu: '木' },
  'Hỏa': { vn: 'Hỏa', zh: '火', en: 'Fire', hantu: '火' },
  'Thổ': { vn: 'Thổ', zh: '土', en: 'Earth', hantu: '土' },
  'Kim':  { vn: 'Kim',  zh: '金', en: 'Metal', hantu: '金' },
  'Thủy': { vn: 'Thủy', zh: '水', en: 'Water', hantu: '水' },
}

export const ELEMENT_ORDER: FiveElement[] = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy']

export const ELEMENT_CSS_VAR = {
  'Mộc':  { base: 'var(--element-wood)',  light: 'var(--element-wood-light)' },
  'Hỏa':  { base: 'var(--element-fire)',  light: 'var(--element-fire-light)' },
  'Thổ':  { base: 'var(--element-earth)', light: 'var(--element-earth-light)' },
  'Kim':  { base: 'var(--element-metal)', light: 'var(--element-metal-light)' },
  'Thủy': { base: 'var(--element-water)', light: 'var(--element-water-light)' },
} as const satisfies Record<FiveElement, { base: string; light: string }>
