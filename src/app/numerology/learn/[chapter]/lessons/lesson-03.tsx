'use client'

import { useState } from 'react'
import { computeLifePath } from '@/lib/numerology'

export function Lesson03() {
  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed">
        <strong>Số Đường Đời</strong> (Life Path Number) là con số quan trọng nhất trong thần số học.
        Nó được tính từ ngày sinh đầy đủ và cho biết con đường cuộc đời, bản chất cốt lõi,
        và những bài học lớn bạn cần trải nghiệm.
      </p>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Cách tính</h4>
        <ol className="text-xs text-muted-foreground leading-relaxed space-y-1 list-decimal list-inside">
          <li>Rút gọn <strong>tháng sinh</strong> → một chữ số (hoặc số bậc thầy)</li>
          <li>Rút gọn <strong>ngày sinh</strong> → một chữ số (hoặc số bậc thầy)</li>
          <li>Cộng tất cả chữ số của <strong>năm sinh</strong>, rồi rút gọn</li>
          <li>Cộng 3 kết quả trên, rồi rút gọn → <strong>Số Đường Đời</strong></li>
        </ol>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">Ví dụ chi tiết</h4>
        <div className="space-y-4">
          <WorkedExample month={3} day={15} year={1990} />
          <WorkedExample month={11} day={22} year={1985} />
          <WorkedExample month={7} day={4} year={2000} />
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 p-4">
        <h4 className="font-semibold text-sm mb-2">Lỗi thường gặp</h4>
        <ul className="text-xs text-muted-foreground leading-relaxed space-y-2">
          <li>
            <strong>Rút gọn số bậc thầy quá sớm:</strong> Nếu tháng là 11, giữ nguyên 11 —
            không rút gọn thành 2 trước khi cộng.
          </li>
          <li>
            <strong>Cộng tất cả chữ số cùng lúc:</strong> Cách đúng là rút gọn từng phần (tháng, ngày, năm)
            riêng rẽ trước, rồi mới cộng lại. Cộng chung tất cả chữ số có thể cho kết quả khác.
          </li>
        </ul>
      </div>

      <LifePathCalculator />
    </div>
  )
}

function WorkedExample({ month, day, year }: { month: number; day: number; year: number }) {
  const result = computeLifePath(month, day, year)

  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm font-medium mb-2">
        Ngày sinh: {day}/{month}/{year}
      </div>
      <div className="text-xs font-mono text-muted-foreground space-y-1">
        <div>Phép tính: {result.calculation}</div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Số Đường Đời:</span>
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
          {result.value}
        </span>
        {result.isMaster && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            Số Bậc Thầy
          </span>
        )}
      </div>
    </div>
  )
}

function LifePathCalculator() {
  const currentYear = new Date().getFullYear()
  const [month, setMonth] = useState(1)
  const [day, setDay] = useState(1)
  const [year, setYear] = useState(1990)
  const [result, setResult] = useState<ReturnType<typeof computeLifePath> | null>(null)

  const handleCalculate = () => {
    setResult(computeLifePath(month, day, year))
  }

  return (
    <div className="rounded-lg border p-4">
      <h4 className="font-semibold text-sm mb-3">Thử tính Số Đường Đời</h4>
      <div className="flex gap-2 items-end flex-wrap">
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Ngày</label>
          <select
            value={day}
            onChange={(e) => { setDay(Number(e.target.value)); setResult(null) }}
            className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus:border-ring"
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Tháng</label>
          <select
            value={month}
            onChange={(e) => { setMonth(Number(e.target.value)); setResult(null) }}
            className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus:border-ring"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>Th{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Năm</label>
          <select
            value={year}
            onChange={(e) => { setYear(Number(e.target.value)); setResult(null) }}
            className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus:border-ring"
          >
            {Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleCalculate}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Tính
        </button>
      </div>
      {result && (
        <div className="mt-4 rounded-lg bg-muted/50 p-3">
          <div className="text-xs font-mono text-muted-foreground mb-2">{result.calculation}</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Số Đường Đời:</span>
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
              {result.value}
            </span>
            {result.isMaster && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                Số Bậc Thầy
              </span>
            )}
          </div>
          {result.description && (
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{result.description}</p>
          )}
        </div>
      )}
    </div>
  )
}
