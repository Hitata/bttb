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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground/50">Loading…</div>
      </div>
    )
  }

  if (!reading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="text-sm text-muted-foreground/60">Không tìm thấy quẻ</div>
        <Link href="/iching/history" className="text-xs text-muted-foreground/40 underline hover:text-muted-foreground/70">
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/iching/history"
            className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          >
            ← Danh sách
          </Link>
          <div className="text-xs text-muted-foreground/40">
            {MODE_LABELS[reading.analysisMode] ?? reading.analysisMode}
          </div>
        </div>

        {/* Meta info */}
        <div className="mb-6 space-y-1 text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
            Quẻ #{reading.primaryNumber}
            {reading.changedNumber ? ` → #${reading.changedNumber}` : ''}
          </div>
          <div className="text-xs text-muted-foreground/40">
            {formatDate(reading.createdAt)}
          </div>
          <div className="text-[10px] text-muted-foreground/30">
            Giờ động tâm: {formatDate(reading.intentionTime)}
          </div>
          <div className="text-[10px] font-mono text-muted-foreground/20 break-all">
            {reading.imageHash.slice(0, 16)}…
          </div>
        </div>

        {/* Question */}
        {reading.question && (
          <div className="mb-4 rounded-xl border border-border/80 bg-card/50 px-4 py-3 text-center">
            <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 mb-1">Câu hỏi</div>
            <div className="text-sm text-foreground/60 italic">{reading.question}</div>
          </div>
        )}

        {/* Prompt text */}
        <div className="rounded-xl border border-border/60 bg-card/30 p-4">
          <pre className="m-0 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-foreground/55">
            {reading.prompt}
          </pre>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={handleCopy}
            className={[
              'rounded-lg border px-5 py-2.5 text-[13px] transition-all',
              copied
                ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
                : 'border-border bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground/70',
            ].join(' ')}
          >
            {copied ? '✓ Đã copy' : 'Copy prompt'}
          </button>
        </div>
      </div>
    </div>
  )
}
