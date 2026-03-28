'use client'

import { useState, useMemo } from 'react'
import React from 'react'
import { Grid2x2, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  TRIGRAMS,
  HEXAGRAMS,
  ICHING_DATA,
  ELEMENT_COLORS,
  getHexLines,
  getHexElement,
  buildGridMatrix,
  type Hexagram,
} from '@/lib/hexagrams-data'

function HexLines({
  upperIdx,
  lowerIdx,
  size = 'sm',
}: {
  upperIdx: number
  lowerIdx: number
  size?: 'sm' | 'lg'
}) {
  const lines = getHexLines(upperIdx, lowerIdx)
  const el = getHexElement(upperIdx)
  const color = ELEMENT_COLORS[el]
  const w = size === 'sm' ? 22 : 32
  const h = size === 'sm' ? 2 : 3
  const gap = size === 'sm' ? 4 : 6

  return (
    <div className="flex flex-col gap-[3px] items-center">
      {lines.map((isYang, i) =>
        isYang ? (
          <div
            key={i}
            style={{ width: w, height: h, background: color, borderRadius: h / 2 }}
          />
        ) : (
          <div key={i} style={{ width: w, display: 'flex', gap: gap }}>
            <div style={{ flex: 1, height: h, background: color, borderRadius: h / 2 }} />
            <div style={{ flex: 1, height: h, background: color, borderRadius: h / 2 }} />
          </div>
        )
      )}
    </div>
  )
}

