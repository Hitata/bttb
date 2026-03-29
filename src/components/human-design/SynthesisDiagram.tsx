'use client'

import { useState } from 'react'

interface Tradition {
  id: string
  label: { vn: string; en: string }
  detail: { vn: string; en: string }
  depth: string
  color: string
  angle: number
}

const TRADITIONS: Tradition[] = [
  {
    id: 'iching',
    label: { vn: 'Kinh Dịch', en: 'I Ching' },
    detail: {
      vn: '64 Cổng = 64 Quẻ. Tích hợp toán học nhị phân sâu nhất. Dãy Phục Hy trên Rave Mandala.',
      en: '64 Gates = 64 Hexagrams. Deepest mathematical binary integration. Fu Xi sequence on the Rave Mandala.'
    },
    depth: 'Deepest',
    color: '#ef4444',
    angle: 0,
  },
  {
    id: 'kabbalah',
    label: { vn: 'Kabbalah', en: 'Kabbalah' },
    detail: {
      vn: 'Cây Sự Sống → hình dạng Bodygraph. Tương đồng chủ yếu về mặt thị giác, không sâu về nội dung.',
      en: 'Tree of Life → Bodygraph shape. Primarily visual resemblance, not deeply substantive.'
    },
    depth: 'Shallowest',
    color: '#c084fc',
    angle: 90,
  },
  {
    id: 'astrology',
    label: { vn: 'Chiêm Tinh', en: 'Astrology' },
    detail: {
      vn: 'Hoàng đạo nhiệt đới phương Tây. 13 thiên thể tính toán kích hoạt Cổng. Tính toán kép 88°.',
      en: 'Western tropical zodiac. 13 celestial bodies calculate Gate activations. Dual 88° calculation.'
    },
    depth: 'Computational',
    color: '#f59e0b',
    angle: 180,
  },
  {
    id: 'chakras',
    label: { vn: 'Luân Xa', en: 'Chakra System' },
    detail: {
      vn: '7 luân xa → 9 trung tâm (2 chia tách). Tái cấu trúc thực sự, không chỉ đổi tên.',
      en: '7 chakras → 9 centers (2 split). Genuine reworking, not just relabeling.'
    },
    depth: 'Reworked',
    color: '#10b981',
    angle: 270,
  },
]

export function SynthesisDiagram() {
  const [selected, setSelected] = useState<string | null>(null)

  const size = 340
  const cx = size / 2
  const cy = size / 2
  const orbitR = 110
  const nodeR = 38
  const centerR = 32

  const selectedTradition = TRADITIONS.find(t => t.id === selected)

  return (
    <div className="space-y-3">
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-sm" xmlns="http://www.w3.org/2000/svg">
          {/* Connection lines */}
          {TRADITIONS.map((t) => {
            const rad = (t.angle - 90) * Math.PI / 180
            const tx = cx + orbitR * Math.cos(rad)
            const ty = cy + orbitR * Math.sin(rad)
            return (
              <line
                key={`line-${t.id}`}
                x1={cx}
                y1={cy}
                x2={tx}
                y2={ty}
                stroke={t.color}
                strokeWidth={selected === t.id ? 2.5 : 1}
                strokeOpacity={selected === t.id ? 0.6 : 0.15}
                strokeDasharray={selected === t.id ? 'none' : '4 4'}
                className="transition-all duration-300"
              />
            )
          })}

          {/* Center circle — Human Design */}
          <circle cx={cx} cy={cy} r={centerR} fill="#f5c542" fillOpacity="0.15" stroke="#f5c542" strokeWidth="2" />
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="8" fontWeight="700" className="fill-foreground">Human</text>
          <text x={cx} y={cy + 6} textAnchor="middle" fontSize="8" fontWeight="700" className="fill-foreground">Design</text>

          {/* Tradition nodes */}
          {TRADITIONS.map((t) => {
            const rad = (t.angle - 90) * Math.PI / 180
            const tx = cx + orbitR * Math.cos(rad)
            const ty = cy + orbitR * Math.sin(rad)
            const isSelected = selected === t.id

            return (
              <g
                key={t.id}
                onClick={() => setSelected(isSelected ? null : t.id)}
                className="cursor-pointer"
              >
                <circle
                  cx={tx}
                  cy={ty}
                  r={nodeR}
                  fill={t.color}
                  fillOpacity={isSelected ? 0.2 : 0.08}
                  stroke={t.color}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-all duration-200 hover:fill-opacity-25"
                />
                <text
                  x={tx}
                  y={ty - 5}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill={t.color}
                >
                  {t.label.vn}
                </text>
                <text
                  x={tx}
                  y={ty + 7}
                  textAnchor="middle"
                  fontSize="7"
                  fill={t.color}
                  opacity="0.7"
                >
                  {t.label.en}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {selectedTradition && (
        <div
          className="rounded-lg border p-4 text-sm transition-all"
          style={{ borderColor: selectedTradition.color + '40' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold" style={{ color: selectedTradition.color }}>
              {selectedTradition.label.vn}
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded-full border" style={{ borderColor: selectedTradition.color + '40', color: selectedTradition.color }}>
              {selectedTradition.depth}
            </span>
          </div>
          <p className="mt-1">{selectedTradition.detail.vn}</p>
          <p className="text-xs text-muted-foreground italic mt-1">{selectedTradition.detail.en}</p>
        </div>
      )}
    </div>
  )
}
