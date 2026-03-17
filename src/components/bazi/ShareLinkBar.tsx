'use client'

import { useState } from 'react'
import type { BirthInput } from '@/lib/bazi'

interface ShareLinkBarProps {
  input: BirthInput
}

export function ShareLinkBar({ input }: ShareLinkBarProps) {
  const [copied, setCopied] = useState(false)

  const params = new URLSearchParams({
    name: input.name,
    gender: input.gender,
    y: String(input.year),
    m: String(input.month),
    d: String(input.day),
    h: String(input.hour),
    min: String(input.minute),
  })

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/bazi?${params.toString()}`
    : `/bazi?${params.toString()}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <input
        readOnly
        value={url}
        className="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm font-mono"
        onClick={e => (e.target as HTMLInputElement).select()}
      />
      <button
        onClick={handleCopy}
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
      >
        {copied ? 'Đã copy!' : 'Copy link'}
      </button>
    </div>
  )
}
