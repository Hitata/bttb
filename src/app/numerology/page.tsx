'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Save, Check, Loader2, Hash, Users, Copy } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { NumerologyResult } from '@/lib/numerology'

const CoreNumbersPanel = dynamic(() => import('@/components/numerology/CoreNumbersPanel').then(m => ({ default: m.CoreNumbersPanel })))
const NameBreakdown = dynamic(() => import('@/components/numerology/NameBreakdown').then(m => ({ default: m.NameBreakdown })))
const CyclesPanel = dynamic(() => import('@/components/numerology/CyclesPanel').then(m => ({ default: m.CyclesPanel })))
const ChallengesPanel = dynamic(() => import('@/components/numerology/ChallengesPanel').then(m => ({ default: m.ChallengesPanel })))
const PinnaclesPanel = dynamic(() => import('@/components/numerology/PinnaclesPanel').then(m => ({ default: m.PinnaclesPanel })))

type TabKey = 'core' | 'cycles' | 'challenges' | 'pinnacles'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'core', label: 'Con S\u1ed1 Ch\u1ee7 \u0110\u1ea1o' },
  { key: 'cycles', label: 'Chu K\u1ef3' },
  { key: 'challenges', label: 'Th\u1eed Th\u00e1ch' },
  { key: 'pinnacles', label: '\u0110\u1ec9nh Cao' },
]

interface FormData {
  fullName: string
  birthYear: number
  birthMonth: number
  birthDay: number
}

export default function NumerologyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        \u0110ang t\u1ea3i...
      </div>
    }>
      <NumerologyPageContent />
    </Suspense>
  )
}

