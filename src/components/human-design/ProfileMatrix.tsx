'use client'

import { useState } from 'react'
import { HD_LINES, HD_PROFILES, type HdProfile } from '@/lib/human-design-data'

const ANGLE_COLORS: Record<string, string> = {
  right: '#10b981',
  left: '#3b82f6',
  juxtaposition: '#f59e0b',
}

const ANGLE_LABELS: Record<string, { vn: string; en: string }> = {
  right: { vn: 'Góc Phải — Số Phận Cá Nhân', en: 'Right Angle — Personal Destiny' },
  left: { vn: 'Góc Trái — Nghiệp Liên Nhân', en: 'Left Angle — Transpersonal Karma' },
  juxtaposition: { vn: 'Giao Điểm — Số Phận Cố Định', en: 'Juxtaposition — Fixed Fate' },
}

function getProfile(conscious: number, unconscious: number): HdProfile | undefined {
  return HD_PROFILES.find(p => p.conscious === conscious && p.unconscious === unconscious)
}

export function ProfileMatrix() {
  const [selected, setSelected] = useState<HdProfile | null>(null)

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(ANGLE_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: ANGLE_COLORS[key] + '40', border: `1.5px solid ${ANGLE_COLORS[key]}` }} />
            <span>{label.vn}</span>
          </div>
        ))}
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-1 min-w-[340px]">
          {/* Header */}
          <div className="flex items-end justify-center p-1">
            <span className="text-[10px] text-muted-foreground text-center leading-tight">
              Ý thức↓<br />Vô thức→
            </span>
          </div>
          {HD_LINES.map((line) => (
            <div key={`col-${line.num}`} className="flex flex-col items-center justify-end p-1">
              <span className="text-xs font-bold">{line.num}</span>
              <span className="text-[9px] text-muted-foreground">{line.archetype.vn}</span>
            </div>
          ))}

          {/* Rows */}
          {HD_LINES.map((rowLine) => (
            <>
              <div key={`row-${rowLine.num}`} className="flex flex-col items-center justify-center p-1">
                <span className="text-xs font-bold">{rowLine.num}</span>
                <span className="text-[9px] text-muted-foreground">{rowLine.archetype.vn}</span>
              </div>
              {HD_LINES.map((colLine) => {
                const profile = getProfile(rowLine.num, colLine.num)
                if (!profile) {
                  return (
                    <div
                      key={`cell-${rowLine.num}-${colLine.num}`}
                      className="flex items-center justify-center p-1 rounded bg-muted/30 min-h-[48px]"
                    >
                      <span className="text-[10px] text-muted-foreground/30">—</span>
                    </div>
                  )
                }
                const isSelected = selected?.label === profile.label
                const color = ANGLE_COLORS[profile.angle]
                return (
                  <button
                    key={`cell-${rowLine.num}-${colLine.num}`}
                    onClick={() => setSelected(isSelected ? null : profile)}
                    className={`flex flex-col items-center justify-center p-1 rounded border min-h-[48px] transition-all ${
                      isSelected ? 'ring-2 ring-offset-1' : 'hover:bg-muted/50'
                    }`}
                    style={{
                      borderColor: color + '60',
                      backgroundColor: color + '10',
                      ...(isSelected ? { ringColor: color } : {}),
                    }}
                  >
                    <span className="text-sm font-bold" style={{ color }}>
                      {profile.label}
                    </span>
                    <span className="text-[8px] text-muted-foreground">
                      {profile.angle === 'juxtaposition' ? 'JX' : profile.angle === 'right' ? 'RA' : 'LA'}
                    </span>
                  </button>
                )
              })}
            </>
          ))}
        </div>
      </div>

      {/* Selected profile detail */}
      {selected && (
        <div
          className="rounded-lg border p-4 text-sm"
          style={{ borderColor: ANGLE_COLORS[selected.angle] + '40' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold" style={{ color: ANGLE_COLORS[selected.angle] }}>
              {selected.label}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: ANGLE_COLORS[selected.angle] + '20', color: ANGLE_COLORS[selected.angle] }}>
              {ANGLE_LABELS[selected.angle].vn}
            </span>
          </div>
          <div className="font-medium">{selected.vn}</div>
          <div className="text-xs text-muted-foreground italic">{selected.en}</div>
          <p className="mt-2">{selected.description.vn}</p>
          <p className="text-xs text-muted-foreground italic mt-1">{selected.description.en}</p>
        </div>
      )}
    </div>
  )
}
