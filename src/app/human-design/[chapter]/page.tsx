'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  HD_CHAPTERS,
  HD_CENTERS,
  CENTER_TYPE_LABELS,
  getChapterBySlug,
  getAdjacentChapters,
} from '@/lib/human-design-data'
import { BodygraphSvg } from '@/components/human-design/BodygraphSvg'
import { TimelineSvg } from '@/components/human-design/TimelineSvg'
import { SynthesisDiagram } from '@/components/human-design/SynthesisDiagram'
import { CenterEvolutionDiagram } from '@/components/human-design/CenterEvolutionDiagram'
import { CenterDetailPanel } from '@/components/human-design/CenterDetailCard'
import { TypeCards } from '@/components/human-design/TypeCard'
import { LineArchetypeStack } from '@/components/human-design/LineArchetypeStack'
import { ProfileMatrix } from '@/components/human-design/ProfileMatrix'
import { DualCalculationDiagram } from '@/components/human-design/DualCalculationDiagram'
import { NotSelfFlowDiagram } from '@/components/human-design/NotSelfFlowDiagram'

// ============================================================
// Chapter content sections
// ============================================================

function ChapterOrigins() {
  return (
    <div className="space-y-8">
      <Section
        title={{ vn: 'Dòng Thời Gian', en: 'Timeline' }}
        description={{
          vn: 'Human Design được Ra Uru Hu (Robert Alan Krakower) nhận qua trải nghiệm 8 ngày tại Ibiza, Tây Ban Nha, tháng 1 năm 1987. Sự kiện này trùng với Siêu tân tinh 1987A — siêu tân tinh gần nhất được quan sát trong hơn 400 năm và là sự kiện đầu tiên mà phát xạ neutrino được phát hiện trên Trái Đất.',
          en: 'Human Design was received by Ra Uru Hu (Robert Alan Krakower) during an 8-day experience in Ibiza, Spain, in January 1987. This event coincided with Supernova 1987A — the closest observed supernova in over 400 years and the first whose neutrino emissions were detected on Earth.',
        }}
      />
      <TimelineSvg />

      <Section
        title={{ vn: 'Tổng Hợp Bốn Truyền Thống', en: 'Synthesis of Four Traditions' }}
        description={{
          vn: 'Human Design tổng hợp bốn hệ thống cổ xưa: Kinh Dịch (toán học nhị phân), Kabbalah (cấu trúc mạng lưới), Chiêm Tinh phương Tây (tính toán thiên văn), và hệ thống Luân Xa Hindu (trung tâm năng lượng cơ thể). Mỗi truyền thống đóng góp ở mức độ sâu khác nhau.',
          en: 'Human Design synthesizes four ancient systems: the I Ching (binary mathematics), Kabbalah (network topology), Western Astrology (astronomical computation), and the Hindu Chakra system (body-mapped energy centers). Each tradition contributes at a different depth.',
        }}
      />
      <SynthesisDiagram />
    </div>
  )
}

function ChapterIChingGates() {
  return (
    <div className="space-y-8">
      <Section
        title={{ vn: '64 Cổng = 64 Quẻ', en: '64 Gates = 64 Hexagrams' }}
        description={{
          vn: 'Kinh Dịch cung cấp khung cấu trúc sâu nhất. 64 Cổng trong Bodygraph tương ứng 1:1 với 64 quẻ theo thứ tự Văn Vương. Tuy nhiên, sắp xếp trên Rave Mandala theo dãy Phục Hy (nhị phân) — quẻ đối nhau nằm cách 180°. Mỗi quẻ chiếm chính xác 5°37\'30" cung.',
          en: 'The I Ching provides the deepest structural scaffolding. The 64 Gates correspond 1:1 with the 64 hexagrams using King Wen sequence numbering. However, the arrangement on the Rave Mandala follows the Fu Xi binary sequence — complementary hexagrams sit 180° apart. Each hexagram occupies exactly 5°37\'30" of arc.',
        }}
      />
      <div className="rounded-lg border p-4 space-y-3">
        <div className="text-xs font-semibold text-muted-foreground">Điểm Khác Biệt Quan Trọng</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded bg-muted/50 p-3">
            <div className="font-semibold mb-1">Kinh Dịch truyền thống</div>
            <p>Hệ thống bói toán động — hào động biến quẻ này thành quẻ khác. Bản chất là về sự thay đổi.</p>
            <p className="text-muted-foreground italic mt-1">Dynamic oracular system — moving lines transform hexagrams. Essentially about change.</p>
          </div>
          <div className="rounded bg-muted/50 p-3">
            <div className="font-semibold mb-1">Human Design</div>
            <p>Dùng quẻ như mô tả tính cách cố định từ lúc sinh. Cơ chế biến đổi (hào động) bị loại bỏ hoàn toàn.</p>
            <p className="text-muted-foreground italic mt-1">Uses hexagrams as fixed personality descriptors determined at birth. Transformational mechanics entirely stripped away.</p>
          </div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>384 hào riêng biệt (64 × 6) được mô tả trong Rave I&apos;Ching — mỗi Cổng kích hoạt mang một giá trị hào cụ thể (vd: Gate 20.3 = Cổng 20, Hào 3).</p>
        <p className="mt-1">
          <Link href="/hexagrams" className="text-primary underline hover:no-underline">
            Xem 64 Quẻ Kinh Dịch →
          </Link>
        </p>
      </div>
    </div>
  )
}

