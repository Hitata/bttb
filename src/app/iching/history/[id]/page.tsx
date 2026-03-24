'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'

interface ReadingDetail {
  id: string
  imageHash: string
  question: string
  intentionTime: string
  lines: number[]
  coins: number[][]
  primaryNumber: number
  changedNumber: number | null
  nuclearNumber: number
  prompt: string
  analysisMode: string
  createdAt: string
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const MODE_LABELS: Record<string, string> = {
  deep: 'Năng lượng sâu',
  standard: 'Luận giải chuẩn',
  simple: 'Trả lời ngắn',
}

export default function ReadingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [reading, setReading] = useState<ReadingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/iching/readings/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then(setReading)
      .catch(() => setReading(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleCopy = async () => {
    if (!reading) return
    await navigator.clipboard.writeText(reading.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-sm text-white/20">Loading…</div>
      </div>
    )
  }

  if (!reading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <div className="text-sm text-white/30">Không tìm thấy quẻ</div>
        <Link href="/iching/history" className="text-xs text-white/20 underline hover:text-white/40">
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white/80">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/iching/history"
            className="text-xs text-white/30 transition-colors hover:text-white/50"
          >
            ← Danh sách
          </Link>
          <div className="text-xs text-white/20">
            {MODE_LABELS[reading.analysisMode] ?? reading.analysisMode}
          </div>
        </div>

        {/* Meta info */}
        <div className="mb-6 space-y-1 text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/25">
            Quẻ #{reading.primaryNumber}
            {reading.changedNumber ? ` → #${reading.changedNumber}` : ''}
          </div>
          <div className="text-xs text-white/20">
            {formatDate(reading.createdAt)}
          </div>
          <div className="text-[10px] text-white/15">
            Giờ động tâm: {formatDate(reading.intentionTime)}
          </div>
          <div className="text-[10px] font-mono text-white/10 break-all">
            {reading.imageHash.slice(0, 16)}…
          </div>
        </div>

        {/* Question */}
        {reading.question && (
          <div className="mb-4 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center">
            <div className="text-[10px] uppercase tracking-[0.15em] text-white/25 mb-1">Câu hỏi</div>
            <div className="text-sm text-white/60 italic">{reading.question}</div>
          </div>
        )}

        {/* Prompt text */}
        <div
          className="rounded-xl border border-white/6 bg-white/[0.02] p-4"
        >
          <pre
            className="m-0 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-white/55"
          >
            {reading.prompt}
          </pre>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={handleCopy}
            className="rounded-lg border px-5 py-2.5 text-[13px] transition-all"
            style={{
              background: copied ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)',
              borderColor: copied ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.12)',
              color: copied ? 'rgba(74,222,128,0.9)' : 'rgba(255,255,255,0.5)',
            }}
          >
            {copied ? '✓ Đã copy' : 'Copy prompt'}
          </button>
        </div>
      </div>
    </div>
  )
}
