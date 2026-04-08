'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LogOut, Search, Star, Moon } from 'lucide-react'

interface ClientSummary {
  id: string
  name: string
  birthYear: number
  birthMonth: number
  birthDay: number
  gender: string
  hasBazi: boolean
  hasTuVi: boolean
  activeTokens: number
  createdAt: string
}

function normalizeGender(gender: string | undefined): string {
  if (!gender) return ''
  const lower = gender.toLowerCase()
  if (lower === 'male' || lower === 'nam') return 'Nam'
  if (lower === 'female' || lower === 'nữ' || lower === 'nu') return 'Nữ'
  return gender
}

function formatBirthDate(year?: number, month?: number, day?: number): string {
  if (!year || !month || !day) return ''
  return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
}

export default function AdminPageWrapper() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading...</div>}>
      <AdminPage />
    </Suspense>
  )
}

function AdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showLogin = searchParams.get('login') === 'true'

  const [isLoggedIn, setIsLoggedIn] = useState(!showLogin)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [clients, setClients] = useState<ClientSummary[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        setLoginError('Invalid credentials')
        return
      }
      setIsLoggedIn(true)
      router.replace('/admin')
    } catch {
      setLoginError('Connection error')
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    setIsLoggedIn(false)
    router.replace('/admin?login=true')
  }

  useEffect(() => {
    if (!isLoggedIn) return
    setLoading(true)
    const timeout = setTimeout(async () => {
      try {
        const q = search ? `?q=${encodeURIComponent(search)}` : ''
        const res = await fetch(`/api/admin/clients${q}`)
        if (res.status === 401) {
          setIsLoggedIn(false)
          router.replace('/admin?login=true')
          return
        }
        const data = await res.json()
        setClients(data)
      } catch (error) {
        console.error('Error loading clients:', error)
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => clearTimeout(timeout)
  }, [isLoggedIn, search, router])

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-lg border bg-card p-6">
          <h1 className="text-xl font-semibold">Admin Login</h1>
          {loginError && <p className="text-sm text-red-500">{loginError}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2"
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-foreground px-3 py-2 text-background hover:opacity-90"
          >
            Log in
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <LogOut size={16} /> Log out
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border bg-background py-2 pl-9 pr-3"
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : clients.length === 0 ? (
        <p className="text-muted-foreground">No clients found.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Birth Date</th>
                <th className="px-4 py-3 text-left font-medium">Gender</th>
                <th className="px-4 py-3 text-left font-medium">Readings</th>
                <th className="px-4 py-3 text-left font-medium">Active Links</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => router.push(`/admin/clients/${client.id}`)}
                  className="cursor-pointer border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{client.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatBirthDate(client.birthYear, client.birthMonth, client.birthDay)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{normalizeGender(client.gender)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {client.hasBazi && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600">
                          <Star size={12} /> Bazi
                        </span>
                      )}
                      {client.hasTuVi && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-600">
                          <Moon size={12} /> TuVi
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{client.activeTokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
