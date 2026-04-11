import { NUMBER_MEANINGS } from '@/lib/numerology'

export function Lesson09() {
  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed">
        <strong>Số Trưởng Thành</strong> (Maturity Number) là con số xuất hiện muộn trong cuộc đời,
        thường từ khoảng 35-40 tuổi trở đi. Nó được tính bằng cách cộng Số Đường Đời và Số Biểu Đạt,
        rồi rút gọn.
      </p>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Công thức</h4>
        <div className="flex items-center gap-2 text-sm font-mono">
          <span className="px-3 py-1.5 rounded-lg border bg-background">Số Đường Đời</span>
          <span className="text-muted-foreground">+</span>
          <span className="px-3 py-1.5 rounded-lg border bg-background">Số Biểu Đạt</span>
          <span className="text-muted-foreground">→ rút gọn →</span>
          <span className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold">Số Trưởng Thành</span>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">Ý nghĩa</h4>
        <div className="space-y-3">
          <div className="rounded-lg border p-3">
            <h5 className="font-medium text-sm">Năng lượng nửa sau cuộc đời</h5>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Số Trưởng Thành không hoạt động rõ ràng ở tuổi trẻ. Khi bạn tích lũy đủ kinh nghiệm sống,
              năng lượng này bắt đầu bộc lộ và định hướng bạn trong giai đoạn trưởng thành.
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <h5 className="font-medium text-sm">Hợp nhất bản chất và biểu đạt</h5>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Vì được tính từ Đường Đời (bạn là ai) + Biểu Đạt (bạn thể hiện ra sao),
              Số Trưởng Thành đại diện cho sự hợp nhất giữa bản chất và khả năng —
              mục tiêu bạn hướng tới khi trưởng thành hoàn toàn.
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <h5 className="font-medium text-sm">Bổ sung hoặc chuyển hướng</h5>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Nếu Số Trưởng Thành hài hòa với Đường Đời, nửa sau cuộc đời sẽ cảm thấy tự nhiên.
              Nếu khác biệt, bạn có thể trải qua sự chuyển hướng lớn — đổi nghề, đổi ưu tiên, khám phá khía cạnh mới.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">Ví dụ</h4>
        <div className="space-y-3">
          {[
            { lp: 3, exp: 7, result: 1, note: 'Sáng tạo (3) + Phân tích (7) → Lãnh đạo độc lập (1). Nửa sau cuộc đời hướng đến vai trò tiên phong.' },
            { lp: 5, exp: 6, result: 11, note: 'Phiêu lưu (5) + Chăm sóc (6) → Trực giác bậc thầy (11). Tiềm năng tâm linh khai mở ở tuổi trung niên.' },
            { lp: 8, exp: 4, result: 3, note: 'Quyền lực (8) + Kỷ luật (4) → Giao tiếp (3). Nửa sau cuộc đời mở ra sự sáng tạo và biểu đạt.' },
          ].map((ex, i) => (
            <div key={i} className="rounded-lg border p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">
                Đường Đời {ex.lp} + Biểu Đạt {ex.exp} = {ex.lp + ex.exp} → {ex.result}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{ex.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Ý nghĩa theo từng số</h4>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
            const meaning = NUMBER_MEANINGS[n]
            return meaning?.asMaturity ? (
              <div key={n} className="flex gap-2">
                <span className="shrink-0 flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                  {n}
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">{meaning.asMaturity}</p>
              </div>
            ) : null
          })}
        </div>
      </div>
    </div>
  )
}
