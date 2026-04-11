'use client'

import type { CoreNumber } from '@/lib/numerology'
import { NumberCard } from './NumberCard'

interface CoreNumbersPanelProps {
  lifePath: CoreNumber
  birthday: CoreNumber
  expression: CoreNumber
  soulUrge: CoreNumber
  personality: CoreNumber
  maturity: CoreNumber
}

export function CoreNumbersPanel({
  lifePath,
  birthday,
  expression,
  soulUrge,
  personality,
  maturity,
}: CoreNumbersPanelProps) {
  const numbers = [lifePath, birthday, expression, soulUrge, personality, maturity]

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Con So Chu Dao</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {numbers.map((n) => (
          <NumberCard key={n.name} number={n} showCalculation />
        ))}
      </div>
    </div>
  )
}
