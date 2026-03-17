interface CaseHeroSectionProps {
  name: string
  birthDate: string
  birthTime?: string | null
  gender: string
  description?: string | null
  categories: string[]
  tags: string[]
}

export function CaseHeroSection({ name, birthDate, birthTime, gender, description, categories, tags }: CaseHeroSectionProps) {
  return (
    <div className="rounded-lg border bg-muted/30 p-8">
      <div className="flex flex-col items-center text-center md:flex-row md:text-left md:gap-8">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-4xl font-bold text-primary shrink-0">
          {name.charAt(0)}
        </div>
        <div className="mt-4 md:mt-0">
          <h1 className="text-3xl font-bold">{name}</h1>
          <p className="mt-1 text-muted-foreground">
            {gender === 'male' ? 'Male' : 'Female'} — Born {birthDate}
            {birthTime && ` at ${birthTime}`}
          </p>
          {description && <p className="mt-3 max-w-2xl">{description}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map(c => (
              <span key={c} className="rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{c}</span>
            ))}
            {tags.map(t => (
              <span key={t} className="rounded-full border px-3 py-1 text-sm">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
