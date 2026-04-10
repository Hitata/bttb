import { ELEMENT_COLORS } from '@/lib/bazi'
import type { TuTru, FiveElement } from '@/lib/bazi'

interface BaziBoardProps {
  tutru: TuTru
  solarDate?: { year: number | string; month: number | string; day: number | string }
  hour?: number
  gender?: string
}

function ElementText({ element, children, className = '' }: { element: string; children: React.ReactNode; className?: string }) {
  const color = ELEMENT_COLORS[element as FiveElement] || ''
  return <span className={`font-bold ${color} ${className}`}>{children}</span>
}

export function BaziBoard({ tutru, solarDate, hour, gender }: BaziBoardProps) {
  const pillars = [
    { label: 'Năm', pillar: tutru.thienTru },
    { label: 'Tháng', pillar: tutru.nguyetTru },
    { label: 'Ngày', pillar: tutru.nhatTru },
    { label: 'Giờ', pillar: tutru.thoiTru },
  ]

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Header row with date info */}
      {solarDate && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 text-xs text-muted-foreground border-b">
          <span>
            {solarDate.day}/{solarDate.month}/{solarDate.year}
            {hour != null && ` · ${String(hour).padStart(2, '0')}h`}
          </span>
          {gender && (
            <span>{gender === 'male' || gender === 'Nam' ? 'Dương Nam' : 'Dương Nữ'}</span>
          )}
        </div>
      )}

      {/* Four Pillars Grid */}
      <div className="grid grid-cols-4 text-center text-sm">
        {/* Column headers */}
        {pillars.map((p) => (
          <div key={p.label} className="px-1 py-1.5 text-xs font-medium text-muted-foreground border-b">
            {p.label}
          </div>
        ))}

        {/* Thập Thần (Ten God) row */}
        {pillars.map((p, i) => (
          <div key={`tt-${i}`} className="px-1 py-1 text-[11px] text-muted-foreground border-b">
            {p.pillar.thapThan.code}
          </div>
        ))}

        {/* Thiên Can (Heavenly Stems) - main row */}
        {pillars.map((p, i) => (
          <div key={`can-${i}`} className={`px-1 py-2 border-b ${i === 2 ? 'bg-primary/5 ring-1 ring-inset ring-primary/20' : ''}`}>
            <ElementText element={p.pillar.canNguHanh} className="text-xl sm:text-2xl leading-none">
              {p.pillar.can}
            </ElementText>
          </div>
        ))}

        {/* Địa Chi (Earthly Branches) - main row */}
        {pillars.map((p, i) => (
          <div key={`chi-${i}`} className={`px-1 py-2 border-b ${i === 2 ? 'bg-primary/5 ring-1 ring-inset ring-primary/20' : ''}`}>
            <ElementText element={p.pillar.chiNguHanh} className="text-xl sm:text-2xl leading-none">
              {p.pillar.chi}
            </ElementText>
          </div>
        ))}

        {/* Tàng Can (Hidden Stems) */}
        {pillars.map((p, i) => (
          <div key={`tc-${i}`} className="px-1 py-1.5 border-b">
            <div className="flex justify-center gap-1 flex-wrap">
              {p.pillar.tangCan.map((tc, j) => (
                <ElementText key={j} element={tc.nguHanh} className="text-xs font-medium">
                  {tc.can}
                </ElementText>
              ))}
            </div>
          </div>
        ))}

        {/* Nạp Âm */}
        {pillars.map((p, i) => (
          <div key={`ny-${i}`} className="px-1 py-1 text-[11px] text-muted-foreground">
            <ElementText element={p.pillar.naYin.element} className="text-[11px] font-normal">
              {p.pillar.naYin.name}
            </ElementText>
          </div>
        ))}
      </div>
    </div>
  )
}
