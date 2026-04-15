import { ReactNode } from 'react';

type Column<T> = { key: keyof T | string; title: string; render?: (row: T) => ReactNode };

export function Table<T extends { id: string }>({ data, columns }: { data: T[]; columns: Column<T>[] }) {
  return (
    <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>{columns.map((col) => <th key={String(col.key)} className="p-3 text-left">{col.title}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t border-slate-100">
              {columns.map((col) => (
                <td key={String(col.key)} className="p-3">{col.render ? col.render(row) : String((row as Record<string, unknown>)[String(col.key)] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
