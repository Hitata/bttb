'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const links = [
  { href: '/iching', label: 'Kinh Dịch' },
  { href: '/bazi', label: 'Bát Tự' },
  { href: '/numerology', label: 'Thần Số' },
  { href: '/bazi/cases', label: 'Cases' },
  { href: '/hexagrams', label: '64 Quẻ' },
  { href: '/human-design', label: 'Human Design' },
  { href: '/tu-vi', label: 'Tử Vi' },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        aria-label="Toggle menu"
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 4h12M2 8h12M2 12h12" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-12 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-0 right-0 top-12 z-50 border-b border-border bg-[#f5f4ed] shadow-lg">
            <nav className="flex flex-col px-4 py-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-3 text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                    pathname.startsWith(link.href)
                      ? 'bg-secondary text-foreground'
                      : 'text-foreground-secondary hover:bg-secondary/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
