'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ClientSummary {
  id: string
  name: string
  gender: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number
  dayMaster: string
  chartSummary: string
  createdAt: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function BaziClientsPage() {
  const [clients, setClients] = useState<ClientSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetch(`/api/bazi/clients?q=${encodeURIComponent(search)}`)
        .then(r => r.json())
        .then(data => setClients(Array.isArray(data) ? data : []))
        .catch(() => setClients([]))
        .finally(() => setLoading(false))
    }, 200)
    return () => clearTimeout(timeout)
  }, [search])

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Khách hàng</h1>
        <Link
          href="/bazi"
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
        >
          ← Lá số mới
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setLoading(true) }}
        placeholder="Tìm theo tên..."
        className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-ring"
      />

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Đang tải...</div>
      ) : clients.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          {search ? 'Không tìm thấy' : 'Chưa có khách hàng nào'}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {clients.map((c) => (
            <Link
              key={c.id}
              href={`/bazi?name=${encodeURIComponent(c.name)}&gender=${c.gender}&y=${c.birthYear}&m=${c.birthMonth}&d=${c.birthDay}&h=${c.birthHour}&min=0`}
              className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-ring/30 hover:bg-accent/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {c.dayMaster}
                    <span className="mx-1.5 opacity-30">·</span>
                    {c.chartSummary}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground/60">
                    {c.birthDay}/{c.birthMonth}/{c.birthYear}
                    <span className="mx-1.5 opacity-30">·</span>
                    {c.gender === 'male' ? 'Nam' : 'Nữ'}
                    <span className="mx-1.5 opacity-30">·</span>
                    Lưu {formatDate(c.createdAt)}
                  </div>
                </div>
                <div className="shrink-0 text-xs text-muted-foreground/30 transition-colors group-hover:text-muted-foreground/60">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
