import type { TraitItem } from '@/lib/bazi'

interface TraitsGridProps {
  traits: TraitItem[]
}

function DotRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`h-2.5 w-2.5 rounded-full ${i < value ? 'bg-primary' : 'bg-muted'}`}
        />
      ))}
    </div>
  )
}

export function TraitsGrid({ traits }: TraitsGridProps) {
  if (traits.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Key Traits</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {traits.map((trait, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{trait.name}</h3>
              <DotRating value={trait.strength} />
            </div>
            <p className="text-sm text-muted-foreground">{trait.description}</p>
            {trait.tenGods && trait.tenGods.length > 0 && (
              <div className="mt-2 flex gap-1">
                {trait.tenGods.map(tg => (
                  <span key={tg} className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{tg}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
