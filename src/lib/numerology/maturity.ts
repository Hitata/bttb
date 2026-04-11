import { NUMBER_MEANINGS, MASTER_NUMBERS } from './constants'
import { reduce } from './reduction'
import type { CoreNumber } from './types'

export function computeMaturity(
  lifePathValue: number,
  expressionValue: number
): CoreNumber {
  const value = reduce(lifePathValue + expressionValue)
  const meaning = NUMBER_MEANINGS[value]

  return {
    name: 'Maturity',
    nameVi: 'Số Trưởng Thành',
    value,
    isMaster: MASTER_NUMBERS.has(value),
    description: meaning?.asMaturity || meaning?.general || '',
    calculation: `reduce(${lifePathValue} + ${expressionValue}) = reduce(${lifePathValue + expressionValue}) = ${value}`,
  }
}
