'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { BaziPillarTable } from '@/components/bazi/BaziPillarTable'
import { CurrentYearPanel } from '@/components/bazi/CurrentYearPanel'
import { DaiVanSection } from '@/components/bazi/DaiVanSection'
import { FengShuiCompass } from '@/components/bazi/FengShuiCompass'
import { ThanSatTable } from '@/components/bazi/ThanSatTable'
import { ThaiMenhCungDisplay } from '@/components/bazi/ThaiMenhCung'
import type { BaziResult } from '@/lib/bazi'

interface ReadingData {
  name: string
  gender: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number | null
  birthMinute: number | null
  result: BaziResult
}

export default function SavedReadingPage() {
  const params = useParams<{ id: string }>()
  const [reading, setReading] = useState<ReadingData | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    fetch(`/api/bazi/readings/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(setReading)
      .catch(() => setError('Không tìm thấy lá số'))
  }, [params.id])

  if (error) return <div className="container mx-auto max-w-6xl px-4 py-8 text-center text-muted-foreground">{error}</div>
  if (!reading) return <div className="container mx-auto max-w-6xl px-4 py-8 text-center text-muted-foreground">Đang tải...</div>

  const result = reading.result

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{reading.name}</h1>
        <p className="text-muted-foreground">
          {reading.gender === 'male' ? 'Nam' : 'Nữ'} —{' '}
          {reading.birthDay}/{reading.birthMonth}/{reading.birthYear}
          {reading.birthHour != null && ` ${String(reading.birthHour).padStart(2, '0')}:${String(reading.birthMinute ?? 0).padStart(2, '0')}`}
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <BaziPillarTable
            tuTru={result.tutru}
            solarDate={result.date.solar}
            lunarDate={result.date.lunar}
            nongLichDate={result.date.nongLich}
            hour={reading.birthHour ?? undefined}
            minute={reading.birthMinute ?? undefined}
          />
          <CurrentYearPanel data={result.daivan.currentYear} />
        </div>

        <DaiVanSection
          cycles={result.daivan.cycles}
          chuKy={result.daivan.chuKy}
          startAge={result.daivan.startAge}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {result.compass.length > 0 && (
            <FengShuiCompass data={result.compass[0]} />
          )}
          <ThanSatTable data={result.thansat} />
          {result.thaiMenhCung && <ThaiMenhCungDisplay data={result.thaiMenhCung} />}
        </div>
      </div>
    </div>
  )
}
