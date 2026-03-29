'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ReadingSummary {
  id: string
  name: string
  gender: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number | null
  birthMinute: number | null
  slug: string | null
  isPublic: boolean
  createdAt: string
}

export default function ReadingsPage() {
  const [readings, setReadings] = useState<ReadingSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bazi/readings')
      .then(res => res.json())
      .then(setReadings)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lá Số Đã Lưu</h1>

      {loading ? (
        <p className="text-center text-muted-foreground">Đang tải...</p>
      ) : readings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Bạn chưa lưu lá số nào.</p>
          <Link href="/bazi" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
            Lập lá số mới
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {readings.map(r => (
            <Link
              key={r.id}
              href={`/bazi/${r.id}`}
              className="block rounded-lg border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{r.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {r.gender === 'male' ? 'Nam' : 'Nữ'} — {r.birthDay}/{r.birthMonth}/{r.birthYear}
                    {r.birthHour != null && ` ${String(r.birthHour).padStart(2, '0')}:${String(r.birthMinute ?? 0).padStart(2, '0')}`}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
