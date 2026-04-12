// src/app/admin/clients/[id]/page.tsx
'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Copy, Check, Plus, Star, Moon, Hexagon } from 'lucide-react'

interface TokenData {
  id: string
  clientType: string
  maxMessages: number
  expiresAt: string
  createdAt: string
  _count: { messages: number }
}

interface ClientDetail {
  id: string
  name: string
  baziClientId: string | null
  tuViClientId: string | null
  hdClientId: string | null
  baziClient: {
    name: string
    gender: string
    birthYear: number
    birthMonth: number
    birthDay: number
    birthHour: number
    dayMaster: string
    chartSummary: string
  } | null
  tuViClient: {
    name: string
    gender: string
    birthYear: number
    birthMonth: number
    birthDay: number
    birthHour: number
    cucName: string
    chartSummary: string
  } | null
  hdClient: {
    name: string
    gender: string
    birthYear: number
    birthMonth: number
    birthDay: number
    birthHour: number | null
    birthTimeUnknown: boolean
    designType: string | null
    chartSummary: string | null
  } | null
  tokens: TokenData[]
}

function normalizeGender(gender: string): string {
  const lower = gender.toLowerCase()
  if (lower === 'male' || lower === 'nam') return 'Nam'
  if (lower === 'female' || lower === 'nữ' || lower === 'nu') return 'Nữ'
  return gender
}

