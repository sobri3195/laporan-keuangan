import clsx from 'clsx';
import { SpreadsheetCell } from '../../features/report-export/types';

export function PreviewGrid({ headers, rows }: { headers: string[]; rows: SpreadsheetCell[][] }) {
  return (
    <div className="overflow-auto border border-slate-300">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="border border-slate-300 bg-violet-100 p-2 text-center font-semibold text-slate-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className={clsx('border border-slate-300 p-2 align-middle', {
                    'text-left': cell.align !== 'center' && cell.align !== 'right',
                    'text-center': cell.align === 'center',
                    'text-right': cell.align === 'right',
                    'font-semibold': cell.bold,
                    [cell.bgClass || '']: Boolean(cell.bgClass)
                  })}
                >
                  {cell.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
