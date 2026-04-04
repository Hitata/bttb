'use client'

import type { ElementStrength, StemRootedness, Faction, FiveElement } from '@/lib/bazi/types'
import { ELEMENT_COLORS } from '@/lib/bazi'

const STATE_COLORS: Record<string, string> = {
  'Vượng': 'text-green-600 dark:text-green-400',
  'Tướng': 'text-blue-600 dark:text-blue-400',
  'Hưu': 'text-gray-500 dark:text-gray-400',
  'Tù': 'text-orange-500 dark:text-orange-400',
  'Tử': 'text-red-500 dark:text-red-400',
}

const ROOT_LABELS: Record<string, { text: string; color: string }> = {
  strong: { text: 'Gốc vững', color: 'text-green-600 dark:text-green-400' },
  medium: { text: 'Có gốc', color: 'text-blue-600 dark:text-blue-400' },
  weak: { text: 'Gốc yếu', color: 'text-orange-500 dark:text-orange-400' },
  none: { text: 'Hư phù', color: 'text-red-500 dark:text-red-400' },
}

const PILLAR_NAMES = ['Năm', 'Tháng', 'Ngày', 'Giờ']

const ELEMENT_CSS_VAR: Record<FiveElement, string> = {
  'Mộc': 'var(--element-wood)',
  'Hỏa': 'var(--element-fire)',
  'Thổ': 'var(--element-earth)',
  'Kim': 'var(--element-metal)',
  'Thủy': 'var(--element-water)',
}

export default function StrengthPanel({
  seasonalStrength,
  stemRootedness,
  factions,
}: {
  seasonalStrength: ElementStrength[]
  stemRootedness: StemRootedness[]
  factions: Faction[]
}) {
  return (
    <div className="space-y-4">
      {/* Seasonal Strength */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold">Vượng Suy Theo Tháng</h3>
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {seasonalStrength.map(s => (
            <div key={s.element} className="rounded-md bg-muted p-2">
              <div className={ELEMENT_COLORS[s.element] + ' font-medium'}>{s.element}</div>
              <div className={`mt-1 font-semibold ${STATE_COLORS[s.state]}`}>{s.state}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stem Rootedness */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold">Gốc Rễ Thiên Can</h3>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {stemRootedness.map((sr, i) => {
            const rootInfo = ROOT_LABELS[sr.rootStrength]
            return (
              <div key={i} className="rounded-md bg-muted p-2">
                <div className="text-muted-foreground">{PILLAR_NAMES[sr.pillarIndex]}</div>
                <div className={`font-medium ${ELEMENT_COLORS[sr.element]}`}>{sr.canName}</div>
                <div className={`mt-1 ${rootInfo.color}`}>{rootInfo.text}</div>
                {sr.roots.length > 0 && (
                  <div className="mt-0.5 text-muted-foreground">
                    {sr.roots.length} gốc
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Factions */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold">Đảng Thế Ngũ Hành</h3>
        <div className="space-y-2">
          {factions.filter(f => f.strength > 0).map(f => (
            <div key={f.element} className="flex items-center gap-2 text-xs">
              <span className="w-5 text-center font-bold text-muted-foreground">#{f.rank}</span>
              <span className={`w-8 font-medium ${ELEMENT_COLORS[f.element]}`}>{f.element}</span>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (f.strength / (factions[0]?.strength || 1)) * 100)}%`,
                      backgroundColor: ELEMENT_CSS_VAR[f.element],
                      opacity: 0.5,
                    }}
                  />
                </div>
              </div>
              <span className="w-16 text-right text-muted-foreground">
                {f.leaders.length}C {f.supporters.length}Đ
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
