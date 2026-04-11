'use client'

import { useState } from 'react'
import {
  LETTER_VALUES,
  stripDiacritics,
  computeExpression,
  getNameBreakdown,
} from '@/lib/numerology'

export function Lesson07() {
  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed">
        <strong>Số Biểu Đạt</strong> (Expression Number) được tính từ tên khai sinh đầy đủ.
        Nó cho biết tài năng, khả năng tự nhiên, và cách bạn thể hiện bản thân ra thế giới.
        Nếu Số Đường Đời là &ldquo;bạn là ai&rdquo;, thì Số Biểu Đạt là &ldquo;bạn thể hiện ra sao&rdquo;.
      </p>

      <div>
        <h4 className="font-semibold text-sm mb-3">Bảng chữ cái Pythagorean</h4>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          Mỗi chữ cái được gán một giá trị từ 1 đến 9 theo chu kỳ:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                  <th key={n} className="py-2 px-1 text-center font-bold text-primary">{n}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[['A','B','C','D','E','F','G','H','I'],
                ['J','K','L','M','N','O','P','Q','R'],
                ['S','T','U','V','W','X','Y','Z','']].map((row, i) => (
                <tr key={i} className="border-b border-dashed">
                  {row.map((letter, j) => (
                    <td key={j} className="py-1.5 px-1 text-center text-muted-foreground">
                      {letter}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Xử lý tiếng Việt</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Tiếng Việt có dấu thanh (sắc, huyền, hỏi, ngã, nặng) và chữ Đ.
          Hệ thống tự động bỏ dấu trước khi tính: Ă→A, Ê→E, Ơ→O, Ư→U, Đ→D, v.v.
          Bạn chỉ cần nhập tên đúng chính tả, phần còn lại hệ thống xử lý.
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-mono">
          {['Nguyễn', 'Văn', 'Anh'].map(name => {
            const stripped = stripDiacritics(name)
            return (
              <span key={name} className="px-2 py-1 rounded border bg-background">
                {name} → {stripped}
              </span>
            )
          })}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">Cách tính</h4>
        <ol className="text-xs text-muted-foreground leading-relaxed space-y-1 list-decimal list-inside">
          <li>Bỏ dấu tiếng Việt, chuyển thành A-Z.</li>
          <li>Gán giá trị Pythagorean cho mỗi chữ cái.</li>
          <li>Cộng tất cả giá trị trong từng phần tên, rút gọn từng phần.</li>
          <li>Cộng các kết quả rút gọn, rút gọn lần cuối → Số Biểu Đạt.</li>
        </ol>
      </div>

      <ExpressionCalculator />
    </div>
  )
}

function ExpressionCalculator() {
  const [name, setName] = useState('')

  const hasName = name.trim().length > 0
  const breakdown = hasName ? getNameBreakdown(name) : []
  const result = hasName ? computeExpression(name) : null

  return (
    <div className="rounded-lg border p-4">
      <h4 className="font-semibold text-sm mb-3">Thử tính Số Biểu Đạt</h4>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nhập họ tên khai sinh..."
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring"
      />

      {hasName && breakdown.length > 0 && (
        <div className="mt-4 space-y-3">
          {breakdown.map((part, i) => (
            <div key={i} className="rounded-lg bg-muted/50 p-3">
              <div className="text-xs font-medium mb-2">{part.name}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {part.letters.map((l, j) => (
                  <div key={j} className="flex flex-col items-center gap-0.5">
                    <span className="text-xs text-muted-foreground">{l.letter}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-background border font-mono">
                      {l.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-[11px] text-muted-foreground font-mono">
                Tổng: {part.total} → {part.reduced}
              </div>
            </div>
          ))}

          {result && (
            <div className="flex items-center gap-3 pt-2 border-t">
              <span className="text-xs text-muted-foreground font-mono">{result.calculation}</span>
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {result.value}
              </span>
              {result.isMaster && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                  Số Bậc Thầy
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
