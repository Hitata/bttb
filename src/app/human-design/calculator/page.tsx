'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BirthInputForm, type BirthFormData } from '@/components/shared/BirthInputForm'

export default function CalculatorPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (data: BirthFormData) => {
    setError('')
    setIsLoading(true)
    try {
      // Calculate
      const calcRes = await fetch('/api/human-design/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          gender: data.gender,
          year: data.birthYear,
          month: data.birthMonth,
          day: data.birthDay,
          hour: data.birthTimeUnknown ? 12 : data.birthHour,
          minute: data.birthTimeUnknown ? 0 : data.birthMinute,
          timezone: data.timezone,
          latitude: data.latitude,
          longitude: data.longitude,
          birthTimeUnknown: data.birthTimeUnknown,
        }),
      })

      if (!calcRes.ok) {
        const errData = await calcRes.json()
        throw new Error(errData.error || 'Calculation failed')
      }

      const chart = await calcRes.json()

      // Save reading
      const saveRes = await fetch('/api/human-design/readings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          gender: data.gender,
          birthYear: data.birthYear,
          birthMonth: data.birthMonth,
          birthDay: data.birthDay,
          birthHour: data.birthTimeUnknown ? null : data.birthHour,
          birthMinute: data.birthTimeUnknown ? null : data.birthMinute,
          birthTimeUnknown: data.birthTimeUnknown,
          birthPlace: data.birthPlace,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          result: chart,
        }),
      })

      // Save client (fire-and-forget)
      fetch('/api/human-design/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          gender: data.gender,
          year: data.birthYear,
          month: data.birthMonth,
          day: data.birthDay,
          hour: data.birthTimeUnknown ? null : data.birthHour,
          minute: data.birthTimeUnknown ? null : data.birthMinute,
          birthTimeUnknown: data.birthTimeUnknown,
          birthPlace: data.birthPlace,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
        }),
      }).catch(() => {})

      if (saveRes.ok) {
        const { id } = await saveRes.json()
        router.push(`/human-design/chart/${id}`)
      } else {
        // Fallback to sessionStorage if save fails
        sessionStorage.setItem('hd-chart-latest', JSON.stringify(chart))
        router.push('/human-design/chart/latest')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tính biểu đồ. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/human-design" className="hover:underline">Thiết Kế Con Người</Link>
        <span className="mx-1.5">/</span>
        <span>Tính Biểu Đồ</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Tính Biểu Đồ</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Nhập thông tin sinh để khám phá biểu đồ của bạn
        <span className="italic ml-1">— Calculate your Human Design chart</span>
      </p>

      <BirthInputForm
        onSubmit={handleSubmit}
        loading={isLoading}
        showBirthTimeUnknown={true}
      />

      {error && (
        <p className="text-xs text-destructive mt-2">{error}</p>
      )}

      <p className="text-xs text-muted-foreground mt-4 text-center leading-relaxed">
        Giờ sinh chính xác giúp biểu đồ chính xác hơn. Nếu chưa biết, hãy hỏi mẹ hoặc tìm trong giấy khai sinh.
      </p>
    </div>
  )
}
