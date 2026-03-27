import type { FiveElement } from './types'

/**
 * Ngũ Hành Color System — centralized element color configuration.
 *
 * CSS custom properties are defined in globals.css with light/dark variants.
 * This file maps FiveElement names to those tokens for use in components.
 */

// ===== Element metadata (Vietnamese + Chinese + English) =====
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

// ===== Element order for consistent display =====
export const ELEMENT_ORDER: FiveElement[] = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy']

// ===== CSS variable references (work in both light/dark) =====
export const ELEMENT_CSS_VAR = {
  'Mộc':  { base: 'var(--element-wood)',  light: 'var(--element-wood-light)' },
  'Hỏa':  { base: 'var(--element-fire)',  light: 'var(--element-fire-light)' },
  'Thổ':  { base: 'var(--element-earth)', light: 'var(--element-earth-light)' },
  'Kim':  { base: 'var(--element-metal)', light: 'var(--element-metal-light)' },
  'Thủy': { base: 'var(--element-water)', light: 'var(--element-water-light)' },
} as const satisfies Record<FiveElement, { base: string; light: string }>

// ===== Raw hex values for inline styles (gradients, SVG, etc.) =====
// These are the canonical values — globals.css references the same hex codes.
export const ELEMENT_HEX = {
  light: {
    'Mộc':  { base: '#2D6A4F', light: '#52B788' },
    'Hỏa':  { base: '#D62828', light: '#F77F00' },
    'Thổ':  { base: '#8B6914', light: '#DDA15E' },
    'Kim':  { base: '#6C757D', light: '#DEE2E6' },
    'Thủy': { base: '#1B4965', light: '#5FA8D3' },
  },
  dark: {
    'Mộc':  { base: '#40916C', light: '#74C69D' },
    'Hỏa':  { base: '#EF4444', light: '#FBBF24' },
    'Thổ':  { base: '#D4A017', light: '#E9C46A' },
    'Kim':  { base: '#9CA3AF', light: '#E5E7EB' },
    'Thủy': { base: '#3B82F6', light: '#93C5FD' },
  },
} as const satisfies Record<'light' | 'dark', Record<FiveElement, { base: string; light: string }>>

// ===== Tailwind class references (for ElementColorBadge etc.) =====
export const ELEMENT_TEXT_CLASS: Record<FiveElement, string> = {
  'Mộc': 'text-[var(--element-wood)]',
  'Hỏa': 'text-[var(--element-fire)]',
  'Thổ': 'text-[var(--element-earth)]',
  'Kim':  'text-[var(--element-metal)]',
  'Thủy': 'text-[var(--element-water)]',
}

export const ELEMENT_TEXT_LIGHT_CLASS: Record<FiveElement, string> = {
  'Mộc': 'text-[var(--element-wood-light)]',
  'Hỏa': 'text-[var(--element-fire-light)]',
  'Thổ': 'text-[var(--element-earth-light)]',
  'Kim':  'text-[var(--element-metal-light)]',
  'Thủy': 'text-[var(--element-water-light)]',
}

export const ELEMENT_BG_CLASS: Record<FiveElement, string> = {
  'Mộc': 'bg-[var(--element-wood)]',
  'Hỏa': 'bg-[var(--element-fire)]',
  'Thổ': 'bg-[var(--element-earth)]',
  'Kim':  'bg-[var(--element-metal)]',
  'Thủy': 'bg-[var(--element-water)]',
}
