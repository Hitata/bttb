'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Search, Star, Moon, Plus, X } from 'lucide-react'

interface UnlinkedClient {
  id: string
  name: string
  type: 'bazi' | 'tuvi'
}

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
  const [reloadKey, setReloadKey] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [unlinked, setUnlinked] = useState<UnlinkedClient[]>([])
  const [selectedClient, setSelectedClient] = useState<UnlinkedClient | null>(null)
  const [creating, setCreating] = useState(false)

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

  async function openAddModal() {
    setShowAddModal(true)
    try {
      const res = await fetch('/api/admin/clients/unlinked')
      const data = await res.json()
      setUnlinked(data)
    } catch (error) {
      console.error('Error loading unlinked clients:', error)
    }
  }

  async function createProfile() {
    if (!selectedClient) return
    setCreating(true)
    try {
      const body: Record<string, string> = { name: selectedClient.name }
      if (selectedClient.type === 'bazi') body.baziClientId = selectedClient.id
      else body.tuViClientId = selectedClient.id
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setShowAddModal(false)
        setSelectedClient(null)
        setReloadKey((k) => k + 1)
      }
    } catch (error) {
      console.error('Error creating profile:', error)
    } finally {
      setCreating(false)
    }
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
  }, [isLoggedIn, search, router, reloadKey])

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-card p-8 shadow-sm">
          <h1 className="text-xl font-semibold">Admin Login</h1>
          {loginError && <p className="text-sm text-destructive">{loginError}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring placeholder:text-muted-foreground/50"
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring placeholder:text-muted-foreground/50"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Log in
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <div className="flex items-center gap-3">
          <button onClick={openAddModal} className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Plus size={14} /> Add Client
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut size={16} /> Log out
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-md rounded-t-xl border border-border bg-card p-6 sm:rounded-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add Client Profile</h2>
              <button onClick={() => { setShowAddModal(false); setSelectedClient(null) }} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            {unlinked.length === 0 ? (
              <p className="text-sm text-muted-foreground">No unlinked Bazi or TuVi clients found. Create one via the calculator pages first.</p>
            ) : (
              <>
                <p className="mb-3 text-sm text-muted-foreground">Select an existing Bazi or TuVi client to create a profile:</p>
                <div className="mb-4 max-h-60 space-y-1 overflow-y-auto">
                  {unlinked.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedClient(c)}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        selectedClient?.id === c.id ? 'bg-secondary border border-border' : 'hover:bg-secondary/60'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${
                        c.type === 'bazi' ? 'bg-amber-500/10 text-amber-600' : 'bg-purple-500/10 text-purple-600'
                      }`}>
                        {c.type === 'bazi' ? 'Bazi' : 'TuVi'}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={createProfile}
                  disabled={!selectedClient || creating}
                  className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Profile'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

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
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-lg border border-border sm:block">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/40">
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
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-secondary/50"
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

          {/* Mobile cards */}
          <div className="space-y-2 sm:hidden">
            {clients.map((client) => (
              <div
                key={client.id}
                onClick={() => router.push(`/admin/clients/${client.id}`)}
                className="cursor-pointer rounded-lg border border-border p-3 transition-colors active:bg-secondary/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm">{client.name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {formatBirthDate(client.birthYear, client.birthMonth, client.birthDay)}
                      {normalizeGender(client.gender) && (
                        <> · {normalizeGender(client.gender)}</>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground/40">→</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {client.hasBazi && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-600">
                      <Star size={10} /> Bazi
                    </span>
                  )}
                  {client.hasTuVi && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-600">
                      <Moon size={10} /> TuVi
                    </span>
                  )}
                  {client.activeTokens > 0 && (
                    <span className="text-[10px] text-muted-foreground">
                      {client.activeTokens} link{client.activeTokens > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
