'use client'

const CHAKRAS = [
  { vn: 'Vương Miện', en: 'Crown', color: '#c084fc' },
  { vn: 'Đệ Tam Nhãn', en: 'Third Eye', color: '#818cf8' },
  { vn: 'Cổ Họng', en: 'Throat', color: '#38bdf8' },
  { vn: 'Tim', en: 'Heart', color: '#34d399', split: true },
  { vn: 'Đám Rối TK', en: 'Solar Plexus', color: '#fbbf24', split: true },
  { vn: 'Sacral', en: 'Sacral', color: '#f97316' },
  { vn: 'Gốc', en: 'Root', color: '#ef4444' },
]

const HD_NINE = [
  { vn: 'Đầu', en: 'Head', color: '#f5c542', from: 0 },
  { vn: 'Ajna', en: 'Ajna', color: '#4ade80', from: 1 },
  { vn: 'Cổ Họng', en: 'Throat', color: '#c084fc', from: 2 },
  { vn: 'G', en: 'G Center', color: '#f5c542', from: 3 },
  { vn: 'Tim/Ý Chí', en: 'Heart/Will', color: '#ef4444', from: 3 },
  { vn: 'Lá Lách', en: 'Spleen', color: '#3b82f6', from: 4 },
  { vn: 'Đám Rối TK', en: 'Solar Plexus', color: '#f59e0b', from: 4 },
  { vn: 'Sacral', en: 'Sacral', color: '#ef4444', from: 5 },
  { vn: 'Gốc', en: 'Root', color: '#f59e0b', from: 6 },
]

export function CenterEvolutionDiagram() {
  const leftX = 80
  const rightX = 280
  const svgH = 420
  const startY = 40
  const chakraSpacing = 50
  const hdSpacing = 42

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground px-2">
        <span>7 Luân Xa truyền thống</span>
        <span>9 Trung Tâm Human Design</span>
      </div>
      <svg viewBox={`0 0 360 ${svgH}`} className="w-full max-w-md mx-auto" xmlns="http://www.w3.org/2000/svg">
        {/* Connection lines */}
        {HD_NINE.map((hd, i) => {
          const fromY = startY + hd.from * chakraSpacing
          const toY = startY + i * hdSpacing
          const isSplit = CHAKRAS[hd.from].split
          return (
            <path
              key={`line-${i}`}
              d={`M${leftX + 50},${fromY} C${180},${fromY} ${180},${toY} ${rightX - 50},${toY}`}
              fill="none"
              stroke={hd.color}
              strokeWidth={isSplit ? 2 : 1}
              strokeOpacity={isSplit ? 0.5 : 0.2}
              strokeDasharray={isSplit ? '6 3' : 'none'}
            />
          )
        })}

        {/* Chakras (left) */}
        {CHAKRAS.map((ch, i) => {
          const y = startY + i * chakraSpacing
          return (
            <g key={`chakra-${i}`}>
              <circle cx={leftX} cy={y} r={16} fill={ch.color} fillOpacity="0.15" stroke={ch.color} strokeWidth="1.5" />
              <text x={leftX} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="7" fontWeight="600" fill={ch.color}>
                {ch.vn}
              </text>
              {ch.split && (
                <text x={leftX + 22} y={y - 8} fontSize="12" fill={ch.color} opacity="0.6">
                  ⟡
                </text>
              )}
            </g>
          )
        })}

        {/* HD Centers (right) */}
        {HD_NINE.map((hd, i) => {
          const y = startY + i * hdSpacing
          return (
            <g key={`hd-${i}`}>
              <rect x={rightX - 18} y={y - 13} width={80} height={26} rx={6} fill={hd.color} fillOpacity="0.1" stroke={hd.color} strokeWidth="1.5" />
              <text x={rightX + 22} y={y - 2} textAnchor="middle" dominantBaseline="middle" fontSize="8" fontWeight="600" fill={hd.color}>
                {hd.vn}
              </text>
              <text x={rightX + 22} y={y + 8} textAnchor="middle" dominantBaseline="middle" fontSize="6" opacity="0.5" className="fill-foreground">
                {hd.en}
              </text>
            </g>
          )
        })}

        {/* Split labels */}
        <text x={180} y={startY + 3 * chakraSpacing - 20} textAnchor="middle" fontSize="7" className="fill-foreground" opacity="0.5">
          Tim chia tách →
        </text>
        <text x={180} y={startY + 4 * chakraSpacing - 20} textAnchor="middle" fontSize="7" className="fill-foreground" opacity="0.5">
          Đám rối chia tách →
        </text>

        {/* Year marker */}
        <text x={180} y={svgH - 10} textAnchor="middle" fontSize="9" fontWeight="600" className="fill-foreground" opacity="0.4">
          1781 — Đột biến 9 Trung Tâm
        </text>
      </svg>
    </div>
  )
}
