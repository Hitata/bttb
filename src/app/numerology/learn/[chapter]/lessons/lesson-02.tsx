'use client'

import { useState } from 'react'
import { reduce, digitSum, MASTER_NUMBERS } from '@/lib/numerology'

export function Lesson02() {
  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed">
        Phép tính nền tảng của thần số học là <strong>rút gọn</strong> (reduce) — cộng tất cả chữ số
        của một con số lại với nhau, lặp lại cho đến khi còn một chữ số duy nhất (1–9)
        hoặc gặp số bậc thầy (11, 22, 33).
      </p>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Quy tắc</h4>
        <ol className="text-xs text-muted-foreground leading-relaxed space-y-1 list-decimal list-inside">
          <li>Cộng tất cả chữ số của con số lại với nhau.</li>
          <li>Nếu kết quả lớn hơn 9 và <strong>không phải</strong> 11, 22, hoặc 33 → lặp lại bước 1.</li>
          <li>Nếu kết quả là 1–9 hoặc 11/22/33 → dừng. Đó là kết quả rút gọn.</li>
        </ol>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">Ví dụ từng bước</h4>
        <div className="space-y-3">
          <ReductionExample number={1990} />
          <ReductionExample number={29} />
          <ReductionExample number={347} />
          <ReductionExample number={119} />
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">Số Bậc Thầy — ngoại lệ quan trọng</h4>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          Các số 11, 22, và 33 được gọi là <strong>số bậc thầy</strong> (Master Numbers).
          Khi quá trình rút gọn cho ra một trong ba số này, ta <strong>dừng lại</strong> — không rút gọn thêm.
          Chúng mang năng lượng khuếch đại đặc biệt (sẽ học chi tiết ở Bài 5).
        </p>
        <div className="flex gap-3">
          {[11, 22, 33].map((n) => (
            <div key={n} className="flex-1 rounded-lg border border-amber-200 bg-amber-50 p-3 text-center">
              <div className="text-lg font-bold text-amber-700">{n}</div>
              <div className="text-[10px] text-amber-600 mt-1">
                = {n === 11 ? '2 khuếch đại' : n === 22 ? '4 khuếch đại' : '6 khuếch đại'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReductionCalculator />
    </div>
  )
}

function ReductionExample({ number }: { number: number }) {
  const steps: { value: number; digits: number[] }[] = []
  let current = number

  while (current > 9 && !MASTER_NUMBERS.has(current)) {
    const digits: number[] = []
    let val = current
    while (val > 0) {
      digits.unshift(val % 10)
      val = Math.floor(val / 10)
    }
    const sum = digits.reduce((a, b) => a + b, 0)
    steps.push({ value: current, digits })
    current = sum
  }

  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
        <span className="font-bold">{number}</span>
        {steps.map((step, i) => (
          <span key={i} className="text-muted-foreground">
            → {step.digits.join('+')}={step.digits.reduce((a, b) => a + b, 0)}
          </span>
        ))}
        <span className="text-primary font-bold">→ {current}</span>
        {MASTER_NUMBERS.has(current) && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
            Số Bậc Thầy
          </span>
        )}
      </div>
    </div>
  )
}

function ReductionCalculator() {
  const [input, setInput] = useState('')
  const num = parseInt(input, 10)
  const isValid = !isNaN(num) && num > 0

  const steps: string[] = []
  if (isValid) {
    let current = num
    while (current > 9 && !MASTER_NUMBERS.has(current)) {
      const digits: number[] = []
      let val = current
      while (val > 0) {
        digits.unshift(val % 10)
        val = Math.floor(val / 10)
      }
      const sum = digits.reduce((a, b) => a + b, 0)
      steps.push(`${digits.join(' + ')} = ${sum}`)
      current = sum
    }
  }

  const result = isValid ? reduce(num) : null

  return (
    <div className="rounded-lg border p-4">
      <h4 className="font-semibold text-sm mb-3">Thử rút gọn một số</h4>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập một số..."
          min={1}
          className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring"
        />
        {isValid && result !== null && (
          <div className="flex items-center gap-2 text-xs font-mono">
            {steps.map((step, i) => (
              <span key={i} className="text-muted-foreground">→ {step}</span>
            ))}
            <span className="text-primary font-bold text-base">→ {result}</span>
            {MASTER_NUMBERS.has(result) && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                Số Bậc Thầy
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
