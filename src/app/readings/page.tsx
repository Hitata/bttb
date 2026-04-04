'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ReadingSummary {
  id: string
  name: string
  gender: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number | null
  birthMinute: number | null
  slug: string | null
  isPublic: boolean
  createdAt: string
  system: 'bazi' | 'hd' | 'tuvi'
}

const SYSTEM_LABELS = {
  bazi: { name: 'Bát Tự', color: '#c2785c', href: (id: string) => `/bazi/${id}` },
  hd: { name: 'Human Design', color: '#2a9d8f', href: (id: string) => `/human-design/chart/${id}` },
  tuvi: { name: 'Tử Vi', color: '#6b5b95', href: (id: string) => `/tu-vi/chart/${id}` },
}

export default function ReadingsPage() {
  const [readings, setReadings] = useState<ReadingSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'bazi' | 'hd' | 'tuvi'>('all')

  useEffect(() => {
    Promise.all([
      fetch('/api/bazi/readings').then(r => r.json()).then((items: ReadingSummary[]) =>
        items.map(i => ({ ...i, system: 'bazi' as const }))
      ).catch(() => []),
      fetch('/api/human-design/readings').then(r => r.json()).then((items: ReadingSummary[]) =>
        items.map(i => ({ ...i, system: 'hd' as const }))
      ).catch(() => []),
      fetch('/api/tu-vi/readings').then(r => r.json()).then((items: ReadingSummary[]) =>
        items.map(i => ({ ...i, system: 'tuvi' as const }))
      ).catch(() => []),
    ]).then(([bazi, hd, tuvi]) => {
      const all = [...bazi, ...hd, ...tuvi].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setReadings(all)
    }).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? readings : readings.filter(r => r.system === filter)

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Lá Số Đã Lưu</h1>
      <p className="text-sm text-muted-foreground mb-6">Tất cả lá số Bát Tự, Human Design, và Tử Vi</p>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'bazi', 'hd', 'tuvi'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
              filter === f ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            {f === 'all' ? `Tất cả (${readings.length})` :
             f === 'bazi' ? `Bát Tự (${readings.filter(r => r.system === 'bazi').length})` :
             f === 'hd' ? `HD (${readings.filter(r => r.system === 'hd').length})` :
             `Tử Vi (${readings.filter(r => r.system === 'tuvi').length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Đang tải...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Chưa có lá số nào.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/bazi" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
              Bát Tự
            </Link>
            <Link href="/human-design/calculator" className="rounded-md border px-4 py-2 text-sm hover:bg-muted">
              Human Design
            </Link>
            <Link href="/tu-vi/calculator" className="rounded-md border px-4 py-2 text-sm hover:bg-muted">
              Tử Vi
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => {
            const sys = SYSTEM_LABELS[r.system]
            return (
              <Link
                key={`${r.system}-${r.id}`}
                href={sys.href(r.id)}
                className="block rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: sys.color + '18', color: sys.color }}
                      >
                        {sys.name}
                      </span>
                      <h3 className="font-medium">{r.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {r.gender === 'male' ? 'Nam' : r.gender === 'female' ? 'Nữ' : r.gender} — {r.birthDay}/{r.birthMonth}/{r.birthYear}
                      {r.birthHour != null && ` ${String(r.birthHour).padStart(2, '0')}:${String(r.birthMinute ?? 0).padStart(2, '0')}`}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
