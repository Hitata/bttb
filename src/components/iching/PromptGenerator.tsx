'use client'

import { useState, useEffect } from 'react'
import type { CastingResponse, HexagramData } from '@/lib/iching/types'

interface BaziReadingSummary {
  id: string
  name: string
  gender: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number | null
  birthMinute: number | null
}

interface BaziFullReading extends BaziReadingSummary {
  result: {
    dayMasterIndex: number
    tutru: {
      nhatTru: { can: string; chi: string; canNguHanh: string; chiNguHanh: string }
    }
    daivan: {
      startAge: number
      cycles: Array<{
        startAge: number
        startYear: number
        can: string
        chi: string
        thapThan: { code: string; name: string }
      }>
      currentYear: {
        year: number
        can: string
        chi: string
        yearCanNguHanh: string
        yearChiNguHanh: string
        yearCanThapThan: { code: string; name: string }
      }
    }
  }
}

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
  baziReading?: BaziFullReading | null,
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

  // Bazi section
  let baziSection = ''
  if (baziReading) {
    const timeStr = baziReading.birthHour != null
      ? ` ${String(baziReading.birthHour).padStart(2, '0')}:${String(baziReading.birthMinute ?? 0).padStart(2, '0')}`
      : ''

    const r = baziReading.result
    const nhatTru = r?.tutru?.nhatTru
    const daivan = r?.daivan

    // Find current đại vận (the cycle whose startYear <= current year)
    const currentYear = new Date().getFullYear()
    let currentDaiVan = ''
    if (daivan?.cycles) {
      const sorted = [...daivan.cycles].sort((a, b) => b.startYear - a.startYear)
      const active = sorted.find(c => c.startYear <= currentYear)
      if (active) {
        const age = currentYear - baziReading.birthYear
        currentDaiVan = `\n- Đại vận hiện tại: ${active.can} ${active.chi} (từ tuổi ${active.startAge}, năm ${active.startYear}) — ${active.thapThan.name} (${active.thapThan.code})`
      }
    }

    // Lưu niên (current year pillar)
    let luuNien = ''
    if (daivan?.currentYear) {
      const cy = daivan.currentYear
      luuNien = `\n- Lưu niên ${cy.year}: ${cy.can} ${cy.chi} — ${cy.yearCanNguHanh} ${cy.yearChiNguHanh} — ${cy.yearCanThapThan.name} (${cy.yearCanThapThan.code})`
    }

    // Nhật chủ (Day Master)
    let nhatChu = ''
    if (nhatTru) {
      nhatChu = `\n- Nhật chủ: ${nhatTru.can} ${nhatTru.chi} (${nhatTru.canNguHanh} / ${nhatTru.chiNguHanh})`
    }

    baziSection = `

## Bát Tự người hỏi (Querent's Birth Chart)
- Tên: ${baziReading.name}
- Giới tính: ${baziReading.gender === 'male' ? 'Nam' : 'Nữ'}
- Ngày sinh: ${baziReading.birthDay}/${baziReading.birthMonth}/${baziReading.birthYear}${timeStr}${nhatChu}${currentDaiVan}${luuNien}

Hãy dùng thông tin Bát Tự này để phân tích mối quan hệ Ngũ Hành giữa quẻ và mệnh của người hỏi (đặc biệt nhật chủ, đại vận hiện tại, và lưu niên), cho lời khuyên cá nhân hóa.`
  }

  return `Tôi vừa gieo quẻ Kinh Dịch bằng phép gieo đồng tiền (擲錢法).

## Kết quả Gieo Quẻ

Các hào (từ dưới lên): [${linesArray}]
${linesDetail}

Hào biến: ${movingLinesStr}

## Bản Quái (Primary Hexagram)
${primarySection}

## Biến Quái (Changed Hexagram)
${changedSection}${baziSection}

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
  const [showPrompt, setShowPrompt] = useState(false)
  const [baziReadings, setBaziReadings] = useState<BaziReadingSummary[]>([])
  const [selectedBazi, setSelectedBazi] = useState<BaziFullReading | null>(null)

  useEffect(() => {
    fetch('/api/bazi/readings')
      .then(res => res.json())
      .then((data: BaziReadingSummary[]) => setBaziReadings(data))
      .catch(() => {})
  }, [])

  const prompt = primaryData
    ? buildPrompt(result, primaryData, changedData, nuclearData, selectedBazi)
    : ''

  const handleCopy = async () => {
    if (!prompt) return
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBaziChange = async (id: string) => {
    if (id === '') {
      setSelectedBazi(null)
      return
    }
    try {
      const res = await fetch(`/api/bazi/readings/${id}`)
      if (res.ok) {
        const data: BaziFullReading = await res.json()
        setSelectedBazi(data)
      }
    } catch {
      setSelectedBazi(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
      {/* Bazi selector */}
      {baziReadings.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label
            htmlFor="bazi-select"
            style={{ fontSize: '11px', color: 'hsl(var(--foreground) / 0.35)', whiteSpace: 'nowrap' }}
          >
            Bát Tự:
          </label>
          <select
            id="bazi-select"
            value={selectedBazi?.id ?? ''}
            onChange={e => handleBaziChange(e.target.value)}
            style={{
              background: 'hsl(var(--foreground) / 0.05)',
              border: '1px solid hsl(var(--foreground) / 0.1)',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '12px',
              color: 'hsl(var(--foreground) / 0.6)',
              outline: 'none',
            }}
          >
            <option value="">Không chọn</option>
            {baziReadings.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} — {r.birthDay}/{r.birthMonth}/{r.birthYear}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Toggle / Copy buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setShowPrompt(!showPrompt)}
          disabled={!primaryData}
          style={{
            background: 'none',
            border: '1px solid hsl(var(--foreground) / 0.1)',
            borderRadius: '10px',
            padding: '10px 24px',
            fontSize: '13px',
            color: 'hsl(var(--foreground) / 0.45)',
            cursor: primaryData ? 'pointer' : 'not-allowed',
            opacity: primaryData ? 1 : 0.5,
            transition: 'background 0.15s',
          }}
        >
          {showPrompt ? 'Ẩn prompt' : 'Xem prompt'}
        </button>
        <button
          onClick={handleCopy}
          disabled={!primaryData}
          style={{
            background: 'none',
            border: '1px solid hsl(var(--foreground) / 0.1)',
            borderRadius: '10px',
            padding: '10px 24px',
            fontSize: '13px',
            color: copied ? '#4ade80' : 'hsl(var(--foreground) / 0.45)',
            cursor: primaryData ? 'pointer' : 'not-allowed',
            opacity: primaryData ? 1 : 0.5,
            transition: 'background 0.15s, color 0.15s',
          }}
        >
          {copied ? 'Copied!' : 'Copy prompt'}
        </button>
      </div>

      {/* Prompt text area */}
      {showPrompt && prompt && (
        <textarea
          readOnly
          value={prompt}
          style={{
            width: '100%',
            maxWidth: '640px',
            minHeight: '300px',
            background: 'hsl(var(--foreground) / 0.03)',
            border: '1px solid hsl(var(--foreground) / 0.1)',
            borderRadius: '10px',
            padding: '16px',
            fontSize: '12px',
            lineHeight: '1.6',
            color: 'hsl(var(--foreground) / 0.6)',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'monospace',
          }}
          onClick={e => (e.target as HTMLTextAreaElement).select()}
        />
      )}
    </div>
  )
}

export default PromptGenerator
