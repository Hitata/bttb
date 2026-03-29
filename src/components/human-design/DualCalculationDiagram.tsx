'use client'

const PLANETS = [
  { symbol: '☉', vn: 'Mặt Trời', en: 'Sun', weight: '~70%', color: '#f59e0b' },
  { symbol: '⊕', vn: 'Trái Đất', en: 'Earth', weight: '', color: '#10b981' },
  { symbol: '☽', vn: 'Mặt Trăng', en: 'Moon', weight: '', color: '#94a3b8' },
  { symbol: '☊', vn: 'Bắc Giao Điểm', en: 'North Node', weight: '', color: '#8b5cf6' },
  { symbol: '☋', vn: 'Nam Giao Điểm', en: 'South Node', weight: '', color: '#8b5cf6' },
  { symbol: '☿', vn: 'Thủy Tinh', en: 'Mercury', weight: '', color: '#64748b' },
  { symbol: '♀', vn: 'Kim Tinh', en: 'Venus', weight: '', color: '#ec4899' },
  { symbol: '♂', vn: 'Hỏa Tinh', en: 'Mars', weight: '', color: '#ef4444' },
  { symbol: '♃', vn: 'Mộc Tinh', en: 'Jupiter', weight: '', color: '#f59e0b' },
  { symbol: '♄', vn: 'Thổ Tinh', en: 'Saturn', weight: '', color: '#78716c' },
  { symbol: '♅', vn: 'Thiên Vương', en: 'Uranus', weight: '', color: '#06b6d4' },
  { symbol: '♆', vn: 'Hải Vương', en: 'Neptune', weight: '', color: '#3b82f6' },
  { symbol: '♇', vn: 'Diêm Vương', en: 'Pluto', weight: '', color: '#6b7280' },
]

export function DualCalculationDiagram() {
  return (
    <div className="space-y-4">
      {/* Dual calculation visual */}
      <svg viewBox="0 0 400 180" className="w-full max-w-lg mx-auto" xmlns="http://www.w3.org/2000/svg">
        {/* Timeline */}
        <line x1={40} y1={90} x2={360} y2={90} stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />

        {/* 88° before birth (Design) */}
        <g>
          <circle cx={100} cy={90} r={30} fill="#ef4444" fillOpacity="0.1" stroke="#ef4444" strokeWidth="2" />
          <text x={100} y={85} textAnchor="middle" fontSize="8" fontWeight="700" fill="#ef4444">Design</text>
          <text x={100} y={96} textAnchor="middle" fontSize="7" fill="#ef4444" opacity="0.7">Vô thức</text>
          <text x={100} y={135} textAnchor="middle" fontSize="8" className="fill-foreground" opacity="0.5">~88 ngày trước</text>
          <text x={100} y={146} textAnchor="middle" fontSize="7" className="fill-foreground" opacity="0.35">88° solar arc</text>
        </g>

        {/* Arrow between */}
        <line x1={140} y1={90} x2={250} y2={90} stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" markerEnd="url(#arrow)" />
        <text x={195} y={80} textAnchor="middle" fontSize="8" className="fill-foreground" opacity="0.4">88° offset</text>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" opacity="0.3" />
          </marker>
        </defs>

        {/* Birth (Personality) */}
        <g>
          <circle cx={290} cy={90} r={30} fill="#1a1a1a" fillOpacity="0.1" stroke="#1a1a1a" strokeWidth="2" className="stroke-foreground" strokeOpacity="0.6" />
          <text x={290} y={85} textAnchor="middle" fontSize="8" fontWeight="700" className="fill-foreground">Personality</text>
          <text x={290} y={96} textAnchor="middle" fontSize="7" className="fill-foreground" opacity="0.5">Ý thức</text>
          <text x={290} y={135} textAnchor="middle" fontSize="8" className="fill-foreground" opacity="0.5">Lúc sinh</text>
          <text x={290} y={146} textAnchor="middle" fontSize="7" className="fill-foreground" opacity="0.35">Moment of birth</text>
        </g>

        {/* Result */}
        <text x={200} y={172} textAnchor="middle" fontSize="8" className="fill-foreground" opacity="0.4">
          13 hành tinh × 2 thời điểm = 26 kích hoạt → Bodygraph
        </text>
      </svg>

      {/* 13 Celestial Bodies grid */}
      <div>
        <div className="text-xs font-semibold text-muted-foreground mb-2">13 Thiên Thể / Celestial Bodies</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
          {PLANETS.map((p) => (
            <div key={p.en} className="flex items-center gap-2 rounded border p-2">
              <span className="text-lg" style={{ color: p.color }}>{p.symbol}</span>
              <div>
                <div className="text-xs font-medium">{p.vn}</div>
                <div className="text-[10px] text-muted-foreground">{p.en} {p.weight && <span className="font-semibold">{p.weight}</span>}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
