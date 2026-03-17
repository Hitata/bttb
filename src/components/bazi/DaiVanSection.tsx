'use client'

import { ElementColorBadge } from './ElementColorBadge'
import { TenGodBadge } from './TenGodBadge'
import type { DaiVanCycle, ChuKyYear, FiveElement } from '@/lib/bazi'
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from '@/lib/bazi'

interface DaiVanSectionProps {
  cycles: DaiVanCycle[]
  chuKy: ChuKyYear[]
  startAge: number
  onYearClick?: (year: number) => void
}

export function DaiVanSection({ cycles, chuKy, startAge, onYearClick }: DaiVanSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Đại Vận</h3>

      {/* Cycles summary row */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center text-xs">
          <thead>
            <tr className="bg-muted">
              <th className="border px-2 py-1 text-left font-medium">Tuổi</th>
              {cycles.map((c, i) => (
                <th key={i} className="border px-2 py-1 font-medium">{c.startAge}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1 text-left font-medium">Năm</td>
              {cycles.map((c, i) => (
                <td key={i} className="border px-2 py-1">{c.startYear}</td>
              ))}
            </tr>
            <tr>
              <td className="border px-2 py-1 text-left font-medium">Can Chi</td>
              {cycles.map((c, i) => (
                <td key={i} className="border px-2 py-1">
                  <div className="flex flex-col items-center">
                    <TenGodBadge tenGod={c.thapThan} className="text-[10px]" />
                    <ElementColorBadge element={HEAVENLY_STEMS[c.canIndex].element} className="font-bold">
                      {c.can}
                    </ElementColorBadge>
                    <ElementColorBadge element={EARTHLY_BRANCHES[c.chiIndex].element} className="font-bold">
                      {c.chi}
                    </ElementColorBadge>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="border px-2 py-1 text-left font-medium">Nạp Âm</td>
              {cycles.map((c, i) => (
                <td key={i} className="border px-2 py-1 text-[10px]">
                  <ElementColorBadge element={c.naYin.element}>{c.naYin.name}</ElementColorBadge>
                </td>
              ))}
            </tr>
            <tr>
              <td className="border px-2 py-1 text-left font-medium">Trường Sinh</td>
              {cycles.map((c, i) => (
                <td key={i} className="border px-2 py-1 text-[10px]">{c.vongTruongSinh.name}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 90-year grid */}
      <div>
        <h4 className="mb-2 text-sm font-medium">Chu Kỳ Đại Vận</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center text-xs">
            <thead>
              <tr className="bg-muted">
                <th className="border px-1 py-1 font-medium">Đại Vận</th>
                {Array.from({ length: 10 }, (_, i) => (
                  <th key={i} className="border px-1 py-1 font-medium">{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cycles.map((cycle, cIdx) => (
                <tr key={cIdx}>
                  <td className="border px-1 py-1 font-medium">
                    {cycle.can} {cycle.chi}
                  </td>
                  {Array.from({ length: 10 }, (_, yIdx) => {
                    const yearData = chuKy[cIdx * 10 + yIdx]
                    if (!yearData) return <td key={yIdx} className="border px-1 py-1">-</td>
                    const canStem = HEAVENLY_STEMS[yearData.canIndex]
                    const chiBranch = EARTHLY_BRANCHES[yearData.chiIndex]
                    return (
                      <td
                        key={yIdx}
                        className="border px-1 py-1 cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => onYearClick?.(yearData.year)}
                        title={`${yearData.year} (${yearData.age} tuổi)`}
                      >
                        <div className="text-[10px] text-muted-foreground">{yearData.year}</div>
                        <ElementColorBadge element={canStem.element} className="text-[11px]">
                          {canStem.name}
                        </ElementColorBadge>
                        <ElementColorBadge element={chiBranch.element} className="text-[11px]">
                          {chiBranch.name}
                        </ElementColorBadge>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
