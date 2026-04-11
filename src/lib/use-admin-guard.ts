'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Client-side admin auth guard. Checks admin session via API call.
 * Redirects to /admin?login=true if not authenticated.
 * Returns { isLoading, isAuthenticated }.
 */
export function useAdminGuard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    fetch('/api/admin/clients')
      .then(res => {
        if (res.status === 401) {
          router.replace('/admin?login=true')
        } else {
          setIsAuthenticated(true)
        }
      })
      .catch(() => router.replace('/admin?login=true'))
      .finally(() => setIsLoading(false))
  }, [router])

  return { isLoading, isAuthenticated }
}
