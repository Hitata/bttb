import { ELEMENT_COLORS } from '@/lib/bazi'
import type { FiveElement } from '@/lib/bazi'
import { cn } from '@/lib/utils'

interface ElementColorBadgeProps {
  element: FiveElement
  children: React.ReactNode
  className?: string
}

export function ElementColorBadge({ element, children, className }: ElementColorBadgeProps) {
  const textColor = ELEMENT_COLORS[element] || 'text-foreground'

  return (
    <span className={cn(textColor, 'font-medium', className)}>
      {children}
    </span>
  )
}
