'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ClientSummary {
  id: string
  fullName: string
  birthYear: number
  birthMonth: number
  birthDay: number
  lifePathNumber: number
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

export default function NumerologyClientsPage() {
  const [clients, setClients] = useState<ClientSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetch(`/api/numerology/clients?q=${encodeURIComponent(search)}`)
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
        <h1 className="text-lg font-semibold tracking-tight">Kh\u00e1ch h\u00e0ng</h1>
        <Link
          href="/numerology"
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
        >
          \u2190 T\u00ednh s\u1ed1 m\u1edbi
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setLoading(true) }}
        placeholder="T\u00ecm theo t\u00ean..."
        className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-ring"
      />

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">\u0110ang t\u1ea3i...</div>
      ) : clients.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          {search ? 'Kh\u00f4ng t\u00ecm th\u1ea5y' : 'Ch\u01b0a c\u00f3 kh\u00e1ch h\u00e0ng n\u00e0o'}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {clients.map((c) => (
            <Link
              key={c.id}
              href={`/numerology?name=${encodeURIComponent(c.fullName)}&y=${c.birthYear}&m=${c.birthMonth}&d=${c.birthDay}`}
              className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-ring/30 hover:bg-accent/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{c.fullName}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    S\u1ed1 ch\u1ee7 \u0111\u1ea1o: {c.lifePathNumber}
                    {c.chartSummary && (
                      <>
                        <span className="mx-1.5 opacity-30">&middot;</span>
                        {c.chartSummary}
                      </>
                    )}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground/60">
                    {c.birthDay}/{c.birthMonth}/{c.birthYear}
                    <span className="mx-1.5 opacity-30">&middot;</span>
                    L\u01b0u {formatDate(c.createdAt)}
                  </div>
                </div>
                <div className="shrink-0 text-xs text-muted-foreground/30 transition-colors group-hover:text-muted-foreground/60">
                  &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
