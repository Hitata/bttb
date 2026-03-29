'use client'

import { HD_CENTERS, CENTER_TYPE_LABELS, getChannelsForCenter, type HdCenter } from '@/lib/human-design-data'
import { BodygraphSvg } from './BodygraphSvg'

export function CenterDetailPanel({
  centerId,
  onClose,
}: {
  centerId: string
  onClose: () => void
}) {
  const center = HD_CENTERS.find(c => c.id === centerId)
  if (!center) return null

  const channels = getChannelsForCenter(centerId)

  return (
    <div className="rounded-lg border p-4 text-sm" style={{ borderColor: center.color + '40' }}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-lg" style={{ color: center.color }}>{center.vn}</div>
          <div className="text-xs text-muted-foreground italic">{center.en}</div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">
          ✕
        </button>
      </div>

      <div className="flex gap-4">
        <div className="w-20 shrink-0">
          <BodygraphSvg
            definedCenters={[centerId]}
            highlightCenter={centerId}
            showLabels={false}
            showChannels={false}
            className="max-w-[70px]"
          />
        </div>

        <div className="space-y-3 flex-1">
          {/* Types */}
          <div className="flex gap-1.5 flex-wrap">
            {center.types.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-full border"
                style={{ borderColor: CENTER_TYPE_LABELS[t].color + '40', color: CENTER_TYPE_LABELS[t].color }}
              >
                {CENTER_TYPE_LABELS[t].vn} / {CENTER_TYPE_LABELS[t].en}
              </span>
            ))}
          </div>

          {/* Bio */}
          <div className="text-xs text-muted-foreground">
            Sinh học: {center.biologicalCorrelation}
          </div>
          {center.chakraOrigin && (
            <div className="text-xs text-muted-foreground">
              Luân xa gốc: {center.chakraOrigin}
            </div>
          )}

          {/* Defined vs Undefined */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded border p-2">
              <div className="text-[10px] font-semibold text-muted-foreground mb-1">Defined (Xác Định)</div>
              <p className="text-xs">{center.definedTheme.vn}</p>
              <p className="text-[10px] text-muted-foreground italic">{center.definedTheme.en}</p>
            </div>
            <div className="rounded border p-2">
              <div className="text-[10px] font-semibold text-muted-foreground mb-1">Undefined (Mở)</div>
              <p className="text-xs">{center.undefinedTheme.vn}</p>
              <p className="text-[10px] text-muted-foreground italic">{center.undefinedTheme.en}</p>
            </div>
          </div>

          {/* Not-Self Question */}
          <div className="rounded bg-muted/50 p-2">
            <div className="text-[10px] font-semibold text-muted-foreground mb-0.5">Câu Hỏi Not-Self</div>
            <p className="text-xs font-medium">{center.notSelfQuestion.vn}</p>
            <p className="text-[10px] text-muted-foreground italic">{center.notSelfQuestion.en}</p>
          </div>

          {/* Channels */}
          {channels.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-muted-foreground mb-1">Kênh kết nối ({channels.length})</div>
              <div className="flex flex-wrap gap-1">
                {channels.slice(0, 6).map((ch) => (
                  <span key={ch.id} className="text-[10px] px-1.5 py-0.5 rounded bg-muted">
                    {ch.gates.join('-')} {ch.vn}
                  </span>
                ))}
                {channels.length > 6 && (
                  <span className="text-[10px] text-muted-foreground">+{channels.length - 6} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function InteractiveCenters() {
  return null // rendered inline in the chapter page
}
