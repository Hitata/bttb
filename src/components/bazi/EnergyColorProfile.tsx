'use client'

import { useEffect, useRef, useState } from 'react'
import { ELEMENT_INFO, ELEMENT_ORDER, ELEMENT_CSS_VAR } from '@/lib/bazi/colors'
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from '@/lib/bazi/constants'
import type { FiveElement, BaziResult, BirthInput, CurrentYearData } from '@/lib/bazi'
import { ArrowDown, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface EnergyColorProfileProps {
  result: BaziResult
  input: BirthInput
}

interface ElementWeight {
  element: FiveElement
  weight: number
  tenGodRole?: string
}

/**
 * Calculate five-element weight distribution from the four pillars.
 * Each pillar has: 1 heavenly stem (weight 1.0) + hidden stems (split proportionally).
 * Day branch hidden stems have 1.5x weight (closest to daymaster).
 */
function calcElementWeights(result: BaziResult): ElementWeight[] {
  const weights: Record<FiveElement, number> = { 'Mộc': 0, 'Hỏa': 0, 'Thổ': 0, 'Kim': 0, 'Thủy': 0 }

  const pillars = [
    { pillar: result.tutru.thienTru, stemW: 1.0, hiddenW: 0.8 },
    { pillar: result.tutru.nguyetTru, stemW: 1.2, hiddenW: 0.9 },
    { pillar: result.tutru.nhatTru, stemW: 1.5, hiddenW: 1.2 },
    { pillar: result.tutru.thoiTru, stemW: 1.0, hiddenW: 0.7 },
  ]

  for (const { pillar, stemW, hiddenW } of pillars) {
    const stemEl = pillar.canNguHanh as FiveElement
    weights[stemEl] += stemW

    const chiEl = pillar.chiNguHanh as FiveElement
    weights[chiEl] += stemW * 0.8

    const hiddenCount = pillar.tangCan.length
    for (const tc of pillar.tangCan) {
      const el = tc.nguHanh as FiveElement
      weights[el] += hiddenW / Math.max(hiddenCount, 1)
    }
  }

  const total = Object.values(weights).reduce((s, v) => s + v, 0)

  return ELEMENT_ORDER.map(el => ({
    element: el,
    weight: Math.round((weights[el] / total) * 1000) / 10,
  })).sort((a, b) => b.weight - a.weight)
}

/**
 * Calculate annual shift when current year data is available.
 */
function calcAnnualWeights(base: ElementWeight[], yearData: CurrentYearData): ElementWeight[] {
  const adjusted = Object.fromEntries(base.map(b => [b.element, b.weight])) as Record<FiveElement, number>

  // Add the year stem and branch influence
  const yearStemEl = yearData.yearCanNguHanh as FiveElement
  const yearBranchEl = yearData.yearChiNguHanh as FiveElement

  adjusted[yearStemEl] += 6
  adjusted[yearBranchEl] += 4

  // Hidden stems of the year branch
  for (const tc of yearData.tangCan) {
    const el = tc.nguHanh as FiveElement
    adjusted[el] += 2 / yearData.tangCan.length
  }

  const total = Object.values(adjusted).reduce((s, v) => s + v, 0)
  return ELEMENT_ORDER.map(el => ({
    element: el,
    weight: Math.round((adjusted[el] / total) * 1000) / 10,
  })).sort((a, b) => b.weight - a.weight)
}

function ElementBar({ element, pct, delay }: { element: FiveElement; pct: number; delay: number }) {
  const [width, setWidth] = useState(0)
  const info = ELEMENT_INFO[element]
  const cssVar = ELEMENT_CSS_VAR[element]

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay)
    return () => clearTimeout(t)
  }, [pct, delay])

  return (
    <div className="grid grid-cols-[72px_1fr_44px] items-center gap-3 sm:grid-cols-[88px_1fr_48px]">
      <div className="min-w-0">
        <div className="text-sm font-semibold" style={{ color: cssVar.light }}>
          {info.vn} · {info.zh}
        </div>
        <div className="text-[10px] tracking-wide text-muted-foreground">{info.en}</div>
      </div>
      <div className="h-7 overflow-hidden rounded bg-muted/50 sm:h-8">
        <div
          className="relative h-full rounded transition-[width] duration-[1.4s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${cssVar.base}, ${cssVar.light})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        </div>
      </div>
      <div className="text-right text-xs tabular-nums text-muted-foreground">{pct}%</div>
    </div>
  )
}

