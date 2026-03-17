'use client'

import { useState } from 'react'
import type { FAQItem } from '@/lib/bazi'

interface FAQSectionProps {
  items: FAQItem[]
}

export function FAQSection({ items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (items.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">FAQ</h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-muted/50"
            >
              <span>{item.question}</span>
              <span className="ml-2 text-muted-foreground">{openIndex === i ? '−' : '+'}</span>
            </button>
            {openIndex === i && (
              <div className="border-t px-4 py-3 text-sm text-muted-foreground">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
