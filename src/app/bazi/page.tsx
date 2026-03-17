'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { BirthInputForm } from '@/components/bazi/BirthInputForm'
import { BaziPillarTable } from '@/components/bazi/BaziPillarTable'
import { CurrentYearPanel } from '@/components/bazi/CurrentYearPanel'
import { DaiVanSection } from '@/components/bazi/DaiVanSection'
import { FengShuiCompass } from '@/components/bazi/FengShuiCompass'
import { ThanSatTable } from '@/components/bazi/ThanSatTable'
import { ThaiMenhCungDisplay } from '@/components/bazi/ThaiMenhCung'
import { RawDataExport } from '@/components/bazi/RawDataExport'
import { ShareLinkBar } from '@/components/bazi/ShareLinkBar'
import type { BaziResult, BirthInput } from '@/lib/bazi'

export default function BaziPage() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-6xl px-4 py-8 text-center text-muted-foreground">Đang tải...</div>}>
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

  const handleSubmit = useCallback(async (data: BirthInput) => {
    setIsLoading(true)
    setError(null)
    setInput(data)
    setSaved(false)

    try {
      const res = await fetch('/api/bazi/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Calculation failed')
      }

      const baziResult: BaziResult = await res.json()
      setResult(baziResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])

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
      const data: BirthInput = {
        name,
        gender: gender as 'male' | 'female',
        year: Number(y),
        month: Number(m),
        day: Number(d),
        hour: Number(h || 0),
        minute: Number(min || 0),
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
    year: Number(searchParams.get('y') || 1990),
    month: Number(searchParams.get('m') || 1),
    day: Number(searchParams.get('d') || 1),
    hour: Number(searchParams.get('h') || 0),
    minute: Number(searchParams.get('min') || 0),
  } : undefined

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lập Lá Số Bát Tự (Tứ Trụ)</h1>

      <div className="rounded-lg border p-6 mb-8">
        <BirthInputForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialValues={initialValues}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 mb-8 text-red-700 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {result && input && (
        <div className="space-y-8">
          {/* Share + Save */}
          <div className="space-y-3">
            <ShareLinkBar input={input} />
            {session?.user && (
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className="rounded-md border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
              >
                {saved ? 'Đã lưu!' : saving ? 'Đang lưu...' : 'Lưu lá số'}
              </button>
            )}
          </div>

          {/* Four Pillars + Current Year */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.compass.length > 0 && (
              <FengShuiCompass data={result.compass[0]} />
            )}
            <ThanSatTable data={result.thansat} />
            {result.thaiMenhCung && (
              <ThaiMenhCungDisplay data={result.thaiMenhCung} />
            )}
          </div>

          {/* Raw Data Export */}
          <RawDataExport result={result} input={input} />
        </div>
      )}
    </div>
  )
}
