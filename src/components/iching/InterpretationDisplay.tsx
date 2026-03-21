'use client'

import { useEffect, useState } from 'react'
import type { HexagramData } from '@/lib/iching/types'

interface InterpretationDisplayProps {
  primaryNumber: number
  changedNumber: number | null
  nuclearNumber: number
}

type SectionKey = 'primary' | 'changed' | 'nuclear'

interface TextBlockProps {
  label: string
  text: string
}

function TextBlock({ label, text }: TextBlockProps) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div
        style={{
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.35)',
          marginBottom: '6px',
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.7,
          whiteSpace: 'pre-line',
          maxWidth: '640px',
        }}
      >
        {text}
      </div>
    </div>
  )
}

interface SectionProps {
  sectionKey: SectionKey
  title: string
  data: HexagramData
  expanded: boolean
  onToggle: (key: SectionKey) => void
}

function Section({ sectionKey, title, data, expanded, onToggle }: SectionProps) {
  return (
    <div
      style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Header */}
      <button
        onClick={() => onToggle(sectionKey)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '16px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'left',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.4)', marginRight: '6px', fontSize: '13px' }}>{title}</span>
          <span style={{ fontWeight: 500 }}>
            #{data.number} {data.nameVi}{' '}
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>({data.nameZh})</span>{' '}
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: 400 }}>
              — {data.nameEn}
            </span>
          </span>
        </div>
        <span
          style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.3)',
            flexShrink: 0,
            transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.2s ease',
            display: 'inline-block',
          }}
        >
          ▼
        </span>
      </button>

      {/* Body */}
      {expanded && (
        <div style={{ paddingBottom: '20px' }}>
          {/* Structure line */}
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '20px',
              letterSpacing: '0.03em',
            }}
          >
            {data.structure}
          </div>

          <TextBlock label="Energy State" text={data.energyState} />
          <TextBlock label="Physicist · Nhà Vật lý" text={data.physicist} />
          <TextBlock label="Sage · Minh triết" text={data.sage} />
          <TextBlock label="Advisor · Cố vấn" text={data.advisor} />
          <TextBlock label="Balance · Cân bằng" text={data.balance} />
        </div>
      )}
    </div>
  )
}

export function InterpretationDisplay({
  primaryNumber,
  changedNumber,
  nuclearNumber,
}: InterpretationDisplayProps) {
  const [hexagrams, setHexagrams] = useState<Map<number, HexagramData>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Primary is expanded by default; changed and nuclear are collapsed
  const [expanded, setExpanded] = useState<Set<SectionKey>>(new Set(['primary']))

  useEffect(() => {
    const numbers = Array.from(
      new Set([primaryNumber, ...(changedNumber !== null ? [changedNumber] : []), nuclearNumber])
    )

    const query = numbers.join(',')

    fetch(`/api/iching/hexagrams?numbers=${query}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<HexagramData[]>
      })
      .then((data) => {
        const map = new Map<number, HexagramData>()
        for (const item of data) {
          map.set(item.number, item)
        }
        setHexagrams(map)
        setLoading(false)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load interpretation')
        setLoading(false)
      })
  }, [primaryNumber, changedNumber, nuclearNumber])

  function toggleSection(key: SectionKey) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  if (loading) {
    return (
      <div
        style={{
          padding: '32px 0',
          textAlign: 'center',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.1em',
        }}
      >
        Loading interpretation…
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          padding: '24px 0',
          textAlign: 'center',
          fontSize: '12px',
          color: 'rgba(255,100,100,0.5)',
        }}
      >
        {error}
      </div>
    )
  }

  const primaryData = hexagrams.get(primaryNumber)
  const changedData = changedNumber !== null ? hexagrams.get(changedNumber) : null
  const nuclearData = hexagrams.get(nuclearNumber)

  if (!primaryData || !nuclearData) {
    return null
  }

  return (
    <div style={{ marginTop: '8px' }}>
      <Section
        sectionKey="primary"
        title="Primary Hexagram"
        data={primaryData}
        expanded={expanded.has('primary')}
        onToggle={toggleSection}
      />

      {changedData && (
        <Section
          sectionKey="changed"
          title="Changed Hexagram"
          data={changedData}
          expanded={expanded.has('changed')}
          onToggle={toggleSection}
        />
      )}

      <Section
        sectionKey="nuclear"
        title="Nuclear Hexagram · Hỗ Quái"
        data={nuclearData}
        expanded={expanded.has('nuclear')}
        onToggle={toggleSection}
      />

      {/* Bottom border */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />
    </div>
  )
}

export default InterpretationDisplay
