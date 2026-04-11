'use client'

import { useState } from 'react'
import { computeLifePath, computeChallenges, computePinnacles } from '@/lib/numerology'

export function Lesson11() {
  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed">
        Ngoài chu kỳ 9 năm, thần số học còn xác định <strong>4 giai đoạn lớn</strong> trong cuộc đời,
        mỗi giai đoạn mang một <strong>thử thách</strong> (challenge) cần vượt qua
        và một <strong>đỉnh cao</strong> (pinnacle) có thể đạt được.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-lg border p-4">
          <h4 className="font-semibold text-sm mb-2">Thử Thách (Challenges)</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tính bằng <strong>phép trừ</strong> các thành phần ngày sinh.
            Cho biết những bài học khó khăn bạn cần đối mặt trong mỗi giai đoạn.
            Số thử thách thường nhỏ (0-8), phản ánh điểm yếu cần khắc phục.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h4 className="font-semibold text-sm mb-2">Đỉnh Cao (Pinnacles)</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tính bằng <strong>phép cộng</strong> các thành phần ngày sinh.
            Cho biết cơ hội và thành tựu có thể đạt được trong mỗi giai đoạn.
            Số đỉnh cao có thể là bất kỳ số nào, kể cả số bậc thầy.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">4 giai đoạn</h4>
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p><strong>Giai đoạn 1:</strong> Từ sinh đến khoảng 27-35 tuổi (tùy Số Đường Đời). Giai đoạn hình thành.</p>
          <p><strong>Giai đoạn 2:</strong> 9 năm tiếp theo. Giai đoạn phát tri���n.</p>
          <p><strong>Giai đoạn 3:</strong> 9 năm tiếp theo. Giai đoạn trưởng thành.</p>
          <p><strong>Giai đoạn 4:</strong> Từ đó đến cuối đời. Giai đoạn hoàn thiện.</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          <strong>Lưu ý:</strong> Tuổi bắt đầu giai đoạn 1 kết thúc = 36 - Số Đường Đời (rút gọn nghiêm ngặt).
          Ví dụ: Đường Đời 7 → giai đoạn 1 kết thúc ở tuổi 29.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">Cách tính</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-3 font-medium">Giai đoạn</th>
                <th className="text-left py-2 pr-3 font-medium">Thử Thách (trừ)</th>
                <th className="text-left py-2 font-medium">Đỉnh Cao (cộng)</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-dashed">
                <td className="py-2 pr-3 font-medium text-foreground">1</td>
                <td className="py-2 pr-3">|tháng - ngày|</td>
                <td className="py-2">tháng + ngày</td>
              </tr>
              <tr className="border-b border-dashed">
                <td className="py-2 pr-3 font-medium text-foreground">2</td>
                <td className="py-2 pr-3">|ngày - năm|</td>
                <td className="py-2">ngày + năm</td>
              </tr>
              <tr className="border-b border-dashed">
                <td className="py-2 pr-3 font-medium text-foreground">3</td>
                <td className="py-2 pr-3">|TT1 - TT2|</td>
                <td className="py-2">ĐC1 + ĐC2</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 font-medium text-foreground">4</td>
                <td className="py-2 pr-3">|tháng - năm|</td>
                <td className="py-2">tháng + năm</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          TT = Thử Thách, ĐC = Đ��nh Cao. Tất cả đều rút gọn sau khi tính.
        </p>
      </div>

      <TimelineCalculator />
    </div>
  )
}

function TimelineCalculator() {
  const currentYear = new Date().getFullYear()
  const [month, setMonth] = useState(3)
  const [day, setDay] = useState(15)
  const [year, setYear] = useState(1990)
  const [showResult, setShowResult] = useState(false)

  const lifePath = computeLifePath(month, day, year)
  const challenges = computeChallenges(month, day, year, lifePath.value)
  const pinnacles = computePinnacles(month, day, year, lifePath.value)
  const currentAge = currentYear - year

  return (
    <div className="rounded-lg border p-4">
      <h4 className="font-semibold text-sm mb-3">Xem Thử Thách & Đỉnh Cao</h4>
      <div className="flex gap-2 items-end flex-wrap">
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Ngày</label>
          <select
            value={day}
            onChange={(e) => { setDay(Number(e.target.value)); setShowResult(false) }}
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
            onChange={(e) => { setMonth(Number(e.target.value)); setShowResult(false) }}
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
            onChange={(e) => { setYear(Number(e.target.value)); setShowResult(false) }}
            className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus:border-ring"
          >
            {Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i).map(y => (
              <option key={y} value={y}>{y}</option>
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
        <div className="mt-4 space-y-4">
          <div className="text-xs text-muted-foreground">
            Số Đường Đời: <strong>{lifePath.value}</strong> · Tuổi hiện tại: <strong>{currentAge}</strong>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            {challenges.map((ch, i) => {
              const pin = pinnacles[i]
              const isCurrent = currentAge >= ch.startAge && (ch.endAge === null || currentAge <= ch.endAge)

              return (
                <div
                  key={i}
                  className={`rounded-lg border p-3 ${isCurrent ? 'border-primary bg-primary/5' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">
                      Giai đoạn {i + 1}
                      {isCurrent && <span className="text-primary ml-1">(hiện tại)</span>}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {ch.startAge}–{ch.endAge ?? '∞'} tuổi
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 text-[10px] font-bold">
                        {ch.number}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Thử thách</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 text-[10px] font-bold">
                        {pin.number}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Đỉnh cao</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
