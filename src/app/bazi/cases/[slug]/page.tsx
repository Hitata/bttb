import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import { CaseHeroSection } from '@/components/bazi/cases/CaseHeroSection'
import { BaziChartDisplay } from '@/components/bazi/cases/BaziChartDisplay'
import { TraitsGrid } from '@/components/bazi/cases/TraitsGrid'
import { TimelineSection } from '@/components/bazi/cases/TimelineSection'
import { LuckPillarsSection } from '@/components/bazi/cases/LuckPillarsSection'
import { FAQSection } from '@/components/bazi/cases/FAQSection'
import type { BaziResult, TraitItem, TimelineEvent, DaiVanCycle, FAQItem } from '@/lib/bazi'

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const baziCase = await prisma.baziCase.findUnique({
    where: { slug },
  })

  if (!baziCase || !baziCase.isPublished) notFound()

  const chartData: BaziResult = JSON.parse(baziCase.chartData)
  const traits: TraitItem[] = JSON.parse(baziCase.traits)
  const timeline: TimelineEvent[] = JSON.parse(baziCase.timeline)
  const luckPillars: DaiVanCycle[] = JSON.parse(baziCase.luckPillars)
  const faq: FAQItem[] = JSON.parse(baziCase.faq)
  const categories: string[] = JSON.parse(baziCase.categories)
  const tags: string[] = JSON.parse(baziCase.tags)

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-10">
      <CaseHeroSection
        name={baziCase.name}
        birthDate={baziCase.birthDate}
        birthTime={baziCase.birthTime}
        gender={baziCase.gender}
        description={baziCase.description}
        categories={categories}
        tags={tags}
      />

      <BaziChartDisplay tuTru={chartData.tutru} />

      <TraitsGrid traits={traits} />

      <LuckPillarsSection
        cycles={luckPillars.length > 0 ? luckPillars : chartData.daivan.cycles}
        startAge={chartData.daivan.startAge}
      />

      <TimelineSection events={timeline} />

      <FAQSection items={faq} />
    </div>
  )
}