function HexDetail({
  hex,
  onClose,
}: {
  hex: Hexagram
  onClose: () => void
}) {
  const el = getHexElement(hex.upperTriIdx)
  const color = ELEMENT_COLORS[el]
  const upper = TRIGRAMS[hex.upperTriIdx]
  const lower = TRIGRAMS[hex.lowerTriIdx]
  const iching = ICHING_DATA[hex.num]

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-serif" style={{ color }}>
              {hex.cn}
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">{hex.num}. {hex.pinyin}</div>
              <div className="text-lg font-semibold">{hex.vnFull}</div>
              <div className="text-sm text-muted-foreground italic">{hex.en}</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Ngoại quái</div>
            <HexLines upperIdx={hex.upperTriIdx} lowerIdx={hex.upperTriIdx} size="lg" />
            <div className="mt-1 font-semibold text-sm">{upper.cn} {upper.vn}</div>
            <div className="text-xs text-muted-foreground">{upper.nature}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Nội quái</div>
            <HexLines upperIdx={hex.lowerTriIdx} lowerIdx={hex.lowerTriIdx} size="lg" />
            <div className="mt-1 font-semibold text-sm">{lower.cn} {lower.vn}</div>
            <div className="text-xs text-muted-foreground">{lower.nature}</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground italic">{hex.description}</p>
        {iching && (
          <div className="space-y-2 border-t pt-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quái Từ · Judgment</div>
            <p className="text-sm">{iching.judgment.vn}</p>
            <p className="text-xs text-muted-foreground italic">{iching.judgment.en}</p>
          </div>
        )}
        {iching && (
          <div className="space-y-2 border-t pt-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tượng Từ · Image</div>
            <p className="text-sm">{iching.image.vn}</p>
            <p className="text-xs text-muted-foreground italic">{iching.image.en}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function GridView({
  selectedTrigramIdx,
  onSelectHex,
}: {
  selectedTrigramIdx: number | null
  onSelectHex: (hex: Hexagram) => void
}) {
  const matrix = useMemo(() => buildGridMatrix(), [])

  function isHighlighted(hex: Hexagram) {
    if (selectedTrigramIdx === null) return true
    return hex.upperTriIdx === selectedTrigramIdx || hex.lowerTriIdx === selectedTrigramIdx
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-9 gap-0.5 min-w-[400px]">
        <div className="flex items-end justify-end p-1">
          <span className="text-[10px] text-muted-foreground leading-tight text-right">
            Ngoại↓<br />Nội→
          </span>
        </div>
        {TRIGRAMS.map((t, j) => (
          <div key={j} className="flex flex-col items-center justify-end p-1 pb-2">
            <span className="text-sm font-bold" style={{ color: ELEMENT_COLORS[t.el] }}>{t.cn}</span>
            <span className="text-[10px] text-muted-foreground">{t.vn}</span>
          </div>
        ))}
        {matrix.map((row, i) => (
          <React.Fragment key={i}>
            <div key={`rh-${i}`} className="flex flex-col items-center justify-center p-1">
              <span className="text-sm font-bold" style={{ color: ELEMENT_COLORS[TRIGRAMS[i].el] }}>{TRIGRAMS[i].cn}</span>
              <span className="text-[10px] text-muted-foreground">{TRIGRAMS[i].vn}</span>
            </div>
            {row.map((hex, j) =>
              hex ? (
                <button
                  key={`cell-${i}-${j}`}
                  onClick={() => onSelectHex(hex)}
                  className={`flex flex-col items-center justify-center gap-0.5 p-1.5 rounded border text-center transition-all min-h-[72px] ${
                    isHighlighted(hex)
                      ? 'hover:bg-muted/70 border-border cursor-pointer'
                      : 'opacity-25 border-transparent cursor-pointer'
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground leading-none">{hex.num}</span>
                  <HexLines upperIdx={hex.upperTriIdx} lowerIdx={hex.lowerTriIdx} />
                  <span
                    className="text-sm font-bold leading-none"
                    style={{ color: ELEMENT_COLORS[getHexElement(hex.upperTriIdx)] }}
                  >
                    {hex.cn}
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-none">{hex.vn}</span>
                </button>
              ) : (
                <div key={`empty-${i}-${j}`} />
              )
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function CircleView({ onSelectHex }: { onSelectHex: (hex: Hexagram) => void }) {
  const size = 600
  const cx = size / 2
  const cy = size / 2
  const r1 = 90
  const r2 = 220
  const angleStep = 360 / 64
  const startAngle = -90

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-xl" xmlns="http://www.w3.org/2000/svg">
        <circle cx={cx} cy={cy} r={r2 + 15} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.8" />
        <circle cx={cx} cy={cy} r={r2} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.8" />
        <circle cx={cx} cy={cy} r={r1} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.8" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="28" opacity="0.2" className="fill-foreground">☯</text>
        {HEXAGRAMS.map((hex, idx) => {
          const angle = startAngle + idx * angleStep
          const rad = angle * Math.PI / 180
          const a1 = (angle - angleStep / 2) * Math.PI / 180
          const a2 = (angle + angleStep / 2) * Math.PI / 180
          const el = getHexElement(hex.upperTriIdx)
          const color = ELEMENT_COLORS[el]
          const midR = (r1 + r2) / 2
          const x1o = cx + r2 * Math.cos(a1), y1o = cy + r2 * Math.sin(a1)
          const x2o = cx + r2 * Math.cos(a2), y2o = cy + r2 * Math.sin(a2)
          const x1i = cx + r1 * Math.cos(a1), y1i = cy + r1 * Math.sin(a1)
          const x2i = cx + r1 * Math.cos(a2), y2i = cy + r1 * Math.sin(a2)
          const labelR = midR + 12
          const lx = cx + labelR * Math.cos(rad)
          const ly = cy + labelR * Math.sin(rad)
          const rotation = (angle > 90 || angle < -90) ? angle + 180 : angle
          return (
            <g key={idx} onClick={() => onSelectHex(hex)} style={{ cursor: 'pointer' }}>
              <path
                d={`M${x1o},${y1o} A${r2},${r2} 0 0,1 ${x2o},${y2o} L${x2i},${y2i} A${r1},${r1} 0 0,0 ${x1i},${y1i} Z`}
                fill={color}
                stroke="white"
                strokeWidth="0.5"
                opacity="0.18"
                className="hover:opacity-50 transition-opacity"
              />
              <text
                x={lx} y={ly}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="8" fill={color} fontWeight="700"
                transform={`rotate(${rotation},${lx},${ly})`}
              >
                {hex.cn}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function HexagramsPage() {
  const [view, setView] = useState<'grid' | 'circle'>('grid')
  const [selectedTrigramIdx, setSelectedTrigramIdx] = useState<number | null>(null)
  const [selectedHex, setSelectedHex] = useState<Hexagram | null>(null)

  function handleSelectTrigram(idx: number | null) {
    setSelectedTrigramIdx(prev => (prev === idx ? null : idx))
    setSelectedHex(null)
  }

  function handleSelectHex(hex: Hexagram) {
    setSelectedHex(prev => (prev?.num === hex.num ? null : hex))
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">64 Quẻ Kinh Dịch</h1>
        <p className="text-muted-foreground mt-1">Lục Thập Tứ Quái · 64 Hexagrams of the I Ching</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex rounded-md border overflow-hidden mr-2">
          <button
            onClick={() => setView('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
              view === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            <Grid2x2 className="w-3.5 h-3.5" />
            Ma trận
          </button>
          <button
            onClick={() => setView('circle')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
              view === 'circle' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            <Circle className="w-3.5 h-3.5" />
            Vòng tròn
          </button>
        </div>

        {view === 'grid' && (
          <>
            <Button
              variant={selectedTrigramIdx === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSelectTrigram(null)}
            >
              Tất Cả
            </Button>
            {TRIGRAMS.map((t, i) => (
              <Button
                key={i}
                variant={selectedTrigramIdx === i ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSelectTrigram(i)}
                style={selectedTrigramIdx === i ? {} : { color: ELEMENT_COLORS[t.el] }}
              >
                {t.cn} {t.vn}
              </Button>
            ))}
          </>
        )}
      </div>

      {view === 'grid' ? (
        <GridView selectedTrigramIdx={selectedTrigramIdx} onSelectHex={handleSelectHex} />
      ) : (
        <CircleView onSelectHex={handleSelectHex} />
      )}

      {selectedHex && (
        <HexDetail hex={selectedHex} onClose={() => setSelectedHex(null)} />
      )}
    </div>
  )
}
