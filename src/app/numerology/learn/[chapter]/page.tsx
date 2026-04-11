'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Lesson01 } from './lessons/lesson-01'
import { Lesson02 } from './lessons/lesson-02'
import { Lesson03 } from './lessons/lesson-03'
import { Lesson04 } from './lessons/lesson-04'
import { Lesson05 } from './lessons/lesson-05'
import { Lesson06 } from './lessons/lesson-06'
import { Lesson07 } from './lessons/lesson-07'
import { Lesson08 } from './lessons/lesson-08'
import { Lesson09 } from './lessons/lesson-09'
import { Lesson10 } from './lessons/lesson-10'
import { Lesson11 } from './lessons/lesson-11'
import { Lesson12 } from './lessons/lesson-12'

const CHAPTERS: Record<string, {
  num: number
  title: { vn: string; en: string }
  prev?: { slug: string; title: string }
  next?: { slug: string; title: string }
  Content: () => React.ReactNode
}> = {
  'so-hoc-la-gi': {
    num: 1,
    title: { vn: 'Số Học Là Gì?', en: 'What Is Numerology?' },
    next: { slug: 'cach-rut-gon-so', title: 'Cách Rút Gọn Số' },
    Content: Lesson01,
  },
  'cach-rut-gon-so': {
    num: 2,
    title: { vn: 'Cách Rút Gọn Số', en: 'Number Reduction' },
    prev: { slug: 'so-hoc-la-gi', title: 'Số Học Là Gì?' },
    next: { slug: 'so-duong-doi', title: 'Số Đường Đời' },
    Content: Lesson02,
  },
  'so-duong-doi': {
    num: 3,
    title: { vn: 'Số Đường Đời', en: 'Life Path Number' },
    prev: { slug: 'cach-rut-gon-so', title: 'Cách Rút Gọn Số' },
    next: { slug: '9-nguyen-mau', title: '9 Nguyên Mẫu' },
    Content: Lesson03,
  },
  '9-nguyen-mau': {
    num: 4,
    title: { vn: '9 Nguyên Mẫu', en: 'The 9 Archetypes' },
    prev: { slug: 'so-duong-doi', title: 'Số Đường Đời' },
    next: { slug: 'so-bac-thay', title: 'Số Bậc Thầy' },
    Content: Lesson04,
  },
  'so-bac-thay': {
    num: 5,
    title: { vn: 'Số Bậc Thầy', en: 'Master Numbers' },
    prev: { slug: '9-nguyen-mau', title: '9 Nguyên Mẫu' },
    next: { slug: 'so-ngay-sinh', title: 'Số Ngày Sinh' },
    Content: Lesson05,
  },
  'so-ngay-sinh': {
    num: 6,
    title: { vn: 'Số Ngày Sinh', en: 'Birthday Number' },
    prev: { slug: 'so-bac-thay', title: 'Số Bậc Thầy' },
    next: { slug: 'so-bieu-dat', title: 'Số Biểu Đạt' },
    Content: Lesson06,
  },
  'so-bieu-dat': {
    num: 7,
    title: { vn: 'Số Biểu Đạt', en: 'Expression Number' },
    prev: { slug: 'so-ngay-sinh', title: 'Số Ngày Sinh' },
    next: { slug: 'linh-hon-va-nhan-cach', title: 'Linh Hồn & Nhân Cách' },
    Content: Lesson07,
  },
  'linh-hon-va-nhan-cach': {
    num: 8,
    title: { vn: 'Linh Hồn & Nhân Cách', en: 'Soul Urge & Personality' },
    prev: { slug: 'so-bieu-dat', title: 'Số Biểu Đạt' },
    next: { slug: 'so-truong-thanh', title: 'Số Trưởng Thành' },
    Content: Lesson08,
  },
  'so-truong-thanh': {
    num: 9,
    title: { vn: 'Số Trưởng Thành', en: 'Maturity Number' },
    prev: { slug: 'linh-hon-va-nhan-cach', title: 'Linh Hồn & Nhân Cách' },
    next: { slug: 'chu-ky-ca-nhan', title: 'Chu Kỳ Cá Nhân' },
    Content: Lesson09,
  },
  'chu-ky-ca-nhan': {
    num: 10,
    title: { vn: 'Chu Kỳ Cá Nhân', en: 'Personal Cycles' },
    prev: { slug: 'so-truong-thanh', title: 'Số Trưởng Thành' },
    next: { slug: 'thu-thach-va-dinh-cao', title: 'Thử Thách & Đỉnh Cao' },
    Content: Lesson10,
  },
  'thu-thach-va-dinh-cao': {
    num: 11,
    title: { vn: 'Thử Thách & Đỉnh Cao', en: 'Challenges & Pinnacles' },
    prev: { slug: 'chu-ky-ca-nhan', title: 'Chu Kỳ Cá Nhân' },
    next: { slug: 'doc-ho-so-so-hoc', title: 'Đọc Hồ Sơ Số Học' },
    Content: Lesson11,
  },
  'doc-ho-so-so-hoc': {
    num: 12,
    title: { vn: 'Đọc Hồ Sơ Số Học', en: 'Reading a Full Profile' },
    prev: { slug: 'thu-thach-va-dinh-cao', title: 'Thử Thách & Đỉnh Cao' },
    Content: Lesson12,
  },
}

export default function LearnChapterPage() {
  const params = useParams()
  const slug = params.chapter as string
  const chapter = CHAPTERS[slug]

  if (!chapter) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 text-center">
        <p className="text-muted-foreground">Bài học không tìm thấy</p>
        <Link href="/numerology/learn" className="text-primary text-sm mt-2 inline-block hover:underline">
          Quay lại danh sách bài học
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-6">
        <Link href="/numerology" className="hover:underline">Thần Số Học</Link>
        <span className="mx-1.5">/</span>
        <Link href="/numerology/learn" className="hover:underline">Học</Link>
        <span className="mx-1.5">/</span>
        <span>Bài {chapter.num}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-mono font-medium text-muted-foreground">
            {chapter.num}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold">{chapter.title.vn}</h1>
        </div>
        <p className="text-sm text-muted-foreground italic mt-1 ml-9">{chapter.title.en}</p>
      </div>

      <chapter.Content />

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t">
        {chapter.prev ? (
          <Link
            href={`/numerology/learn/${chapter.prev.slug}`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← {chapter.prev.title}
          </Link>
        ) : (
          <Link
            href="/numerology/learn"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Danh sách bài học
          </Link>
        )}
        {chapter.next ? (
          <Link
            href={`/numerology/learn/${chapter.next.slug}`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {chapter.next.title} →
          </Link>
        ) : (
          <Link
            href="/numerology"
            className="text-xs text-primary hover:underline"
          >
            Tính thần số →
          </Link>
        )}
      </div>
    </div>
  )
}
