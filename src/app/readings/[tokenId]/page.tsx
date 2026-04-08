'use client'

import { useEffect, useState, use } from 'react'
import { ChatPanel } from '@/components/readings/ChatPanel'
import { Star, Moon } from 'lucide-react'

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
  messages: Message[]
}

export default function ReadingPage({ params }: { params: Promise<{ tokenId: string }> }) {
  const { tokenId } = use(params)
  const [data, setData] = useState<ReadingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/readings/${tokenId}`)
      .then(res => {
        if (res.status === 404) { setNotFound(true); return null }
        return res.json()
      })
      .then(data => { if (data) setData(data) })
      .finally(() => setLoading(false))
  }, [tokenId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">Link Not Found</h1>
          <p className="text-muted-foreground">This reading link doesn&apos;t exist or has been removed.</p>
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
    ? 'bg-amber-500/10 text-amber-600'
    : 'bg-purple-500/10 text-purple-600'

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${typeColor}`}>
            <TypeIcon size={12} /> {typeLabel}
          </span>
        </div>
        <h1 className="text-2xl font-semibold">{data.clientName}</h1>
        {chart && (
          <p className="text-muted-foreground">
            {chart.birthDay}/{chart.birthMonth}/{chart.birthYear}
            {chart.birthHour != null && ` · ${String(chart.birthHour).padStart(2, '0')}h`}
            {' · '}
            {chart.gender === 'male' || chart.gender === 'Nam' ? 'Nam' : 'Nữ'}
          </p>
        )}
      </div>

      {/* Chart summary */}
      {chart && (
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
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
          <p className="text-sm font-medium text-destructive">This reading link has expired.</p>
          <p className="mt-1 text-xs text-muted-foreground">Contact your practitioner for a new one.</p>
        </div>
      )}

      {/* Chat */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">Questions &amp; Answers</h2>
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
