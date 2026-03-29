'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ReadingSummary {
  id: string
  imageHash: string
  question: string
  primaryNumber: number
  changedNumber: number | null
  nuclearNumber: number
  analysisMode: string
  intentionTime: string
  createdAt: string
}

interface HexagramName {
  number: number
  nameVi: string
  nameZh: string
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const MODE_LABELS: Record<string, string> = {
  deep: 'Sâu',
  standard: 'Chuẩn',
  simple: 'Ngắn',
}

export default function HistoryPage() {
  const [readings, setReadings] = useState<ReadingSummary[]>([])
  const [names, setNames] = useState<Map<number, HexagramName>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/iching/readings')
      .then(r => r.json())
      .then((data: ReadingSummary[]) => {
        setReadings(data)
        // Fetch hexagram names for all unique numbers
        const nums = new Set<number>()
        data.forEach(r => {
          nums.add(r.primaryNumber)
          if (r.changedNumber) nums.add(r.changedNumber)
        })
        if (nums.size > 0) {
          return fetch(`/api/iching/hexagrams?numbers=${[...nums].join(',')}`)
            .then(r => r.json())
            .then((hexagrams: HexagramName[]) => {
              setNames(new Map(hexagrams.map(h => [h.number, h])))
            })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getName = (num: number) => {
    const h = names.get(num)
    return h ? `${h.nameZh} ${h.nameVi}` : `#${num}`
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white/80">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-sm uppercase tracking-[0.2em] text-white/30">
            Lịch sử gieo quẻ
          </h1>
          <Link
            href="/iching"
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/40 transition-colors hover:border-white/20 hover:text-white/60"
          >
            Gieo quẻ mới
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-white/20">Loading…</div>
        ) : readings.length === 0 ? (
          <div className="py-20 text-center text-sm text-white/20">Chưa có quẻ nào</div>
        ) : (
          <div className="flex flex-col gap-2">
            {readings.map((r) => (
              <Link
                key={r.id}
                href={`/iching/history/${r.id}`}
                className="group rounded-xl border border-white/6 bg-white/[0.02] p-4 transition-all hover:border-white/12 hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white/70">
                      <span className="text-white/40">#{r.primaryNumber}</span>{' '}
                      {getName(r.primaryNumber)}
                      {r.changedNumber && (
                        <>
                          <span className="mx-1.5 text-white/15">→</span>
                          <span className="text-white/40">#{r.changedNumber}</span>{' '}
                          {getName(r.changedNumber)}
                        </>
                      )}
                    </div>
                    {r.question && (
                      <div className="mt-1 truncate text-xs text-white/30 italic">
                        {r.question}
                      </div>
                    )}
                    <div className="mt-1 text-xs text-white/25">
                      {formatDate(r.createdAt)}
                      <span className="mx-1.5 text-white/10">·</span>
                      {MODE_LABELS[r.analysisMode] ?? r.analysisMode}
                    </div>
                  </div>
                  <div className="shrink-0 text-xs text-white/15 transition-colors group-hover:text-white/30">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
