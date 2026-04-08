'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { BirthInputForm, type BirthFormData } from '@/components/shared/BirthInputForm'

export default function TuViCalculatorPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-muted-foreground">Đang tải...</div>}>
      <TuViCalculatorContent />
    </Suspense>
  )
}

function TuViCalculatorContent() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (data: BirthFormData) => {
    setError('')
    setIsLoading(true)
    try {
      // Map gender to Vietnamese for Tu-Vi
      const gender = data.gender === 'male' ? 'Nam' : 'Nữ'

      // Calculate chart
      const calcRes = await fetch('/api/tu-vi/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          gender,
          year: data.birthYear,
          month: data.birthMonth,
          day: data.birthDay,
          hour: data.birthHour,
          minute: data.birthMinute,
          timezone: data.timezone,
          latitude: data.latitude,
          longitude: data.longitude,
          birthPlace: data.birthPlace,
        }),
      })

      if (!calcRes.ok) {
        const err = await calcRes.json()
        throw new Error(err.error || 'Calculation failed')
      }

      const chart = await calcRes.json()

      // Save to sessionStorage as fallback
      sessionStorage.setItem('tuvi-chart-latest', JSON.stringify(chart))

      // Try to save to DB (reading + client profile)
      try {
        const saveBody = {
          name: data.name,
          gender,
          birthYear: data.birthYear,
          birthMonth: data.birthMonth,
          birthDay: data.birthDay,
          birthHour: data.birthHour,
          birthMinute: data.birthMinute,
          birthPlace: data.birthPlace,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          result: chart,
        }

        const [saveRes] = await Promise.all([
          fetch('/api/tu-vi/readings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saveBody),
          }),
          fetch('/api/tu-vi/clients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: data.name,
              gender,
              year: data.birthYear,
              month: data.birthMonth,
              day: data.birthDay,
              hour: data.birthHour,
              minute: data.birthMinute,
              birthPlace: data.birthPlace,
              latitude: data.latitude,
              longitude: data.longitude,
              timezone: data.timezone,
            }),
          }).catch(() => {}),
        ])

        if (saveRes.ok) {
          const { id } = await saveRes.json()
          router.push(`/tu-vi/chart/${id}`)
          return
        }
      } catch {
        // DB save failed, use sessionStorage fallback
      }

      router.push('/tu-vi/chart/latest')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-6">
        <Link href="/tu-vi" className="hover:underline">Tử Vi Đẩu Số</Link>
        <span className="mx-1.5">/</span>
        <span>Lập Lá Số</span>
      </nav>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold mb-1">Lập Lá Số Tử Vi</h1>
          <p className="text-xs text-muted-foreground italic">Calculate your Purple Star chart</p>
        </div>
        <Link
          href="/tu-vi/clients"
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
        >
          Khách hàng →
        </Link>
      </div>

      {error && (
        <div className="mb-4 text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</div>
      )}

      <BirthInputForm onSubmit={handleSubmit} loading={isLoading} />
    </div>
  )
}