function PaletteStrip({ weights }: { weights: ElementWeight[] }) {
  return (
    <div className="flex h-28 overflow-hidden rounded-xl shadow-lg sm:h-36">
      {weights.map(({ element, weight }) => {
        const cssVar = ELEMENT_CSS_VAR[element]
        const info = ELEMENT_INFO[element]
        return (
          <div
            key={element}
            className="relative flex items-end justify-center pb-2"
            style={{
              flexGrow: weight,
              background: `linear-gradient(160deg, ${cssVar.base}, ${cssVar.light})`,
            }}
          >
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/70 drop-shadow-sm sm:text-xs">
              {info.vn}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function ComparisonCard({
  title,
  subtitle,
  weights,
  highlight,
}: {
  title: string
  subtitle: string
  weights: ElementWeight[]
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl border bg-card/50 p-4 sm:p-5 ${
        highlight ? 'border-[var(--element-fire)]/20' : 'border-border'
      }`}
    >
      <h3 className={`text-base font-medium sm:text-lg ${highlight ? 'text-[var(--element-fire-light)]' : ''}`}>
        {title}
      </h3>
      <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">{subtitle}</div>

      {/* Mini palette */}
      <div className="mb-3 flex h-10 overflow-hidden rounded-md sm:h-12">
        {weights.map(({ element, weight }) => {
          const cssVar = ELEMENT_CSS_VAR[element]
          return (
            <div
              key={element}
              className="flex min-w-0 items-center justify-center"
              style={{
                flexGrow: weight,
                background: `linear-gradient(160deg, ${cssVar.base}, ${cssVar.light})`,
              }}
            >
              <span className="text-[9px] font-medium text-white/80 drop-shadow-sm sm:text-[10px]">
                {Math.round(weight)}%
              </span>
            </div>
          )
        })}
      </div>

      {/* Swatches */}
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {weights.map(({ element, weight }) => {
          const cssVar = ELEMENT_CSS_VAR[element]
          const info = ELEMENT_INFO[element]
          return (
            <div key={element} className="flex items-center gap-1.5">
              <div
                className="size-2.5 shrink-0 rounded-full border border-foreground/10"
                style={{ background: cssVar.light }}
              />
              <span className="text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">{info.vn}</span> {Math.round(weight)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ShiftIndicator({ basePct, annualPct }: { basePct: number; annualPct: number }) {
  const diff = annualPct - basePct
  if (Math.abs(diff) < 1) return <Minus className="size-3 text-muted-foreground" />
  if (diff > 0) return <TrendingUp className="size-3 text-[var(--element-fire)]" />
  return <TrendingDown className="size-3 text-[var(--element-water)]" />
}

export function EnergyColorProfile({ result, input }: EnergyColorProfileProps) {
  const baseWeights = calcElementWeights(result)
  const yearData = result.daivan.currentYear
  const annualWeights = calcAnnualWeights(baseWeights, yearData)

  const dmStem = HEAVENLY_STEMS[result.dayMasterIndex]
  const yearStem = HEAVENLY_STEMS[yearData.canIndex]
  const yearBranch = EARTHLY_BRANCHES[yearData.chiIndex]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="bg-gradient-to-r from-[var(--element-wood-light)] to-[var(--element-fire-light)] bg-clip-text text-2xl font-light tracking-wide text-transparent sm:text-3xl">
          Energy Color Profile
        </h2>
        <div className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          Ngũ Hành Color System · 五行色彩
        </div>
        <div className="mt-3 text-base" style={{ color: ELEMENT_CSS_VAR[dmStem.element as FiveElement].light }}>
          Nhật Chủ: {dmStem.zh} {dmStem.name} ({ELEMENT_INFO[dmStem.element as FiveElement].en})
        </div>
      </div>

      {/* Base Energy Distribution */}
      <section>
        <div className="mb-5 border-b border-border/50 pb-2">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Natal Chart · Mệnh Bàn Gốc
          </div>
          <div className="text-lg font-light sm:text-xl">Base Energy Distribution</div>
        </div>
        <div className="flex flex-col gap-3">
          {baseWeights.map((w, i) => (
            <ElementBar key={w.element} element={w.element} pct={w.weight} delay={200 + i * 100} />
          ))}
        </div>
      </section>

      {/* Natal Color Signature */}
      <section>
        <div className="mb-5 border-b border-border/50 pb-2">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Your Palette · Bảng Màu Mệnh
          </div>
          <div className="text-lg font-light sm:text-xl">Natal Color Signature</div>
        </div>
        <PaletteStrip weights={baseWeights} />
      </section>

      {/* Annual Shift */}
      <section>
        <div className="mb-5 border-b border-border/50 pb-2">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Annual Shift · Lưu Niên {yearData.year} {yearStem.name} {yearBranch.name}
          </div>
          <div className="text-lg font-light sm:text-xl">Energy Redistribution</div>
        </div>

        {/* Shift note */}
        <div className="mb-5 text-center text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium" style={{ color: ELEMENT_CSS_VAR[yearStem.element as FiveElement].light }}>
            {yearStem.name} ({ELEMENT_INFO[yearStem.element as FiveElement].en})
          </span>
          {' + '}
          <span className="font-medium" style={{ color: ELEMENT_CSS_VAR[yearBranch.element as FiveElement].light }}>
            {yearBranch.name} ({ELEMENT_INFO[yearBranch.element as FiveElement].en})
          </span>
          <div className="my-2">
            <ArrowDown className="mx-auto size-5 text-[var(--element-fire)]" />
          </div>
          {annualWeights.map((aw, i) => {
            const bw = baseWeights.find(b => b.element === aw.element)!
            const diff = Math.round(aw.weight - bw.weight)
            if (Math.abs(diff) < 2) return null
            const info = ELEMENT_INFO[aw.element]
            return (
              <span key={aw.element}>
                {i > 0 ? ' · ' : ''}
                {info.vn} {diff > 0 ? `+${diff}%` : `${diff}%`}
              </span>
            )
          })}
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ComparisonCard title="Base Chart" subtitle="Mệnh Bàn Gốc" weights={baseWeights} />
          <ComparisonCard
            title={`${yearData.year} ${yearStem.name} ${yearBranch.name}`}
            subtitle={`Lưu Niên · ${ELEMENT_INFO[yearStem.element as FiveElement].en} ${yearBranch.zodiac ?? ''}`}
            weights={annualWeights}
            highlight
          />
        </div>
      </section>

      {/* Personal Color System — hex swatches */}
      <section>
        <div className="mb-5 border-b border-border/50 pb-2">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Your Colors · Hex Codes
          </div>
          <div className="text-lg font-light sm:text-xl">Personal Color System</div>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {baseWeights.map(({ element }) => {
            const cssVar = ELEMENT_CSS_VAR[element]
            const info = ELEMENT_INFO[element]
            return (
              <div key={element} className="rounded-lg border bg-card/50 p-2.5 text-center sm:p-3">
                <div
                  className="mb-2 h-10 rounded-md sm:h-12"
                  style={{ background: `linear-gradient(135deg, ${cssVar.base}, ${cssVar.light})` }}
                />
                <div className="text-sm font-medium" style={{ color: cssVar.light }}>{info.vn}</div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
