'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { TuViChartGrid } from '@/components/tu-vi/TuViChart'
import { PalaceDetail } from '@/components/tu-vi/PalaceDetail'
import { TuViPromptGenerator } from '@/components/tu-vi/TuViPromptGenerator'
import type { TuViChart } from '@/lib/tu-vi/types'

function ChartSummaryPanel({ chart }: { chart: TuViChart }) {
  return (
    <div className="space-y-4">
      {/* Cục badge */}
      <div className="rounded-lg px-3 py-2 bg-primary/5 border border-primary/20">
        <div className="text-base font-bold text-primary">{chart.profile.cucName}</div>
        <div className="text-xs text-muted-foreground">{chart.profile.menhElement}</div>
      </div>

      {/* Year */}
      <div>
        <div className="text-xs font-medium text-muted-foreground mb-0.5">Năm</div>
        <div className="text-sm">{chart.profile.yearStem} {chart.profile.yearBranch}</div>
      </div>

      {/* Lunar date */}
      <div>
        <div className="text-xs font-medium text-muted-foreground mb-0.5">Âm lịch</div>
        <div className="text-sm tabular-nums">
          {chart.lunar.lunarDay}/{chart.lunar.lunarMonth}/{chart.lunar.lunarYear}
          {chart.lunar.isLeapMonth && <span className="text-amber-500 ml-1">(nhuận)</span>}
        </div>
      </div>

      {/* Tứ Hóa */}
      <div>
        <div className="text-xs font-medium text-muted-foreground mb-1">Tứ Hóa</div>
        <div className="space-y-0.5">
          {chart.tuHoa.map(th => (
            <div key={th.type} className="text-xs">
              <span className="text-primary font-medium">
                {th.type === 'loc' ? 'Lộc' : th.type === 'quyen' ? 'Quyền' : th.type === 'khoa' ? 'Khoa' : 'Kỵ'}
              </span>
              <span className="text-muted-foreground ml-1.5">{th.starName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Profile: Mệnh Chủ, Thân Chủ */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-0.5">Mệnh Chủ</div>
          <div className="text-sm">{chart.profile.menhChu}</div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-0.5">Thân Chủ</div>
          <div className="text-sm">{chart.profile.thanChu}</div>
        </div>
      </div>

      {/* Nạp Âm */}
      {chart.profile.napAm && (
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-0.5">Nạp Âm</div>
          <div className="text-sm">{chart.profile.napAm.name} ({chart.profile.napAm.element})</div>
        </div>
      )}

      {/* Sinh Khắc */}
      {chart.profile.sinhKhac && (
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-0.5">Sinh Khắc</div>
          <div className="text-sm">{chart.profile.sinhKhac.direction}</div>
          <div className="text-xs text-muted-foreground">{chart.profile.sinhKhac.description}</div>
        </div>
      )}

      {/* Star count by palace */}
      <div>
        <div className="text-xs font-medium text-muted-foreground mb-1">
          Cung ({chart.palaces.length})
        </div>
        <div className="space-y-0.5">
          {chart.palaces.map((p, i) => (
            <div key={i} className="text-xs flex items-center gap-1.5">
              <span className="text-foreground">{p.name}</span>
              <span className="text-muted-foreground">({p.earthlyBranch})</span>
              {p.stars.length > 0 && (
                <span className="text-[10px] text-muted-foreground">{p.stars.length} sao</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TuViChartPage() {
  const params = useParams()
  const id = params.id as string
  const [chart, setChart] = useState<TuViChart | null>(null)
  const [selectedPalace, setSelectedPalace] = useState<number | null>(null)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)

  useEffect(() => {
    const loadChart = async () => {
      if (id === 'latest') {
        const stored = sessionStorage.getItem('tuvi-chart-latest')
        if (stored) setChart(JSON.parse(stored))
        return
      }

      try {
        const res = await fetch(`/api/tu-vi/readings/${id}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        setChart(data.result)
      } catch {
        const stored = sessionStorage.getItem('tuvi-chart-latest')
        if (stored) setChart(JSON.parse(stored))
      }
    }
    loadChart()
  }, [id])

  const handlePalaceClick = useCallback((index: number) => {
    setSelectedPalace(index)
    setMobileSheetOpen(true)
  }, [])

  if (!chart) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="text-center py-20">
          <p className="text-muted-foreground">Lá số không tìm thấy</p>
          <Link href="/tu-vi/calculator" className="text-primary text-sm mt-2 inline-block hover:underline">
            Lập lá số mới
          </Link>
        </div>
      </div>
    )
  }

  const selectedPalaceData = selectedPalace !== null ? chart.palaces[selectedPalace] : null

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb + Copy button */}
      <div className="flex items-center justify-between mb-6">
        <nav className="text-xs text-muted-foreground">
          <Link href="/tu-vi" className="hover:underline">Tử Vi Đẩu Số</Link>
          <span className="mx-1.5">/</span>
          <Link href="/tu-vi/calculator" className="hover:underline">Lập Lá Số</Link>
          <span className="mx-1.5">/</span>
          <span>{chart.input.name}</span>
        </nav>
        <TuViPromptGenerator chart={chart} />
      </div>

      {/* Mobile: compact summary strip */}
      <div className="lg:hidden flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary">
          {chart.profile.cucName}
        </span>
        <span className="text-xs text-muted-foreground">
          {chart.profile.yearStem} {chart.profile.yearBranch}
        </span>
      </div>

      {/* Three-panel layout */}
      <div className="flex gap-6">
        {/* Left: Summary (desktop only) */}
        <div className="hidden lg:block w-[220px] shrink-0 sticky top-[72px] self-start">
          <ChartSummaryPanel chart={chart} />
        </div>

        {/* Center: Chart Grid */}
        <div className="flex-1 min-w-[280px]">
          <TuViChartGrid
            palaces={chart.palaces}
            menhIndex={chart.profile.menhPalaceIndex}
            thanIndex={chart.profile.thanPalaceIndex}
            selectedPalace={selectedPalace}
            onPalaceClick={handlePalaceClick}
            centerContent={
              <div className="text-center">
                <div className="text-sm font-bold">{chart.input.name}</div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {chart.input.year}/{chart.input.month}/{chart.input.day}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {chart.input.gender} · {chart.profile.cucName}
                </div>
              </div>
            }
          />

          {/* Mobile: Summary below chart */}
          <div className="lg:hidden mt-6 border-t pt-4">
            <ChartSummaryPanel chart={chart} />
          </div>
        </div>

        {/* Right: Detail panel (desktop) */}
        <div className="hidden lg:block w-[300px] shrink-0">
          <div className="sticky top-[72px] rounded-lg border p-4 transition-opacity duration-300">
            {selectedPalaceData ? (
              <PalaceDetail
                palace={selectedPalaceData}
                isMenh={selectedPalace === chart.profile.menhPalaceIndex}
                isThan={selectedPalace === chart.profile.thanPalaceIndex}
              />
            ) : (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Lá Số Của Bạn</h3>
                <p className="text-sm leading-relaxed">
                  Chạm vào bất kỳ cung nào trên lá số để xem chi tiết về các sao và ý nghĩa.
                </p>
                <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
                  <span className="opacity-60">👆</span>
                  Chạm vào cung để khám phá
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: Bottom sheet */}
      {mobileSheetOpen && selectedPalaceData && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setMobileSheetOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl shadow-lg max-h-[50vh] overflow-y-auto">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="px-4 pb-6">
              <PalaceDetail
                palace={selectedPalaceData}
                isMenh={selectedPalace === chart.profile.menhPalaceIndex}
                isThan={selectedPalace === chart.profile.thanPalaceIndex}
                onClose={() => setMobileSheetOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
