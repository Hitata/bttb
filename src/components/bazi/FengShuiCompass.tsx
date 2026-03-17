import type { CompassData } from '@/lib/bazi'

interface FengShuiCompassProps {
  data: CompassData
}

export function FengShuiCompass({ data }: FengShuiCompassProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Phương Hướng</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border px-3 py-2" colSpan={3}>Phương Hướng</th>
            </tr>
          </thead>
          <tbody>
            {data.good.map((dir, i) => (
              <tr key={`good-${i}`}>
                {i === 0 && (
                  <td className="border px-3 py-2 text-center font-bold text-green-600" rowSpan={data.good.length}>
                    TỐT
                  </td>
                )}
                <td className="border px-3 py-2 font-medium">{dir.name}</td>
                <td className="border px-3 py-2">
                  {dir.compass}
                  <span className="ml-1 text-xs text-muted-foreground">({dir.zodiac}-{dir.fiveElements})</span>
                </td>
              </tr>
            ))}
            {data.bad.map((dir, i) => (
              <tr key={`bad-${i}`}>
                {i === 0 && (
                  <td className="border px-3 py-2 text-center font-bold text-red-600" rowSpan={data.bad.length}>
                    XẤU
                  </td>
                )}
                <td className="border px-3 py-2 font-medium">{dir.name}</td>
                <td className="border px-3 py-2">
                  {dir.compass}
                  <span className="ml-1 text-xs text-muted-foreground">({dir.zodiac}-{dir.fiveElements})</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
