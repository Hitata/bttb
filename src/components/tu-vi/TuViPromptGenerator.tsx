'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { TuViChart } from '@/lib/tu-vi/types'
import { BRIGHTNESS_LABELS } from '@/lib/tu-vi/star-brightness'

const TU_HOA_LABELS: Record<string, string> = {
  loc: 'Hóa Lộc',
  quyen: 'Hóa Quyền',
  khoa: 'Hóa Khoa',
  ky: 'Hóa Kỵ',
}

function generatePromptText(chart: TuViChart): string {
  const palaceLines = chart.palaces
    .map(p => {
      const starText = p.stars.length > 0
        ? p.stars.map(s => {
            const b = BRIGHTNESS_LABELS[s.brightness]
            const tuHoa = s.tuHoa ? ` [${TU_HOA_LABELS[s.tuHoa]}]` : ''
            return `    ${s.name} (${s.nameEn}) — ${b.vi}${tuHoa}`
          }).join('\n')
        : '    (trống)'
      return `  ${p.name} (${p.nameEn}) — ${p.earthlyBranch}\n${starText}`
    })
    .join('\n\n')

  const tuHoaLines = chart.tuHoa
    .map(th => `  ${TU_HOA_LABELS[th.type]}: ${th.starName}`)
    .join('\n')

  return `╔══════════════════════════════════════════╗
║     TỬ VI ĐẨU SỐ · LÁ SỐ CHÍNH TINH    ║
╚══════════════════════════════════════════╝

Name: ${chart.input.name}
Birth: ${chart.input.year}-${String(chart.input.month).padStart(2, '0')}-${String(chart.input.day).padStart(2, '0')} ${String(chart.input.hour).padStart(2, '0')}:${String(chart.input.minute).padStart(2, '0')} ${chart.input.timezone}
Gender: ${chart.input.gender}
Lunar: ${chart.lunar.lunarYear}/${chart.lunar.lunarMonth}/${chart.lunar.lunarDay}${chart.lunar.isLeapMonth ? ' (nhuận)' : ''}

┌─ MỆNH CỤC ─────────────────────────────┐
│  ${chart.profile.cucName} (${chart.profile.menhElement})
│  Năm: ${chart.profile.yearStem} ${chart.profile.yearBranch}
└──────────────────────────────────────────┘

┌─ TỨ HÓA ────────────────────────────────┐
${tuHoaLines}
└──────────────────────────────────────────┘

┌─ 12 CUNG ────────────────────────────────┐
${palaceLines}
└──────────────────────────────────────────┘

Scope: Lá số Chính Tinh — 14 major stars + Tứ Hóa only. Minor stars (Phụ Tinh) not included.

Please interpret this Tử Vi chart. Focus on:
1. Mệnh (Destiny) palace — personality, life direction
2. Quan Lộc (Career) palace — career path, strengths
3. Tài Bạch (Wealth) palace — financial tendencies
4. Phu Thê (Marriage) palace — relationships
5. Key star combinations and Tứ Hóa effects
6. Overall chart pattern and advice`
}

export function TuViPromptGenerator({ chart }: { chart: TuViChart }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = generatePromptText(chart)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={`transition-colors duration-150 ${copied ? 'bg-primary text-primary-foreground' : ''}`}
    >
      {copied ? 'Đã sao chép ✓' : 'Copy Prompt'}
    </Button>
  )
}
