'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'

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
  bazi: {
    name: 'Bát Tự',
    className: 'bg-[oklch(0.58_0.14_42/0.1)] text-[oklch(0.58_0.14_42)] dark:bg-[oklch(0.65_0.14_42/0.15)] dark:text-[oklch(0.65_0.14_42)]',
    href: (id: string) => `/bazi/${id}`,
    api: '/api/bazi/readings',
  },
  hd: {
    name: 'Human Design',
    className: 'bg-[oklch(0.58_0.1_175/0.1)] text-[oklch(0.52_0.1_175)] dark:bg-[oklch(0.65_0.1_175/0.15)] dark:text-[oklch(0.7_0.1_175)]',
    href: (id: string) => `/human-design/chart/${id}`,
    api: '/api/human-design/readings',
  },
  tuvi: {
    name: 'Tử Vi',
    className: 'bg-[oklch(0.5_0.1_290/0.1)] text-[oklch(0.45_0.1_290)] dark:bg-[oklch(0.55_0.1_290/0.15)] dark:text-[oklch(0.7_0.1_290)]',
    href: (id: string) => `/tu-vi/chart/${id}`,
    api: '/api/tu-vi/readings',
  },
}

function SkeletonRow() {
  return (
    <div className="rounded-lg p-4 ring-1 ring-foreground/5 animate-pulse">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="h-5 w-14 rounded-md bg-muted" />
        <div className="h-5 w-44 rounded-md bg-muted" />
      </div>
      <div className="h-4 w-52 rounded-md bg-muted" />
    </div>
  )
}

export default function ReadingsPage() {
  const [readings, setReadings] = useState<ReadingSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'bazi' | 'hd' | 'tuvi'>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingId])

  const counts = useMemo(() => ({
    all: readings.length,
    bazi: readings.filter(r => r.system === 'bazi').length,
    hd: readings.filter(r => r.system === 'hd').length,
    tuvi: readings.filter(r => r.system === 'tuvi').length,
  }), [readings])

  const filtered = useMemo(
    () => filter === 'all' ? readings : readings.filter(r => r.system === filter),
    [readings, filter]
  )

  function startEdit(r: ReadingSummary) {
    setEditingId(`${r.system}-${r.id}`)
    setEditName(r.name)
  }

  async function saveEdit(r: ReadingSummary) {
    const trimmed = editName.trim()
    if (!trimmed || trimmed === r.name) {
      setEditingId(null)
      return
    }

    const sys = SYSTEM_LABELS[r.system]
    await fetch(`${sys.api}/${r.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed }),
    })

    setReadings(prev => prev.map(rd =>
      rd.id === r.id && rd.system === r.system ? { ...rd, name: trimmed } : rd
    ))
    setEditingId(null)
  }

  async function doDelete(r: ReadingSummary) {
    const sys = SYSTEM_LABELS[r.system]
    await fetch(`${sys.api}/${r.id}`, { method: 'DELETE' })
    setReadings(prev => prev.filter(rd => !(rd.id === r.id && rd.system === r.system)))
    setDeletingId(null)
  }

  const FILTER_LABELS = {
    all: 'Tất cả',
    bazi: 'Bát Tự',
    hd: 'Human Design',
    tuvi: 'Tử Vi',
  } as const

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Lá Số Đã Lưu</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Bát Tự, Human Design, và Tử Vi
      </p>

      {/* Filter tabs */}
      <div
        className="flex gap-1 mb-8 overflow-x-auto pb-0.5"
        role="tablist"
        aria-label="Lọc theo hệ thống"
      >
        {(['all', 'bazi', 'hd', 'tuvi'] as const).map(f => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`text-sm px-3 py-2 rounded-md whitespace-nowrap transition-all duration-150 min-h-[44px] ${
              filter === f
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {FILTER_LABELS[f]}
            <span className="ml-1.5 text-xs tabular-nums opacity-60">
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-2">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-1 font-medium">Chưa có lá số nào</p>
          <p className="text-sm text-muted-foreground mb-8">Tạo lá số đầu tiên</p>
          <div className="flex items-center justify-center gap-2">
            <Link href="/bazi" className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors min-h-[44px] inline-flex items-center">
              Bát Tự
            </Link>
            <Link href="/human-design/calculator" className="rounded-md ring-1 ring-border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors min-h-[44px] inline-flex items-center">
              Human Design
            </Link>
            <Link href="/tu-vi/calculator" className="rounded-md ring-1 ring-border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors min-h-[44px] inline-flex items-center">
              Tử Vi
            </Link>
          </div>
        </div>
      ) : (
        /* Readings list */
        <div className="space-y-1">
          {filtered.map(r => {
            const sys = SYSTEM_LABELS[r.system]
            const key = `${r.system}-${r.id}`
            const isEditing = editingId === key
            const isDeleting = deletingId === key

            // Delete confirmation
            if (isDeleting) {
              return (
                <div
                  key={key}
                  role="alert"
                  className="rounded-lg ring-1 ring-destructive/30 bg-destructive/5 p-4"
                >
                  <p className="text-sm mb-3">
                    Xóa <strong>{r.name}</strong>? Không thể hoàn tác.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => doDelete(r)}
                      className="text-sm px-4 py-2 rounded-md bg-destructive text-white hover:bg-destructive/90 transition-colors min-h-[44px] font-medium"
                    >
                      Xóa
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="text-sm px-4 py-2 rounded-md ring-1 ring-border hover:bg-accent transition-colors min-h-[44px]"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )
            }

            // Edit mode
            if (isEditing) {
              return (
                <div key={key} className="rounded-lg ring-1 ring-primary/40 bg-primary/5 p-4">
                  <label className="text-xs text-muted-foreground mb-1.5 block">Đổi tên</label>
                  <input
                    ref={editInputRef}
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit(r)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    className="font-medium bg-transparent border-b border-primary/40 focus:border-primary outline-none w-full text-base py-1 mb-3 transition-colors"
                    aria-label="Tên lá số"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(r)}
                      className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors min-h-[44px] font-medium"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-sm px-4 py-2 rounded-md ring-1 ring-border hover:bg-accent transition-colors min-h-[44px]"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )
            }

            // Normal mode
            return (
              <div
                key={key}
                className="group relative rounded-lg ring-1 ring-foreground/[0.06] hover:ring-foreground/[0.12] transition-[box-shadow] duration-150"
              >
                <Link href={sys.href(r.id)} className="flex items-center gap-3 p-3.5 pr-24 sm:pr-28">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-px rounded-sm shrink-0 ${sys.className}`}>
                        {sys.name}
                      </span>
                      <span className="text-xs text-muted-foreground/60 tabular-nums shrink-0">
                        {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <h3 className="font-medium truncate leading-snug">{r.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {r.gender === 'male' ? 'Nam' : r.gender === 'female' ? 'Nữ' : r.gender}
                      {' \u00b7 '}
                      {r.birthDay}/{r.birthMonth}/{r.birthYear}
                      {r.birthHour != null && ` \u00b7 ${String(r.birthHour).padStart(2, '0')}:${String(r.birthMinute ?? 0).padStart(2, '0')}`}
                    </p>
                  </div>
                </Link>
                {/* Actions */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={() => startEdit(r)}
                    aria-label={`Sửa tên ${r.name}`}
                    className="p-2.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeletingId(key)}
                    aria-label={`Xóa ${r.name}`}
                    className="p-2.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
