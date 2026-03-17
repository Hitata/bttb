import Link from 'next/link'

interface CaseCardProps {
  slug: string
  name: string
  birthDate: string
  gender: string
  description?: string | null
  tags: string[]
}

export function CaseCard({ slug, name, birthDate, gender, description, tags }: CaseCardProps) {
  return (
    <Link
      href={`/bazi/cases/${slug}`}
      className="block rounded-lg border p-6 hover:bg-muted/50 transition-colors"
    >
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {gender === 'male' ? 'Nam' : 'Nữ'} — {birthDate}
      </p>
      {description && (
        <p className="mt-2 text-sm line-clamp-2">{description}</p>
      )}
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {tags.map(tag => (
            <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs">{tag}</span>
          ))}
        </div>
      )}
    </Link>
  )
}
