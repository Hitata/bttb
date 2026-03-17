'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { BirthInput, Gender } from '@/lib/bazi'

interface BirthInputFormProps {
  onSubmit: (data: BirthInput) => void
  isLoading: boolean
  initialValues?: Partial<BirthInput>
}

export function BirthInputForm({ onSubmit, isLoading, initialValues }: BirthInputFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [gender, setGender] = useState<Gender>(initialValues?.gender ?? 'male')
  const [day, setDay] = useState(initialValues?.day ?? 1)
  const [month, setMonth] = useState(initialValues?.month ?? 1)
  const [year, setYear] = useState(initialValues?.year ?? 1990)
  const [hour, setHour] = useState(initialValues?.hour ?? 0)
  const [minute, setMinute] = useState(initialValues?.minute ?? 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, gender, day, month, year, hour, minute })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Name */}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Họ và tên</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Nhập họ tên..."
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="mb-1 block text-sm font-medium">Giới tính</label>
          <select
            value={gender}
            onChange={e => setGender(e.target.value as Gender)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="mb-1 block text-sm font-medium">Năm sinh</label>
          <input
            type="number"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            min={1900}
            max={2100}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        {/* Month */}
        <div>
          <label className="mb-1 block text-sm font-medium">Tháng</label>
          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
            ))}
          </select>
        </div>

        {/* Day */}
        <div>
          <label className="mb-1 block text-sm font-medium">Ngày</label>
          <select
            value={day}
            onChange={e => setDay(Number(e.target.value))}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        {/* Hour */}
        <div>
          <label className="mb-1 block text-sm font-medium">Giờ</label>
          <select
            value={hour}
            onChange={e => setHour(Number(e.target.value))}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
            ))}
          </select>
        </div>

        {/* Minute */}
        <div>
          <label className="mb-1 block text-sm font-medium">Phút</label>
          <select
            value={minute}
            onChange={e => setMinute(Number(e.target.value))}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            {[0, 15, 30, 45].map(m => (
              <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !name}>
        {isLoading ? 'Đang tính...' : 'Lập Lá Số Bát Tự'}
      </Button>
    </form>
  )
}