function ChapterKabbalahBodygraph() {
  return (
    <div className="space-y-8">
      <Section
        title={{ vn: 'Bodygraph & Cây Sự Sống', en: 'Bodygraph & Tree of Life' }}
        description={{
          vn: 'Bodygraph trông giống Cây Sự Sống của Kabbalah — một mạng lưới các nút nối bằng đường dẫn. Tuy nhiên, sự tương ứng chủ yếu là về mặt thị giác: Cây có 10 sephiroth + 22 đường, Bodygraph có 9 Trung Tâm + 36 Kênh. Ra Uru Hu lấy khái niệm kiến trúc — mạng lưới năng lượng được ánh xạ lên cơ thể — chứ không phải logic nội tại của Kabbalah.',
          en: 'The Bodygraph resembles the Kabbalistic Tree of Life — a vertical network of nodes connected by paths. However, the correspondence is primarily visual: the Tree has 10 sephiroth + 22 paths, the Bodygraph has 9 Centers + 36 Channels. Ra took the architectural concept — a body-mapped energy network — not the tradition\'s internal logic.',
        }}
      />
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-2">Bodygraph — 9 Trung Tâm, 36 Kênh</div>
          <BodygraphSvg
            definedCenters={['head', 'throat', 'g', 'sacral']}
            showLabels={true}
            showChannels={true}
          />
        </div>
      </div>
      <div className="rounded-lg border p-4 text-sm">
        <div className="text-xs font-semibold text-muted-foreground mb-2">So Sánh Cấu Trúc / Structural Comparison</div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-semibold">Kabbalah</div>
            <ul className="mt-1 space-y-1 text-muted-foreground">
              <li>10 sephiroth (hoặc 11 với Da&apos;at)</li>
              <li>22 đường dẫn (= 22 chữ Hebrew)</li>
              <li>3 trụ cột: Từ Bi, Nghiêm Khắc, Cân Bằng</li>
              <li>4 Thế Giới (Atziluth → Asiyah)</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Human Design</div>
            <ul className="mt-1 space-y-1 text-muted-foreground">
              <li>9 Trung Tâm</li>
              <li>36 Kênh (= cặp Cổng I Ching)</li>
              <li>Không có cấu trúc 3 trụ</li>
              <li>Không có 4 Thế Giới</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChapterNineCenters() {
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      <Section
        title={{ vn: 'Từ 7 Luân Xa đến 9 Trung Tâm', en: 'From 7 Chakras to 9 Centers' }}
        description={{
          vn: 'Human Design cho rằng năm 1781 (trùng với phát hiện Thiên Vương Tinh), loài người đột biến từ "sinh vật 7 trung tâm" thành "sinh vật 9 trung tâm". Luân xa Tim chia thành Trung Tâm G + Tim/Ý Chí. Luân xa Đám Rối Thần Kinh chia thành Đám Rối TK + Lá Lách.',
          en: 'Human Design claims that in 1781 (coinciding with Uranus\'s discovery), humanity mutated from "seven-centered beings" to "nine-centered beings." The Heart Chakra split into G Center + Heart/Will. The Solar Plexus Chakra split into Solar Plexus + Spleen.',
        }}
      />
      <CenterEvolutionDiagram />

      <Section
        title={{ vn: 'Bodygraph Tương Tác', en: 'Interactive Bodygraph' }}
        description={{
          vn: 'Nhấn vào mỗi trung tâm để xem chi tiết. Mỗi trung tâm được phân loại theo chức năng: Áp lực, Động cơ, Nhận thức, Biểu đạt, hoặc Bản thể. Phân biệt quan trọng nhất: trung tâm được Xác Định (defined) phát ra năng lượng nhất quán, trung tâm Mở (undefined) tiếp nhận và khuếch đại năng lượng từ bên ngoài.',
          en: 'Click each center for details. Centers are classified as: Pressure, Motor, Awareness, Expression, or Identity. The critical distinction: Defined centers radiate consistent energy; Undefined centers receive and amplify external energy.',
        }}
      />

      {/* Center type legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {Object.entries(CENTER_TYPE_LABELS).map(([key, val]) => (
          <span key={key} className="px-2 py-1 rounded-full border" style={{ borderColor: val.color + '40', color: val.color }}>
            {val.vn} / {val.en}
          </span>
        ))}
      </div>

      <BodygraphSvg
        definedCenters={HD_CENTERS.map(c => c.id)}
        highlightCenter={selectedCenter}
        onCenterClick={(id) => setSelectedCenter(selectedCenter === id ? null : id)}
        showLabels={true}
        showChannels={true}
      />

      {selectedCenter && (
        <CenterDetailPanel
          centerId={selectedCenter}
          onClose={() => setSelectedCenter(null)}
        />
      )}
    </div>
  )
}

function ChapterAstrologyCalculation() {
  return (
    <div className="space-y-8">
      <Section
        title={{ vn: 'Tính Toán Kép', en: 'Dual Calculation' }}
        description={{
          vn: 'Human Design tính hai bộ 13 vị trí hành tinh: một lúc SINH (Personality — ý thức, vẽ đen) và một tại 88 độ cung Mặt Trời TRƯỚC khi sinh (Design — vô thức, vẽ đỏ, khoảng 88 ngày trước). Ra cho rằng thời điểm thứ hai đánh dấu khi "Tinh Thể Nhân Cách" nhập thai nhi. Tổng cộng 26 kích hoạt tạo nên Bodygraph.',
          en: 'Human Design computes two sets of 13 planetary positions: one at BIRTH (Personality — conscious, drawn in black) and one at exactly 88 degrees of solar arc BEFORE birth (Design — unconscious, drawn in red, ~88 days prior). Together, the 26 activations populate the Bodygraph.',
        }}
      />
      <DualCalculationDiagram />

      <div className="rounded-lg border p-4 text-sm space-y-2">
        <div className="text-xs font-semibold text-muted-foreground">Ràng Buộc 88° & Profile</div>
        <p className="text-xs">
          Mỗi hào trong một Cổng chiếm khoảng 0.9375°. Offset 88° tương đương ~3.87 hào dịch chuyển, nên Design luôn cách Personality 2 hoặc 3 hào. Điều này giới hạn chỉ có <span className="font-bold">12 Profile</span> hợp lệ từ 36 tổ hợp lý thuyết.
        </p>
        <p className="text-xs text-muted-foreground italic">
          Each line spans ~0.9375°. The 88° offset translates to ~3.87 lines of displacement, restricting Profile pairings to exactly 12 valid combinations out of 36 theoretical ones.
        </p>
      </div>
    </div>
  )
}

function ChapterFiveTypes() {
  return (
    <div className="space-y-8">
      <Section
        title={{ vn: 'Năm Loại Hình', en: 'Five Types' }}
        description={{
          vn: 'Loại Hình được xác định bởi Sacral (trung tâm năng lượng sống) và kết nối motor-đến-Cổ Họng. Sacral xác định → Generator. Sacral + motor đến Throat → Manifesting Generator. Không Sacral + motor đến Throat → Manifestor. Không Sacral, không motor đến Throat → Projector. Không trung tâm nào xác định → Reflector (~1%).',
          en: 'Type is determined by Sacral definition and motor-to-Throat connection. Defined Sacral → Generator. Sacral + motor to Throat → Manifesting Generator. No Sacral + motor to Throat → Manifestor. No Sacral, no motor to Throat → Projector. No centers defined → Reflector (~1%).',
        }}
      />
      <TypeCards />

      <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-2">
        <div className="text-xs font-semibold text-muted-foreground">Hiểu Lầm Phổ Biến / Common Misconception</div>
        <p className="text-xs">
          Hệ thống cho rằng ~70% nhân loại là Generator/MG nhưng sống như thể họ là Manifestor — cố gắng khởi xướng thay vì phản hồi — tạo ra thất vọng mãn tính.
        </p>
        <p className="text-xs text-muted-foreground italic">
          The system claims ~70% of humanity are Generators/MGs but live as if they were Manifestors — trying to initiate rather than respond — producing chronic frustration.
        </p>
      </div>
    </div>
  )
}

function ChapterLinesProfiles() {
  return (
    <div className="space-y-8">
      <Section
        title={{ vn: 'Sáu Hào — Sáu Nguyên Mẫu', en: 'Six Lines — Six Archetypes' }}
        description={{
          vn: 'Sáu hào của mỗi quẻ mang vai trò nguyên mẫu xuyên suốt tất cả 64 Cổng. Hào 1-3 (hạ quái) là quá trình cá nhân; Hào 4-6 (thượng quái) là quá trình liên nhân. Các hào đối xứng: 1↔4, 2↔5, 3↔6.',
          en: 'The six lines carry archetypal roles across all 64 Gates. Lines 1-3 (lower trigram) are personal process; Lines 4-6 (upper trigram) are transpersonal process. Mirror relationships: 1↔4, 2↔5, 3↔6.',
        }}
      />
      <LineArchetypeStack />

      <Section
        title={{ vn: 'Ma Trận 12 Profile', en: '12 Profile Matrix' }}
        description={{
          vn: '12 Profile được tạo từ cặp hào Ý thức (Mặt Trời Personality) và Vô thức (Mặt Trời Design). Do ràng buộc 88°, chỉ có 12/36 tổ hợp hợp lệ. Phân loại: Góc Phải (số phận cá nhân), Góc Trái (nghiệp liên nhân), và Giao Điểm (4/1 duy nhất — số phận cố định).',
          en: '12 Profiles formed by pairing the Personality Sun line with the Design Sun line. Due to the 88° constraint, only 12 of 36 combinations are valid. Classified as Right Angle (personal destiny), Left Angle (transpersonal karma), and Juxtaposition (the singular 4/1 — fixed fate).',
        }}
      />
      <ProfileMatrix />
    </div>
  )
}

function ChapterPhilosophy() {
  return (
    <div className="space-y-8">
      <Section
        title={{ vn: 'Not-Self & Giải Điều Kiện', en: 'Not-Self & Deconditioning' }}
        description={{
          vn: 'Not-Self là tổng hợp điều kiện hóa hấp thụ qua các trung tâm Mở — những khuôn mẫu, niềm tin và chiến lược mà ta nhầm là bản chất thật. Mỗi Loại Hình có chữ ký Not-Self riêng. Mỗi trung tâm Mở tạo ra câu hỏi Not-Self cụ thể. Giải pháp: giải điều kiện ~7 năm — nhất quán theo Strategy & Authority.',
          en: 'The Not-Self refers to accumulated conditioning absorbed through undefined centers — patterns, beliefs, and strategies mistaken for authentic nature. Each Type has a Not-Self signature. Each undefined center generates a specific Not-Self question. The remedy: ~7-year deconditioning through consistent Strategy & Authority.',
        }}
      />
      <NotSelfFlowDiagram />

      <Section
        title={{ vn: 'Nghịch Lý: Cơ Học & Tự Do', en: 'Paradox: Determinism & Liberation' }}
        description={{
          vn: 'Human Design là hệ thống tất định mạnh — Design cố định từ lúc sinh, không thể thay đổi. Nghịch lý: nó tự nhận là giải phóng. "Tự do" không phải là lựa chọn mà là sự sắp hàng — đầu hàng bản chất cơ học thay vì chống lại nó. Ra gọi đây là "tự do của sự không-lựa-chọn." Tâm trí bị truất ngôi khỏi vai trò ra quyết định và tái định vị thành "Quyền Bên Ngoài" — hữu ích để tư vấn người khác nhưng không đáng tin để chỉ đạo đời mình.',
          en: 'Human Design is strongly deterministic — your Design is fixed at birth and cannot be altered. The paradox: it presents itself as liberating. The "freedom" offered is not choice but alignment — surrendering to one\'s mechanical nature rather than fighting it. Ra called this "the freedom of choicelessness." The mind is dethroned as decision-maker and repositioned as "Outer Authority."',
        }}
      />

      <div className="rounded-lg border-2 border-dashed p-6 text-center space-y-2">
        <div className="text-3xl opacity-30">∞</div>
        <p className="text-sm font-medium">
          &ldquo;Mọi thứ đều được xác định, nhưng quan sát cơ chế lại giải phóng.&rdquo;
        </p>
        <p className="text-xs text-muted-foreground italic">
          &ldquo;Everything is determined, yet watching the mechanics liberates.&rdquo;
        </p>
      </div>

      <Section
        title={{ vn: 'Rave Cosmology', en: 'Rave Cosmology' }}
        description={{
          vn: 'Vũ trụ học của Ra: "Biverse" gồm hai lực nguyên thủy — Vật Chất (Atomics) và Vật Chất Tối. Big Bang tạo ra "tinh thể ý thức" vỡ vụn: Design Crystal (thể xác) và Personality Crystal (ý thức tự phản ánh), được giữ bởi Magnetic Monopole. Neutrino từ các ngôi sao mang thông tin qua các hành tinh và in dấu lên tinh thể tại hai thời điểm then chốt.',
          en: 'Ra\'s cosmology: a "Biverse" of two primordial forces — matter (Atomics) and Dark Matter. The Big Bang produced shattered "crystals of consciousness": Design Crystals (body) and Personality Crystals (self-reflective awareness), held by a Magnetic Monopole. Neutrinos from stars carry information filtered through planets and imprint these crystals at two key moments.',
        }}
      />
    </div>
  )
}

// ============================================================
// Shared components
// ============================================================

function Section({
  title,
  description,
}: {
  title: { vn: string; en: string }
  description: { vn: string; en: string }
}) {
  return (
    <div>
      <h2 className="text-lg font-bold">{title.vn}</h2>
      <p className="text-xs text-muted-foreground italic mb-2">{title.en}</p>
      <p className="text-sm leading-relaxed">{description.vn}</p>
      <p className="text-xs text-muted-foreground italic mt-1 leading-relaxed">{description.en}</p>
    </div>
  )
}

// ============================================================
// Chapter content map
// ============================================================

const CHAPTER_CONTENT: Record<string, React.ComponentType> = {
  origins: ChapterOrigins,
  'iching-gates': ChapterIChingGates,
  'kabbalah-bodygraph': ChapterKabbalahBodygraph,
  'nine-centers': ChapterNineCenters,
  'astrology-calculation': ChapterAstrologyCalculation,
  'five-types': ChapterFiveTypes,
  'lines-profiles': ChapterLinesProfiles,
  philosophy: ChapterPhilosophy,
}

// ============================================================
// Main page
// ============================================================

export default function ChapterPage() {
  const params = useParams()
  const slug = params.chapter as string
  const chapter = getChapterBySlug(slug)
  const { prev, next } = getAdjacentChapters(slug)

  if (!chapter) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy chương</h1>
        <p className="text-muted-foreground mt-2">Chapter not found</p>
        <Link href="/human-design" className="text-primary underline mt-4 inline-block">
          ← Quay lại
        </Link>
      </div>
    )
  }

  const Content = CHAPTER_CONTENT[slug]

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/human-design" className="hover:text-foreground transition-colors">
          Human Design
        </Link>
        <span>/</span>
        <span>Chương {chapter.order}</span>
      </div>

      {/* Chapter header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: chapter.color + '18', color: chapter.color }}
          >
            {chapter.icon}
          </div>
          <span className="text-sm font-mono text-muted-foreground">
            Chương {String(chapter.order).padStart(2, '0')}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">{chapter.title.vn}</h1>
        <p className="text-muted-foreground mt-1 text-sm italic">{chapter.title.en}</p>
        <p className="text-muted-foreground mt-1 text-sm">{chapter.subtitle.vn}</p>
      </div>

      {/* Chapter sidebar — chapter list */}
      <div className="flex flex-wrap gap-1 mb-8">
        {HD_CHAPTERS.map((ch) => (
          <Link
            key={ch.slug}
            href={`/human-design/${ch.slug}`}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              ch.slug === slug
                ? 'border-foreground bg-foreground text-background font-medium'
                : 'border-border hover:bg-muted'
            }`}
          >
            {ch.order}. {ch.title.vn}
          </Link>
        ))}
      </div>

      {/* Content */}
      {Content ? <Content /> : <p className="text-muted-foreground">Nội dung đang được xây dựng...</p>}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t">
        {prev ? (
          <Link href={`/human-design/${prev.slug}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{prev.title.vn}</span>
              <span className="sm:hidden">Trước</span>
            </Button>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link href={`/human-design/${next.slug}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <span className="hidden sm:inline">{next.title.vn}</span>
              <span className="sm:hidden">Tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <Link href="/human-design">
            <Button variant="ghost" size="sm" className="gap-1">
              Về trang tổng hợp
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
