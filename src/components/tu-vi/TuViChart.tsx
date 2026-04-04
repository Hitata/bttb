'use client'

import type { Palace, Star } from '@/lib/tu-vi/types'
import { BRIGHTNESS_LABELS } from '@/lib/tu-vi/star-brightness'

// 12-palace square grid layout (4×4 with center 2×2 for birth info)
// Earthly Branch positions map to grid cells:
// Row 0: Tỵ(5) Ngọ(6) Mùi(7) Thân(8)
// Row 1: Thìn(4) [center] [center] Dậu(9)
// Row 2: Mão(3) [center] [center] Tuất(10)
// Row 3: Dần(2) Sửu(1) Tý(0) Hợi(11)

const GRID_POSITIONS: Record<number, { row: number; col: number }> = {
  5:  { row: 0, col: 0 }, // Tỵ
  6:  { row: 0, col: 1 }, // Ngọ
  7:  { row: 0, col: 2 }, // Mùi
  8:  { row: 0, col: 3 }, // Thân
  4:  { row: 1, col: 0 }, // Thìn
  9:  { row: 1, col: 3 }, // Dậu
  3:  { row: 2, col: 0 }, // Mão
  10: { row: 2, col: 3 }, // Tuất
  2:  { row: 3, col: 0 }, // Dần
  1:  { row: 3, col: 1 }, // Sửu
  0:  { row: 3, col: 2 }, // Tý
  11: { row: 3, col: 3 }, // Hợi
}

const TU_HOA_LABELS: Record<string, string> = {
  loc: 'Lộc',
  quyen: 'Quyền',
  khoa: 'Khoa',
  ky: 'Kỵ',
}

function StarBadge({ star }: { star: Star }) {
  const brightness = BRIGHTNESS_LABELS[star.brightness]
  const isTuViGroup = star.group === 'tuVi'

  return (
    <div className="flex items-center gap-0.5">
      <span
        className="text-[9px] sm:text-[10px] font-medium leading-tight"
        style={{ color: isTuViGroup ? '#c2785c' : '#2a9d8f' }}
      >
        {star.name}
      </span>
      {brightness.symbol && (
        <span className="text-[8px] text-amber-500">{brightness.symbol}</span>
      )}
      {star.brightness === 'ham' && (
        <span className="text-[8px] text-muted-foreground">○</span>
      )}
      {star.tuHoa && (
        <span className="text-[7px] sm:text-[8px] px-0.5 rounded bg-primary/10 text-primary font-medium">
          {TU_HOA_LABELS[star.tuHoa]}
        </span>
      )}
    </div>
  )
}

function PalaceCell({
  palace,
  isSelected,
  isMenh,
  isThan,
  onClick,
}: {
  palace: Palace
  isSelected: boolean
  isMenh: boolean
  isThan: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-full h-full p-1.5 sm:p-2 text-left border transition-colors
        ${isSelected ? 'bg-primary/5 border-primary/40' : 'border-border/60 hover:bg-muted/50'}
      `}
    >
      {/* Palace name + branch */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] sm:text-xs font-semibold leading-tight">
          {palace.name}
          {isMenh && <span className="text-primary ml-0.5">●</span>}
          {isThan && <span className="text-amber-500 ml-0.5">◐</span>}
        </span>
        <span className="text-[8px] text-muted-foreground">{palace.earthlyBranch}</span>
      </div>

      {/* Stars */}
      <div className="space-y-0">
        {palace.stars.map(star => (
          <StarBadge key={star.id} star={star} />
        ))}
      </div>
    </button>
  )
}

export function TuViChartGrid({
  palaces,
  menhIndex,
  thanIndex,
  selectedPalace,
  onPalaceClick,
  centerContent,
}: {
  palaces: readonly Palace[]
  menhIndex: number
  thanIndex: number
  selectedPalace: number | null
  onPalaceClick: (index: number) => void
  centerContent?: React.ReactNode
}) {
  // Build a map from branch position → palace index
  const branchToPalaceIndex = new Map<number, number>()
  palaces.forEach((p, i) => branchToPalaceIndex.set(p.position, i))

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Scope label */}
      <div className="text-[10px] text-muted-foreground text-center mb-2">
        Lá số Chính Tinh (14 sao chính + Tứ Hóa)
      </div>

      <div className="grid grid-cols-4 grid-rows-4 gap-0 border rounded-lg overflow-hidden aspect-square">
        {/* Render 4×4 grid */}
        {Array.from({ length: 4 }, (_, row) =>
          Array.from({ length: 4 }, (_, col) => {
            // Center 2×2 (row 1-2, col 1-2)
            if ((row === 1 || row === 2) && (col === 1 || col === 2)) {
              // Only render center content at (1,1)
              if (row === 1 && col === 1) {
                return (
                  <div
                    key="center"
                    className="col-span-2 row-span-2 flex items-center justify-center p-3 border"
                    style={{ gridColumn: '2 / 4', gridRow: '2 / 4' }}
                  >
                    {centerContent}
                  </div>
                )
              }
              return null // Other center cells handled by colspan/rowspan
            }

            // Find which branch position maps to this grid cell
            const branchIndex = Object.entries(GRID_POSITIONS).find(
              ([, pos]) => pos.row === row && pos.col === col
            )?.[0]

            if (branchIndex === undefined) return null

            const palaceIdx = branchToPalaceIndex.get(Number(branchIndex))
            if (palaceIdx === undefined) return null

            const palace = palaces[palaceIdx]

            return (
              <PalaceCell
                key={branchIndex}
                palace={palace}
                isSelected={selectedPalace === palaceIdx}
                isMenh={palaceIdx === menhIndex}
                isThan={palaceIdx === thanIndex}
                onClick={() => onPalaceClick(palaceIdx)}
              />
            )
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 text-[9px] text-muted-foreground">
        <span><span style={{ color: '#c2785c' }}>■</span> Tử Vi group</span>
        <span><span style={{ color: '#2a9d8f' }}>■</span> Thiên Phủ group</span>
        <span>● Mệnh</span>
        <span>◐ Thân</span>
      </div>
    </div>
  )
}
