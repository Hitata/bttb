'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CITIES, CUSTOM_CITY_INDEX } from '@/lib/shared/city-presets'

const inputClass = 'h-8 w-full rounded-md border bg-background px-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30'

export default function CalculatorPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [gender, setGender] = useState('male')
  const [day, setDay] = useState(1)
  const [month, setMonth] = useState(1)
  const [year, setYear] = useState(1990)
  const [hour, setHour] = useState(12)
  const [minute, setMinute] = useState(0)
  const [birthTimeUnknown, setBirthTimeUnknown] = useState(false)
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

    if (!name.trim()) {
      setError('Vui lòng nhập tên')
      return
    }
    if (isCustomCity && (!customLat || !customLng)) {
      setError('Vui lòng nhập tọa độ')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/human-design/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          gender,
          year, month, day,
          hour: birthTimeUnknown ? 12 : hour,
          minute: birthTimeUnknown ? 0 : minute,
          timezone,
          latitude,
          longitude,
          birthTimeUnknown,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Calculation failed')
      }

      const chart = await res.json()

      // Save to DB
      const city = isCustomCity ? 'Custom' : CITIES[cityIndex].label
      const saveRes = await fetch('/api/human-design/readings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          gender,
          birthYear: year, birthMonth: month, birthDay: day,
          birthHour: birthTimeUnknown ? null : hour,
          birthMinute: birthTimeUnknown ? null : minute,
          birthTimeUnknown,
          birthPlace: city,
          latitude, longitude, timezone,
          result: chart,
        }),
      })

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

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Họ và tên</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className={inputClass}
            placeholder="Nhập tên"
            aria-required="true"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Giới tính</label>
          <select value={gender} onChange={e => setGender(e.target.value)} className={inputClass}>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Ngày</label>
            <select value={day} onChange={e => setDay(Number(e.target.value))} className={inputClass}>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Tháng</label>
            <select value={month} onChange={e => setMonth(Number(e.target.value))} className={inputClass}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Năm</label>
            <input
              type="number"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              min={1900} max={2100}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <input
              type="checkbox"
              checked={birthTimeUnknown}
              onChange={e => setBirthTimeUnknown(e.target.checked)}
              className="rounded border-muted-foreground/30"
            />
            Không biết giờ sinh
            <span className="italic">— Birth time unknown</span>
          </label>
        </div>

        {!birthTimeUnknown && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Giờ</label>
              <select value={hour} onChange={e => setHour(Number(e.target.value))} className={inputClass}>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Phút</label>
              <select value={minute} onChange={e => setMinute(Number(e.target.value))} className={inputClass}>
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {birthTimeUnknown && (
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-md px-3 py-2">
            Khi chưa biết giờ sinh, biểu đồ sẽ dùng 12:00 trưa. Loại hình (Type) và trung tâm có thể chưa chính xác.
          </p>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Nơi sinh</label>
          <select
            value={cityIndex}
            onChange={e => setCityIndex(Number(e.target.value))}
            className={inputClass}
          >
            {CITIES.map((c, i) => (
              <option key={i} value={i}>{c.label}</option>
            ))}
          </select>
        </div>

        {isCustomCity && (
          <div className="space-y-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Múi giờ (IANA)</label>
              <input
                type="text"
                value={customTz}
                onChange={e => setCustomTz(e.target.value)}
                className={inputClass}
                placeholder="Asia/Ho_Chi_Minh"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Vĩ độ</label>
                <input
                  type="number"
                  step="any"
                  value={customLat}
                  onChange={e => setCustomLat(e.target.value)}
                  className={inputClass}
                  placeholder="10.82"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Kinh độ</label>
                <input
                  type="number"
                  step="any"
                  value={customLng}
                  onChange={e => setCustomLng(e.target.value)}
                  className={inputClass}
                  placeholder="106.63"
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? 'Đang tính...' : 'Tính Biểu Đồ'}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-4 text-center leading-relaxed">
        Giờ sinh chính xác giúp biểu đồ chính xác hơn. Nếu chưa biết, hãy hỏi mẹ hoặc tìm trong giấy khai sinh.
      </p>
    </div>
  )
}
