'use client'

import { cn } from '@/lib/utils'
import type { TenGodRef } from '@/lib/bazi'

interface TenGodBadgeProps {
  tenGod: TenGodRef
  className?: string
  onClick?: () => void
}

export function TenGodBadge({ tenGod, className, onClick }: TenGodBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs font-semibold cursor-default',
        onClick && 'cursor-pointer hover:bg-accent',
        className,
      )}
      title={tenGod.name}
      onClick={onClick}
    >
      {tenGod.code}
    </span>
  )
}
