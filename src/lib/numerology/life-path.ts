import { NUMBER_MEANINGS, MASTER_NUMBERS } from './constants'
import { reduce, digitSum } from './reduction'
import type { CoreNumber } from './types'

export function computeLifePath(
  month: number,
  day: number,
  year: number
): CoreNumber {
  const m = reduce(month)
  const d = reduce(day)
  const y = reduce(digitSum(year))
  const value = reduce(m + d + y)
  const meaning = NUMBER_MEANINGS[value]

  return {
    name: 'Life Path',
    nameVi: 'Số Chủ Đạo',
    value,
    isMaster: MASTER_NUMBERS.has(value),
    description: meaning?.asLifePath || meaning?.general || '',
    calculation: `reduce(${month}) + reduce(${day}) + reduce(digitSum(${year})) = ${m} + ${d} + ${y} = ${m + d + y} → ${value}`,
  }
}
