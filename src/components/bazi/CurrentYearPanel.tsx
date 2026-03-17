import { ElementColorBadge } from './ElementColorBadge'
import { TenGodBadge } from './TenGodBadge'
import type { CurrentYearData, FiveElement } from '@/lib/bazi'

interface CurrentYearPanelProps {
  data: CurrentYearData
}

export function CurrentYearPanel({ data }: CurrentYearPanelProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h4 className="mb-3 text-center font-semibold">{data.year}</h4>
      <table className="w-full text-sm">
        <tbody>
          <tr>
            <td className="py-1 text-xs text-muted-foreground">Thiên Can</td>
            <td className="py-1 text-center">
              <div className="flex items-center justify-center gap-1">
                <TenGodBadge tenGod={data.yearCanThapThan} />
                <ElementColorBadge element={data.yearCanNguHanh as FiveElement} className="font-bold">
                  {data.can}
                </ElementColorBadge>
              </div>
              <div className="text-xs text-muted-foreground">{data.yearCanNguHanh}</div>
            </td>
          </tr>
          <tr>
            <td className="py-1 text-xs text-muted-foreground">Địa Chi</td>
            <td className="py-1 text-center">
              <ElementColorBadge element={data.yearChiNguHanh as FiveElement} className="font-bold">
                {data.chi}
              </ElementColorBadge>
              <div className="text-xs text-muted-foreground">{data.yearChiNguHanh}</div>
            </td>
          </tr>
          <tr>
            <td className="py-1 text-xs text-muted-foreground">Tàng Can</td>
            <td className="py-1 text-center">
              {data.tangCan.map((tc, i) => (
                <div key={i} className="flex items-center justify-center gap-1 text-xs">
                  <TenGodBadge tenGod={tc.thapThan} className="text-[10px]" />
                  <ElementColorBadge element={tc.nguHanh as FiveElement}>{tc.can}</ElementColorBadge>
                </div>
              ))}
            </td>
          </tr>
          <tr>
            <td className="py-1 text-xs text-muted-foreground">Nạp Âm</td>
            <td className="py-1 text-center text-xs">
              <ElementColorBadge element={data.naYin.element}>{data.naYin.name}</ElementColorBadge>
            </td>
          </tr>
          <tr>
            <td className="py-1 text-xs text-muted-foreground">Trường Sinh</td>
            <td className="py-1 text-center text-xs">{data.vongTruongSinh.name}</td>
          </tr>
          {data.thanSat.length > 0 && (
            <tr>
              <td className="py-1 text-xs text-muted-foreground">Thần Sát</td>
              <td className="py-1 text-center text-xs">
                {data.thanSat.map((ts, i) => (
                  <span key={i} className={`block ${ts.type === 'good' ? 'text-green-600' : ts.type === 'bad' ? 'text-red-600' : ''}`}>
                    {ts.name}
                  </span>
                ))}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
