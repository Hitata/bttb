'use client'

import type { NamePartBreakdown } from '@/lib/numerology'

interface NameBreakdownProps {
  breakdown: NamePartBreakdown[]
}

export function NameBreakdown({ breakdown }: NameBreakdownProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Phan Tich Ten</h3>
      <div className="space-y-3">
        {breakdown.map((part) => (
          <div key={part.name} className="rounded-lg border bg-card p-3">
            <div className="mb-2 text-xs font-medium text-muted-foreground">{part.name}</div>
            <div className="flex flex-wrap gap-1.5">
              {part.letters.map((l, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center rounded px-2 py-1 text-xs ${
                    l.type === 'vowel'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <span className="font-medium">{l.letter}</span>
                  <span className="text-[10px] opacity-70">{l.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Tong: {part.total} &rarr; {part.reduced}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
