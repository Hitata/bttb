import { prisma } from '@/lib/prisma'
import { CaseCard } from '@/components/bazi/cases/CaseCard'

export const dynamic = 'force-dynamic'

export default async function CasesPage() {
  const cases = await prisma.baziCase.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    select: {
      slug: true,
      name: true,
      birthDate: true,
      gender: true,
      description: true,
      tags: true,
    },
  })

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Celebrity Bazi Cases</h1>
      <p className="text-muted-foreground mb-8">
        Explore detailed Four Pillars analyses of notable figures.
      </p>

      {cases.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No cases published yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cases.map(c => (
            <CaseCard
              key={c.slug}
              slug={c.slug}
              name={c.name}
              birthDate={c.birthDate}
              gender={c.gender}
              description={c.description}
              tags={JSON.parse(c.tags)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
