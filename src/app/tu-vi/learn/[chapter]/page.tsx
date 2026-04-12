'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { EARTHLY_BRANCHES, HEAVENLY_STEMS } from '@/lib/tu-vi/palace-data'
import { MAJOR_STARS, LUC_SAT_STARS, PHU_TINH_STARS } from '@/lib/tu-vi/star-descriptions'
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
    next: { slug: 'phu-tinh', title: 'Phụ Tinh' },
    Content: ReadingChapter,
  },
  'phu-tinh': {
    title: { vn: 'Phụ Tinh', en: 'Minor Stars & Killing Stars' },
    prev: { slug: 'doc-la-so', title: 'Đọc Lá Số' },
    next: { slug: 'tu-hoa', title: 'Tứ Hóa' },
    Content: MinorStarsChapter,
  },
  'tu-hoa': {
    title: { vn: 'Tứ Hóa', en: 'The Four Transformations' },
    prev: { slug: 'phu-tinh', title: 'Phụ Tinh' },
    next: { slug: 'dai-van', title: 'Đại Vận & Lưu Niên' },
    Content: TuHoaChapter,
  },
  'dai-van': {
    title: { vn: 'Đại Vận & Lưu Niên', en: 'Major Periods & Annual Charts' },
    prev: { slug: 'tu-hoa', title: 'Tứ Hóa' },
    next: { slug: 'case-study', title: 'Phân Tích Thực Hành' },
    Content: DaiVanChapter,
  },
  'case-study': {
    title: { vn: 'Phân Tích Thực Hành', en: 'Case Study Walkthrough' },
    prev: { slug: 'dai-van', title: 'Đại Vận & Lưu Niên' },
    Content: CaseStudyChapter,
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
      <p className="text-base leading-relaxed">
        Lá số Tử Vi được chia thành 12 cung, mỗi cung đại diện cho một lĩnh vực của cuộc sống.
        Các cung được sắp xếp trên một lưới vuông 4×4, với 12 ô bao quanh và 4 ô trung tâm chứa thông tin sinh.
      </p>

      <p className="text-base leading-relaxed">
        Mỗi cung gắn với một Địa Chi cố định (Tý, Sửu, Dần...). Tên cung (Mệnh, Huynh Đệ, Phu Thê...)
        được xoay vào các vị trí này dựa trên tháng sinh và giờ sinh.
      </p>

      {/* Interactive palace grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PALACE_INFO.map((p, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-3 hover:shadow-[rgba(0,0,0,0.05)_0px_4px_24px] transition-shadow">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
              <h4 className="font-semibold text-sm">{p.name}</h4>
              <span className="text-xs text-muted-foreground italic">{p.en}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-secondary border border-border rounded-lg p-4">
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
      <p className="text-base leading-relaxed">
        14 sao chính (Chính Tinh) là nền tảng của lá số Tử Vi. Chúng chia thành 2 nhóm:
        nhóm Tử Vi (6 sao) và nhóm Thiên Phủ (8 sao). Mỗi sao có bản chất, ngũ hành, và ý nghĩa riêng.
      </p>

      {/* Star brightness legend */}
      <div className="bg-secondary border border-border rounded-lg p-4">
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
            <div key={star.id} className="bg-card border border-border rounded-lg p-3">
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
            <div key={star.id} className="bg-card border border-border rounded-lg p-3">
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
      <p className="text-base leading-relaxed">
        Đọc lá số Tử Vi là nghệ thuật tổng hợp: xem sao nào ở cung nào, sáng hay tối,
        có Tứ Hóa không, và các sao tương tác với nhau ra sao.
      </p>

      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-2">1. Tìm cung Mệnh</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Cung Mệnh là trung tâm lá số, quyết định bản chất con người.
            Xem có sao chính nào trong Mệnh không, độ sáng ra sao.
            Mệnh có Tử Vi Miếu khác hoàn toàn với Mệnh trống.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-2">2. Đọc Mệnh Cục</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Mệnh Cục (Thủy/Mộc/Kim/Thổ/Hỏa + số 2-6) cho biết ngũ hành chủ đạo
            và nhịp vận mệnh. Cục số nhỏ (2) thì vận đến sớm, cục lớn (6) thì muộn hơn.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-2">3. Xem độ sáng các sao</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Cùng một sao nhưng ở vị trí khác nhau sẽ có sức mạnh khác nhau.
            Miếu/Vượng là mạnh (sao phát huy tốt), Hãm là yếu (sao bị giới hạn).
            Đắc là khá, Bình là trung bình.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-2">4. Đọc Tứ Hóa</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tứ Hóa (Lộc, Quyền, Khoa, Kỵ) là 4 biến đổi gắn vào sao dựa trên Can năm.
            Hóa Lộc mang tài lộc, Hóa Quyền mang quyền lực, Hóa Khoa mang danh tiếng,
            Hóa Kỵ mang thử thách. Tứ Hóa rơi vào cung nào thì ảnh hưởng lĩnh vực đó.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-2">5. Tổ hợp sao</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Các sao không hoạt động riêng lẻ. Tử Vi + Thiên Phủ trong Mệnh = lãnh đạo mạnh.
            Liêm Trinh + Thất Sát = quyết liệt, dữ dội. Thái Âm + Thiên Đồng = hiền lành, nghệ thuật.
            Đọc tổ hợp quan trọng hơn đọc từng sao riêng lẻ.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
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

// ─── Chapter 4: Phụ Tinh ───

const KEY_PHU_TINH = PHU_TINH_STARS.filter(s =>
  ['VanXuong', 'VanKhuc', 'TaPhu', 'HuuBat', 'ThienKhoi', 'ThienViet'].includes(s.id)
)

function MinorStarsChapter() {
  return (
    <div className="space-y-8">
      <p className="text-base leading-relaxed">
        Ngoài 14 Chính Tinh, lá số Tử Vi còn có hàng chục sao phụ. Quan trọng nhất là 6 Lục Sát
        (sao xấu) và 6 Phụ Tinh chính (sao hỗ trợ). Các sao này không quyết định vận mệnh một mình,
        nhưng chúng &quot;tô màu&quot; cho các Chính Tinh — làm tốt thêm hoặc xấu đi đáng kể.
      </p>

      {/* Lục Sát */}
      <div>
        <h3 className="font-bold text-sm mb-1" style={{ color: '#e63946' }}>Lục Sát — 6 Sao Sát</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Sát tinh gây khó khăn, trở ngại, nhưng cũng mang lại sức mạnh và động lực khi ở đúng vị trí.
          Không phải lúc nào sát tinh cũng xấu — Kình Dương Miếu địa giúp quyết đoán, Hỏa Tinh + Tham Lang tạo &quot;bạo phát&quot;.
        </p>
        <div className="space-y-3">
          {LUC_SAT_STARS.map(star => (
            <div key={star.id} className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm" style={{ color: '#e63946' }}>
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

      {/* Lục Sát pairs */}
      <div className="bg-secondary border border-border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">3 cặp Lục Sát</h4>
        <div className="space-y-2 text-xs leading-relaxed">
          <div><span className="font-medium">Kình Dương + Đà La:</span> Kim khí. Kình Dương mạnh mẽ trực diện, Đà La âm thầm vướng mắc. Cùng cung = &quot;Kình Đà giáp&quot; rất hung.</div>
          <div><span className="font-medium">Hỏa Tinh + Linh Tinh:</span> Hỏa khí. Hỏa Tinh bùng nổ nhanh, Linh Tinh âm ỉ lâu dài. Gặp Tham Lang = cách &quot;bạo phát&quot;.</div>
          <div><span className="font-medium">Địa Không + Địa Kiếp:</span> Hỏa khí. Gây trống rỗng, mất mát. Nhưng cũng mang tư duy siêu thoát, tôn giáo, sáng tạo.</div>
        </div>
      </div>

      {/* Key Phụ Tinh */}
      <div>
        <h3 className="font-bold text-sm mb-1" style={{ color: '#2a9d8f' }}>6 Phụ Tinh Chính</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Các sao hỗ trợ mang lại may mắn, quý nhân, và tài năng. Cung Mệnh có nhiều phụ tinh tốt = đời được giúp đỡ nhiều.
        </p>
        <div className="space-y-3">
          {KEY_PHU_TINH.map(star => (
            <div key={star.id} className="bg-card border border-border rounded-lg p-3">
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

      {/* Phụ Tinh pairs */}
      <div className="bg-secondary border border-border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">3 cặp Phụ Tinh</h4>
        <div className="space-y-2 text-xs leading-relaxed">
          <div><span className="font-medium">Văn Xương + Văn Khúc:</span> Văn tinh. Mang học vấn, thông minh, tài hoa. Xương thiên về logic, Khúc thiên về nghệ thuật.</div>
          <div><span className="font-medium">Tả Phù + Hữu Bật:</span> Phụ tá tinh. Mang quý nhân, giúp đỡ. Có cặp này trong tam phương = luôn có người hỗ trợ.</div>
          <div><span className="font-medium">Thiên Khôi + Thiên Việt:</span> Quý nhân tinh. Khôi = quý nhân dương (nam), Việt = quý nhân âm (nữ). Gặp lúc khó khăn được giúp.</div>
        </div>
      </div>
    </div>
  )
}

// ─── Chapter 5: Tứ Hóa ───

const TU_HOA_INFO = [
  {
    name: 'Hóa Lộc',
    symbol: '祿',
    color: '#2a9d8f',
    meaning: 'Tài lộc, may mắn, thuận lợi',
    detail: 'Sao nào được Hóa Lộc thì mang thêm tài lộc, cơ hội, sự thuận lợi vào lĩnh vực mà cung đó đại diện. Ví dụ: Hóa Lộc vào cung Tài Bạch = tài chính tốt. Hóa Lộc vào cung Phu Thê = tình duyên may mắn.',
  },
  {
    name: 'Hóa Quyền',
    symbol: '權',
    color: '#e07a5f',
    meaning: 'Quyền lực, kiểm soát, mạnh mẽ',
    detail: 'Sao được Hóa Quyền trở nên mạnh mẽ, chủ động, có quyền kiểm soát. Mang tham vọng và sức ảnh hưởng. Ví dụ: Hóa Quyền vào Quan Lộc = sự nghiệp có quyền lực. Nhưng cũng dễ cố chấp.',
  },
  {
    name: 'Hóa Khoa',
    symbol: '科',
    color: '#457b9d',
    meaning: 'Danh tiếng, học vấn, thanh danh',
    detail: 'Sao được Hóa Khoa mang danh tiếng, uy tín, sự công nhận. Thiên về trí tuệ và học thuật hơn là tiền bạc. Ví dụ: Hóa Khoa vào Mệnh = nổi tiếng, được nể trọng.',
  },
  {
    name: 'Hóa Kỵ',
    symbol: '忌',
    color: '#e63946',
    meaning: 'Trở ngại, ám ảnh, bất thuận',
    detail: 'Sao bị Hóa Kỵ gặp khó khăn, vướng mắc, ám ảnh trong lĩnh vực đó. Hóa Kỵ không hoàn toàn xấu — nó cho thấy nơi bạn đặt nhiều tâm trí nhất, nhưng cũng lo lắng nhất. Ví dụ: Hóa Kỵ vào Tật Ách = hay lo về sức khỏe.',
  },
]

const TU_HOA_TABLE_DATA = [
  { stem: 'Giáp', loc: 'Liêm Trinh', quyen: 'Phá Quân', khoa: 'Vũ Khúc', ky: 'Thái Dương' },
  { stem: 'Ất', loc: 'Thiên Cơ', quyen: 'Thiên Lương', khoa: 'Tử Vi', ky: 'Thái Âm' },
  { stem: 'Bính', loc: 'Thiên Đồng', quyen: 'Thiên Cơ', khoa: 'Văn Xương', ky: 'Liêm Trinh' },
  { stem: 'Đinh', loc: 'Thái Âm', quyen: 'Thiên Đồng', khoa: 'Thiên Cơ', ky: 'Cự Môn' },
  { stem: 'Mậu', loc: 'Tham Lang', quyen: 'Thái Âm', khoa: 'Hữu Bật', ky: 'Thiên Cơ' },
  { stem: 'Kỷ', loc: 'Vũ Khúc', quyen: 'Tham Lang', khoa: 'Thiên Lương', ky: 'Văn Khúc' },
  { stem: 'Canh', loc: 'Thái Dương', quyen: 'Vũ Khúc', khoa: 'Thiên Đồng', ky: 'Thái Âm' },
  { stem: 'Tân', loc: 'Cự Môn', quyen: 'Thái Dương', khoa: 'Văn Khúc', ky: 'Văn Xương' },
  { stem: 'Nhâm', loc: 'Thiên Lương', quyen: 'Tử Vi', khoa: 'Thiên Phủ', ky: 'Vũ Khúc' },
  { stem: 'Quý', loc: 'Phá Quân', quyen: 'Cự Môn', khoa: 'Thái Âm', ky: 'Tham Lang' },
]

function TuHoaChapter() {
  return (
    <div className="space-y-8">
      <p className="text-base leading-relaxed">
        Tứ Hóa là 4 biến đổi gắn vào 4 sao dựa trên Thiên Can năm sinh. Đây là yếu tố
        quan trọng bậc nhất trong Tử Vi — nó &quot;kích hoạt&quot; các sao, biến chúng từ tĩnh thành động.
        Nhiều thầy coi Tứ Hóa là &quot;linh hồn&quot; của lá số.
      </p>

      {/* 4 Hóa cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TU_HOA_INFO.map(h => (
          <div key={h.name} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-bold" style={{ color: h.color }}>{h.symbol}</span>
              <div>
                <h4 className="font-semibold text-sm" style={{ color: h.color }}>{h.name}</h4>
                <p className="text-[10px] text-muted-foreground">{h.meaning}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{h.detail}</p>
          </div>
        ))}
      </div>

      {/* Tứ Hóa lookup table */}
      <div>
        <h3 className="font-bold text-sm mb-2">Bảng tra Tứ Hóa theo Thiên Can</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Mỗi Thiên Can năm sinh quyết định 4 sao nào được Hóa. Tìm Can năm sinh của bạn trong bảng dưới.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 font-semibold">Can</th>
                <th className="text-left py-2 px-2 font-semibold" style={{ color: '#2a9d8f' }}>Hóa Lộc</th>
                <th className="text-left py-2 px-2 font-semibold" style={{ color: '#e07a5f' }}>Hóa Quyền</th>
                <th className="text-left py-2 px-2 font-semibold" style={{ color: '#457b9d' }}>Hóa Khoa</th>
                <th className="text-left py-2 px-2 font-semibold" style={{ color: '#e63946' }}>Hóa Kỵ</th>
              </tr>
            </thead>
            <tbody>
              {TU_HOA_TABLE_DATA.map(row => (
                <tr key={row.stem} className="border-b border-muted">
                  <td className="py-2 px-2 font-medium">{row.stem}</td>
                  <td className="py-2 px-2">{row.loc}</td>
                  <td className="py-2 px-2">{row.quyen}</td>
                  <td className="py-2 px-2">{row.khoa}</td>
                  <td className="py-2 px-2">{row.ky}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key insights */}
      <div className="bg-secondary border border-border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">Quy tắc quan trọng</h4>
        <div className="space-y-2 text-xs leading-relaxed">
          <div><span className="font-medium">Lộc + Kỵ cùng cung:</span> Vừa có cơ hội vừa có trở ngại — &quot;lộc kèm kỵ&quot;, thành công nhưng phải trả giá.</div>
          <div><span className="font-medium">Lộc chuyển Kỵ:</span> Hóa Lộc ở cung A, Hóa Kỵ ở cung tam hợp = tài lộc bị rò rỉ sang lĩnh vực khác.</div>
          <div><span className="font-medium">Kỵ nhập Mệnh/Thân:</span> Suốt đời ám ảnh bởi lĩnh vực của sao bị Kỵ. Cần hiểu để chuyển hóa.</div>
          <div><span className="font-medium">Tam Hóa liên châu:</span> Lộc + Quyền + Khoa cùng tam phương = cách cục rất đẹp, công thành danh toại.</div>
        </div>
      </div>
    </div>
  )
}

// ─── Chapter 6: Đại Vận & Lưu Niên ───

function DaiVanChapter() {
  return (
    <div className="space-y-8">
      <p className="text-base leading-relaxed">
        Lá số Tử Vi không chỉ cho biết bản chất suốt đời — nó còn cho biết <em>khi nào</em> chuyện gì xảy ra.
        Đại Hạn (vận 10 năm) và Lưu Niên (vận từng năm) là công cụ dự đoán thời điểm trong Tử Vi.
      </p>

      {/* Đại Hạn */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">Đại Hạn (Major Period — 10 năm)</h4>
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>
            Mỗi cung trong lá số đại diện cho một giai đoạn 10 năm. Tuổi bắt đầu phụ thuộc vào Cục số:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-2">
            <div className="rounded bg-background border px-2 py-1.5">
              <span className="font-medium text-foreground">Thủy Nhị Cục:</span> bắt đầu tuổi 2
            </div>
            <div className="rounded bg-background border px-2 py-1.5">
              <span className="font-medium text-foreground">Mộc Tam Cục:</span> bắt đầu tuổi 3
            </div>
            <div className="rounded bg-background border px-2 py-1.5">
              <span className="font-medium text-foreground">Kim Tứ Cục:</span> bắt đầu tuổi 4
            </div>
            <div className="rounded bg-background border px-2 py-1.5">
              <span className="font-medium text-foreground">Thổ Ngũ Cục:</span> bắt đầu tuổi 5
            </div>
            <div className="rounded bg-background border px-2 py-1.5">
              <span className="font-medium text-foreground">Hỏa Lục Cục:</span> bắt đầu tuổi 6
            </div>
          </div>
          <p>
            Đại Hạn đầu tiên ở cung Mệnh, rồi di chuyển theo chiều thuận (Dương Nam/Âm Nữ) hoặc
            nghịch (Âm Nam/Dương Nữ) qua 12 cung. Khi đến một cung, các sao trong cung đó &quot;thức dậy&quot;
            và ảnh hưởng cuộc sống trong 10 năm đó.
          </p>
        </div>
      </div>

      {/* Cách đọc Đại Hạn */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">Cách đọc Đại Hạn</h4>
        <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
          <div className="flex gap-2">
            <span className="font-mono text-foreground shrink-0">01.</span>
            <p>Xem Đại Hạn rơi vào cung nào — đó là &quot;Mệnh tạm thời&quot; trong 10 năm đó.</p>
          </div>
          <div className="flex gap-2">
            <span className="font-mono text-foreground shrink-0">02.</span>
            <p>Đọc các sao trong cung đó như đọc cung Mệnh — sáng/tối, tốt/xấu.</p>
          </div>
          <div className="flex gap-2">
            <span className="font-mono text-foreground shrink-0">03.</span>
            <p>Xem tam phương tứ chính của cung Đại Hạn — các sao hỗ trợ hoặc xung phá.</p>
          </div>
          <div className="flex gap-2">
            <span className="font-mono text-foreground shrink-0">04.</span>
            <p>Kết hợp với lá số gốc: Đại Hạn tốt + gốc tốt = rất tốt. Đại Hạn xấu + gốc xấu = cần cẩn thận.</p>
          </div>
        </div>
      </div>

      {/* Lưu Niên */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">Lưu Niên (Annual Chart)</h4>
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>
            Mỗi năm, Địa Chi của năm đó xác định cung Lưu Niên. Ví dụ: năm Tý thì Lưu Niên ở cung có Địa Chi Tý.
          </p>
          <p>
            Lưu Niên có Tứ Hóa riêng (dựa trên Can của năm đang xét), tạo thêm một lớp biến đổi.
            Đây là lý do cùng một lá số nhưng năm nay tốt, năm sau xấu.
          </p>
          <p className="font-medium text-foreground">
            3 lớp đọc: Lá số gốc (suốt đời) → Đại Hạn (10 năm) → Lưu Niên (1 năm)
          </p>
        </div>
      </div>

      {/* Lưu Niên Tứ Hóa */}
      <div className="bg-secondary border border-border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">Tứ Hóa Lưu Niên</h4>
        <div className="space-y-2 text-xs leading-relaxed">
          <p className="text-muted-foreground">
            Ngoài Tứ Hóa gốc (theo Can năm sinh), mỗi năm có thêm Tứ Hóa Lưu Niên
            (theo Can của năm đang xét). Khi Hóa Kỵ Lưu Niên trùng cung với Hóa Kỵ gốc = năm đặc biệt khó khăn.
          </p>
          <div><span className="font-medium">Ví dụ:</span> Bạn sinh năm Giáp → Hóa Kỵ gốc ở Thái Dương. Năm Canh (2040) → Hóa Kỵ Lưu Niên cũng ở Thái Âm. Nếu cả hai cùng cung = &quot;song Kỵ&quot;, năm rất thử thách.</div>
        </div>
      </div>

      {/* Practical tips */}
      <div className="bg-secondary border border-border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">Mẹo thực hành</h4>
        <div className="space-y-2 text-xs leading-relaxed">
          <div><span className="font-medium">Đại Hạn qua cung có Hóa Lộc gốc:</span> 10 năm thuận lợi về tài chính hoặc tình cảm.</div>
          <div><span className="font-medium">Đại Hạn qua cung có Lục Sát nhiều:</span> 10 năm nhiều biến động, cần bình tĩnh.</div>
          <div><span className="font-medium">Lưu Niên qua cung Tật Ách gốc:</span> Năm cần chú ý sức khỏe đặc biệt.</div>
          <div><span className="font-medium">Tuần/Triệt trong Đại Hạn:</span> Sao bị Tuần/Triệt giảm lực, cả tốt lẫn xấu.</div>
        </div>
      </div>
    </div>
  )
}

// ─── Chapter 7: Case Study ───

function CaseStudyChapter() {
  return (
    <div className="space-y-8">
      <p className="text-base leading-relaxed">
        Chương này hướng dẫn bạn đọc một lá số hoàn chỉnh từ đầu đến cuối, áp dụng tất cả
        kiến thức từ 6 chương trước. Mỗi bước đều tham chiếu lại chương liên quan.
      </p>

      {/* Example chart setup */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">Ví dụ: Nam, sinh ngày 15/03/1990, giờ Dần (3-5h sáng)</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>Năm Canh Ngọ (Can Canh, Chi Ngọ)</div>
          <div>Dương Nam → chiều thuận</div>
        </div>
      </div>

      {/* Step by step */}
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-secondary">Bước 1</span>
            <h4 className="font-semibold text-sm">Xác định cung Mệnh & Thân</h4>
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
            <p>Từ tháng sinh (tháng 3 âm lịch) và giờ sinh (Dần), tìm vị trí cung Mệnh trên lưới.</p>
            <p>Thân cung được tính từ tháng + giờ theo công thức cố định.</p>
            <p className="text-[10px] italic">→ Xem lại: Chương 1 (Thập Nhị Cung)</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-secondary">Bước 2</span>
            <h4 className="font-semibold text-sm">Đọc Chính Tinh trong Mệnh</h4>
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
            <p>Xem có sao chính nào trong cung Mệnh. Kiểm tra độ sáng (Miếu/Vượng/Đắc/Bình/Hãm).</p>
            <p>Ví dụ: Nếu Mệnh có Tử Vi Miếu = người có phong thái lãnh đạo, tự trọng cao, được kính nể.</p>
            <p>Nếu Mệnh trống (không có chính tinh) → phải đọc tam phương để bù.</p>
            <p className="text-[10px] italic">→ Xem lại: Chương 2 (Chính Tinh) + Chương 3 (Đọc Lá Số)</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-secondary">Bước 3</span>
            <h4 className="font-semibold text-sm">Kiểm tra Phụ Tinh & Sát Tinh</h4>
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
            <p>Mệnh có Văn Xương/Văn Khúc? → Thông minh, có học. Có Tả Phù/Hữu Bật? → Được giúp đỡ.</p>
            <p>Có Kình Dương/Đà La? → Tính cách mạnh nhưng hay gặp trở ngại. Có Địa Không/Kiếp? → Tư duy siêu thoát.</p>
            <p className="text-[10px] italic">→ Xem lại: Chương 4 (Phụ Tinh)</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-secondary">Bước 4</span>
            <h4 className="font-semibold text-sm">Đọc Tứ Hóa</h4>
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
            <p>Năm Canh → Hóa Lộc ở Thái Dương, Hóa Quyền ở Vũ Khúc, Hóa Khoa ở Thiên Đồng, Hóa Kỵ ở Thái Âm.</p>
            <p>Tìm các sao này ở cung nào. Hóa Lộc ở Thái Dương mang tài lộc vào lĩnh vực mà cung chứa Thái Dương đại diện.</p>
            <p>Hóa Kỵ ở Thái Âm → Thái Âm ở cung nào? Lĩnh vực đó sẽ có lo lắng, vướng mắc suốt đời.</p>
            <p className="text-[10px] italic">→ Xem lại: Chương 5 (Tứ Hóa)</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-secondary">Bước 5</span>
            <h4 className="font-semibold text-sm">Đọc các cung quan trọng</h4>
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
            <p>Sau Mệnh, đọc tiếp: <strong>Quan Lộc</strong> (sự nghiệp), <strong>Tài Bạch</strong> (tài chính), <strong>Phu Thê</strong> (hôn nhân).</p>
            <p>Mỗi cung đọc giống cung Mệnh: chính tinh + phụ tinh + sát tinh + Tứ Hóa.</p>
            <p>Lưu ý tam phương tứ chính: cung Quan Lộc chịu ảnh hưởng từ cung tam hợp và đối cung.</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-secondary">Bước 6</span>
            <h4 className="font-semibold text-sm">Xem Đại Hạn hiện tại</h4>
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
            <p>Năm 2026, người sinh 1990 = 36 tuổi. Nếu Kim Tứ Cục → Đại Hạn bắt đầu từ tuổi 4.</p>
            <p>Đại Hạn thứ 4 (tuổi 34-43) → tìm cung thứ 4 theo chiều thuận từ Mệnh.</p>
            <p>Đọc cung Đại Hạn đó + Tứ Hóa Lưu Niên của năm Bính Ngọ (2026).</p>
            <p className="text-[10px] italic">→ Xem lại: Chương 6 (Đại Vận & Lưu Niên)</p>
          </div>
        </div>
      </div>

      {/* Summary framework */}
      <div className="bg-secondary border border-border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">Khung tổng hợp đọc lá số</h4>
        <div className="space-y-1 text-xs leading-relaxed">
          <div className="flex gap-2"><span className="font-mono text-muted-foreground">1.</span> Mệnh + Thân → bản chất con người</div>
          <div className="flex gap-2"><span className="font-mono text-muted-foreground">2.</span> Chính Tinh + độ sáng → năng lực cốt lõi</div>
          <div className="flex gap-2"><span className="font-mono text-muted-foreground">3.</span> Phụ Tinh + Sát Tinh → may mắn & thử thách</div>
          <div className="flex gap-2"><span className="font-mono text-muted-foreground">4.</span> Tứ Hóa → động lực & ám ảnh</div>
          <div className="flex gap-2"><span className="font-mono text-muted-foreground">5.</span> Các cung trọng yếu → tài, quan, phu thê</div>
          <div className="flex gap-2"><span className="font-mono text-muted-foreground">6.</span> Đại Hạn + Lưu Niên → thời điểm cụ thể</div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <p className="text-sm font-semibold mb-2">Sẵn sàng đọc lá số thật?</p>
        <p className="text-xs text-foreground-secondary mb-4">
          Hãy lập lá số của chính bạn và áp dụng 6 bước trên.
        </p>
        <Link
          href="/tu-vi/calculator"
          className="inline-block rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Lập Lá Số Của Bạn →
        </Link>
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
        <p className="text-sm text-foreground-secondary italic mt-1">{chapter.title.en}</p>
      </div>

      <chapter.Content />

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
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
