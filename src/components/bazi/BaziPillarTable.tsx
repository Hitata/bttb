'use client'

import { useState } from 'react'
import { ElementColorBadge } from './ElementColorBadge'
import { TenGodBadge } from './TenGodBadge'
import type { TuTru, DateInfo, FiveElement } from '@/lib/bazi'
import { Button } from '@/components/ui/button'

interface BaziPillarTableProps {
  tuTru: TuTru
  solarDate: DateInfo
  lunarDate: DateInfo
  nongLichDate: DateInfo
  hour?: number
  minute?: number
}

export function BaziPillarTable({ tuTru, solarDate, lunarDate, nongLichDate, hour, minute }: BaziPillarTableProps) {
  const [order, setOrder] = useState<'year-first' | 'hour-first'>('year-first')

  const pillars = order === 'year-first'
    ? [
        { label: 'NĂM', pillar: tuTru.thienTru },
        { label: 'THÁNG', pillar: tuTru.nguyetTru },
        { label: 'NGÀY', pillar: tuTru.nhatTru },
        { label: 'GIỜ', pillar: tuTru.thoiTru },
      ]
    : [
        { label: 'GIỜ', pillar: tuTru.thoiTru },
        { label: 'NGÀY', pillar: tuTru.nhatTru },
        { label: 'THÁNG', pillar: tuTru.nguyetTru },
        { label: 'NĂM', pillar: tuTru.thienTru },
      ]

  const solarDates = order === 'year-first'
    ? [String(solarDate.year), String(solarDate.month), String(solarDate.day), hour != null ? `${hour}:${String(minute ?? 0).padStart(2, '0')}` : '']
    : [hour != null ? `${hour}:${String(minute ?? 0).padStart(2, '0')}` : '', String(solarDate.day), String(solarDate.month), String(solarDate.year)]

  const lunarDates = order === 'year-first'
    ? [String(lunarDate.year), String(lunarDate.month), String(lunarDate.day), '']
    : ['', String(lunarDate.day), String(lunarDate.month), String(lunarDate.year)]

  const nongLichDates = order === 'year-first'
    ? [String(nongLichDate.year), String(nongLichDate.month), String(nongLichDate.day), '']
    : ['', String(nongLichDate.day), String(nongLichDate.month), String(nongLichDate.year)]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Lá Số Bát Tự</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOrder(o => o === 'year-first' ? 'hour-first' : 'year-first')}
        >
          {order === 'year-first' ? 'Năm → Giờ' : 'Giờ → Năm'}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border px-3 py-2 text-left font-medium"></th>
              {pillars.map(p => (
                <th key={p.label} className="border px-3 py-2 font-medium">{p.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Solar date */}
            <tr>
              <td className="border px-3 py-1 text-left text-xs text-muted-foreground">Dương lịch</td>
              {solarDates.map((d, i) => (
                <td key={i} className="border px-3 py-1 text-xs">{d}</td>
              ))}
            </tr>
            {/* Lunar date */}
            <tr>
              <td className="border px-3 py-1 text-left text-xs text-muted-foreground">Âm lịch</td>
              {lunarDates.map((d, i) => (
                <td key={i} className="border px-3 py-1 text-xs">{d}</td>
              ))}
            </tr>
            {/* Nong lich */}
            <tr>
              <td className="border px-3 py-1 text-left text-xs text-muted-foreground">Nông lịch</td>
              {nongLichDates.map((d, i) => (
                <td key={i} className="border px-3 py-1 text-xs">{d}</td>
              ))}
            </tr>
            {/* Thiên Can (Heavenly Stems) */}
            <tr className="bg-card">
              <td className="border px-3 py-2 text-left font-medium">Thiên Can</td>
              {pillars.map((p, i) => (
                <td key={i} className="border px-3 py-2">
                  <div className="flex flex-col items-center gap-1">
                    <TenGodBadge tenGod={p.pillar.thapThan} />
                    <ElementColorBadge element={p.pillar.canNguHanh as FiveElement} className="text-lg font-bold">
                      {p.pillar.can}
                    </ElementColorBadge>
                    <span className="text-xs text-muted-foreground">{p.pillar.canNguHanh}</span>
                  </div>
                </td>
              ))}
            </tr>
            {/* Địa Chi (Earthly Branches) */}
            <tr className="bg-card">
              <td className="border px-3 py-2 text-left font-medium">Địa Chi</td>
              {pillars.map((p, i) => (
                <td key={i} className="border px-3 py-2">
                  <div className="flex flex-col items-center gap-1">
                    <ElementColorBadge element={p.pillar.chiNguHanh as FiveElement} className="text-lg font-bold">
                      {p.pillar.chi}
                    </ElementColorBadge>
                    <span className="text-xs text-muted-foreground">{p.pillar.chiNguHanh}</span>
                  </div>
                </td>
              ))}
            </tr>
            {/* Tàng Can (Hidden Stems) */}
            <tr>
              <td className="border px-3 py-2 text-left font-medium">Tàng Can</td>
              {pillars.map((p, i) => (
                <td key={i} className="border px-3 py-2">
                  <div className="flex flex-col items-center gap-1">
                    {p.pillar.tangCan.map((tc, j) => (
                      <div key={j} className="flex items-center gap-1 text-xs">
                        <TenGodBadge tenGod={tc.thapThan} className="text-[10px]" />
                        <ElementColorBadge element={tc.nguHanh as FiveElement}>
                          {tc.can}
                        </ElementColorBadge>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            {/* Nạp Âm */}
            <tr>
              <td className="border px-3 py-1 text-left text-xs font-medium">Nạp Âm</td>
              {pillars.map((p, i) => (
                <td key={i} className="border px-3 py-1 text-xs">
                  <ElementColorBadge element={p.pillar.naYin.element}>
                    {p.pillar.naYin.name}
                  </ElementColorBadge>
                </td>
              ))}
            </tr>
            {/* Trường Sinh */}
            <tr>
              <td className="border px-3 py-1 text-left text-xs font-medium">Trường Sinh</td>
              {pillars.map((p, i) => (
                <td key={i} className="border px-3 py-1 text-xs">{p.pillar.vongTruongSinh.name}</td>
              ))}
            </tr>
            {/* Thần Sát */}
            <tr>
              <td className="border px-3 py-1 text-left text-xs font-medium">Thần Sát</td>
              {pillars.map((p, i) => (
                <td key={i} className="border px-3 py-1 text-xs">
                  {p.pillar.thanSat.map((ts, j) => (
                    <span key={j} className={`block ${ts.type === 'good' ? 'text-green-600' : ts.type === 'bad' ? 'text-red-600' : ''}`}>
                      {ts.name}
                    </span>
                  ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
