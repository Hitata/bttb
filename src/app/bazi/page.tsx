'use client'

import { Suspense, useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { BirthInputForm, type BirthFormData } from '@/components/shared/BirthInputForm'
import { BirthInputSummary } from '@/components/bazi/BirthInputSummary'
import { ShareLinkBar } from '@/components/bazi/ShareLinkBar'
import { Save, Check, Loader2, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { BaziResult, BirthInput } from '@/lib/bazi'

const BaziPillarTable = dynamic(() => import('@/components/bazi/BaziPillarTable').then(m => ({ default: m.BaziPillarTable })))
const CurrentYearPanel = dynamic(() => import('@/components/bazi/CurrentYearPanel').then(m => ({ default: m.CurrentYearPanel })))
const DaiVanSection = dynamic(() => import('@/components/bazi/DaiVanSection').then(m => ({ default: m.DaiVanSection })))
const FengShuiCompass = dynamic(() => import('@/components/bazi/FengShuiCompass').then(m => ({ default: m.FengShuiCompass })))
const ThanSatTable = dynamic(() => import('@/components/bazi/ThanSatTable').then(m => ({ default: m.ThanSatTable })))
const ThaiMenhCungDisplay = dynamic(() => import('@/components/bazi/ThaiMenhCung').then(m => ({ default: m.ThaiMenhCungDisplay })))
const RawDataExport = dynamic(() => import('@/components/bazi/RawDataExport').then(m => ({ default: m.RawDataExport })))
const EnergyColorProfile = dynamic(() => import('@/components/bazi/EnergyColorProfile').then(m => ({ default: m.EnergyColorProfile })))
const RelationshipsPanel = dynamic(() => import('@/components/bazi/RelationshipsPanel'))
const StrengthPanel = dynamic(() => import('@/components/bazi/StrengthPanel'))

export default function BaziPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Đang tải...
      </div>
    }>
      <BaziPageContent />
    </Suspense>
  )
}

