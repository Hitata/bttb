'use client'

import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CITIES, CUSTOM_CITY_INDEX } from '@/lib/shared/city-presets'

export interface BirthFormData {
  name: string
  gender: 'male' | 'female'
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number
  birthMinute: number
  birthTimeUnknown: boolean
  birthPlace: string
  timezone: string
  latitude: number
  longitude: number
}

interface BirthInputFormProps {
  onSubmit: (data: BirthFormData) => void
  loading?: boolean
  defaultValues?: Partial<BirthFormData>
  showBirthTimeUnknown?: boolean
}

const inputClass =
  'h-8 w-full rounded-xl border border-border bg-background px-2.5 text-sm outline-none transition-colors focus:border-focus-blue focus:ring-1 focus:ring-focus-blue/30'

const currentYear = new Date().getFullYear()

function getCityIndexFromPlace(birthPlace?: string): number {
  if (!birthPlace) return 0
  const idx = CITIES.findIndex(c => c.label === birthPlace)
  return idx >= 0 ? idx : 0
}

export function BirthInputForm({
  onSubmit,
  loading = false,
  defaultValues,
  showBirthTimeUnknown = false,
}: BirthInputFormProps) {
  const nameRef = useRef<HTMLInputElement>(null)
  useEffect(() => { nameRef.current?.focus() }, [])
  const [name, setName] = useState(defaultValues?.name ?? '')
  const [gender, setGender] = useState<'male' | 'female'>(defaultValues?.gender ?? 'male')
  const [birthDay, setBirthDay] = useState(defaultValues?.birthDay ?? 1)
  const [birthMonth, setBirthMonth] = useState(defaultValues?.birthMonth ?? 1)
  const [birthYear, setBirthYear] = useState(defaultValues?.birthYear ?? currentYear - 30)
  const [birthHour, setBirthHour] = useState(defaultValues?.birthHour ?? 12)
  const [birthMinute, setBirthMinute] = useState(defaultValues?.birthMinute ?? 0)
  const [birthTimeUnknown, setBirthTimeUnknown] = useState(
    defaultValues?.birthTimeUnknown ?? false
  )

  const initialCityIndex = getCityIndexFromPlace(defaultValues?.birthPlace)
  const [cityIndex, setCityIndex] = useState(initialCityIndex)

  const [customTz, setCustomTz] = useState(
    defaultValues?.timezone ?? 'Asia/Ho_Chi_Minh'
  )
  const [customLat, setCustomLat] = useState(
    defaultValues?.latitude != null ? String(defaultValues.latitude) : ''
  )
  const [customLng, setCustomLng] = useState(
    defaultValues?.longitude != null ? String(defaultValues.longitude) : ''
  )

  const isCustomCity = cityIndex === CUSTOM_CITY_INDEX

  const handleCityChange = (idx: number) => {
    setCityIndex(idx)
    if (idx !== CUSTOM_CITY_INDEX) {
      setCustomTz(CITIES[idx].tz)
      setCustomLat(String(CITIES[idx].lat))
      setCustomLng(String(CITIES[idx].lng))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const timezone = isCustomCity ? customTz : CITIES[cityIndex].tz
    const latitude = isCustomCity ? Number(customLat) : CITIES[cityIndex].lat
    const longitude = isCustomCity ? Number(customLng) : CITIES[cityIndex].lng
    const birthPlace = isCustomCity ? 'Custom' : CITIES[cityIndex].label

    onSubmit({
      name,
      gender,
      birthYear,
      birthMonth,
      birthDay,
      birthHour: birthTimeUnknown ? 12 : birthHour,
      birthMinute: birthTimeUnknown ? 0 : birthMinute,
      birthTimeUnknown,
      birthPlace,
      timezone,
      latitude,
      longitude,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      {/* Name */}
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground-secondary">Họ và tên</label>
        <input
          ref={nameRef}
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className={inputClass}
          placeholder="Tuỳ chọn"
          required
        />
      </div>

      {/* Gender */}
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground-secondary">Giới tính</label>
        <select
          value={gender}
          onChange={e => setGender(e.target.value as 'male' | 'female')}
          className={inputClass}
        >
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </select>
      </div>

      {/* Birth date row */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">Ngày</label>
          <select
            value={birthDay}
            onChange={e => setBirthDay(Number(e.target.value))}
            className={inputClass}
          >
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">Tháng</label>
          <select
            value={birthMonth}
            onChange={e => setBirthMonth(Number(e.target.value))}
            className={inputClass}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">Năm</label>
          <input
            type="number"
            value={birthYear}
            onChange={e => setBirthYear(Number(e.target.value))}
            min={1900}
            max={2100}
            className={inputClass}
          />
        </div>
      </div>

      {/* Birth time unknown checkbox */}
      {showBirthTimeUnknown && (
        <div>
          <label className="mb-1 flex items-center gap-2 text-xs font-medium text-foreground-secondary">
            <input
              type="checkbox"
              checked={birthTimeUnknown}
              onChange={e => setBirthTimeUnknown(e.target.checked)}
              className="rounded border border-border"
            />
            Không biết giờ sinh
            <span className="italic">— Birth time unknown</span>
          </label>
        </div>
      )}

      {/* Birth time row */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">Giờ</label>
          <select
            value={birthTimeUnknown ? 12 : birthHour}
            onChange={e => setBirthHour(Number(e.target.value))}
            disabled={birthTimeUnknown}
            className={inputClass}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-secondary">Phút</label>
          <select
            value={birthTimeUnknown ? 0 : birthMinute}
            onChange={e => setBirthMinute(Number(e.target.value))}
            disabled={birthTimeUnknown}
            className={inputClass}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Birth place */}
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground-secondary">Nơi sinh</label>
        <select
          value={cityIndex}
          onChange={e => handleCityChange(Number(e.target.value))}
          className={inputClass}
        >
          {CITIES.map((c, i) => (
            <option key={i} value={i}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Custom location fields */}
      {isCustomCity && (
        <div className="space-y-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground-secondary">Múi giờ (IANA)</label>
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
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">Vĩ độ</label>
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
              <label className="mb-1 block text-xs font-medium text-foreground-secondary">Kinh độ</label>
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

      {/* Submit */}
      <Button type="submit" className="w-full" size="sm" disabled={loading}>
        {loading ? 'Đang tính...' : 'Xem lá số'}
      </Button>
    </form>
  )
}
