import type { DaiVanCycle } from '@/lib/bazi'
import { ELEMENT_COLORS, HEAVENLY_STEMS, EARTHLY_BRANCHES } from '@/lib/bazi'

interface LuckPillarsSectionProps {
  cycles: DaiVanCycle[]
  startAge: number
}

export function LuckPillarsSection({ cycles, startAge }: LuckPillarsSectionProps) {
  if (cycles.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Luck Pillars (Dai Van)</h2>
      <p className="text-sm text-muted-foreground">Starting age: {startAge}</p>
      <div className="overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {cycles.map((cycle, i) => {
            const canElement = HEAVENLY_STEMS[cycle.canIndex]?.element
            const chiElement = EARTHLY_BRANCHES[cycle.chiIndex]?.element
            const canColor = canElement ? (ELEMENT_COLORS[canElement] || '') : ''
            const chiColor = chiElement ? (ELEMENT_COLORS[chiElement] || '') : ''
            return (
              <div key={i} className="rounded-lg border p-3 text-center min-w-[80px]">
                <div className="text-xs text-muted-foreground">Age {cycle.startAge}</div>
                <div className="text-xs text-muted-foreground">{cycle.startYear}</div>
                <div className={`mt-1 text-lg font-bold ${canColor}`}>{cycle.can}</div>
                <div className={`text-lg font-bold ${chiColor}`}>{cycle.chi}</div>
                <div className="mt-1 text-xs text-muted-foreground">{cycle.thapThan.code}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
