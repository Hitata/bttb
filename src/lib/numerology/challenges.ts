import { NUMBER_MEANINGS } from './constants'
import { reduce, reduceStrict } from './reduction'
import type { Challenge } from './types'

export function computeChallenges(
  month: number,
  day: number,
  year: number,
  lifePathValue: number
): Challenge[] {
  const m = reduceStrict(month)
  const d = reduceStrict(day)
  const y = reduceStrict(reduce(year))

  const first = Math.abs(m - d)
  const second = Math.abs(d - y)
  const third = Math.abs(first - second)
  const fourth = Math.abs(m - y)

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
      label: 'Thử thách thứ nhất',
      startAge: 0,
      endAge: firstEnd,
    },
    {
      number: second,
      position: 'second',
      label: 'Thử thách thứ hai',
      startAge: firstEnd + 1,
      endAge: firstEnd + 9,
    },
    {
      number: third,
      position: 'third',
      label: 'Thử thách thứ ba',
      startAge: 0,
      endAge: firstEnd + 9,
    },
    {
      number: fourth,
      position: 'fourth',
      label: 'Thử thách thứ tư',
      startAge: firstEnd + 10,
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
      description: meaning?.asChallenge || meaning?.general || '',
    }
  })
}
