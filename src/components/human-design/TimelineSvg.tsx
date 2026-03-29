'use client'

import { useState } from 'react'

interface TimelineEvent {
  year: number
  label: { vn: string; en: string }
  detail: { vn: string; en: string }
  color: string
}

const EVENTS: TimelineEvent[] = [
  {
    year: 1781,
    label: { vn: 'Khám phá Thiên Vương Tinh', en: 'Discovery of Uranus' },
    detail: {
      vn: 'Human Design cho rằng loài người đột biến từ 7 luân xa thành 9 trung tâm vào thời điểm này.',
      en: 'Human Design claims humanity mutated from 7 chakras to 9 centers at this time.'
    },
    color: '#3b82f6',
  },
  {
    year: 1948,
    label: { vn: 'Ra Uru Hu ra đời', en: 'Ra Uru Hu born' },
    detail: {
      vn: 'Robert Alan Krakower sinh tại Montreal, Canada. Sau này trở thành nhà quảng cáo, nhà xuất bản.',
      en: 'Robert Alan Krakower born in Montreal, Canada. Later became an advertising executive and publisher.'
    },
    color: '#f5c542',
  },
  {
    year: 1987,
    label: { vn: '"Giọng Nói" & Siêu Tân Tinh', en: '"The Voice" & Supernova 1987A' },
    detail: {
      vn: '3-11 tháng 1: Ra nhận được truyền tải 8 ngày tại Ibiza. 24 tháng 2: Siêu tân tinh 1987A — sự kiện neutrino đầu tiên được phát hiện từ ngoài Hệ Mặt Trời.',
      en: 'Jan 3-11: Ra receives 8-day transmission in Ibiza. Feb 24: Supernova 1987A — first neutrino event detected from outside the Solar System.'
    },
    color: '#ef4444',
  },
  {
    year: 1991,
    label: { vn: 'Xuất bản "Sách Đen"', en: '"The Black Book" published' },
    detail: {
      vn: 'The Human Design System được xuất bản sau 4 năm Ra xác minh hệ thống qua hàng ngàn lá số.',
      en: 'The Human Design System published after 4 years of Ra verifying the system through thousands of charts.'
    },
    color: '#10b981',
  },
  {
    year: 1999,
    label: { vn: 'Jovian Archive thành lập', en: 'Jovian Archive founded' },
    detail: {
      vn: 'Tổ chức chính thức và International Human Design School được thành lập để truyền dạy hệ thống.',
      en: 'Official organization and International Human Design School established to teach the system.'
    },
    color: '#8b5cf6',
  },
  {
    year: 2011,
    label: { vn: 'Ra Uru Hu qua đời', en: 'Ra Uru Hu passes' },
    detail: {
      vn: 'Ra qua đời tại Ibiza ngày 12 tháng 3. Hệ thống tiếp tục dưới sự quản lý của gia đình.',
      en: 'Ra dies in Ibiza on March 12. The system continues under family stewardship.'
    },
    color: '#6b7280',
  },
]

export function TimelineSvg() {
  const [selected, setSelected] = useState<number | null>(2) // default to 1987

  const width = 700
  const height = 200
  const padding = 60
  const minYear = 1770
  const maxYear = 2020
  const range = maxYear - minYear
  const y = 100

  function xFor(year: number) {
    return padding + ((year - minYear) / range) * (width - padding * 2)
  }

  const selectedEvent = selected !== null ? EVENTS[selected] : null

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px]" xmlns="http://www.w3.org/2000/svg">
          {/* Main line */}
          <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />

          {/* Events */}
          {EVENTS.map((ev, i) => {
            const x = xFor(ev.year)
            const isSelected = selected === i
            return (
              <g
                key={ev.year}
                onClick={() => setSelected(isSelected ? null : i)}
                className="cursor-pointer"
              >
                {/* Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 8 : 6}
                  fill={ev.color}
                  fillOpacity={isSelected ? 1 : 0.7}
                  stroke={isSelected ? ev.color : 'none'}
                  strokeWidth={isSelected ? 3 : 0}
                  strokeOpacity={0.3}
                  className="transition-all duration-200"
                />
                {/* Year */}
                <text
                  x={x}
                  y={y - 18}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isSelected ? '700' : '500'}
                  fill={ev.color}
                  className="transition-all"
                >
                  {ev.year}
                </text>
                {/* Label */}
                <text
                  x={x}
                  y={y + 28}
                  textAnchor="middle"
                  fontSize="8"
                  className="fill-foreground"
                  opacity={isSelected ? 0.9 : 0.5}
                >
                  {ev.label.vn}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Detail card */}
      {selectedEvent && (
        <div
          className="rounded-lg border p-4 text-sm transition-all"
          style={{ borderColor: selectedEvent.color + '40' }}
        >
          <div className="font-semibold" style={{ color: selectedEvent.color }}>
            {selectedEvent.year} — {selectedEvent.label.vn}
          </div>
          <p className="text-xs text-muted-foreground italic mt-0.5">{selectedEvent.label.en}</p>
          <p className="mt-2">{selectedEvent.detail.vn}</p>
          <p className="text-xs text-muted-foreground italic mt-1">{selectedEvent.detail.en}</p>
        </div>
      )}
    </div>
  )
}