function BaziPageContent() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [result, setResult] = useState<BaziResult | null>(null)
  const [input, setInput] = useState<BirthInput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savingClient, setSavingClient] = useState(false)
  const [savedClient, setSavedClient] = useState(false)
  const [formCollapsed, setFormCollapsed] = useState(false)

  // Store last form data so save client handler can access location fields
  const lastFormDataRef = useRef<BirthFormData | null>(null)

  const handleSubmit = useCallback(async (data: BirthFormData) => {
    lastFormDataRef.current = data

    const input: BirthInput = {
      name: data.name,
      gender: data.gender,
      year: data.birthYear,
      month: data.birthMonth,
      day: data.birthDay,
      hour: data.birthHour,
      minute: data.birthMinute,
    }

    setIsLoading(true)
    setError(null)
    setInput(input)
    setSaved(false)
    setSavedClient(false)

    try {
      const res = await fetch('/api/bazi/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Calculation failed')
      }

      const baziResult: BaziResult = await res.json()
      setResult(baziResult)
      setFormCollapsed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleExpand = useCallback(() => setFormCollapsed(false), [])

  // Auto-load from URL params
  useEffect(() => {
    const name = searchParams.get('name')
    const gender = searchParams.get('gender')
    const y = searchParams.get('y')
    const m = searchParams.get('m')
    const d = searchParams.get('d')
    const h = searchParams.get('h')
    const min = searchParams.get('min')

    if (name && gender && y && m && d) {
      const data: BirthFormData = {
        name,
        gender: gender as 'male' | 'female',
        birthYear: Number(y),
        birthMonth: Number(m),
        birthDay: Number(d),
        birthHour: Number(h || 0),
        birthMinute: Number(min || 0),
        birthTimeUnknown: false,
        birthPlace: '',
        timezone: 'Asia/Ho_Chi_Minh',
        latitude: 10.82,
        longitude: 106.63,
      }
      handleSubmit(data)
    }
  }, [searchParams, handleSubmit])

  const handleSave = async () => {
    if (!session?.user || !result || !input) return
    setSaving(true)
    try {
      const res = await fetch('/api/bazi/readings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          birthYear: input.year,
          birthMonth: input.month,
          birthDay: input.day,
          birthHour: input.hour,
          birthMinute: input.minute,
          result,
        }),
      })
      if (res.ok) setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveClient = async () => {
    if (!result || !input) return
    const formData = lastFormDataRef.current
    setSavingClient(true)
    try {
      const res = await fetch('/api/bazi/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: input.name,
          gender: input.gender,
          year: input.year,
          month: input.month,
          day: input.day,
          hour: input.hour,
          minute: input.minute,
          birthPlace: formData?.birthPlace,
          latitude: formData?.latitude,
          longitude: formData?.longitude,
          timezone: formData?.timezone,
        }),
      })
      if (res.ok) setSavedClient(true)
    } finally {
      setSavingClient(false)
    }
  }

  const handleYearClick = async (year: number) => {
    if (!result) return
    try {
      const params = new URLSearchParams({
        dm: String(result.dayMasterIndex),
        yc: String(result.tutru.thienTru.canIndex),
        yb: String(result.tutru.thienTru.chiIndex),
        db: String(result.tutru.nhatTru.chiIndex),
      })
      const res = await fetch(`/api/bazi/daivan/${year}?${params}`)
      if (res.ok) {
        const yearData = await res.json()
        setResult(prev => prev ? { ...prev, daivan: { ...prev.daivan, currentYear: yearData } } : prev)
      }
    } catch {
      // silently fail
    }
  }

  const initialValues = searchParams.get('name') ? {
    name: searchParams.get('name') || '',
    gender: (searchParams.get('gender') || 'male') as 'male' | 'female',
    birthYear: Number(searchParams.get('y') || 1990),
    birthMonth: Number(searchParams.get('m') || 1),
    birthDay: Number(searchParams.get('d') || 1),
    birthHour: Number(searchParams.get('h') || 0),
    birthMinute: Number(searchParams.get('min') || 0),
  } : undefined

  const hasResult = result && input

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left sidebar - Form */}
        <aside className={`shrink-0 ${hasResult ? 'lg:w-[180px]' : 'lg:w-[200px]'} transition-all duration-300`}>
          <div className="lg:sticky lg:top-[72px]">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-lg font-semibold tracking-tight lg:text-xl">
                Lá Số Bát Tự
              </h1>
              <span />
            </div>
            {formCollapsed && input
              ? <BirthInputSummary input={input} onEdit={handleExpand} />
              : <BirthInputForm onSubmit={handleSubmit} loading={isLoading} defaultValues={initialValues} />
            }

            {error && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Actions when result is available */}
            {hasResult && (
              <div className="mt-3 space-y-2">
                <ShareLinkBar input={input} />
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
                      Đã lưu khách
                    </>
                  ) : savingClient ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="size-3.5" />
                      Lưu khách hàng
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
                        Đã lưu
                      </>
                    ) : saving ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="size-3.5" />
                        Lưu lá số
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
                <CalendarDays className="size-8 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Nhập thông tin ngày sinh để lập lá số
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex min-h-[40vh] flex-col items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">Đang tính toán...</p>
            </div>
          )}

          {hasResult && (
            <div className="space-y-6">
              {/* Four Pillars + Current Year */}
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
                <BaziPillarTable
                  tuTru={result.tutru}
                  solarDate={result.date.solar}
                  lunarDate={result.date.lunar}
                  nongLichDate={result.date.nongLich}
                  hour={input.hour}
                  minute={input.minute}
                />
                <CurrentYearPanel data={result.daivan.currentYear} />
              </div>

              {/* Dai Van */}
              <DaiVanSection
                cycles={result.daivan.cycles}
                chuKy={result.daivan.chuKy}
                startAge={result.daivan.startAge}
                onYearClick={handleYearClick}
              />

              {/* Feng Shui + Than Sat + Thai Menh Cung */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {result.compass.length > 0 && (
                  <FengShuiCompass data={result.compass[0]} />
                )}
                <ThanSatTable data={result.thansat} />
                {result.thaiMenhCung && (
                  <ThaiMenhCungDisplay data={result.thaiMenhCung} />
                )}
              </div>

              {/* Relationships & Strength Analysis */}
              {result.analysis && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <RelationshipsPanel relationships={result.analysis.relationships} />
                  <StrengthPanel
                    seasonalStrength={result.analysis.seasonalStrength}
                    stemRootedness={result.analysis.stemRootedness}
                    factions={result.analysis.factions}
                    positionalInteractions={result.analysis.positionalInteractions}
                    extremeDynamics={result.analysis.extremeDynamics}
                    cungVi={result.analysis.cungVi}
                  />
                </div>
              )}

              {/* Energy Color Profile */}
              <EnergyColorProfile result={result} input={input} />

              {/* Raw Data Export */}
              <RawDataExport result={result} input={input} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