function getTokenStatus(token: TokenData): { label: string; color: string } {
  const now = new Date()
  if (new Date(token.expiresAt) <= now) return { label: 'Expired', color: 'bg-muted text-muted-foreground' }
  if (token._count.messages >= token.maxMessages) return { label: 'Maxed', color: 'bg-orange-500/10 text-orange-600' }
  return { label: 'Active', color: 'bg-green-500/10 text-green-600' }
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'bazi' | 'tuvi' | 'hd'>('bazi')
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null)
  const [generating, setGenerating] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/clients/${id}`)
        if (res.status === 401) {
          router.replace('/admin?login=true')
          return
        }
        if (!res.ok) {
          router.replace('/admin')
          return
        }
        const data = await res.json()
        setClient(data)
        if (!data.baziClientId && data.tuViClientId) setActiveTab('tuvi')
        else if (!data.baziClientId && !data.tuViClientId && data.hdClientId) setActiveTab('hd')
      } catch (error) {
        console.error('Error loading client:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  async function fetchClient() {
    const clientRes = await fetch(`/api/admin/clients/${id}`)
    const data = await clientRes.json()
    setClient(data)
  }

  async function generateToken(clientType: 'bazi' | 'tuvi' | 'hd') {
    setGenerating(clientType)
    try {
      const res = await fetch('/api/admin/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientProfileId: id, clientType }),
      })
      if (res.ok) {
        await fetchClient()
      }
    } catch (error) {
      console.error('Error generating token:', error)
    } finally {
      setGenerating(null)
    }
  }

  async function handleGenerate(system: string) {
    setGenerating(system)
    try {
      const res = await fetch(`/api/admin/clients/${id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system }),
      })
      if (res.ok) {
        await fetchClient()
      }
    } finally {
      setGenerating(null)
    }
  }

  async function copyLink(tokenId: string) {
    const url = `${window.location.origin}/readings/${tokenId}`
    await navigator.clipboard.writeText(url)
    setCopiedTokenId(tokenId)
    setTimeout(() => setCopiedTokenId(null), 2000)
  }

  async function revokeToken(tokenId: string) {
    try {
      await fetch(`/api/admin/tokens/${tokenId}`, { method: 'DELETE' })
      await fetchClient()
    } catch (error) {
      console.error('Error revoking token:', error)
    }
  }

  if (loading) return <div className="mx-auto max-w-4xl p-6 text-muted-foreground">Loading...</div>
  if (!client) return <div className="mx-auto max-w-4xl p-6 text-muted-foreground">Client not found</div>

  const birth = client.baziClient ?? client.tuViClient ?? client.hdClient
  const birthDate = birth
    ? `${birth.birthDay.toString().padStart(2, '0')}/${birth.birthMonth.toString().padStart(2, '0')}/${birth.birthYear}`
    : ''

  return (
    <div className="mx-auto max-w-4xl p-6">
      <button onClick={() => router.push('/admin')} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{client.name}</h1>
        {birth && (
          <p className="text-muted-foreground">
            {birthDate} · {normalizeGender(birth.gender)}
          </p>
        )}
      </div>

      {(!client.baziClientId || !client.tuViClientId || !client.hdClientId) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {!client.baziClientId && (
            <button
              onClick={() => handleGenerate('bazi')}
              disabled={!!generating}
              className="flex items-center gap-1 rounded-md bg-amber-500/10 px-3 py-1.5 text-sm text-amber-600 hover:bg-amber-500/20 disabled:opacity-50"
            >
              <Plus size={14} /> {generating === 'bazi' ? 'Generating...' : 'Generate Bazi'}
            </button>
          )}
          {!client.tuViClientId && (
            <button
              onClick={() => handleGenerate('tuvi')}
              disabled={!!generating}
              className="flex items-center gap-1 rounded-md bg-purple-500/10 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-500/20 disabled:opacity-50"
            >
              <Plus size={14} /> {generating === 'tuvi' ? 'Generating...' : 'Generate Tu-Vi'}
            </button>
          )}
          {!client.hdClientId && (
            <button
              onClick={() => handleGenerate('hd')}
              disabled={!!generating}
              className="flex items-center gap-1 rounded-md bg-blue-500/10 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-500/20 disabled:opacity-50"
            >
              <Plus size={14} /> {generating === 'hd' ? 'Generating...' : 'Generate HD'}
            </button>
          )}
        </div>
      )}

      <div className="mb-4 flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('bazi')}
          className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'bazi' ? 'border-primary text-foreground' : 'border-transparent text-foreground-secondary hover:text-foreground'
          }`}
        >
          <Star size={14} /> Bazi
        </button>
        <button
          onClick={() => setActiveTab('tuvi')}
          className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'tuvi' ? 'border-primary text-foreground' : 'border-transparent text-foreground-secondary hover:text-foreground'
          }`}
        >
          <Moon size={14} /> TuVi
        </button>
        <button
          onClick={() => setActiveTab('hd')}
          className={`flex items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'hd' ? 'border-primary text-foreground' : 'border-transparent text-foreground-secondary hover:text-foreground'
          }`}
        >
          <Hexagon size={14} /> HD
        </button>
      </div>

      <div className="mb-8 rounded-lg border border-border bg-card p-4">
        {activeTab === 'bazi' ? (
          client.baziClient ? (
            <div>
              <p className="font-medium">{client.baziClient.dayMaster}</p>
              <p className="mt-1 text-sm text-muted-foreground">{client.baziClient.chartSummary}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No Bazi reading linked.</p>
          )
        ) : activeTab === 'tuvi' ? (
          client.tuViClient ? (
            <div>
              <p className="font-medium">{client.tuViClient.cucName}</p>
              <p className="mt-1 text-sm text-muted-foreground">{client.tuViClient.chartSummary}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No TuVi reading linked.</p>
          )
        ) : (
          client.hdClient ? (
            <div>
              <p className="font-medium">{client.hdClient.designType ?? 'Unknown Design Type'}</p>
              <p className="mt-1 text-sm text-muted-foreground">{client.hdClient.chartSummary}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {client.hdClient.birthTimeUnknown
                  ? 'Birth time unknown'
                  : `${client.hdClient.birthDay.toString().padStart(2, '0')}/${client.hdClient.birthMonth.toString().padStart(2, '0')}/${client.hdClient.birthYear}${client.hdClient.birthHour != null ? ` · Hour ${client.hdClient.birthHour}` : ''}`}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">No Human Design reading linked.</p>
          )
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Reading Links</h2>
        <div className="flex gap-2">
          {client.baziClientId && (
            <button
              onClick={() => generateToken('bazi')}
              disabled={!!generating}
              className="flex items-center gap-1 rounded-md bg-amber-500/10 px-3 py-1.5 text-sm text-amber-600 hover:bg-amber-500/20 disabled:opacity-50"
            >
              <Plus size={14} /> Bazi Link
            </button>
          )}
          {client.tuViClientId && (
            <button
              onClick={() => generateToken('tuvi')}
              disabled={!!generating}
              className="flex items-center gap-1 rounded-md bg-purple-500/10 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-500/20 disabled:opacity-50"
            >
              <Plus size={14} /> TuVi Link
            </button>
          )}
          {client.hdClientId && (
            <button
              onClick={() => generateToken('hd')}
              disabled={!!generating}
              className="flex items-center gap-1 rounded-md bg-blue-500/10 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-500/20 disabled:opacity-50"
            >
              <Plus size={14} /> HD Link
            </button>
          )}
        </div>
      </div>

      {client.tokens.length === 0 ? (
        <p className="text-muted-foreground">No reading links generated yet.</p>
      ) : (
        <div className="space-y-2">
          {client.tokens.map((token) => {
            const status = getTokenStatus(token)
            const expiryDate = new Date(token.expiresAt).toLocaleDateString()
            return (
              <div key={token.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-secondary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${status.color}`}>
                    {status.label}
                  </span>
                  <span className="text-sm">
                    {token.clientType === 'bazi' ? 'Bazi' : token.clientType === 'tuvi' ? 'TuVi' : 'HD'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {token._count.messages}/{token.maxMessages} questions
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Expires {expiryDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyLink(token.id)}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    {copiedTokenId === token.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copiedTokenId === token.id ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => window.open(`/readings/${token.id}`, '_blank')}
                    className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    View
                  </button>
                  {status.label === 'Active' && (
                    <button
                      onClick={() => revokeToken(token.id)}
                      className="rounded-md px-2 py-1 text-sm text-red-500 hover:bg-red-500/10"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
