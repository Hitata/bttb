'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'

const LESSONS = [
  { slug: 'so-hoc-la-gi', num: 1, vn: 'Số Học Là Gì?', en: 'What Is Numerology?', desc: 'Nguồn gốc, hệ thống Pythagorean, so sánh với Tử Vi và I Ching.' },
  { slug: 'cach-rut-gon-so', num: 2, vn: 'Cách Rút Gọn Số', en: 'Number Reduction', desc: 'Phép tính cơ bản — rút gọn số nhiều chữ số thành một chữ số.' },
  { slug: 'so-duong-doi', num: 3, vn: 'Số Đường Đời', en: 'Life Path Number', desc: 'Con số quan trọng nhất — tính từ ngày sinh.' },
  { slug: '9-nguyen-mau', num: 4, vn: '9 Nguyên Mẫu', en: 'The 9 Archetypes', desc: 'Khám phá 9 con số nguyên mẫu với đặc điểm, điểm mạnh và bóng tối.' },
  { slug: 'so-bac-thay', num: 5, vn: 'Số Bậc Thầy', en: 'Master Numbers', desc: 'Số 11, 22, 33 — năng lượng khuếch đại và sự nhị nguyên.' },
  { slug: 'so-ngay-sinh', num: 6, vn: 'Số Ngày Sinh', en: 'Birthday Number', desc: 'Tài năng bẩm sinh từ ngày bạn sinh ra.' },
  { slug: 'so-bieu-dat', num: 7, vn: 'Số Biểu Đạt', en: 'Expression Number', desc: 'Con số từ tên — bảng chữ cái Pythagorean và cách xử lý tiếng Việt.' },
  { slug: 'linh-hon-va-nhan-cach', num: 8, vn: 'Linh Hồn & Nhân Cách', en: 'Soul Urge & Personality', desc: 'Nguyên âm = khao khát nội tâm, phụ âm = hình ảnh bên ngoài.' },
  { slug: 'so-truong-thanh', num: 9, vn: 'Số Trưởng Thành', en: 'Maturity Number', desc: 'Năng lượng xuất hiện ở nửa sau cuộc đời.' },
  { slug: 'chu-ky-ca-nhan', num: 10, vn: 'Chu Kỳ Cá Nhân', en: 'Personal Cycles', desc: 'Năm, tháng, ngày cá nhân — chu kỳ 9 năm.' },
  { slug: 'thu-thach-va-dinh-cao', num: 11, vn: 'Thử Thách & Đỉnh Cao', en: 'Challenges & Pinnacles', desc: 'Các giai đoạn cuộc đời theo độ tuổi.' },
  { slug: 'doc-ho-so-so-hoc', num: 12, vn: 'Đọc Hồ Sơ Số Học', en: 'Reading a Full Profile', desc: 'Tổng hợp tất cả con số thành bức tranh hoàn chỉnh.' },
]

export default function NumerologyLearnIndex() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-6">
        <Link href="/numerology" className="hover:underline">Thần Số Học</Link>
        <span className="mx-1.5">/</span>
        <span>Học</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-full bg-muted p-2">
            <BookOpen className="size-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Học Thần Số Học</h1>
            <p className="text-sm text-muted-foreground italic">Learn Numerology</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          12 bài học từ cơ bản đến nâng cao, giúp bạn hiểu và đọc được hồ sơ thần số học hoàn chỉnh.
        </p>
      </div>

      <div className="space-y-2">
        {LESSONS.map((lesson) => (
          <Link
            key={lesson.slug}
            href={`/numerology/learn/${lesson.slug}`}
            className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <span className="shrink-0 mt-0.5 flex size-7 items-center justify-center rounded-full bg-muted text-xs font-mono font-medium text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
              {lesson.num}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-sm">{lesson.vn}</h2>
                <span className="text-xs text-muted-foreground italic">{lesson.en}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{lesson.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/numerology"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Quay lại Thần Số Học
        </Link>
      </div>
    </div>
  )
}
