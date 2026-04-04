'use client'

import Link from 'next/link'

const CHAPTERS = [
  {
    slug: 'thap-nhi-cung',
    icon: '⬜',
    color: '#c2785c',
    title: { vn: 'Thập Nhị Cung', en: 'The 12 Palaces' },
    subtitle: { vn: 'Tìm hiểu 12 cung trong lá số Tử Vi — mỗi cung đại diện cho một lĩnh vực đời sống' },
    order: 1,
  },
  {
    slug: 'chinh-tinh',
    icon: '★',
    color: '#2a9d8f',
    title: { vn: 'Chính Tinh', en: 'The Major Stars' },
    subtitle: { vn: '14 sao chính chia thành nhóm Tử Vi và Thiên Phủ — bản chất, hành, và ý nghĩa' },
    order: 2,
  },
  {
    slug: 'doc-la-so',
    icon: '📖',
    color: '#6b5b95',
    title: { vn: 'Đọc Lá Số', en: 'How to Read a Chart' },
    subtitle: { vn: 'Cách đọc lá số Tử Vi: tìm Mệnh, đọc sao, hiểu sáng/tối, và tổng hợp' },
    order: 3,
  },
]

export default function TuViPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Tử Vi Đẩu Số</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Purple Star Astrology — Hệ thống mệnh lý cổ truyền Việt Nam qua 12 cung và 14 chính tinh
        </p>
      </div>

      <Link
        href="/tu-vi/calculator"
        className="mb-6 block rounded-lg border-2 border-primary/30 bg-primary/5 p-5 hover:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-primary/15 text-primary">
            ◎
          </div>
          <div>
            <h3 className="font-semibold text-sm">Lập Lá Số Của Bạn</h3>
            <p className="text-xs text-muted-foreground italic">Calculate your Tử Vi chart</p>
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHAPTERS.map((ch) => (
          <Link
            key={ch.slug}
            href={`/tu-vi/learn/${ch.slug}`}
            className="group rounded-lg border p-5 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: ch.color + '18', color: ch.color }}
              >
                {ch.icon}
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {String(ch.order).padStart(2, '0')}
              </span>
            </div>
            <h3 className="font-semibold text-sm group-hover:underline">{ch.title.vn}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 italic">{ch.title.en}</p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{ch.subtitle.vn}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
