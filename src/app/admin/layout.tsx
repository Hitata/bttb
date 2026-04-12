'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield } from 'lucide-react'

const ADMIN_LINKS = [
  { href: '/admin', label: 'Clients' },
  { href: '/admin/readings', label: 'Lá Số' },
  { href: '/admin/bazi-clients', label: 'Bát Tự' },
  { href: '/admin/tu-vi-clients', label: 'Tử Vi' },
  { href: '/admin/numerology-clients', label: 'Thần Số' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-12 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-1 overflow-x-auto px-4 py-1.5 sm:px-6">
          <Link href="/admin" className="mr-2 flex shrink-0 items-center gap-1.5 text-xs font-semibold text-foreground">
            <Shield size={14} />
            <span className="hidden sm:inline">Admin</span>
          </Link>
          {ADMIN_LINKS.map(({ href, label }) => {
            const isActive = href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`shrink-0 rounded-md px-2.5 py-1 text-xs transition-colors ${
                  isActive
                    ? 'bg-secondary text-foreground font-medium'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
      {children}
    </div>
  )
}
