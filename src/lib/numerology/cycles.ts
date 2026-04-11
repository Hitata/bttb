import { NUMBER_MEANINGS } from './constants'
import { reduce } from './reduction'
import type { PersonalCycle } from './types'

export function computePersonalYear(
  birthMonth: number,
  birthDay: number,
  currentYear: number
): number {
  return reduce(birthMonth + birthDay + currentYear)
}

export function computePersonalMonth(
  personalYear: number,
  currentMonth: number
): number {
  return reduce(personalYear + currentMonth)
}

export function computePersonalDay(
  personalMonth: number,
  currentDay: number
): number {
  return reduce(personalMonth + currentDay)
}

export function computePersonalCycles(
  birthMonth: number,
  birthDay: number,
  currentDate: Date = new Date()
): PersonalCycle {
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const currentDay = currentDate.getDate()

  const personalYear = computePersonalYear(birthMonth, birthDay, currentYear)
  const personalMonth = computePersonalMonth(personalYear, currentMonth)
  const personalDay = computePersonalDay(personalMonth, currentDay)

  const yearMeaning = NUMBER_MEANINGS[personalYear]
  const monthMeaning = NUMBER_MEANINGS[personalMonth]
  const dayMeaning = NUMBER_MEANINGS[personalDay]

  return {
    personalYear,
    personalMonth,
    personalDay,
    currentDate: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`,
    yearMeaning: yearMeaning?.asPersonalYear || yearMeaning?.general || '',
    monthMeaning: monthMeaning?.asPersonalYear || monthMeaning?.general || '',
    dayMeaning: dayMeaning?.asPersonalYear || dayMeaning?.general || '',
  }
}
