'use client'

import { useState } from 'react'
import type { CastingResponse, HexagramData } from '@/lib/iching/types'

interface PromptGeneratorProps {
  result: CastingResponse
  primaryData: HexagramData | null
  changedData: HexagramData | null
  nuclearData: HexagramData | null
}

const LINE_POSITION_NAMES = ['Sơ hào', 'Nhị hào', 'Tam hào', 'Tứ hào', 'Ngũ hào', 'Thượng hào']

function getLineDescription(value: number): string {
  switch (value) {
    case 9: return 'Lão Dương (Old Yang — biến)'
    case 7: return 'Thiếu Dương (Young Yang — tĩnh)'
    case 8: return 'Thiếu Âm (Young Yin — tĩnh)'
    case 6: return 'Lão Âm (Old Yin — biến)'
    default: return String(value)
  }
}

function buildPrompt(
  result: CastingResponse,
  primaryData: HexagramData,
  changedData: HexagramData | null,
  nuclearData: HexagramData | null,
): string {
  const { lines, primary, changed } = result

  // Lines section (bottom to top, 1-indexed)
  const linesArray = lines.join(', ')
  const linesDetail = lines
    .map((value, index) => {
      const pos = index + 1
      const posName = LINE_POSITION_NAMES[index]
      return `- Hào ${pos} (${posName}): ${value} — ${getLineDescription(value)}`
    })
    .join('\n')

  // Moving lines (1-indexed positions with value 6 or 9)
  const movingLines = lines
    .map((value, index) => (value === 6 || value === 9 ? `Hào ${index + 1}` : null))
    .filter(Boolean)
  const movingLinesStr = movingLines.length > 0 ? movingLines.join(', ') : 'Không có'

  // Nuclear hexagram name
  const nuclearNameVi = nuclearData ? nuclearData.nameVi : `#${primary.nuclearNumber}`

  // Primary hexagram section
  const primarySection = [
    `#${primary.number} ${primary.name.vi} (${primary.name.zh}) — ${primary.name.en}`,
    `Cấu trúc: ${primaryData.structure}`,
    `Hỗ quái: #${primary.nuclearNumber} ${nuclearNameVi}`,
  ].join('\n')

  // Changed hexagram section
  let changedSection: string
  if (changed && changedData) {
    changedSection = `#${changed.number} ${changed.name.vi} (${changed.name.zh}) — ${changed.name.en}`
  } else if (changed) {
    changedSection = `#${changed.number} ${changed.name.vi} (${changed.name.zh}) — ${changed.name.en}`
  } else {
    changedSection = 'Không có biến quái (tất cả hào đều tĩnh)'
  }

  return `Tôi vừa gieo quẻ Kinh Dịch bằng phép gieo đồng tiền (擲錢法).

## Kết quả Gieo Quẻ

Các hào (từ dưới lên): [${linesArray}]
${linesDetail}

Hào biến: ${movingLinesStr}

## Bản Quái (Primary Hexagram)
${primarySection}

## Biến Quái (Changed Hexagram)
${changedSection}

---

Hãy dùng skill iching-foundation để luận giải đầy đủ theo quy trình 7 bước:
1. Xác định Quẻ
2. Phân tích Cấu trúc (trigram, Ngũ Hành, vị trí hào)
3. Phân tích Hào biến
4. Luận giải Ba lớp (Nhà Vật lý / Minh triết / Cố vấn)
5. Bản đồ Xu hướng (Primary → Changed → Nuclear)
6. Đánh giá Cân bằng
7. Tổng hợp`
}

export function PromptGenerator({
  result,
  primaryData,
  changedData,
  nuclearData,
}: PromptGeneratorProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!primaryData) return
    const prompt = buildPrompt(result, primaryData, changedData, nuclearData)
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      disabled={!primaryData}
      style={{
        background: 'none',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '12px 32px',
        fontSize: '13px',
        color: 'rgba(255,255,255,0.45)',
        cursor: primaryData ? 'pointer' : 'not-allowed',
        minHeight: '48px',
        WebkitTapHighlightColor: 'transparent',
        opacity: primaryData ? 1 : 0.5,
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        if (primaryData) {
          ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'
        }
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.background = 'none'
      }}
    >
      {copied ? 'Copied!' : 'Copy prompt for Claude'}
    </button>
  )
}

export default PromptGenerator
