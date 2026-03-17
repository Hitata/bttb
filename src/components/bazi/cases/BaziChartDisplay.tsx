import type { TuTru } from '@/lib/bazi'
import { ELEMENT_COLORS } from '@/lib/bazi'

interface BaziChartDisplayProps {
  tuTru: TuTru
}

function PillarColumn({ label, pillar }: { label: string; pillar: TuTru[keyof TuTru] }) {
  const canColor = ELEMENT_COLORS[pillar.canNguHanh as keyof typeof ELEMENT_COLORS] || ''
  const chiColor = ELEMENT_COLORS[pillar.chiNguHanh as keyof typeof ELEMENT_COLORS] || ''

  return (
    <div className="text-center space-y-2">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="rounded-lg border p-3 space-y-1">
        <div className="text-xs text-muted-foreground">{pillar.thapThan.code}</div>
        <div className={`text-xl font-bold ${canColor}`}>{pillar.can}</div>
        <div className="text-xs text-muted-foreground">{pillar.canNguHanh}</div>
      </div>
      <div className="rounded-lg border p-3 space-y-1">
        <div className={`text-xl font-bold ${chiColor}`}>{pillar.chi}</div>
        <div className="text-xs text-muted-foreground">{pillar.chiNguHanh}</div>
        {pillar.tangCan.length > 0 && (
          <div className="mt-2 space-y-0.5">
            {pillar.tangCan.map((tc, i) => (
              <div key={i} className="text-xs">
                <span className="text-muted-foreground">{tc.thapThan.code}</span>{' '}
                <span>{tc.can}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="text-xs text-muted-foreground">{pillar.naYin.name}</div>
    </div>
  )
}

export function BaziChartDisplay({ tuTru }: BaziChartDisplayProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Four Pillars Chart</h2>
      <div className="grid grid-cols-4 gap-4">
        <PillarColumn label="Year" pillar={tuTru.thienTru} />
        <PillarColumn label="Month" pillar={tuTru.nguyetTru} />
        <PillarColumn label="Day" pillar={tuTru.nhatTru} />
        <PillarColumn label="Hour" pillar={tuTru.thoiTru} />
      </div>
    </div>
  )
}
