'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { EARTHLY_BRANCHES } from '@/lib/tu-vi/palace-data'
import { MAJOR_STARS } from '@/lib/tu-vi/star-descriptions'
import { BRIGHTNESS_LABELS } from '@/lib/tu-vi/star-brightness'

// Chapter definitions
const CHAPTERS: Record<string, {
  title: { vn: string; en: string }
  prev?: { slug: string; title: string }
  next?: { slug: string; title: string }
  Content: () => React.ReactNode
}> = {
  'thap-nhi-cung': {
    title: { vn: 'Thập Nhị Cung', en: 'The 12 Palaces' },
    next: { slug: 'chinh-tinh', title: 'Chính Tinh' },
    Content: PalacesChapter,
  },
  'chinh-tinh': {
    title: { vn: 'Chính Tinh', en: 'The Major Stars' },
    prev: { slug: 'thap-nhi-cung', title: 'Thập Nhị Cung' },
    next: { slug: 'doc-la-so', title: 'Đọc Lá Số' },
    Content: StarsChapter,
  },
  'doc-la-so': {
    title: { vn: 'Đọc Lá Số', en: 'How to Read a Chart' },
    prev: { slug: 'chinh-tinh', title: 'Chính Tinh' },
    Content: ReadingChapter,
  },
}

const PALACE_INFO = [
  { name: 'Mệnh', en: 'Destiny', desc: 'Bản chất, tính cách, vận mệnh tổng quan. Đây là cung quan trọng nhất trong lá số.' },
  { name: 'Huynh Đệ', en: 'Siblings', desc: 'Anh chị em ruột, bạn bè thân thiết, mối quan hệ ngang hàng.' },
  { name: 'Phu Thê', en: 'Marriage', desc: 'Hôn nhân, tình cảm, đối tác cuộc đời.' },
  { name: 'Tử Tức', en: 'Children', desc: 'Con cái, sáng tạo, hậu duệ. Cũng liên quan đến khả năng sáng tạo.' },
  { name: 'Tài Bạch', en: 'Wealth', desc: 'Tài chính, thu nhập, cách kiếm tiền và giữ tiền.' },
  { name: 'Tật Ách', en: 'Health', desc: 'Sức khỏe, bệnh tật, thể chất. Cũng chỉ thử thách trong đời.' },
  { name: 'Thiên Di', en: 'Travel', desc: 'Di chuyển, xuất ngoại, quan hệ xã hội bên ngoài.' },
  { name: 'Nô Bộc', en: 'Staff', desc: 'Cấp dưới, nhân viên, người giúp đỡ, bạn bè xã giao.' },
  { name: 'Quan Lộc', en: 'Career', desc: 'Sự nghiệp, công danh, chức vụ, hướng đi nghề nghiệp.' },
  { name: 'Điền Trạch', en: 'Property', desc: 'Nhà cửa, bất động sản, gia sản, môi trường sống.' },
  { name: 'Phúc Đức', en: 'Fortune', desc: 'Phúc đức tổ tiên, đời sống tâm linh, hạnh phúc nội tâm.' },
  { name: 'Phụ Mẫu', en: 'Parents', desc: 'Cha mẹ, học vấn, giáo dục, quyền lực bảo hộ.' },
]

