import { computeLifePath } from './life-path'
import { computeBirthday } from './birthday'
import {
  getNameBreakdown,
  computeExpression,
  computeSoulUrge,
  computePersonality,
} from './name-numbers'
import { computeMaturity } from './maturity'
import { computePersonalCycles } from './cycles'
import { computeChallenges } from './challenges'
import { computePinnacles } from './pinnacles'
import type { NumerologyInput, NumerologyResult } from './types'

export function computeNumerology(
  input: NumerologyInput,
  currentDate: Date = new Date()
): NumerologyResult {
  const { fullName, birthYear, birthMonth, birthDay } = input

  // Core numbers
  const lifePath = computeLifePath(birthMonth, birthDay, birthYear)
  const birthday = computeBirthday(birthDay)
  const expression = computeExpression(fullName)
  const soulUrge = computeSoulUrge(fullName)
  const personality = computePersonality(fullName)
  const maturity = computeMaturity(lifePath.value, expression.value)

  // Name breakdown
  const nameBreakdown = getNameBreakdown(fullName)

  // Personal cycles
  const cycles = computePersonalCycles(birthMonth, birthDay, currentDate)

  // Challenges and pinnacles
  const challenges = computeChallenges(
    birthMonth,
    birthDay,
    birthYear,
    lifePath.value
  )
  const pinnacles = computePinnacles(
    birthMonth,
    birthDay,
    birthYear,
    lifePath.value
  )

  // Compute current age and set isCurrent flags
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const currentDay = currentDate.getDate()
  let age = currentYear - birthYear
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--
  }

  for (const challenge of challenges) {
    challenge.isCurrent =
      age >= challenge.startAge &&
      (challenge.endAge === null || age <= challenge.endAge)
  }

  for (const pinnacle of pinnacles) {
    pinnacle.isCurrent =
      age >= pinnacle.startAge &&
      (pinnacle.endAge === null || age <= pinnacle.endAge)
  }

  return {
    input,
    nameBreakdown,
    lifePath,
    birthday,
    expression,
    soulUrge,
    personality,
    maturity,
    cycles,
    challenges,
    pinnacles,
  }
}

// Re-exports
export type {
  NumerologyInput,
  NumerologyResult,
  CoreNumber,
  PersonalCycle,
  Challenge,
  Pinnacle,
  LetterBreakdown,
  NamePartBreakdown,
  LetterType,
} from './types'

export { MASTER_NUMBERS, NUMBER_MEANINGS, LETTER_VALUES, VOWELS } from './constants'
export { reduce, reduceStrict, digitSum } from './reduction'
export { stripDiacritics, classifyLetters, processName } from './vietnamese'
export { computeLifePath } from './life-path'
export { computeBirthday } from './birthday'
export {
  getNameBreakdown,
  computeExpression,
  computeSoulUrge,
  computePersonality,
} from './name-numbers'
export { computeMaturity } from './maturity'
export {
  computePersonalYear,
  computePersonalMonth,
  computePersonalDay,
  computePersonalCycles,
} from './cycles'
export { computeChallenges } from './challenges'
export { computePinnacles } from './pinnacles'
