'use client'

import { useState } from 'react'
import type { CoreNumber } from '@/lib/numerology'
import { NumberBadge } from './NumberBadge'

interface NumberCardProps {
  number: CoreNumber
  showCalculation?: boolean
}

export function NumberCard({ number, showCalculation = false }: NumberCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <NumberBadge value={number.value} size="lg" />
        <h4 className="text-sm font-semibold">{number.nameVi}</h4>
        <p className="text-xs text-muted-foreground">{number.name}</p>
        <p className="text-xs leading-relaxed">{number.description}</p>
      </div>

      {showCalculation && number.calculation && (
        <div className="mt-3">
          <button
            type="button"
            className="w-full text-left text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '- ' : '+ '}Cach tinh
          </button>
          {expanded && (
            <p className="mt-1.5 rounded-md bg-muted p-2 text-xs text-muted-foreground whitespace-pre-wrap">
              {number.calculation}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
