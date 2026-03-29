'use client'

import { useState } from 'react'
import { HD_LINES, type HdLine } from '@/lib/human-design-data'

export function LineArchetypeStack() {
  const [selected, setSelected] = useState<number | null>(null)

  const selectedLine = selected !== null ? HD_LINES.find(l => l.num === selected) : null

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <svg viewBox="0 0 300 360" className="w-full max-w-sm" xmlns="http://www.w3.org/2000/svg">
          {/* Trigram divider */}
          <line x1={50} y1={183} x2={250} y2={183} stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="4 4" />
          <text x={270} y={90} textAnchor="middle" fontSize="8" className="fill-foreground" opacity="0.3" transform="rotate(90,270,90)">
            Liên Nhân · Upper
          </text>
          <text x={270} y={270} textAnchor="middle" fontSize="8" className="fill-foreground" opacity="0.3" transform="rotate(90,270,270)">
            Cá Nhân · Lower
          </text>

          {/* Lines — drawn top to bottom: 6, 5, 4, 3, 2, 1 */}
          {[...HD_LINES].reverse().map((line, i) => {
            const y = 30 + i * 55
            const isSelected = selected === line.num
            const trigramColor = line.trigram === 'upper' ? '#8b5cf6' : '#f59e0b'

            return (
              <g
                key={line.num}
                onClick={() => setSelected(isSelected ? null : line.num)}
                className="cursor-pointer"
              >
                {/* Bar */}
                <rect
                  x={50}
                  y={y}
                  width={190}
                  height={40}
                  rx={8}
                  fill={trigramColor}
                  fillOpacity={isSelected ? 0.2 : 0.06}
                  stroke={trigramColor}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeOpacity={isSelected ? 0.8 : 0.2}
                  className="transition-all duration-200 hover:fill-opacity-15"
                />

                {/* Line number */}
                <text x={66} y={y + 24} fontSize="16" fontWeight="800" fill={trigramColor} opacity={isSelected ? 1 : 0.6}>
                  {line.num}
                </text>

                {/* Archetype */}
                <text x={90} y={y + 17} fontSize="10" fontWeight="600" className="fill-foreground" opacity={isSelected ? 1 : 0.7}>
                  {line.archetype.vn}
                </text>
                <text x={90} y={y + 30} fontSize="8" className="fill-foreground" opacity="0.4">
                  {line.archetype.en} — {line.theme.vn}
                </text>

                {/* Mirror indicator */}
                <text x={228} y={y + 24} fontSize="8" className="fill-foreground" opacity="0.3" textAnchor="end">
                  ↔ {line.mirror}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Detail */}
      {selectedLine && (
        <div className="rounded-lg border p-4 text-sm" style={{ borderColor: (selectedLine.trigram === 'upper' ? '#8b5cf6' : '#f59e0b') + '40' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold" style={{ color: selectedLine.trigram === 'upper' ? '#8b5cf6' : '#f59e0b' }}>
              Hào {selectedLine.num}
            </span>
            <span className="font-semibold">{selectedLine.archetype.vn}</span>
            <span className="text-xs text-muted-foreground italic">({selectedLine.archetype.en})</span>
          </div>
          <p className="mt-1">{selectedLine.description.vn}</p>
          <p className="text-xs text-muted-foreground italic mt-1">{selectedLine.description.en}</p>
          <div className="mt-2 text-xs text-muted-foreground">
            Hào đối xứng: {selectedLine.mirror} ({HD_LINES.find(l => l.num === selectedLine.mirror)?.archetype.vn})
          </div>
        </div>
      )}
    </div>
  )
}
