export interface NumerologyInput {
  fullName: string
  birthYear: number
  birthMonth: number // 1-12
  birthDay: number // 1-31
}

export type LetterType = 'vowel' | 'consonant'

export interface LetterBreakdown {
  letter: string // Original letter (with diacritics)
  baseLetter: string // Stripped letter (A-Z)
  value: number // Pythagorean value (1-9)
  type: LetterType
}

export interface NamePartBreakdown {
  name: string
  letters: LetterBreakdown[]
  total: number
  reduced: number
}

export interface CoreNumber {
  name: string
  nameVi: string
  value: number
  isMaster: boolean
  description: string
  calculation: string
}

export interface PersonalCycle {
  personalYear: number
  personalMonth: number
  personalDay: number
  currentDate: string
  yearMeaning: string
  monthMeaning: string
  dayMeaning: string
}

export interface Challenge {
  number: number
  position: 'first' | 'second' | 'third' | 'fourth'
  label: string
  startAge: number
  endAge: number | null
  isCurrent: boolean
  description: string
}

export interface Pinnacle {
  number: number
  position: 'first' | 'second' | 'third' | 'fourth'
  label: string
  startAge: number
  endAge: number | null
  isCurrent: boolean
  isMaster: boolean
  description: string
}

export interface NumerologyResult {
  input: NumerologyInput
  nameBreakdown: NamePartBreakdown[]
  lifePath: CoreNumber
  birthday: CoreNumber
  expression: CoreNumber
  soulUrge: CoreNumber
  personality: CoreNumber
  maturity: CoreNumber
  cycles: PersonalCycle
  challenges: Challenge[]
  pinnacles: Pinnacle[]
}
