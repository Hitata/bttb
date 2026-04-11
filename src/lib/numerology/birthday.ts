import { NUMBER_MEANINGS, MASTER_NUMBERS } from './constants'
import { reduce } from './reduction'
import type { CoreNumber } from './types'

export function computeBirthday(day: number): CoreNumber {
  const value = reduce(day)
  const meaning = NUMBER_MEANINGS[value]

  return {
    name: 'Birthday',
    nameVi: 'Số Ngày Sinh',
    value,
    isMaster: MASTER_NUMBERS.has(value),
    description: meaning?.asBirthday || meaning?.general || '',
    calculation: `reduce(${day}) = ${value}`,
  }
}
