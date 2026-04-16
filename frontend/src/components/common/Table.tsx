import { ReactNode } from 'react';

type Column<T> = { key: keyof T | string; title: string; render?: (row: T) => ReactNode; className?: string };

export function Table<T extends { id: string }>({
  data,
  columns,
  emptyMessage = 'Data belum tersedia.'
}: {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="p-3 text-left font-semibold">
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td className="p-5 text-center text-slate-500" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-t border-slate-100 transition hover:bg-slate-50">
                  {columns.map((col) => (
                    <td key={String(col.key)} className={`p-3 align-top ${col.className ?? ''}`}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
