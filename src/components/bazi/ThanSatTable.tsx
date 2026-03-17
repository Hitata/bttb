import type { ThanSatAnnual } from '@/lib/bazi'

interface ThanSatTableProps {
  data: ThanSatAnnual[]
}

export function ThanSatTable({ data }: ThanSatTableProps) {
  if (data.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Thần Sát</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border px-3 py-2" colSpan={3}>Thần Sát</th>
            </tr>
          </thead>
          <tbody>
            {data.map((ts, i) => (
              <tr key={i}>
                <td className="border px-3 py-2 font-medium">{ts.name}</td>
                <td className="border px-3 py-2">{ts.day}</td>
                <td className="border px-3 py-2">{ts.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
