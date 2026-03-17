import type { TimelineEvent } from '@/lib/bazi'

interface TimelineSectionProps {
  events: TimelineEvent[]
}

export function TimelineSection({ events }: TimelineSectionProps) {
  if (events.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Life Timeline</h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {events.map((event, i) => (
            <div key={i} className="relative pl-12">
              {/* Dot */}
              <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />

              <div className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-muted-foreground">{event.year}</span>
                      <span className="text-xs text-muted-foreground">(Age {event.age})</span>
                      <span className="rounded bg-muted px-2 py-0.5 text-xs">{event.category}</span>
                    </div>
                    <h3 className="mt-1 font-medium">{event.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  <div className="text-right text-xs space-y-1 shrink-0">
                    {event.annualPillar && (
                      <div><span className="text-muted-foreground">Annual:</span> {event.annualPillar}</div>
                    )}
                    {event.luckPillar && (
                      <div><span className="text-muted-foreground">Luck:</span> {event.luckPillar}</div>
                    )}
                    {event.starBadges && event.starBadges.length > 0 && (
                      <div className="flex gap-1 justify-end flex-wrap">
                        {event.starBadges.map(s => (
                          <span key={s} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {event.baziAnalysis && (
                  <p className="mt-2 text-xs italic text-muted-foreground border-t pt-2">{event.baziAnalysis}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
