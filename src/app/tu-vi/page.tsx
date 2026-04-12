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
  {
    slug: 'phu-tinh',
    icon: '✦',
    color: '#e07a5f',
    title: { vn: 'Phụ Tinh', en: 'Minor Stars & Killing Stars' },
    subtitle: { vn: 'Lục Sát, Văn Xương/Khúc, Tả Phù/Hữu Bật, Thiên Khôi/Việt — các sao hỗ trợ và sát tinh' },
    order: 4,
  },
  {
    slug: 'tu-hoa',
    icon: '化',
    color: '#d4a373',
    title: { vn: 'Tứ Hóa', en: 'The Four Transformations' },
    subtitle: { vn: 'Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ — 4 biến đổi then chốt thay đổi toàn bộ lá số' },
    order: 5,
  },
  {
    slug: 'dai-van',
    icon: '⏳',
    color: '#457b9d',
    title: { vn: 'Đại Vận & Lưu Niên', en: 'Major Periods & Annual Charts' },
    subtitle: { vn: 'Cách đọc vận 10 năm (Đại Hạn), vận năm (Lưu Niên), và dự đoán thời điểm' },
    order: 6,
  },
  {
    slug: 'case-study',
    icon: '🔍',
    color: '#264653',
    title: { vn: 'Phân Tích Thực Hành', en: 'Case Study Walkthrough' },
    subtitle: { vn: 'Đọc một lá số hoàn chỉnh từ đầu đến cuối — áp dụng tất cả kiến thức các chương trước' },
    order: 7,
  },
]

export default function TuViPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Tử Vi Đẩu Số</h1>
        <p className="text-foreground-secondary mt-1 text-sm sm:text-base">
          Purple Star Astrology — Hệ thống mệnh lý cổ truyền Việt Nam qua 12 cung và 14 chính tinh
        </p>
      </div>

      <Link
        href="/tu-vi/calculator"
        className="mb-8 block bg-card border border-border rounded-lg p-6 hover:shadow-[rgba(0,0,0,0.05)_0px_4px_24px] transition-shadow"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-primary/10 text-primary">
            ◎
          </div>
          <div>
            <h3 className="font-semibold text-sm">Lập Lá Số Của Bạn</h3>
            <p className="text-xs text-muted-foreground italic">Calculate your Tử Vi chart</p>
          </div>
          <div className="ml-auto">
            <span className="inline-block bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-md">
              Bắt đầu →
            </span>
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHAPTERS.map((ch) => (
          <Link
            key={ch.slug}
            href={`/tu-vi/learn/${ch.slug}`}
            className="group bg-card border border-border rounded-lg p-5 hover:shadow-[rgba(0,0,0,0.05)_0px_4px_24px] transition-shadow"
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
            <p className="text-xs text-foreground-secondary mt-2 leading-relaxed">{ch.subtitle.vn}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
