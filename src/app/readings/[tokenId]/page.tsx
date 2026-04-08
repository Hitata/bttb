'use client'

import { useEffect, useState, use } from 'react'
import { ChatPanel } from '@/components/readings/ChatPanel'
import { BaziBoard } from '@/components/bazi/BaziBoard'
import { Star, Moon, AlertCircle, LinkIcon } from 'lucide-react'
import type { TuTru } from '@/lib/bazi'

interface ChartData {
  name: string
  gender: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number
  dayMaster?: string
  cucName?: string
  chartSummary?: string
}

interface Message {
  id: string
  role: 'client' | 'assistant'
  content: string
  createdAt: string
}

interface ReadingData {
  status: 'valid' | 'expired' | 'maxed'
  tokenId: string
  clientType: 'bazi' | 'tuvi'
  clientName: string
  expiresAt: string
  maxMessages: number
  clientMessageCount: number
  chartData: ChartData | null
  tutru: TuTru | null
  chartDate: { solar: { year: number; month: number; day: number }; lunar: { year: number; month: number; day: number } } | null
  messages: Message[]
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 animate-pulse">
      <div className="mb-6">
        <div className="h-5 w-16 rounded-full bg-muted mb-2" />
        <div className="h-7 w-48 rounded-md bg-muted mb-1.5" />
        <div className="h-4 w-36 rounded-md bg-muted" />
      </div>
      <div className="rounded-lg border bg-card overflow-hidden mb-6">
        <div className="h-8 bg-muted/50 border-b" />
        <div className="grid grid-cols-4 gap-px">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 p-3">
              <div className="h-3 w-8 mx-auto rounded bg-muted" />
              <div className="h-8 w-8 mx-auto rounded bg-muted" />
              <div className="h-8 w-8 mx-auto rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
      <div className="border-t pt-6">
        <div className="h-5 w-36 rounded-md bg-muted mb-4" />
        <div className="h-10 rounded-lg bg-muted" />
      </div>
    </div>
  )
}

export default function ReadingPage({ params }: { params: Promise<{ tokenId: string }> }) {
  const { tokenId } = use(params)
  const [data, setData] = useState<ReadingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(false)

  const loadReading = () => {
    setLoading(true)
    setError(false)
    fetch(`/api/readings/${tokenId}`)
      .then(res => {
        if (res.status === 404) { setNotFound(true); return null }
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then(data => { if (data) setData(data) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadReading() }, [tokenId])

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle size={24} className="text-destructive" />
          </div>
          <h1 className="text-lg font-semibold mb-1">Unable to Load Reading</h1>
          <p className="text-sm text-muted-foreground mb-5">Something went wrong. Check your connection and try again.</p>
          <button
            onClick={loadReading}
            aria-label="Retry loading reading"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:bg-primary/80"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <LinkIcon size={24} className="text-muted-foreground" />
          </div>
          <h1 className="text-lg font-semibold mb-1">Link Not Found</h1>
          <p className="text-sm text-muted-foreground">This reading link doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const isExpired = data.status === 'expired'
  const chart = data.chartData
  const TypeIcon = data.clientType === 'bazi' ? Star : Moon
  const typeLabel = data.clientType === 'bazi' ? 'Bát Tự' : 'Tử Vi'
  const typeColor = data.clientType === 'bazi'
    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
    : 'bg-purple-500/10 text-purple-700 dark:text-purple-400'

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${typeColor}`}>
          <TypeIcon size={12} /> {typeLabel}
        </span>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{data.clientName}</h1>
        {chart && (
          <p className="mt-0.5 text-sm text-muted-foreground">
            {chart.birthDay}/{chart.birthMonth}/{chart.birthYear}
            {chart.birthHour != null && ` · ${String(chart.birthHour).padStart(2, '0')}h`}
            {' · '}
            {chart.gender === 'male' || chart.gender === 'Nam' ? 'Nam' : 'Nữ'}
          </p>
        )}
      </div>

      {/* Bazi Board */}
      {data.clientType === 'bazi' && data.tutru && (
        <div className="mb-6">
          <BaziBoard
            tutru={data.tutru}
            solarDate={data.chartDate?.solar}
            hour={chart?.birthHour}
            gender={chart?.gender}
          />
        </div>
      )}

      {/* Chart summary (for non-bazi or fallback) */}
      {chart && !data.tutru && (
        <div className="mb-6 rounded-lg border bg-card p-4">
          <p className="font-medium">
            {chart.dayMaster || chart.cucName || ''}
          </p>
          {chart.chartSummary && (
            <p className="mt-1 text-sm text-muted-foreground">{chart.chartSummary}</p>
          )}
        </div>
      )}

      {/* Expiry warning */}
      {isExpired && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-center" role="alert">
          <p className="text-sm font-medium text-destructive">This reading link has expired.</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Contact your practitioner for a new one.</p>
        </div>
      )}

      {/* Chat */}
      <div className="border-t pt-6">
        <h2 className="text-base font-semibold mb-4">Questions &amp; Answers</h2>
        <ChatPanel
          tokenId={tokenId}
          initialMessages={data.messages}
          clientMessageCount={data.clientMessageCount}
          maxMessages={data.maxMessages}
          disabled={isExpired}
          disabledReason="This reading link has expired. Contact your practitioner for a new one."
        />
      </div>
    </div>
  )
}