function NumerologyPageContent() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [result, setResult] = useState<NumerologyResult | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savingClient, setSavingClient] = useState(false)
  const [savedClient, setSavedClient] = useState(false)
  const [formCollapsed, setFormCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('core')
  const [copied, setCopied] = useState(false)

  // Form fields
  const [fullName, setFullName] = useState('')
  const [birthYear, setBirthYear] = useState(1990)
  const [birthMonth, setBirthMonth] = useState(1)
  const [birthDay, setBirthDay] = useState(1)

  const currentYear = new Date().getFullYear()

  const handleSubmit = useCallback(async (data: FormData) => {
    setIsLoading(true)
    setError(null)
    setFormData(data)
    setSaved(false)
    setSavedClient(false)

    try {
      const res = await fetch('/api/numerology/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Calculation failed')
      }

      const numerologyResult: NumerologyResult = await res.json()
      setResult(numerologyResult)
      setFormCollapsed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit({ fullName, birthYear, birthMonth, birthDay })
  }

  const handleExpand = useCallback(() => setFormCollapsed(false), [])

  // Auto-load from URL params
  useEffect(() => {
    const name = searchParams.get('name')
    const y = searchParams.get('y')
    const m = searchParams.get('m')
    const d = searchParams.get('d')

    if (name && y && m && d) {
      const data: FormData = {
        fullName: name,
        birthYear: Number(y),
        birthMonth: Number(m),
        birthDay: Number(d),
      }
      setFullName(name)
      setBirthYear(Number(y))
      setBirthMonth(Number(m))
      setBirthDay(Number(d))
      handleSubmit(data)
    }
  }, [searchParams, handleSubmit])

  const handleSave = async () => {
    if (!session?.user || !result || !formData) return
    setSaving(true)
    try {
      const res = await fetch('/api/numerology/readings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          birthYear: formData.birthYear,
          birthMonth: formData.birthMonth,
          birthDay: formData.birthDay,
          result,
        }),
      })
      if (res.ok) setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveClient = async () => {
    if (!result || !formData) return
    setSavingClient(true)
    try {
      const res = await fetch('/api/numerology/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          birthYear: formData.birthYear,
          birthMonth: formData.birthMonth,
          birthDay: formData.birthDay,
        }),
      })
      if (res.ok) setSavedClient(true)
    } finally {
      setSavingClient(false)
    }
  }

  const handleCopyLink = async () => {
    if (!formData) return
    const params = new URLSearchParams({
      name: formData.fullName,
      y: String(formData.birthYear),
      m: String(formData.birthMonth),
      d: String(formData.birthDay),
    })
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/numerology?${params.toString()}`
      : `/numerology?${params.toString()}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasResult = result && formData
  const currentAge = formData ? currentYear - formData.birthYear : 0

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left sidebar - Form */}
        <aside className={`shrink-0 ${hasResult ? 'lg:w-[180px]' : 'lg:w-[200px]'} transition-all duration-300`}>
          <div className="lg:sticky lg:top-[72px]">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-lg font-semibold tracking-tight lg:text-xl">
                Th\u1ea7n S\u1ed1 H\u1ecdc
              </h1>
              <Link
                href="/numerology/clients"
                className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted"
              >
                <Users className="size-3" />
                Kh\u00e1ch
              </Link>
            </div>

            {formCollapsed && formData ? (
              <div className="space-y-2">
                <div className="rounded-lg border border-border bg-card p-3 text-sm">
                  <div className="font-medium">{formData.fullName}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {formData.birthDay}/{formData.birthMonth}/{formData.birthYear}
                  </div>
                </div>
                <button
                  onClick={handleExpand}
                  className="text-xs text-muted-foreground underline-offset-2 hover:underline"
                >
                  S\u1eeda th\u00f4ng tin
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="H\u1ecd t\u00ean khai sinh"
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-ring"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(Number(e.target.value))}
                    className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus:border-ring"
                  >
                    {Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(Number(e.target.value))}
                    className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus:border-ring"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>Th{m}</option>
                    ))}
                  </select>
                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(Number(e.target.value))}
                    className="rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus:border-ring"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" disabled={isLoading || !fullName.trim()} className="w-full" size="sm">
                  {isLoading ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      \u0110ang t\u00ednh...
                    </>
                  ) : (
                    'T\u00ednh to\u00e1n'
                  )}
                </Button>
              </form>
            )}

            {error && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Actions when result is available */}
            {hasResult && (
              <div className="mt-3 space-y-2">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5" />
                      \u0110\u00e3 copy link!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      Copy link chia s\u1ebb
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleSaveClient}
                  disabled={savingClient || savedClient}
                  variant={savedClient ? 'secondary' : 'outline'}
                  size="sm"
                  className="w-full"
                >
                  {savedClient ? (
                    <>
                      <Check className="size-3.5" />
                      \u0110\u00e3 l\u01b0u kh\u00e1ch
                    </>
                  ) : savingClient ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      \u0110ang l\u01b0u...
                    </>
                  ) : (
                    <>
                      <Save className="size-3.5" />
                      L\u01b0u kh\u00e1ch h\u00e0ng
                    </>
                  )}
                </Button>
                {session?.user && (
                  <Button
                    onClick={handleSave}
                    disabled={saving || saved}
                    variant={saved ? 'secondary' : 'outline'}
                    size="sm"
                    className="w-full"
                  >
                    {saved ? (
                      <>
                        <Check className="size-3.5" />
                        \u0110\u00e3 l\u01b0u
                      </>
                    ) : saving ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        \u0110ang l\u01b0u...
                      </>
                    ) : (
                      <>
                        <Save className="size-3.5" />
                        L\u01b0u l\u00e1 s\u1ed1
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Right content - Results */}
        <main className="min-w-0 flex-1">
          {!hasResult && !isLoading && (
            <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-4">
                <Hash className="size-8 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Nh\u1eadp h\u1ecd t\u00ean v\u00e0 ng\u00e0y sinh \u0111\u1ec3 t\u00ednh th\u1ea7n s\u1ed1
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex min-h-[40vh] flex-col items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">\u0110ang t\u00ednh to\u00e1n...</p>
            </div>
          )}

          {hasResult && (
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex gap-1 rounded-lg border border-border bg-muted/50 p-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeTab === tab.key
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === 'core' && (
                <div className="space-y-6">
                  <CoreNumbersPanel
                    lifePath={result.lifePath}
                    birthday={result.birthday}
                    expression={result.expression}
                    soulUrge={result.soulUrge}
                    personality={result.personality}
                    maturity={result.maturity}
                  />
                  <NameBreakdown breakdown={result.nameBreakdown} />
                </div>
              )}

              {activeTab === 'cycles' && (
                <CyclesPanel cycles={result.cycles} />
              )}

              {activeTab === 'challenges' && (
                <ChallengesPanel challenges={result.challenges} currentAge={currentAge} />
              )}

              {activeTab === 'pinnacles' && (
                <PinnaclesPanel pinnacles={result.pinnacles} currentAge={currentAge} />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
