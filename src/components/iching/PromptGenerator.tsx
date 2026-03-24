'use client'

import { useState } from 'react'
import type { CastingResponse, HexagramData } from '@/lib/iching/types'
import { BaziClientPicker, type BaziClientSummary } from './BaziClientPicker'

interface PromptGeneratorProps {
  result: CastingResponse
  primaryData: HexagramData | null
  changedData: HexagramData | null
  nuclearData: HexagramData | null
  question: string
}

const LINE_POSITION_NAMES = ['Sơ hào', 'Nhị hào', 'Tam hào', 'Tứ hào', 'Ngũ hào', 'Thượng hào']

type AnalysisMode = 'deep' | 'standard' | 'simple'

const ANALYSIS_MODES: { key: AnalysisMode; label: string; desc: string }[] = [
  { key: 'deep', label: 'Năng lượng sâu', desc: 'Phân tích chuyên sâu' },
  { key: 'standard', label: 'Luận giải chuẩn', desc: 'Quy trình 7 bước' },
  { key: 'simple', label: 'Trả lời ngắn', desc: 'Tóm tắt cho khách' },
]

function getLineChar(value: number): string {
  switch (value) {
    case 9: return '━━━━━━━ ○'  // old yang, moving
    case 7: return '━━━━━━━'    // young yang
    case 8: return '━━━ ━━━'    // young yin
    case 6: return '━━━ ━━━ ○'  // old yin, moving
    default: return String(value)
  }
}

function getLineLabel(value: number): string {
  switch (value) {
    case 9: return '9 Lão Dương (biến)'
    case 7: return '7 Thiếu Dương'
    case 8: return '8 Thiếu Âm'
    case 6: return '6 Lão Âm (biến)'
    default: return String(value)
  }
}

function buildTextUI(
  result: CastingResponse,
  primaryData: HexagramData,
  changedData: HexagramData | null,
  nuclearData: HexagramData | null,
  question: string,
  clientInfo: BaziClientSummary | null = null,
): string {
  const { lines, primary, changed } = result

  // Build hexagram visual (top to bottom = line 6 to line 1)
  const hexLines = [...lines].reverse().map((value, i) => {
    const lineNum = 6 - i
    const posName = LINE_POSITION_NAMES[lineNum - 1]
    return `  ${lineNum}  ${getLineChar(value)}   ${getLineLabel(value)}  (${posName})`
  })

  // Moving lines
  const movingPositions = lines
    .map((v, i) => (v === 6 || v === 9 ? i + 1 : null))
    .filter(Boolean)
  const movingStr = movingPositions.length > 0
    ? movingPositions.map(p => `Hào ${p}`).join(', ')
    : 'Không có'

  // Upper / Lower trigram
  const upperTri = `${primary.upperTrigram.symbol} ${primary.upperTrigram.name}`
  const lowerTri = `${primary.lowerTrigram.symbol} ${primary.lowerTrigram.name}`

  const questionBlock = question.trim()
    ? `\nCâu hỏi: ${question.trim()}\n`
    : ''

  let text = `╔══════════════════════════════════════════╗
║         GIEO QUẺ · 擲錢法                ║
╚══════════════════════════════════════════╝
${questionBlock}
┌─ BẢN QUÁI (Primary) ────────────────────┐
│  #${primary.number} ${primary.name.vi} (${primary.name.zh}) — ${primary.name.en}
│  Thượng: ${upperTri}  ·  Hạ: ${lowerTri}
│  Cấu trúc: ${primaryData.structure}
│  Hỗ quái: #${primary.nuclearNumber}${nuclearData ? ` ${nuclearData.nameVi}` : ''}
└──────────────────────────────────────────┘

  Hào (trên → dưới):
  ── Thượng quái (${upperTri}) ──
${hexLines.slice(0, 3).join('\n')}
  ── Hạ quái (${lowerTri}) ──
${hexLines.slice(3).join('\n')}

  Hào biến: ${movingStr}`

  if (changed && changedData) {
    text += `

┌─ BIẾN QUÁI (Changed) ───────────────────┐
│  #${changed.number} ${changed.name.vi} (${changed.name.zh}) — ${changed.name.en}
│  Cấu trúc: ${changedData.structure}
└──────────────────────────────────────────┘`
  } else if (changed) {
    text += `

┌─ BIẾN QUÁI (Changed) ───────────────────┐
│  #${changed.number} ${changed.name.vi} (${changed.name.zh}) — ${changed.name.en}
└──────────────────────────────────────────┘`
  } else {
    text += `

  Biến Quái: Không có (tất cả hào đều tĩnh)`
  }

  if (clientInfo) {
    text += `

┌─ BÁT TỰ KHÁCH (Client Chart) ──────────┐
│  ${clientInfo.name} (${clientInfo.gender === 'male' ? 'Nam' : 'Nữ'})
│  Sinh: ${clientInfo.birthDay}/${clientInfo.birthMonth}/${clientInfo.birthYear} ${clientInfo.birthHour}h
│  Nhật Chủ: ${clientInfo.dayMaster}
│  Tứ Trụ: ${clientInfo.chartSummary}
└──────────────────────────────────────────┘`
  }

  return text
}

