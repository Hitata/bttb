'use client'

import type { Palace } from '@/lib/tu-vi/types'
import { BRIGHTNESS_LABELS } from '@/lib/tu-vi/star-brightness'
import { STAR_BY_ID } from '@/lib/tu-vi/star-descriptions'

const TU_HOA_LABELS: Record<string, { name: string; desc: string }> = {
  loc: { name: 'Hóa Lộc', desc: 'Tài lộc, may mắn, thuận lợi' },
  quyen: { name: 'Hóa Quyền', desc: 'Quyền lực, chủ động, kiểm soát' },
  khoa: { name: 'Hóa Khoa', desc: 'Danh tiếng, học vấn, thanh cao' },
  ky: { name: 'Hóa Kỵ', desc: 'Trở ngại, thị phi, chấp niệm' },
}

export function PalaceDetail({
  palace,
  isMenh,
  isThan,
  onClose,
}: {
  palace: Palace
  isMenh: boolean
  isThan: boolean
  onClose?: () => void
}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm flex items-center gap-1.5">
            {palace.name}
            {isMenh && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">Mệnh</span>}
            {isThan && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">Thân</span>}
          </h3>
          <p className="text-xs text-muted-foreground italic">{palace.nameEn}</p>
        </div>
        <span className="text-xs text-muted-foreground">{palace.earthlyBranch}</span>
      </div>

      {/* Tuần / Triệt badges */}
      {(palace.isTuan || palace.isTriet) && (
        <div className="flex gap-2">
          {palace.isTuan && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-600 font-medium">
              Tuần — sao bị giảm lực
            </span>
          )}
          {palace.isTriet && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 font-medium">
              Triệt — sao bị triệt tiêu
            </span>
          )}
        </div>
      )}

      {/* Đại Hạn */}
      {palace.daiHan && (
        <div className="text-xs text-muted-foreground">
          Đại Hạn: {palace.daiHan.startAge}–{palace.daiHan.endAge} tuổi
        </div>
      )}

      {/* Domain */}
      <p className="text-sm leading-relaxed">{palace.domain}</p>

      {/* Stars */}
      {palace.stars.length > 0 ? (
        <div className="space-y-3">
          <div className="text-xs font-medium text-muted-foreground">
            Sao trong cung ({palace.stars.length})
          </div>
          {palace.stars.map(star => {
            const info = STAR_BY_ID[star.id]
            const brightness = BRIGHTNESS_LABELS[star.brightness]
            const isTuViGroup = star.group === 'tuVi'

            return (
              <div key={star.id} className="rounded-lg border p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: isTuViGroup ? '#c2785c' : '#2a9d8f' }}
                    >
                      {star.name}
                    </span>
                    <span className="text-xs text-muted-foreground italic">{star.nameEn}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">{brightness.vi}</span>
                    {brightness.symbol && <span className="text-xs text-amber-500">{brightness.symbol}</span>}
                  </div>
                </div>

                <div className="text-[10px] text-muted-foreground">
                  {star.element} · {isTuViGroup ? 'Tử Vi group' : 'Thiên Phủ group'}
                </div>

                {info && (
                  <>
                    <p className="text-xs leading-relaxed">{info.nature}</p>
                    <div className="flex flex-wrap gap-1">
                      {info.keywords.split(', ').map(kw => (
                        <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-muted">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {star.tuHoa && TU_HOA_LABELS[star.tuHoa] && (
                  <div className="text-xs px-2 py-1 rounded bg-primary/5 border border-primary/20">
                    <span className="font-medium text-primary">{TU_HOA_LABELS[star.tuHoa].name}</span>
                    <span className="text-muted-foreground ml-1.5">{TU_HOA_LABELS[star.tuHoa].desc}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">Không có sao chính trong cung này</p>
      )}

      {onClose && (
        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Đóng
        </button>
      )}
    </div>
  )
}
