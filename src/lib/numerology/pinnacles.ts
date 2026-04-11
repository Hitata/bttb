import { NUMBER_MEANINGS, MASTER_NUMBERS } from './constants'
import { reduce, reduceStrict, digitSum } from './reduction'
import type { Pinnacle } from './types'

export function computePinnacles(
  month: number,
  day: number,
  year: number,
  lifePathValue: number
): Pinnacle[] {
  const m = reduce(month)
  const d = reduce(day)
  const y = reduce(digitSum(year))

  const first = reduce(m + d)
  const second = reduce(d + y)
  const third = reduce(first + second)
  const fourth = reduce(m + y)

  const firstEnd = 36 - reduceStrict(lifePathValue)

  const positions: Array<{
    number: number
    position: 'first' | 'second' | 'third' | 'fourth'
    label: string
    startAge: number
    endAge: number | null
  }> = [
    {
      number: first,
      position: 'first',
      label: 'Đỉnh cao thứ nhất',
      startAge: 0,
      endAge: firstEnd,
    },
    {
      number: second,
      position: 'second',
      label: 'Đỉnh cao thứ hai',
      startAge: firstEnd + 1,
      endAge: firstEnd + 9,
    },
    {
      number: third,
      position: 'third',
      label: 'Đỉnh cao thứ ba',
      startAge: firstEnd + 10,
      endAge: firstEnd + 18,
    },
    {
      number: fourth,
      position: 'fourth',
      label: 'Đỉnh cao thứ tư',
      startAge: firstEnd + 19,
      endAge: null,
    },
  ]

  return positions.map(({ number, position, label, startAge, endAge }) => {
    const meaning = NUMBER_MEANINGS[number]
    return {
      number,
      position,
      label,
      startAge,
      endAge,
      isCurrent: false, // Set by orchestrator based on current age
      isMaster: MASTER_NUMBERS.has(number),
      description: meaning?.asPinnacle || meaning?.general || '',
    }
  })
}
