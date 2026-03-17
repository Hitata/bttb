'use client'

import { useState } from 'react'

interface InfoModalProps {
  title: string
  children: React.ReactNode
  triggerLabel?: string
}

export function InfoModal({ title, children, triggerLabel = '?' }: InfoModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs hover:bg-muted"
        title={title}
      >
        {triggerLabel}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="mx-4 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-background p-6 shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground text-xl">&times;</button>
            </div>
            <div className="text-sm">{children}</div>
          </div>
        </div>
      )}
    </>
  )
}
