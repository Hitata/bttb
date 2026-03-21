'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className="w-full"
    >
      {copied ? (
        <>
          <Check className="size-3.5" />
          Đã copy link!
        </>
      ) : (
        <>
          <Copy className="size-3.5" />
          Copy link chia sẻ
        </>
      )}
    </Button>
  )
}
