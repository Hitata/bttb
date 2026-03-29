'use client'

import { HD_TYPES, HD_CENTERS } from '@/lib/human-design-data'

export function NotSelfFlowDiagram() {
  return (
    <div className="space-y-6">
      {/* Type Not-Self signatures */}
      <div>
        <div className="text-xs font-semibold text-muted-foreground mb-2">Not-Self theo Loại Hình</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {HD_TYPES.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="w-3 h-8 rounded-full" style={{ backgroundColor: t.color }} />
              <div className="flex-1">
                <div className="text-xs font-semibold">{t.vn} <span className="text-muted-foreground font-normal">({t.en})</span></div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-500">{t.notSelf.vn}</span>
                  <span className="text-muted-foreground text-xs">→</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: t.color + '15', color: t.color }}>{t.signature.vn}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Not-Self Questions */}
      <div>
        <div className="text-xs font-semibold text-muted-foreground mb-2">Câu Hỏi Not-Self (khi Trung Tâm mở)</div>
        <div className="space-y-1.5">
          {HD_CENTERS.map((c) => (
            <div key={c.id} className="flex items-start gap-2 rounded border p-2.5">
              <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: c.color }} />
              <div className="flex-1">
                <span className="text-xs font-medium">{c.vn}</span>
                <p className="text-xs mt-0.5">{c.notSelfQuestion.vn}</p>
                <p className="text-[10px] text-muted-foreground italic">{c.notSelfQuestion.en}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deconditioning timeline */}
      <div>
        <div className="text-xs font-semibold text-muted-foreground mb-2">Quá Trình Giải Điều Kiện / Deconditioning</div>
        <svg viewBox="0 0 400 80" className="w-full max-w-lg mx-auto" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="decon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect x={30} y={25} width={340} height={20} rx={10} fill="url(#decon-grad)" />
          <line x1={30} y1={35} x2={370} y2={35} stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
          {/* Year markers */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((yr) => {
            const x = 30 + (yr / 7) * 340
            return (
              <g key={yr}>
                <line x1={x} y1={27} x2={x} y2={43} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
                <text x={x} y={58} textAnchor="middle" fontSize="8" className="fill-foreground" opacity="0.5">
                  {yr === 0 ? 'Bắt đầu' : yr === 7 ? '7 năm' : `${yr}`}
                </text>
              </g>
            )
          })}
          <text x={200} y={16} textAnchor="middle" fontSize="8" className="fill-foreground" opacity="0.4">
            Strategy + Authority → Giải phóng từ Not-Self
          </text>
        </svg>
      </div>
    </div>
  )
}
