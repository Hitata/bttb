'use client'

import { MASTER_NUMBERS } from '@/lib/numerology'

interface NumberBadgeProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-14 w-14 text-xl',
} as const

export function NumberBadge({ value, size = 'md' }: NumberBadgeProps) {
  const isMaster = MASTER_NUMBERS.has(value)

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-bold ${sizeClasses[size]} ${
        isMaster
          ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-500'
          : 'bg-muted text-foreground'
      }`}
    >
      {value}
    </div>
  )
}