function buildAnalysisInstruction(mode: AnalysisMode, clientInfo: BaziClientSummary | null = null): string {
  let instruction: string
  switch (mode) {
    case 'deep':
      instruction = `

───────────────────────────────────────────

Hãy dùng skill iching-foundation để luận giải CHUYÊN SÂU:
- Phân tích năng lượng từng hào, đặc biệt hào biến
- Ngũ Hành tương sinh/tương khắc giữa thượng quái và hạ quái
- Phân tích Ba lớp chi tiết (Nhà Vật lý / Minh triết / Cố vấn)
- Bản đồ năng lượng: Primary → Changed → Nuclear
- Đánh giá cân bằng Âm Dương tổng thể
- Liên hệ với hào từ cổ điển (Kinh văn)
- Tổng hợp thông điệp cốt lõi`
      break
    case 'standard':
      instruction = `

───────────────────────────────────────────

Hãy dùng skill iching-foundation để luận giải đầy đủ theo quy trình 7 bước:
1. Xác định Quẻ
2. Phân tích Cấu trúc (trigram, Ngũ Hành, vị trí hào)
3. Phân tích Hào biến
4. Luận giải Ba lớp (Nhà Vật lý / Minh triết / Cố vấn)
5. Bản đồ Xu hướng (Primary → Changed → Nuclear)
6. Đánh giá Cân bằng
7. Tổng hợp`
      break
    case 'simple':
      instruction = `

───────────────────────────────────────────

Hãy dùng skill iching-foundation, luận giải để TRẢ LỜI KHÁCH (dễ hiểu, không thuật ngữ):
- Giải thích năng lượng quẻ bằng ngôn ngữ đời thường (ví dụ: "quẻ này mang năng lượng như nước chảy — mềm mại nhưng kiên trì")
- Dẫn dắt từ năng lượng đến ý nghĩa thực tế cho người hỏi
- Thông điệp chính trong 2-3 câu rõ ràng
- Lời khuyên cụ thể, áp dụng được ngay
- Viết bằng giọng ấm áp, gần gũi như đang trò chuyện`
      break
  }

  if (clientInfo) {
    instruction += `\n- Kết hợp skill bazi-foundation + Bát Tự của khách (Nhật Chủ: ${clientInfo.dayMaster}) với quẻ Kinh Dịch để đưa ra luận giải cá nhân hóa`
  }

  return instruction
}

export function PromptGenerator({
  result,
  primaryData,
  changedData,
  nuclearData,
  question,
}: PromptGeneratorProps) {
  const [copied, setCopied] = useState(false)
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>('standard')
  const [selectedClient, setSelectedClient] = useState<BaziClientSummary | null>(null)

  const handleCopy = async () => {
    if (!primaryData) return
    const textUI = buildTextUI(result, primaryData, changedData, nuclearData, question, selectedClient)
    const instruction = buildAnalysisInstruction(selectedMode, selectedClient)
    const fullPrompt = textUI + instruction
    await navigator.clipboard.writeText(fullPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    // Save to DB
    fetch('/api/iching/readings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageHash: result.imageHash,
        intentionTime: result.intentionTime,
        lines: result.lines,
        coins: result.coins,
        primaryNumber: result.primary.number,
        changedNumber: result.changed?.number ?? null,
        nuclearNumber: result.primary.nuclearNumber,
        prompt: fullPrompt,
        analysisMode: selectedMode,
        question,
      }),
    }).catch(() => {}) // fire-and-forget
  }

  const previewText = primaryData
    ? buildTextUI(result, primaryData, changedData, nuclearData, question, selectedClient) + buildAnalysisInstruction(selectedMode, selectedClient)
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      {/* Analysis mode selector */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {ANALYSIS_MODES.map((mode) => {
          const active = selectedMode === mode.key
          return (
            <button
              key={mode.key}
              onClick={() => setSelectedMode(mode.key)}
              style={{
                background: active ? 'rgba(255,255,255,0.08)' : 'none',
                border: active
                  ? '1px solid rgba(255,255,255,0.25)'
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '8px 14px',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                transition: 'all 0.15s',
                textAlign: 'center',
                minWidth: '100px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: active ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)',
                  fontWeight: active ? 600 : 400,
                }}
              >
                {mode.label}
              </div>
              <div
                style={{
                  fontSize: '9px',
                  color: active ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.2)',
                  marginTop: '2px',
                }}
              >
                {mode.desc}
              </div>
            </button>
          )
        })}
      </div>

      {/* Bazi client selector */}
      <div style={{ width: '100%', maxWidth: '320px' }}>
        <BaziClientPicker selected={selectedClient} onChange={setSelectedClient} />
      </div>

      {/* Text preview */}
      {previewText && (
        <div
          style={{
            width: '100%',
            maxHeight: '280px',
            overflowY: 'auto',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px',
            padding: '14px',
          }}
        >
          <pre
            style={{
              margin: 0,
              fontSize: '11px',
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {previewText}
          </pre>
        </div>
      )}

      {/* Copy button */}
      <button
        onClick={handleCopy}
        disabled={!primaryData}
        style={{
          background: copied
            ? 'rgba(74,222,128,0.1)'
            : 'rgba(255,255,255,0.04)',
          border: copied
            ? '1px solid rgba(74,222,128,0.3)'
            : '1px solid rgba(255,255,255,0.12)',
          borderRadius: '10px',
          padding: '12px 32px',
          fontSize: '13px',
          color: copied
            ? 'rgba(74,222,128,0.9)'
            : 'rgba(255,255,255,0.5)',
          cursor: primaryData ? 'pointer' : 'not-allowed',
          minHeight: '48px',
          WebkitTapHighlightColor: 'transparent',
          opacity: primaryData ? 1 : 0.5,
          transition: 'all 0.2s',
        }}
      >
        {copied ? '✓ Đã copy — paste vào Claude' : 'Copy prompt for Claude'}
      </button>
    </div>
  )
}

export default PromptGenerator
