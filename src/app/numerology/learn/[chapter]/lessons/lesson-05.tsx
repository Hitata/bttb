import { NUMBER_MEANINGS } from '@/lib/numerology'

const MASTER_INFO = [
  { num: 11, base: 2, color: '#8e44ad', label: 'Trực Giác Bậc Thầy', labelEn: 'Master Intuitive' },
  { num: 22, base: 4, color: '#2980b9', label: 'Kiến Tạo Bậc Thầy', labelEn: 'Master Builder' },
  { num: 33, base: 6, color: '#27ae60', label: 'Thầy Giáo Bậc Thầy', labelEn: 'Master Teacher' },
]

export function Lesson05() {
  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed">
        Trong thần số học, hầu hết các số đều rút gọn về 1–9.
        Nhưng có 3 ngoại lệ: <strong>11, 22, và 33</strong> — được gọi là
        <strong> số bậc thầy</strong> (Master Numbers). Khi quá trình rút gọn cho ra
        một trong ba số này, ta dừng lại và không rút gọn thêm.
      </p>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Tại sao đặc biệt?</h4>
        <ul className="text-xs text-muted-foreground leading-relaxed space-y-1 list-disc list-inside">
          <li>Chúng là cặp số lặp (11, 22, 33) — mang năng lượng khuếch đại của số cơ bản.</li>
          <li>Chúng dao động giữa biểu hiện bậc thầy và năng lượng số cơ bản (ví dụ: 11 dao động giữa 11 và 2).</li>
          <li>Người mang số bậc thầy thường cảm thấy áp lực nội tâm lớn — tiềm năng cao nhưng kỳ vọng cũng cao.</li>
        </ul>
      </div>

      <div className="space-y-6">
        {MASTER_INFO.map(({ num, base, color, label, labelEn }) => {
          const masterMeaning = NUMBER_MEANINGS[num]
          const baseMeaning = NUMBER_MEANINGS[base]

          return (
            <div key={num} className="rounded-lg border p-4">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="flex size-12 items-center justify-center rounded-full text-white text-xl font-bold"
                  style={{ backgroundColor: color }}
                >
                  {num}
                </span>
                <div>
                  <h4 className="font-semibold text-sm">{label}</h4>
                  <p className="text-xs text-muted-foreground italic">{labelEn}</p>
                </div>
              </div>

              {masterMeaning && (
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {masterMeaning.general}
                </p>
              )}

              {/* Comparison with base */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="text-xs font-medium mb-1">Biểu hiện bậc thầy ({num})</div>
                  <div className="flex flex-wrap gap-1">
                    {masterMeaning?.keywords.map(kw => (
                      <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: color }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="text-xs font-medium mb-1">Năng lượng cơ bản ({base})</div>
                  <div className="flex flex-wrap gap-1">
                    {baseMeaning?.keywords.map(kw => (
                      <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                Người mang số {num} thường dao động giữa biểu hiện {num} (năng lượng cao)
                và quay về hành vi số {base} (an toàn hơn). Đây là sự nhị nguyên đặc trưng.
              </p>
            </div>
          )
        })}
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Số bậc thầy xuất hiện ở đâu?</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Số bậc thầy có thể xuất hiện ở bất kỳ vị trí nào: Đường Đời, Biểu Đạt, Linh Hồn, Nhân Cách,
          Trưởng Thành, hoặc Đỉnh Cao. Ý nghĩa cụ thể phụ thuộc vào vị trí đó —
          các bài tiếp theo sẽ giải thích từng vị trí.
        </p>
      </div>
    </div>
  )
}
