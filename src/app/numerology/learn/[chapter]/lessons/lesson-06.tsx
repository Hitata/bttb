import { reduce, MASTER_NUMBERS } from '@/lib/numerology'

export function Lesson06() {
  // Generate all 31 days with their reduced values
  const days = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1
    return { day, reduced: reduce(day) }
  })

  // Group by reduced value
  const groups: Record<number, number[]> = {}
  for (const { day, reduced } of days) {
    if (!groups[reduced]) groups[reduced] = []
    groups[reduced].push(day)
  }

  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed">
        <strong>Số Ngày Sinh</strong> (Birthday Number) là con số đơn giản nhất trong thần số học —
        chỉ cần lấy ngày bạn sinh ra và rút gọn. Nó đại diện cho một <strong>tài năng bẩm sinh</strong>,
        một món quà tự nhiên mà bạn mang theo từ khi chào đời.
      </p>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Cách tính</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Lấy ngày sinh (1–31), rút gọn thành một chữ số (hoặc số bậc thầy).
          Ví dụ: sinh ngày 15 → 1+5 = 6. Sinh ngày 29 → 2+9 = 11 (số bậc thầy, dừng lại).
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">Số Ngày Sinh vs Số Đường Đời</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-3 font-medium">Đặc điểm</th>
                <th className="text-left py-2 pr-3 font-medium">Số Đường Đời</th>
                <th className="text-left py-2 font-medium">Số Ngày Sinh</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-dashed">
                <td className="py-2 pr-3 font-medium text-foreground">Đầu vào</td>
                <td className="py-2 pr-3">Ngày + Tháng + Năm</td>
                <td className="py-2">Chỉ Ngày</td>
              </tr>
              <tr className="border-b border-dashed">
                <td className="py-2 pr-3 font-medium text-foreground">Ý nghĩa</td>
                <td className="py-2 pr-3">Con đường và bài học cuộc đời</td>
                <td className="py-2">Tài năng bẩm sinh</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 font-medium text-foreground">Phạm vi</td>
                <td className="py-2 pr-3">Tổng quát, bao trùm</td>
                <td className="py-2">Cụ thể, bổ trợ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">31 ngày → Số rút gọn</h4>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          Bảng dưới đây nhóm 31 ngày theo số rút gọn của chúng.
          Tìm ngày sinh của bạn để biết tài năng bẩm sinh.
        </p>
        <div className="space-y-2">
          {Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b)).map(([reduced, dayList]) => (
            <div key={reduced} className="rounded-lg border p-3 flex items-center gap-3">
              <span className="shrink-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {reduced}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {dayList.map(d => (
                  <span key={d} className="text-xs px-2 py-0.5 rounded border bg-background">
                    {d}
                  </span>
                ))}
              </div>
              {MASTER_NUMBERS.has(Number(reduced)) && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 shrink-0">
                  Bậc Thầy
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Ví dụ</h4>
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>
            <strong>Sinh ngày 7:</strong> Số Ngày Sinh = 7. Tài năng bẩm sinh: phân tích, trực giác,
            tìm kiếm sự thật. Bạn tự nhiên giỏi quan sát và suy ngẫm.
          </p>
          <p>
            <strong>Sinh ngày 23:</strong> 2+3 = 5. Tài năng bẩm sinh: thích nghi, giao tiếp,
            tò mò. Bạn linh hoạt và nhanh nhạy với thay đổi.
          </p>
          <p>
            <strong>Sinh ngày 29:</strong> 2+9 = 11 (Số Bậc Thầy). Tài năng bẩm sinh: trực giác mạnh mẽ,
            nhạy cảm cao, khả năng truyền cảm hứng.
          </p>
        </div>
      </div>
    </div>
  )
}
