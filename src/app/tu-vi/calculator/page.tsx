'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CITIES, CUSTOM_CITY_INDEX } from '@/lib/shared/city-presets'
import { EARTHLY_BRANCHES } from '@/lib/tu-vi/palace-data'

const inputClass = 'h-8 w-full rounded-md border bg-background px-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30'

// Birth hour options: 12 Earthly Branches with approximate time ranges
const HOUR_OPTIONS = [
  { label: 'Tý (23:00–01:00)', value: 0, hour: 0 },
  { label: 'Sửu (01:00–03:00)', value: 1, hour: 2 },
  { label: 'Dần (03:00–05:00)', value: 2, hour: 4 },
  { label: 'Mão (05:00–07:00)', value: 3, hour: 6 },
  { label: 'Thìn (07:00–09:00)', value: 4, hour: 8 },
  { label: 'Tỵ (09:00–11:00)', value: 5, hour: 10 },
  { label: 'Ngọ (11:00–13:00)', value: 6, hour: 12 },
  { label: 'Mùi (13:00–15:00)', value: 7, hour: 14 },
  { label: 'Thân (15:00–17:00)', value: 8, hour: 16 },
  { label: 'Dậu (17:00–19:00)', value: 9, hour: 18 },
  { label: 'Tuất (19:00–21:00)', value: 10, hour: 20 },
  { label: 'Hợi (21:00–23:00)', value: 11, hour: 22 },
]

export default function TuViCalculatorPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam')
  const [day, setDay] = useState(1)
  const [month, setMonth] = useState(1)
  const [year, setYear] = useState(1990)
  const [hourBranch, setHourBranch] = useState(0) // Earthly Branch index
  const [cityIndex, setCityIndex] = useState(0)
  const [customTz, setCustomTz] = useState('Asia/Ho_Chi_Minh')
  const [customLat, setCustomLat] = useState('')
  const [customLng, setCustomLng] = useState('')

  const isCustomCity = cityIndex === CUSTOM_CITY_INDEX
  const timezone = isCustomCity ? customTz : CITIES[cityIndex].tz
  const latitude = isCustomCity ? Number(customLat) : CITIES[cityIndex].lat
  const longitude = isCustomCity ? Number(customLng) : CITIES[cityIndex].lng

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const hourOption = HOUR_OPTIONS[hourBranch]

    try {
      // Calculate chart
      const calcRes = await fetch('/api/tu-vi/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          gender,
          year,
          month,
          day,
          hour: hourOption.hour,
          minute: 0,
          timezone,
          latitude,
          longitude,
          birthPlace: isCustomCity ? 'Custom' : CITIES[cityIndex].label,
        }),
      })

      if (!calcRes.ok) {
        const err = await calcRes.json()
        throw new Error(err.error || 'Calculation failed')
      }

      const chart = await calcRes.json()

      // Save to sessionStorage as fallback
      sessionStorage.setItem('tuvi-chart-latest', JSON.stringify(chart))

      // Try to save to DB
      try {
        const saveRes = await fetch('/api/tu-vi/readings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            gender,
            birthYear: year,
            birthMonth: month,
            birthDay: day,
            birthHour: hourOption.hour,
            birthMinute: 0,
            birthPlace: isCustomCity ? 'Custom' : CITIES[cityIndex].label,
            latitude,
            longitude,
            timezone,
            result: chart,
          }),
        })

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

      <h1 className="text-xl font-bold mb-1">Lập Lá Số Tử Vi</h1>
      <p className="text-xs text-muted-foreground mb-6 italic">Calculate your Purple Star chart</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs font-medium mb-1 block">Tên</label>
          <input
            className={inputClass}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nhập tên..."
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-xs font-medium mb-1 block">Giới tính</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setGender('Nam')}
              className={`px-4 py-1.5 rounded-md text-sm border transition-colors ${
                gender === 'Nam' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              Nam
            </button>
            <button
              type="button"
              onClick={() => setGender('Nữ')}
              className={`px-4 py-1.5 rounded-md text-sm border transition-colors ${
                gender === 'Nữ' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              Nữ
            </button>
          </div>
        </div>

        {/* Date */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs font-medium mb-1 block">Ngày</label>
            <input className={inputClass} type="number" min={1} max={31} value={day} onChange={e => setDay(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Tháng</label>
            <input className={inputClass} type="number" min={1} max={12} value={month} onChange={e => setMonth(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Năm</label>
            <input className={inputClass} type="number" min={1900} max={2100} value={year} onChange={e => setYear(Number(e.target.value))} />
          </div>
        </div>

        {/* Birth hour (Earthly Branch) */}
        <div>
          <label className="text-xs font-medium mb-1 block">Giờ sinh (Chi)</label>
          <select
            className={inputClass}
            value={hourBranch}
            onChange={e => setHourBranch(Number(e.target.value))}
          >
            {HOUR_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="text-xs font-medium mb-1 block">Nơi sinh</label>
          <select
            className={inputClass}
            value={cityIndex}
            onChange={e => setCityIndex(Number(e.target.value))}
          >
            {CITIES.map((c, i) => (
              <option key={i} value={i}>{c.label}</option>
            ))}
          </select>
        </div>

        {isCustomCity && (
          <div className="space-y-2 pl-3 border-l-2 border-primary/20">
            <div>
              <label className="text-xs font-medium mb-1 block">Timezone (IANA)</label>
              <input className={inputClass} value={customTz} onChange={e => setCustomTz(e.target.value)} placeholder="Asia/Ho_Chi_Minh" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium mb-1 block">Vĩ độ</label>
                <input className={inputClass} value={customLat} onChange={e => setCustomLat(e.target.value)} placeholder="10.8231" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Kinh độ</label>
                <input className={inputClass} value={customLng} onChange={e => setCustomLng(e.target.value)} placeholder="106.6297" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Đang tính...' : 'Lập Lá Số'}
        </Button>
      </form>
    </div>
  )
}
