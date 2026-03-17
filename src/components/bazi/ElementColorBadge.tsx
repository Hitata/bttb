import { ELEMENT_COLORS, ELEMENT_BG_COLORS } from '@/lib/bazi'
import type { FiveElement } from '@/lib/bazi'
import { cn } from '@/lib/utils'

interface ElementColorBadgeProps {
  element: FiveElement
  children: React.ReactNode
  className?: string
  showBg?: boolean
}

export function ElementColorBadge({ element, children, className, showBg = false }: ElementColorBadgeProps) {
  const textColor = ELEMENT_COLORS[element] || 'text-foreground'
  const bgColor = showBg ? (ELEMENT_BG_COLORS[element] || '') : ''

  return (
    <span className={cn(textColor, bgColor, showBg && 'rounded px-1.5 py-0.5', 'font-medium', className)}>
      {children}
    </span>
  )
}
