import { NUMBER_MEANINGS } from '@/lib/numerology'

const ARCHETYPE_COLORS: Record<number, string> = {
  1: '#e74c3c',
  2: '#3498db',
  3: '#f39c12',
  4: '#27ae60',
  5: '#9b59b6',
  6: '#e67e22',
  7: '#1abc9c',
  8: '#2c3e50',
  9: '#c0392b',
}

export function Lesson04() {
  const archetypes = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed">
        Mỗi con số từ 1 đến 9 đại diện cho một <strong>nguyên mẫu</strong> (archetype) —
        một bộ năng lượng, tính cách, điểm mạnh và thử thách riêng.
        Hiểu 9 nguyên mẫu này là nền tảng để đọc mọi con số trong thần số học.
      </p>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Lưu ý quan trọng</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Mỗi con số có cả mặt sáng (điểm mạnh) và mặt tối (bóng tối/thử thách).
          Không có số nào &ldquo;tốt&rdquo; hay &ldquo;xấu&rdquo; — tất cả đều có giá trị riêng.
          Mỗi con số cũng mang ý nghĩa khác nhau tùy vào vị trí nó xuất hiện
          (Đường Đời, Biểu Đạt, Linh Hồn...) — các bài tiếp theo sẽ đi sâu hơn.
        </p>
      </div>

      <div className="space-y-4">
        {archetypes.map((num) => {
          const meaning = NUMBER_MEANINGS[num]
          if (!meaning) return null
          const color = ARCHETYPE_COLORS[num]

          return (
            <div key={num} className="rounded-lg border p-4">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="flex size-10 items-center justify-center rounded-full text-white text-lg font-bold"
                  style={{ backgroundColor: color }}
                >
                  {num}
                </span>
                <div>
                  <h4 className="font-semibold text-sm">{meaning.nameVi}</h4>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {meaning.keywords.map(kw => (
                      <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {meaning.general}
              </p>
            </div>
          )
        })}
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Tiếp theo</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Ngoài 9 nguyên mẫu cơ bản, còn có 3 số bậc thầy (11, 22, 33)
          với năng lượng đặc biệt. Bài tiếp theo sẽ giải thích chi tiết.
        </p>
      </div>
    </div>
  )
}
