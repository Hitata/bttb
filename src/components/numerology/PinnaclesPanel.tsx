'use client'

import { useState } from 'react'
import type { Pinnacle } from '@/lib/numerology'
import { NumberBadge } from './NumberBadge'

interface PinnaclesPanelProps {
  pinnacles: Pinnacle[]
  currentAge: number
}

export function PinnaclesPanel({ pinnacles, currentAge }: PinnaclesPanelProps) {
  const [selected, setSelected] = useState<number>(
    pinnacles.findIndex((p) => p.isCurrent)
  )

  const activePinnacle = pinnacles[selected >= 0 ? selected : 0]

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Dinh Cao</h3>

      {/* Timeline */}
      <div className="flex gap-1">
        {pinnacles.map((p, i) => {
          const ageRange = p.endAge !== null ? `${p.startAge}-${p.endAge}` : `${p.startAge}+`
          const isCurrent = p.isCurrent

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
                <NumberBadge value={p.number} size="sm" />
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">{ageRange}</div>
              <div className="text-[10px] font-medium">{p.label}</div>
            </button>
          )
        })}
      </div>

      {/* Description */}
      {activePinnacle && (
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs leading-relaxed">{activePinnacle.description}</p>
        </div>
      )}
    </div>
  )
}
