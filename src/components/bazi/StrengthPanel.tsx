'use client'

import type { ElementStrength, StemRootedness, Faction, FiveElement, PositionalInteraction, ExtremeDynamic, CungVi } from '@/lib/bazi/types'
import { ELEMENT_COLORS } from '@/lib/bazi'

const STATE_COLORS: Record<string, string> = {
  'Vượng': 'text-green-600',
  'Tướng': 'text-blue-600',
  'Hưu': 'text-muted-foreground',
  'Tù': 'text-orange-500',
  'Tử': 'text-red-500',
}

const ROOT_LABELS: Record<string, { text: string; color: string }> = {
  strong: { text: 'Gốc vững', color: 'text-green-600' },
  medium: { text: 'Có gốc', color: 'text-blue-600' },
  weak: { text: 'Gốc yếu', color: 'text-orange-500' },
  none: { text: 'Hư phù', color: 'text-red-500' },
}

const PILLAR_NAMES = ['Năm', 'Tháng', 'Ngày', 'Giờ']

const ELEMENT_CSS_VAR: Record<FiveElement, string> = {
  'Mộc': 'var(--element-wood)',
  'Hỏa': 'var(--element-fire)',
  'Thổ': 'var(--element-earth)',
  'Kim': 'var(--element-metal)',
  'Thủy': 'var(--element-water)',
}

const POSITIONAL_COLORS: Record<string, string> = {
  strongest: 'text-green-600',
  strong: 'text-blue-600',
  weak: 'text-orange-500',
  blocked: 'text-red-500',
}

const POSITIONAL_LABELS: Record<string, string> = {
  strongest: 'Rất mạnh',
  strong: 'Mạnh',
  weak: 'Yếu',
  blocked: 'Bị chặn',
}

const EXTREME_COLORS: Record<string, string> = {
  phanKhac: 'bg-red-100 text-red-800',
  phanSinh: 'bg-orange-100 text-orange-800',
  suyXungVuong: 'bg-amber-100 text-amber-800',
  hopKhac: 'bg-purple-100 text-purple-800',
}

const EXTREME_LABELS: Record<string, string> = {
  phanKhac: 'Phản Khắc',
  phanSinh: 'Phản Sinh',
  suyXungVuong: 'Suy Xung Vượng',
  hopKhac: 'Hợp Khắc',
}

export default function StrengthPanel({
  seasonalStrength,
  stemRootedness,
  factions,
  positionalInteractions,
  extremeDynamics,
  cungVi,
}: {
  seasonalStrength: ElementStrength[]
  stemRootedness: StemRootedness[]
  factions: Faction[]
  positionalInteractions?: PositionalInteraction[]
  extremeDynamics?: ExtremeDynamic[]
  cungVi?: CungVi[]
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

      {/* Positional Interactions */}
      {positionalInteractions && positionalInteractions.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold">Tương Tác Theo Vị Trí</h3>
          <div className="space-y-1.5">
            {positionalInteractions.map((pi, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`shrink-0 font-medium ${POSITIONAL_COLORS[pi.positionalStrength]}`}>
                  {POSITIONAL_LABELS[pi.positionalStrength]}
                </span>
                <div className="min-w-0">
                  <span>{pi.label}</span>
                  {pi.positionalNote && (
                    <span className="ml-1 text-muted-foreground">— {pi.positionalNote}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extreme Dynamics */}
      {extremeDynamics && extremeDynamics.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold">Ngũ Hành Thái Quá</h3>
          <div className="space-y-2">
            {extremeDynamics.map((ed, i) => (
              <div key={i} className={`rounded-md px-2.5 py-2 text-xs ${EXTREME_COLORS[ed.type]}`}>
                <div className="font-medium">{EXTREME_LABELS[ed.type]}: {ed.label}</div>
                <div className="mt-0.5 opacity-80">{ed.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cung Vị */}
      {cungVi && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold">Cung Vị (Tứ Trụ)</h3>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {cungVi.map(cv => (
              <div key={cv.pillarIndex} className="rounded-md bg-muted p-2 text-center">
                <div className="font-semibold">{cv.pillarName}</div>
                <div className="mt-1 text-muted-foreground">{cv.ageRange}</div>
                <div className="mt-1.5 space-y-0.5">
                  <div><span className="text-muted-foreground">Can:</span> {cv.canDomain}</div>
                  <div><span className="text-muted-foreground">Chi:</span> {cv.chiDomain}</div>
                </div>
                <div className="mt-1.5 text-muted-foreground leading-tight">{cv.lifeDomain}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
