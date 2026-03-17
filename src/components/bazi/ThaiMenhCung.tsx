import type { ThaiMenhCung as ThaiMenhCungData } from '@/lib/bazi'

interface ThaiMenhCungProps {
  data: ThaiMenhCungData
}

export function ThaiMenhCungDisplay({ data }: ThaiMenhCungProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Thai Cung & Mệnh Cung</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border p-4 text-center">
          <div className="text-sm text-muted-foreground">Thai Cung</div>
          <div className="mt-1 text-xl font-bold">
            {data.thaiCung.can} {data.thaiCung.chi}
          </div>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <div className="text-sm text-muted-foreground">Mệnh Cung</div>
          <div className="mt-1 text-xl font-bold">
            {data.menhCung.can} {data.menhCung.chi}
          </div>
        </div>
      </div>
    </div>
  )
}
