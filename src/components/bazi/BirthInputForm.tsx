'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Pencil, User, Calendar, Clock } from 'lucide-react'
import type { BirthInput, Gender } from '@/lib/bazi'

interface BirthInputFormProps {
  onSubmit: (data: BirthInput) => void
  isLoading: boolean
  initialValues?: Partial<BirthInput>
  /** Whether to show collapsed summary (after results are available) */
  collapsed?: boolean
  /** Called when user clicks to expand the form */
  onExpand?: () => void
  /** The current input data (for summary display) */
  currentInput?: BirthInput | null
}

export function BirthInputForm({
  onSubmit,
  isLoading,
  initialValues,
  collapsed = false,
  onExpand,
  currentInput,
}: BirthInputFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [gender, setGender] = useState<Gender>(initialValues?.gender ?? 'male')
  const [day, setDay] = useState(initialValues?.day ?? 1)
  const [month, setMonth] = useState(initialValues?.month ?? 1)
  const [year, setYear] = useState(initialValues?.year ?? 1990)
  const [hour, setHour] = useState(initialValues?.hour ?? 0)
  const [minute, setMinute] = useState(initialValues?.minute ?? 0)

  // Sync form from currentInput (after calculation) or initialValues (URL params)
  useEffect(() => {
    const src = currentInput ?? initialValues
    if (src) {
      if (src.name != null) setName(src.name)
      if (src.gender != null) setGender(src.gender)
      if (src.day != null) setDay(src.day)
      if (src.month != null) setMonth(src.month)
      if (src.year != null) setYear(src.year)
      if (src.hour != null) setHour(src.hour)
      if (src.minute != null) setMinute(src.minute)
    }
  }, [currentInput, initialValues])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, gender, day, month, year, hour, minute })
  }

  // Collapsed summary view
  if (collapsed && currentInput) {
    return (
      <button
        type="button"
        onClick={onExpand}
        className="group w-full cursor-pointer rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/30 hover:bg-accent/50"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <User className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate text-sm font-medium">{currentInput.name || 'Không tên'}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {currentInput.gender === 'male' ? 'Nam' : 'Nữ'}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {String(currentInput.day).padStart(2, '0')}/{String(currentInput.month).padStart(2, '0')}/{currentInput.year}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {String(currentInput.hour).padStart(2, '0')}:{String(currentInput.minute).padStart(2, '0')}
              </span>
            </div>
          </div>
          <Pencil className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
      </button>
    )
  }

  // Expanded form view (compact for sidebar)
  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Họ và tên</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="h-8 w-full rounded-md border bg-background px-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
          placeholder="Tuỳ chọn"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Giới tính</label>
        <select
          value={gender}
          onChange={e => setGender(e.target.value as Gender)}
          className="h-8 w-full rounded-md border bg-background px-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
        >
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Ngày</label>
        <select
          value={day}
          onChange={e => setDay(Number(e.target.value))}
          className="h-8 w-full rounded-md border bg-background px-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
        >
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Tháng</label>
        <select
          value={month}
          onChange={e => setMonth(Number(e.target.value))}
          className="h-8 w-full rounded-md border bg-background px-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
        >
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
          min={1900}
          max={2100}
          className="h-8 w-full rounded-md border bg-background px-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Giờ</label>
        <select
          value={hour}
          onChange={e => setHour(Number(e.target.value))}
          className="h-8 w-full rounded-md border bg-background px-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Phút</label>
        <select
          value={minute}
          onChange={e => setMinute(Number(e.target.value))}
          className="h-8 w-full rounded-md border bg-background px-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
        >
          {[0, 15, 30, 45].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full" size="sm" disabled={isLoading}>
        {isLoading ? 'Đang tính...' : 'Lập Lá Số'}
      </Button>
    </form>
  )
}