function PalacesChapter() {
  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed">
        Lá số Tử Vi được chia thành 12 cung, mỗi cung đại diện cho một lĩnh vực của cuộc sống.
        Các cung được sắp xếp trên một lưới vuông 4×4, với 12 ô bao quanh và 4 ô trung tâm chứa thông tin sinh.
      </p>

      <p className="text-sm leading-relaxed">
        Mỗi cung gắn với một Địa Chi cố định (Tý, Sửu, Dần...). Tên cung (Mệnh, Huynh Đệ, Phu Thê...)
        được xoay vào các vị trí này dựa trên tháng sinh và giờ sinh.
      </p>

      {/* Interactive palace grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PALACE_INFO.map((p, i) => (
          <div key={i} className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
              <h4 className="font-semibold text-sm">{p.name}</h4>
              <span className="text-xs text-muted-foreground italic">{p.en}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Thứ tự Địa Chi trên lưới</h4>
        <div className="flex flex-wrap gap-2">
          {EARTHLY_BRANCHES.map((branch, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded border bg-background">
              {branch}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          12 Địa Chi bắt đầu từ Tý (0) đến Hợi (11), xếp theo thứ tự cố định trên lưới vuông.
        </p>
      </div>
    </div>
  )
}

function StarsChapter() {
  const tuViGroup = MAJOR_STARS.filter(s => s.group === 'tuVi')
  const thienPhuGroup = MAJOR_STARS.filter(s => s.group === 'thienPhu')

  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed">
        14 sao chính (Chính Tinh) là nền tảng của lá số Tử Vi. Chúng chia thành 2 nhóm:
        nhóm Tử Vi (6 sao) và nhóm Thiên Phủ (8 sao). Mỗi sao có bản chất, ngũ hành, và ý nghĩa riêng.
      </p>

      {/* Star brightness legend */}
      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Độ sáng (Brightness)</h4>
        <div className="flex flex-wrap gap-3">
          {(Object.entries(BRIGHTNESS_LABELS) as [string, { vi: string; symbol: string }][]).map(([key, val]) => (
            <div key={key} className="text-xs flex items-center gap-1">
              <span className="text-amber-500">{val.symbol || '—'}</span>
              <span>{val.vi}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Mỗi sao có độ sáng khác nhau tùy thuộc vào vị trí Địa Chi.
          Miếu là mạnh nhất, Hãm là yếu nhất.
        </p>
      </div>

      {/* Tử Vi Group */}
      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: '#c2785c' }}>
          Nhóm Tử Vi (6 sao)
        </h3>
        <div className="space-y-3">
          {tuViGroup.map(star => (
            <div key={star.id} className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm" style={{ color: '#c2785c' }}>
                  {star.name}
                </span>
                <span className="text-xs text-muted-foreground italic">{star.nameEn}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted">{star.element}</span>
              </div>
              <p className="text-xs leading-relaxed mb-1">{star.nature}</p>
              <div className="flex flex-wrap gap-1">
                {star.keywords.split(', ').map(kw => (
                  <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-muted/70">{kw}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thiên Phủ Group */}
      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: '#2a9d8f' }}>
          Nhóm Thiên Phủ (8 sao)
        </h3>
        <div className="space-y-3">
          {thienPhuGroup.map(star => (
            <div key={star.id} className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm" style={{ color: '#2a9d8f' }}>
                  {star.name}
                </span>
                <span className="text-xs text-muted-foreground italic">{star.nameEn}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted">{star.element}</span>
              </div>
              <p className="text-xs leading-relaxed mb-1">{star.nature}</p>
              <div className="flex flex-wrap gap-1">
                {star.keywords.split(', ').map(kw => (
                  <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-muted/70">{kw}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ReadingChapter() {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed">
        Đọc lá số Tử Vi là nghệ thuật tổng hợp: xem sao nào ở cung nào, sáng hay tối,
        có Tứ Hóa không, và các sao tương tác với nhau ra sao.
      </p>

      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <h4 className="font-semibold text-sm mb-2">1. Tìm cung Mệnh</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Cung Mệnh là trung tâm lá số, quyết định bản chất con người.
            Xem có sao chính nào trong Mệnh không, độ sáng ra sao.
            Mệnh có Tử Vi Miếu khác hoàn toàn với Mệnh trống.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h4 className="font-semibold text-sm mb-2">2. Đọc Mệnh Cục</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Mệnh Cục (Thủy/Mộc/Kim/Thổ/Hỏa + số 2-6) cho biết ngũ hành chủ đạo
            và nhịp vận mệnh. Cục số nhỏ (2) thì vận đến sớm, cục lớn (6) thì muộn hơn.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h4 className="font-semibold text-sm mb-2">3. Xem độ sáng các sao</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Cùng một sao nhưng ở vị trí khác nhau sẽ có sức mạnh khác nhau.
            Miếu/Vượng là mạnh (sao phát huy tốt), Hãm là yếu (sao bị giới hạn).
            Đắc là khá, Bình là trung bình.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h4 className="font-semibold text-sm mb-2">4. Đọc Tứ Hóa</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tứ Hóa (Lộc, Quyền, Khoa, Kỵ) là 4 biến đổi gắn vào sao dựa trên Can năm.
            Hóa Lộc mang tài lộc, Hóa Quyền mang quyền lực, Hóa Khoa mang danh tiếng,
            Hóa Kỵ mang thử thách. Tứ Hóa rơi vào cung nào thì ảnh hưởng lĩnh vực đó.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h4 className="font-semibold text-sm mb-2">5. Tổ hợp sao</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Các sao không hoạt động riêng lẻ. Tử Vi + Thiên Phủ trong Mệnh = lãnh đạo mạnh.
            Liêm Trinh + Thất Sát = quyết liệt, dữ dội. Thái Âm + Thiên Đồng = hiền lành, nghệ thuật.
            Đọc tổ hợp quan trọng hơn đọc từng sao riêng lẻ.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h4 className="font-semibold text-sm mb-2">6. Tam phương tứ chính</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Mỗi cung chịu ảnh hưởng từ 3 cung tam hợp (cách 4 vị trí) và cung đối diện (cách 6 vị trí).
            Để đánh giá đầy đủ một cung, cần xem cả tam phương tứ chính.
            Đây là kỹ thuật nâng cao, Phase 2.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LearnChapterPage() {
  const params = useParams()
  const slug = params.chapter as string
  const chapter = CHAPTERS[slug]

  if (!chapter) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 text-center">
        <p className="text-muted-foreground">Chương không tìm thấy</p>
        <Link href="/tu-vi" className="text-primary text-sm mt-2 inline-block hover:underline">
          Quay lại Tử Vi
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-6">
        <Link href="/tu-vi" className="hover:underline">Tử Vi Đẩu Số</Link>
        <span className="mx-1.5">/</span>
        <span>Học</span>
        <span className="mx-1.5">/</span>
        <span>{chapter.title.vn}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">{chapter.title.vn}</h1>
        <p className="text-sm text-muted-foreground italic mt-1">{chapter.title.en}</p>
      </div>

      <chapter.Content />

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t">
        {chapter.prev ? (
          <Link
            href={`/tu-vi/learn/${chapter.prev.slug}`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← {chapter.prev.title}
          </Link>
        ) : <span />}
        {chapter.next ? (
          <Link
            href={`/tu-vi/learn/${chapter.next.slug}`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {chapter.next.title} →
          </Link>
        ) : (
          <Link
            href="/tu-vi/calculator"
            className="text-xs text-primary hover:underline"
          >
            Lập lá số →
          </Link>
        )}
      </div>
    </div>
  )
}
