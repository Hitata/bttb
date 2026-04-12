'use client'

import type { ChartRelationship } from '@/lib/bazi/types'

const TYPE_STYLES: Record<string, { label: string; color: string }> = {
  tamHoi:    { label: 'Tam Hội',   color: 'bg-purple-100 text-purple-800' },
  tamHop:    { label: 'Tam Hợp',   color: 'bg-blue-100 text-blue-800' },
  banHoi:    { label: 'Bán Hội',   color: 'bg-purple-50 text-purple-700' },
  banHop:    { label: 'Bán Hợp',   color: 'bg-blue-50 text-blue-700' },
  canHop:    { label: 'Can Hợp',   color: 'bg-green-100 text-green-800' },
  chiLucHop: { label: 'Lục Hợp',   color: 'bg-green-50 text-green-700' },
  chiXung:   { label: 'Xung',      color: 'bg-red-100 text-red-800' },
  chiHinh:   { label: 'Hình',      color: 'bg-orange-100 text-orange-800' },
}

const PILLAR_NAMES = ['Năm', 'Tháng', 'Ngày', 'Giờ']

export default function RelationshipsPanel({ relationships }: { relationships: ChartRelationship[] }) {
  if (relationships.length === 0) return null

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">Quan Hệ Can Chi</h3>
      <div className="flex flex-wrap gap-2">
        {relationships.map((rel, i) => {
          const meta = TYPE_STYLES[rel.type] ?? { label: rel.type, color: 'bg-secondary text-foreground' }
          return (
            <div key={i} className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${meta.color}`}>
              <span>{rel.label}</span>
              {rel.strength && (
                <span className="ml-1 opacity-70">
                  ({rel.strength === 'strong' ? 'mạnh' : rel.strength === 'medium' ? 'ổn' : 'yếu'})
                </span>
              )}
              <span className="ml-1.5 opacity-50">
                [{rel.indices.map(idx => PILLAR_NAMES[idx]).join('–')}]
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
