'use client'

import { Pencil, User, Calendar, Clock } from 'lucide-react'
import type { BirthInput } from '@/lib/bazi'

interface BirthInputSummaryProps {
  input: BirthInput
  onEdit: () => void
}

export function BirthInputSummary({ input, onEdit }: BirthInputSummaryProps) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="group w-full cursor-pointer rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/30 hover:bg-accent/50"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <User className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate text-sm font-medium">{input.name || 'Không tên'}</span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {input.gender === 'male' ? 'Nam' : 'Nữ'}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {String(input.day).padStart(2, '0')}/{String(input.month).padStart(2, '0')}/{input.year}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {String(input.hour).padStart(2, '0')}:{String(input.minute).padStart(2, '0')}
            </span>
          </div>
        </div>
        <Pencil className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
    </button>
  )
}
