'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BodygraphSvg } from '@/components/human-design/BodygraphSvg'
import { HDPromptGenerator } from '@/components/human-design/HDPromptGenerator'
import type { HumanDesignChart, PlanetPosition } from '@/lib/human-design/types'
import { HD_CENTERS, HD_CHANNELS, HD_TYPES, HD_PROFILES } from '@/lib/human-design-data'
import { getGateDescription } from '@/lib/human-design/gate-descriptions'
import { getIncarnationCross } from '@/lib/human-design/incarnation-crosses'
import { getLineDescription } from '@/lib/human-design/line-descriptions'

// Detail panel content types
type DetailView =
  | { kind: 'overview' }
  | { kind: 'center'; centerId: string }
  | { kind: 'channel'; channelId: string }
  | { kind: 'gate'; gateId: number }

function ChartSummaryPanel({ chart }: { chart: HumanDesignChart }) {
  const typeData = HD_TYPES.find(t => t.id === chart.type)
  const profileData = HD_PROFILES.find(
    p => p.conscious === chart.profile.conscious && p.unconscious === chart.profile.unconscious,
  )
  const profileLabel = `${chart.profile.conscious}/${chart.profile.unconscious}`

  return (
    <div className="space-y-4">
      {/* Type badge */}
      {typeData && (
        <div
          className="rounded-lg px-3 py-2"
          style={{ backgroundColor: typeData.color + '18', borderColor: typeData.color + '40', borderWidth: 1 }}
        >
          <div className="text-base font-bold" style={{ color: typeData.color }}>
            {typeData.vn}
          </div>
          <div className="text-xs text-muted-foreground italic">{typeData.en}</div>
        </div>
      )}

      {/* Strategy */}
      <div>
        <div className="text-xs font-medium text-muted-foreground mb-0.5">Chiến lược</div>
        <div className="text-sm">{typeData?.strategy.vn}</div>
        <div className="text-xs text-muted-foreground italic">{typeData?.strategy.en}</div>
      </div>

      {/* Authority */}
      <div>
        <div className="text-xs font-medium text-muted-foreground mb-0.5">Quyền lực nội tại</div>
        <div className="text-sm capitalize">{chart.authority}</div>
      </div>

      {/* Profile */}
      <div>
        <div className="text-xs font-medium text-muted-foreground mb-0.5">Profile</div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums">{profileLabel}</span>
          {profileData && (
            <span className="text-xs text-muted-foreground">{profileData.vn}</span>
          )}
        </div>
      </div>

      {/* Incarnation Cross */}
      <div>
        <div className="text-xs font-medium text-muted-foreground mb-0.5">Thập Tự Hóa Thân</div>
        {(() => {
          const cross = getIncarnationCross(
            chart.incarnationCross.personalitySun,
            chart.profile.conscious,
            chart.profile.unconscious,
          )
          return (
            <>
              {cross && <div className="text-sm font-medium">{cross.fullName}</div>}
              <div className="text-xs tabular-nums text-muted-foreground">
                {chart.incarnationCross.personalitySun}/{chart.incarnationCross.personalityEarth} | {chart.incarnationCross.designSun}/{chart.incarnationCross.designEarth}
              </div>
            </>
          )
        })()}
      </div>

      {/* Centers summary */}
      <div>
        <div className="text-xs font-medium text-muted-foreground mb-1">
          Trung tâm ({chart.definedCenters.length}/9)
        </div>
        <div className="flex flex-wrap gap-1">
          {HD_CENTERS.map(c => {
            const isDefined = chart.definedCenters.includes(c.id)
            return (
              <span
                key={c.id}
                className={`text-[10px] px-1.5 py-0.5 rounded ${isDefined ? 'font-medium' : 'text-muted-foreground/50'}`}
                style={isDefined ? { backgroundColor: c.color + '18', color: c.color } : {}}
              >
                {c.vn.replace('Trung Tâm ', '').replace('Đám Rối TK', 'SP')}
              </span>
            )
          })}
        </div>
      </div>

      {/* Channels count */}
      <div>
        <div className="text-xs font-medium text-muted-foreground mb-0.5">
          Kênh ({chart.definedChannels.length})
        </div>
        <div className="space-y-0.5">
          {chart.definedChannels.map(ch => {
            const data = HD_CHANNELS.find(c => c.id === ch.id)
            return (
              <div key={ch.id} className="text-xs">
                <span className="tabular-nums text-foreground">{ch.id}</span>
                <span className="text-muted-foreground ml-1">{data?.vn}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function DetailPanel({
  chart,
  view,
}: {
  chart: HumanDesignChart
  view: DetailView
}) {
  if (view.kind === 'overview') {
    const typeData = HD_TYPES.find(t => t.id === chart.type)
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Biểu Đồ Của Bạn</h3>
        <p className="text-sm leading-relaxed">{typeData?.description.vn}</p>
        <p className="text-xs text-muted-foreground italic leading-relaxed">{typeData?.description.en}</p>
        <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
          <span className="opacity-60">👆</span>
          Chạm vào trung tâm hoặc kênh để khám phá
        </div>
      </div>
    )
  }

  if (view.kind === 'center') {
    const center = HD_CENTERS.find(c => c.id === view.centerId)
    if (!center) return null
    const isDefined = chart.definedCenters.includes(view.centerId)
    const theme = isDefined ? center.definedTheme : center.undefinedTheme
    const centerGates = chart.gateActivations.filter(a => {
      const ch = HD_CHANNELS.find(c => c.gates.includes(a.gate) && (c.fromCenter === view.centerId || c.toCenter === view.centerId))
      return !!ch
    })

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: center.color }}
          />
          <h3 className="font-semibold text-sm">{center.vn}</h3>
          <span className="text-xs text-muted-foreground italic">{center.en}</span>
        </div>
        <div className="text-[10px] px-2 py-1 rounded bg-muted inline-block">
          {isDefined ? 'Defined' : 'Undefined'} · {center.types.join(', ')}
        </div>
        <p className="text-sm leading-relaxed">{theme.vn}</p>
        <p className="text-xs text-muted-foreground italic leading-relaxed">{theme.en}</p>
        <div className="text-xs">
          <span className="font-medium text-muted-foreground">Sinh học: </span>
          {center.biologicalCorrelation}
        </div>
        {!isDefined && (
          <div className="text-xs">
            <span className="font-medium text-muted-foreground">Câu hỏi Not-Self: </span>
            <span className="italic">{center.notSelfQuestion.vn}</span>
          </div>
        )}
        {centerGates.length > 0 && (
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Cổng hoạt động</div>
            <div className="space-y-0.5">
              {centerGates.map(a => (
                <div key={`${a.gate}-${a.body}-${a.side}`} className="text-xs flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${a.side === 'personality' ? 'bg-foreground' : 'bg-destructive'}`} />
                  <span className="tabular-nums">Gate {a.gate}.{a.line}</span>
                  <span className="text-muted-foreground">{a.body}</span>
                  <span className="text-muted-foreground/60 text-[10px]">
                    {a.side === 'personality' ? 'Ý thức' : 'Vô thức'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (view.kind === 'channel') {
    const channel = HD_CHANNELS.find(c => c.id === view.channelId)
    const defined = chart.definedChannels.find(c => c.id === view.channelId)
    if (!channel) return null
    const gate1Desc = getGateDescription(channel.gates[0])
    const gate2Desc = getGateDescription(channel.gates[1])

    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">{channel.vn}</h3>
        <p className="text-xs text-muted-foreground italic">{channel.en}</p>
        <div className="text-sm tabular-nums">{channel.id}</div>
        <div className="text-xs text-muted-foreground capitalize">
          {channel.fromCenter.replace('-', ' ')} ↔ {channel.toCenter.replace('-', ' ')}
        </div>

        {/* Gate themes */}
        <div className="space-y-2 border-t pt-2">
          {[gate1Desc, gate2Desc].filter(Boolean).map(g => (
            <div key={g!.gate} className="text-xs">
              <span className="font-medium">Gate {g!.gate}</span>
              <span className="text-muted-foreground ml-1">— {g!.hdName}</span>
              <p className="text-muted-foreground mt-0.5">{g!.theme.vn}</p>
            </div>
          ))}
        </div>

        {defined && (
          <div className="space-y-1 border-t pt-2">
            <div className="text-xs font-medium text-muted-foreground">Kích hoạt bởi</div>
            <div className="text-xs flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${defined.activatedBy.gate1.side === 'personality' ? 'bg-foreground' : 'bg-destructive'}`} />
              Gate {defined.activatedBy.gate1.gate}.{defined.activatedBy.gate1.line} — {defined.activatedBy.gate1.body} ({defined.activatedBy.gate1.side === 'personality' ? 'Ý thức' : 'Vô thức'})
            </div>
            <div className="text-xs flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${defined.activatedBy.gate2.side === 'personality' ? 'bg-foreground' : 'bg-destructive'}`} />
              Gate {defined.activatedBy.gate2.gate}.{defined.activatedBy.gate2.line} — {defined.activatedBy.gate2.body} ({defined.activatedBy.gate2.side === 'personality' ? 'Ý thức' : 'Vô thức'})
            </div>
          </div>
        )}
      </div>
    )
  }

  if (view.kind === 'gate') {
    const activations = chart.gateActivations.filter(a => a.gate === view.gateId)
    if (activations.length === 0) return null
    const gateDesc = getGateDescription(view.gateId)

    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">
          Cổng {view.gateId}
          {gateDesc && <span className="font-normal text-muted-foreground ml-1.5">— {gateDesc.hdName}</span>}
        </h3>
        {gateDesc && (
          <>
            <p className="text-sm leading-relaxed">{gateDesc.theme.vn}</p>
            <p className="text-xs text-muted-foreground italic">{gateDesc.theme.en}</p>
            <div className="text-[10px] px-2 py-1 rounded bg-muted inline-block capitalize">
              {gateDesc.center.replace('-', ' ')}
            </div>
          </>
        )}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground mb-1">Kích hoạt</div>
          {activations.map(a => {
            const lineDesc = getLineDescription(a.gate, a.line)
            return (
              <div key={`${a.body}-${a.side}`} className="text-xs">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.side === 'personality' ? 'bg-foreground' : 'bg-destructive'}`} />
                  <span className="tabular-nums">Line {a.line}</span>
                  <span className="text-muted-foreground">{a.body}</span>
                  <span className="text-muted-foreground/60 text-[10px]">
                    {a.side === 'personality' ? 'Ý thức' : 'Vô thức'}
                  </span>
                </div>
                {lineDesc && (
                  <div className="ml-3 mt-0.5 text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground/70">{lineDesc.keynote}</span>
                    <span className="mx-1">—</span>
                    {lineDesc.theme.vn}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}

export default function ChartPage() {
  const params = useParams<{ id: string }>()
  const [chart, setChart] = useState<HumanDesignChart | null>(null)
  const [detailView, setDetailView] = useState<DetailView>({ kind: 'overview' })
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
  const [showTransits, setShowTransits] = useState(false)
  const [transitPositions, setTransitPositions] = useState<PlanetPosition[] | null>(null)

  useEffect(() => {
    const loadChart = async () => {
      if (params.id === 'latest') {
        const stored = sessionStorage.getItem('hd-chart-latest')
        if (stored) setChart(JSON.parse(stored))
        return
      }

      try {
        const res = await fetch(`/api/human-design/readings/${params.id}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        setChart(data.result)
      } catch {
        const stored = sessionStorage.getItem('hd-chart-latest')
        if (stored) setChart(JSON.parse(stored))
      }
    }
    loadChart()
  }, [params.id])

  // Fetch transits when toggled on
  useEffect(() => {
    const loadTransits = async () => {
      if (!showTransits) {
        setTransitPositions(null)
        return
      }
      try {
        const res = await fetch('/api/human-design/transits')
        const data = await res.json()
        setTransitPositions(data.transits)
      } catch {
        setTransitPositions(null)
      }
    }
    loadTransits()
  }, [showTransits])

  const handleCenterClick = useCallback((centerId: string) => {
    setDetailView({ kind: 'center', centerId })
    setMobileSheetOpen(true)
  }, [])

  const handleChannelClick = useCallback((channelId: string) => {
    setDetailView({ kind: 'channel', channelId })
    setMobileSheetOpen(true)
  }, [])

  const handleGateClick = useCallback((gateId: number) => {
    setDetailView({ kind: 'gate', gateId })
    setMobileSheetOpen(true)
  }, [])

  if (!chart) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="text-center py-20">
          <p className="text-muted-foreground">Biểu đồ không tìm thấy</p>
          <Link href="/human-design/calculator" className="text-primary text-sm mt-2 inline-block hover:underline">
            Tính biểu đồ mới
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb + Copy button */}
      <div className="flex items-center justify-between mb-6">
        <nav className="text-xs text-muted-foreground">
          <Link href="/human-design" className="hover:underline">Thiết Kế Con Người</Link>
          <span className="mx-1.5">/</span>
          <Link href="/human-design/calculator" className="hover:underline">Tính Biểu Đồ</Link>
          <span className="mx-1.5">/</span>
          <span>{chart.input.name}</span>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTransits(!showTransits)}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
              showTransits
                ? 'bg-primary/10 border-primary/40 text-primary'
                : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            {showTransits ? 'Transit ●' : 'Transit'}
          </button>
          <HDPromptGenerator chart={chart} />
        </div>
      </div>

      {/* Birth time unknown warning */}
      {chart.birthTimeUnknown && (
        <div className="mb-4 text-xs text-foreground-secondary bg-secondary border border-border rounded-md px-3 py-2">
          Giờ sinh chưa xác định — biểu đồ có thể chưa chính xác
        </div>
      )}

      {/* Mobile: compact summary strip */}
      <div className="lg:hidden flex items-center gap-2 mb-4 flex-wrap">
        {(() => {
          const typeData = HD_TYPES.find(t => t.id === chart.type)
          return typeData ? (
            <span
              className="text-xs font-bold px-2 py-1 rounded"
              style={{ backgroundColor: typeData.color + '18', color: typeData.color }}
            >
              {typeData.vn}
            </span>
          ) : null
        })()}
        <span className="text-sm font-bold tabular-nums">{chart.profile.conscious}/{chart.profile.unconscious}</span>
        <span className="text-xs text-muted-foreground capitalize">{chart.authority}</span>
      </div>

      {/* Three-panel layout */}
      <div className="flex gap-6">
        {/* Left: Summary (desktop only) */}
        <div className="hidden lg:block w-[220px] shrink-0 sticky top-[72px] self-start">
          <ChartSummaryPanel chart={chart} />
        </div>

        {/* Center: Bodygraph */}
        <div className="flex-1 min-w-[280px]">
          <BodygraphSvg
            definedCenters={[...chart.definedCenters]}
            definedChannels={chart.definedChannels}
            gateActivations={chart.gateActivations}
            highlightCenter={detailView.kind === 'center' ? detailView.centerId : null}
            highlightChannel={detailView.kind === 'channel' ? detailView.channelId : null}
            highlightGate={detailView.kind === 'gate' ? detailView.gateId : null}
            onCenterClick={handleCenterClick}
            onChannelClick={handleChannelClick}
            onGateClick={handleGateClick}
            showGateNumbers
            transitPositions={transitPositions ?? undefined}
            className="max-w-sm mx-auto"
          />

          {/* Mobile: Summary below bodygraph */}
          <div className="lg:hidden mt-6 border-t pt-4">
            <ChartSummaryPanel chart={chart} />
          </div>
        </div>

        {/* Right: Detail panel (desktop) */}
        <div className="hidden lg:block w-[300px] shrink-0">
          <div className="sticky top-[72px] rounded-lg border p-4 transition-opacity duration-300">
            <DetailPanel chart={chart} view={detailView} />
          </div>
        </div>
      </div>

      {/* Mobile: Bottom sheet */}
      {mobileSheetOpen && detailView.kind !== 'overview' && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setMobileSheetOpen(false)}
          />
          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl shadow-lg max-h-[50vh] overflow-y-auto transition-transform duration-300">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="px-4 pb-6">
              <DetailPanel chart={chart} view={detailView} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
