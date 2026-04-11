'use client'

import { useState } from 'react'
import { computePersonalYear, computePersonalMonth, NUMBER_MEANINGS } from '@/lib/numerology'

export function Lesson10() {
  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed">
        Thần số học không chỉ cho biết bạn là ai — nó còn cho biết <strong>bạn đang ở đâu trong chu kỳ thời gian</strong>.
        Chu kỳ cá nhân giúp bạn hiểu năng lượng hiện tại và đưa ra quyết định phù hợp với nhịp sống tự nhiên.
      </p>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Chu kỳ 9 năm</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Cuộc đời vận hành theo chu k�� 9 năm. Năm 1 là khởi đầu, năm 9 là kết thúc.
          Sau năm 9, chu kỳ mới bắt đầu lại từ năm 1. Hiểu được bạn đang ở năm nào
          giúp bạn hành động đúng lúc.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">Cách tính Năm Cá Nhân</h4>
        <div className="flex items-center gap-2 text-xs font-mono mb-3">
          <span className="px-2 py-1 rounded border bg-background">Tháng sinh</span>
          <span>+</span>
          <span className="px-2 py-1 rounded border bg-background">Ngày sinh</span>
          <span>+</span>
          <span className="px-2 py-1 rounded border bg-background">Năm hiện tại</span>
          <span>→ rút gọn</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Ví dụ: Sinh 15/3, năm hiện tại 2026: 3 + 15 + 2026 = 2044 → 2+0+4+4 = 10 → 1+0 = <strong>1</strong>.
          Đây là Năm Cá Nhân 1 — năm khởi đầu mới!
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">9 năm trong chu kỳ</h4>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
            const meaning = NUMBER_MEANINGS[n]
            return (
              <div key={n} className="rounded-lg border p-3 flex items-start gap-3">
                <span className="shrink-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {n}
                </span>
                <div>
                  <h5 className="font-medium text-xs">Năm {n}: {meaning?.nameVi}</h5>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {meaning?.asPersonalYear}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Tháng & Ngày Cá Nhân</h4>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          Ngoài năm, bạn có thể tính chu kỳ nhỏ hơn:
        </p>
        <ul className="text-xs text-muted-foreground leading-relaxed space-y-1 list-disc list-inside">
          <li><strong>Tháng Cá Nhân</strong> = Năm Cá Nhân + Tháng hiện tại → rút gọn</li>
          <li><strong>Ngày Cá Nhân</strong> = Tháng C�� Nhân + Ngày hiện tại → rút gọn</li>
        </ul>
      </div>

      <CycleCalculator />
    </div>
  )
}

function CycleCalculator() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const [birthMonth, setBirthMonth] = useState(1)
  const [birthDay, setBirthDay] = useState(1)
  const [showResult, setShowResult] = useState(false)

  const personalYear = computePersonalYear(birthMonth, birthDay, currentYear)
  const personalMonth = computePersonalMonth(personalYear, currentMonth)
  const yearMeaning = NUMBER_MEANINGS[personalYear]

  return (
    <div className="rounded-lg border p-4">
      <h4 className="font-semibold text-sm mb-3">Tính Chu Kỳ Cá Nhân của bạn</h4>
      <div className="flex gap-2 items-end flex-wrap">
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Ngày sinh</label>
          <select
            value={birthDay}
            onChange={(e) => { setBirthDay(Number(e.target.value)); setShowResult(false) }}
            className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus:border-ring"
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Tháng sinh</label>
          <select
            value={birthMonth}
            onChange={(e) => { setBirthMonth(Number(e.target.value)); setShowResult(false) }}
            className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus:border-ring"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>Th{m}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowResult(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Tính
        </button>
      </div>

      {showResult && (
        <div className="mt-4 rounded-lg bg-muted/50 p-3 space-y-2">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[10px] text-muted-foreground">Năm Cá Nhân {currentYear}</div>
              <div className="flex items-center gap-2">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {personalYear}
                </span>
                <span className="text-xs font-medium">{yearMeaning?.nameVi}</span>
              </div>
            </div>
            <div className="border-l pl-3">
              <div className="text-[10px] text-muted-foreground">Tháng Cá Nhân (Th{currentMonth})</div>
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-foreground text-sm font-bold">
                {personalMonth}
              </span>
            </div>
          </div>
          {yearMeaning?.asPersonalYear && (
            <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t">
              {yearMeaning.asPersonalYear}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
