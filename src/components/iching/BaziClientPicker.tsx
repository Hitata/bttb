'use client'

import { useState, useEffect, useRef } from 'react'

export interface BaziClientSummary {
  id: string
  name: string
  gender: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number
  dayMaster: string
  chartSummary: string
}

interface BaziClientPickerProps {
  selected: BaziClientSummary | null
  onChange: (client: BaziClientSummary | null) => void
}

export function BaziClientPicker({ selected, onChange }: BaziClientPickerProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [clients, setClients] = useState<BaziClientSummary[]>([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetch(`/api/bazi/clients?q=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(setClients)
        .catch(() => setClients([]))
        .finally(() => setLoading(false))
    }, 200)
    return () => clearTimeout(debounceRef.current)
  }, [query, open])

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (selected) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.04)',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
            {selected.name}
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
            {selected.dayMaster} · {selected.chartSummary}
          </div>
        </div>
        <button
          onClick={() => onChange(null)}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.3)',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '2px 4px',
          }}
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          background: 'none',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.35)',
          cursor: 'pointer',
          textAlign: 'left',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        + Gắn Bát Tự khách hàng
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            background: '#141414',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            overflow: 'hidden',
            zIndex: 50,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên..."
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '10px 12px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.7)',
              outline: 'none',
            }}
          />
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
                Đang tìm...
              </div>
            ) : clients.length === 0 ? (
              <div style={{ padding: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
                {query ? 'Không tìm thấy' : 'Chưa có khách hàng'}
              </div>
            ) : (
              clients.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onChange(c)
                    setOpen(false)
                    setQuery('')
                  }}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
                >
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '1px' }}>
                    {c.dayMaster} · {c.birthDay}/{c.birthMonth}/{c.birthYear}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
