'use client'

import { useState } from 'react'
import {
  VOWELS,
  getNameBreakdown,
  computeSoulUrge,
  computePersonality,
} from '@/lib/numerology'

export function Lesson08() {
  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed">
        Số Biểu Đạt sử dụng <em>tất cả</em> chữ cái trong tên. Nhưng nếu tách riêng
        <strong> nguyên âm</strong> và <strong>phụ âm</strong>, ta được hai con số mới
        với ý nghĩa khác nhau hoàn toàn.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 text-sm font-bold">
              ♥
            </span>
            <h4 className="font-semibold text-sm">Số Linh Hồn</h4>
          </div>
          <p className="text-[11px] text-muted-foreground italic mb-2">Soul Urge / Heart&apos;s Desire</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tính từ <strong>nguyên âm</strong> trong tên.
            Đại diện cho khao khát sâu thẳm bên trong — điều bạn thực sự muốn,
            động lực ẩn giấu mà người ngoài có thể không thấy.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 text-sm font-bold">
              ◆
            </span>
            <h4 className="font-semibold text-sm">Số Nhân Cách</h4>
          </div>
          <p className="text-[11px] text-muted-foreground italic mb-2">Personality Number</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tính từ <strong>phụ âm</strong> trong tên.
            Đại diện cho hình ảnh bên ngoài — cách người khác nhìn nhận bạn,
            ấn tượng đầu tiên bạn tạo ra.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Nguyên âm & Phụ âm</h4>
        <div className="flex flex-wrap gap-2 mb-2">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(letter => {
            const isVowel = VOWELS.has(letter)
            return (
              <span
                key={letter}
                className={`text-xs px-2 py-1 rounded border font-mono ${
                  isVowel
                    ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-400'
                    : 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/50 dark:text-blue-400'
                }`}
              >
                {letter}
              </span>
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-rose-600 dark:text-rose-400">Nguyên âm: A, E, I, O, U, Y</span>
          {' · '}
          <span className="text-blue-600 dark:text-blue-400">Phụ âm: tất cả còn lại</span>
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
          <strong>Lưu ý về Y:</strong> Trong hệ thống Pythagorean, Y mặc định là nguyên âm.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-2">Vì sao nguyên âm = nội tâm?</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Theo truyền thống Pythagorean, nguyên âm là &ldquo;linh hồn&rdquo; của ngôn ngữ —
          chúng mang âm thanh mở, tự do, không bị cản trở. Phụ âm tạo &ldquo;hình dạng&rdquo;
          bên ngoài. Tương tự, Số Linh Hồn phản ánh thế giới nội tâm, còn Số Nhân Cách
          phản ánh lớp vỏ bên ngoài.
        </p>
      </div>

      <SoulPersonalityCalculator />
    </div>
  )
}

function SoulPersonalityCalculator() {
  const [name, setName] = useState('')

  const hasName = name.trim().length > 0
  const breakdown = hasName ? getNameBreakdown(name) : []
  const soul = hasName ? computeSoulUrge(name) : null
  const personality = hasName ? computePersonality(name) : null

  return (
    <div className="rounded-lg border p-4">
      <h4 className="font-semibold text-sm mb-3">Thử tách Linh Hồn & Nhân Cách</h4>
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
              <div className="flex flex-wrap gap-1">
                {part.letters.map((l, j) => (
                  <div key={j} className="flex flex-col items-center gap-0.5">
                    <span className={`text-xs ${
                      l.type === 'vowel'
                        ? 'text-rose-600 dark:text-rose-400 font-medium'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {l.letter}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                      l.type === 'vowel'
                        ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50'
                        : 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50'
                    }`}>
                      {l.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            {soul && (
              <div className="flex items-center gap-2">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 text-sm font-bold">
                  {soul.value}
                </span>
                <div>
                  <div className="text-xs font-medium">Linh Hồn</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{soul.calculation}</div>
                </div>
              </div>
            )}
            {personality && (
              <div className="flex items-center gap-2">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 text-sm font-bold">
                  {personality.value}
                </span>
                <div>
                  <div className="text-xs font-medium">Nhân Cách</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{personality.calculation}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
