'use client'

import type { PersonalCycle } from '@/lib/numerology'
import { NumberBadge } from './NumberBadge'

interface CyclesPanelProps {
  cycles: PersonalCycle
}

export function CyclesPanel({ cycles }: CyclesPanelProps) {
  const items = [
    { label: 'Nam Ca Nhan', value: cycles.personalYear, meaning: cycles.yearMeaning },
    { label: 'Thang Ca Nhan', value: cycles.personalMonth, meaning: cycles.monthMeaning },
    { label: 'Ngay Ca Nhan', value: cycles.personalDay, meaning: cycles.dayMeaning },
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Chu Ky Ca Nhan</h3>
      <p className="text-xs text-muted-foreground">{cycles.currentDate}</p>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg border bg-card p-3 text-center">
            <div className="mb-2 text-xs font-medium text-muted-foreground">{item.label}</div>
            <div className="flex justify-center">
              <NumberBadge value={item.value} size="md" />
            </div>
            <p className="mt-2 text-xs leading-relaxed">{item.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
