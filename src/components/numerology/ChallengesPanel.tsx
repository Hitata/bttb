'use client'

import { useState } from 'react'
import type { Challenge } from '@/lib/numerology'
import { NumberBadge } from './NumberBadge'

interface ChallengesPanelProps {
  challenges: Challenge[]
  currentAge: number
}

export function ChallengesPanel({ challenges, currentAge }: ChallengesPanelProps) {
  const [selected, setSelected] = useState<number>(
    challenges.findIndex((c) => c.isCurrent)
  )

  const activeChallenge = challenges[selected >= 0 ? selected : 0]

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Thu Thach</h3>

      {/* Timeline */}
      <div className="flex gap-1">
        {challenges.map((c, i) => {
          const ageRange = c.endAge !== null ? `${c.startAge}-${c.endAge}` : `${c.startAge}+`
          const isMain = c.position === 'third'
          const isCurrent = c.isCurrent

          return (
            <button
              key={i}
              type="button"
              className={`flex-1 rounded-lg border p-2 text-center transition-colors ${
                isCurrent
                  ? 'border-foreground/30 bg-accent ring-1 ring-foreground/20'
                  : 'bg-card hover:bg-accent/50'
              } ${selected === i ? 'ring-2 ring-foreground/30' : ''}`}
              onClick={() => setSelected(i)}
            >
              <div className="flex justify-center">
                <NumberBadge value={c.number} size="sm" />
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">{ageRange}</div>
              <div className="text-[10px] font-medium">
                {c.label}
                {isMain && <span className="ml-0.5 text-amber-600 dark:text-amber-400">(Chinh)</span>}
              </div>
            </button>
          )
        })}
      </div>

      {/* Description */}
      {activeChallenge && (
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs leading-relaxed">{activeChallenge.description}</p>
        </div>
      )}
    </div>
  )
}
