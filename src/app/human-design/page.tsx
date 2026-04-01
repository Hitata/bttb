'use client'

import Link from 'next/link'
import { HD_CHAPTERS } from '@/lib/human-design-data'

export default function HumanDesignPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Thiết Kế Con Người</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Human Design System — Hệ thống tự hiểu bản thân qua tổng hợp Kinh Dịch, Kabbalah, Luân Xa, Chiêm Tinh
        </p>
      </div>

      <Link
        href="/human-design/calculator"
        className="mb-6 block rounded-lg border-2 border-primary/30 bg-primary/5 p-5 hover:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-primary/15 text-primary">
            ◎
          </div>
          <div>
            <h3 className="font-semibold text-sm">Tính Biểu Đồ Của Bạn</h3>
            <p className="text-xs text-muted-foreground italic">Calculate your Human Design chart</p>
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {HD_CHAPTERS.map((ch) => (
          <Link
            key={ch.slug}
            href={`/human-design/${ch.slug}`}
            className="group rounded-lg border p-5 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: ch.color + '18', color: ch.color }}
              >
                {ch.icon}
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {String(ch.order).padStart(2, '0')}
              </span>
            </div>
            <h3 className="font-semibold text-sm group-hover:underline">{ch.title.vn}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 italic">{ch.title.en}</p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{ch.subtitle.vn}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
