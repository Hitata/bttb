'use client'

import { useState } from 'react'
import { HD_TYPES, type HdType } from '@/lib/human-design-data'
import { BodygraphSvg } from './BodygraphSvg'

const TYPE_DEFINED_CENTERS: Record<string, string[]> = {
  generator: ['sacral'],
  'manifesting-generator': ['sacral', 'throat'],
  manifestor: ['throat', 'heart', 'root'],
  projector: ['ajna', 'throat', 'g'],
  reflector: [],
}

function TypeDonut() {
  const total = HD_TYPES.reduce((sum, t) => sum + t.percentage, 0)
  const size = 200
  const cx = size / 2
  const cy = size / 2
  const r = 70
  const innerR = 45

  let cumAngle = -90

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[200px] mx-auto" xmlns="http://www.w3.org/2000/svg">
      {HD_TYPES.map((t) => {
        const angle = (t.percentage / total) * 360
        const startRad = (cumAngle * Math.PI) / 180
        const endRad = ((cumAngle + angle) * Math.PI) / 180
        const midRad = ((cumAngle + angle / 2) * Math.PI) / 180
        const largeArc = angle > 180 ? 1 : 0

        const x1o = cx + r * Math.cos(startRad)
        const y1o = cy + r * Math.sin(startRad)
        const x2o = cx + r * Math.cos(endRad)
        const y2o = cy + r * Math.sin(endRad)
        const x1i = cx + innerR * Math.cos(endRad)
        const y1i = cy + innerR * Math.sin(endRad)
        const x2i = cx + innerR * Math.cos(startRad)
        const y2i = cy + innerR * Math.sin(startRad)

        const labelR = r + 14
        const lx = cx + labelR * Math.cos(midRad)
        const ly = cy + labelR * Math.sin(midRad)

        cumAngle += angle

        return (
          <g key={t.id}>
            <path
              d={`M${x1o},${y1o} A${r},${r} 0 ${largeArc},1 ${x2o},${y2o} L${x1i},${y1i} A${innerR},${innerR} 0 ${largeArc},0 ${x2i},${y2i} Z`}
              fill={t.color}
              fillOpacity="0.6"
              stroke="white"
              strokeWidth="1.5"
              className="hover:fill-opacity-80 transition-opacity"
            />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill={t.color} fontWeight="600">
              {t.percentage}%
            </text>
          </g>
        )
      })}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="9" className="fill-foreground" fontWeight="600" opacity="0.5">
        Loại Hình
      </text>
    </svg>
  )
}

function SingleTypeCard({ type, isExpanded, onToggle }: { type: HdType; isExpanded: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`text-left w-full rounded-lg border p-4 transition-all ${isExpanded ? 'ring-2' : 'hover:bg-muted/50'}`}
      style={isExpanded ? { borderColor: type.color, ['--tw-ring-color' as string]: type.color + '40' } : {}}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
        <div>
          <div className="font-semibold text-sm">{type.vn}</div>
          <div className="text-xs text-muted-foreground italic">{type.en} — ~{type.percentage}%</div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          <div className="flex gap-4">
            <div className="w-24 shrink-0">
              <BodygraphSvg
                definedCenters={TYPE_DEFINED_CENTERS[type.id] || []}
                showLabels={false}
                showChannels={false}
                className="max-w-[80px]"
              />
            </div>
            <div className="space-y-2 text-xs">
              <p>{type.description.vn}</p>
              <p className="text-muted-foreground italic">{type.description.en}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border p-2">
              <div className="text-muted-foreground mb-0.5">Chiến lược / Strategy</div>
              <div className="font-medium">{type.strategy.vn}</div>
              <div className="text-muted-foreground italic">{type.strategy.en}</div>
            </div>
            <div className="rounded border p-2">
              <div className="text-muted-foreground mb-0.5">Chữ ký / Signature</div>
              <div className="font-medium" style={{ color: type.color }}>{type.signature.vn}</div>
              <div className="text-muted-foreground italic">{type.signature.en}</div>
            </div>
            <div className="rounded border p-2">
              <div className="text-muted-foreground mb-0.5">Not-Self</div>
              <div className="font-medium text-red-500">{type.notSelf.vn}</div>
              <div className="text-muted-foreground italic">{type.notSelf.en}</div>
            </div>
            <div className="rounded border p-2">
              <div className="text-muted-foreground mb-0.5">Quyền / Authority</div>
              <div className="font-medium">{type.authority.join(', ')}</div>
            </div>
          </div>
        </div>
      )}
    </button>
  )
}

export function TypeCards() {
  const [expanded, setExpanded] = useState<string | null>('generator')

  return (
    <div className="space-y-4">
      <TypeDonut />
      <div className="space-y-2">
        {HD_TYPES.map((t) => (
          <SingleTypeCard
            key={t.id}
            type={t}
            isExpanded={expanded === t.id}
            onToggle={() => setExpanded(expanded === t.id ? null : t.id)}
          />
        ))}
      </div>
    </div>
  )
}
