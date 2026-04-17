import { useMemo, useState } from 'react';
import { formatCurrency } from '../../lib/formatters';
import { HospitalOption, PeriodOption, ReportRecord } from '../../features/report-export/types';
import { StatusBadge } from './StatusBadge';

type Props = {
  data: ReportRecord[];
  periods: PeriodOption[];
  hospitals: HospitalOption[];
  onView: (row: ReportRecord) => void;
  onEdit: (row: ReportRecord) => void;
  onDelete: (row: ReportRecord) => void;
  onPreview: (row: ReportRecord) => void;
};

const pageSize = 8;

export function ReportDataTable({ data, periods, hospitals, onView, onEdit, onDelete, onPreview }: Props) {
  const [sortBy, setSortBy] = useState<'updatedAt' | 'pendapatan'>('updatedAt');
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const rows = [...data];
    rows.sort((a, b) => {
      if (sortBy === 'pendapatan') return (b.pendapatan ?? -Infinity) - (a.pendapatan ?? -Infinity);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return rows;
  }, [data, sortBy]);

  const paged = useMemo(() => sorted.slice((page - 1) * pageSize, page * pageSize), [page, sorted]);
  const maxPage = Math.max(1, Math.ceil(sorted.length / pageSize));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Area CRUD Data</h2>
        <select className="rounded border border-slate-300 px-2 py-1 text-xs" value={sortBy} onChange={(event) => setSortBy(event.target.value as 'updatedAt' | 'pendapatan')}>
          <option value="updatedAt">Sort: Updated At</option>
          <option value="pendapatan">Sort: Pendapatan</option>
        </select>
      </div>
      <div className="overflow-auto">
        <table className="w-full min-w-[1080px] text-sm">
          <thead className="bg-slate-50 text-xs text-slate-700">
            <tr>
              {['Periode', 'Nama RS', 'Jenis Entitas', 'Status', 'Pendapatan', 'Pengeluaran', 'Piutang', 'Persediaan', 'Hutang', 'Updated At', 'Action'].map((header) => (
                <th key={header} className="px-3 py-2 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row) => (
              <tr key={row.id} className="border-t border-slate-200">
                <td className="px-3 py-2">{periods.find((period) => period.id === row.period)?.label ?? row.period}</td>
                <td className="px-3 py-2">{hospitals.find((hospital) => hospital.id === row.hospitalId)?.name ?? row.hospitalId}</td>
                <td className="px-3 py-2">{row.entityType}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-3 py-2">{formatCurrency(row.pendapatan)}</td>
                <td className="px-3 py-2">{formatCurrency(row.pengeluaran)}</td>
                <td className="px-3 py-2">{formatCurrency(row.piutang)}</td>
                <td className="px-3 py-2">{formatCurrency(row.persediaan)}</td>
                <td className="px-3 py-2">{formatCurrency(row.hutang)}</td>
                <td className="px-3 py-2">{new Date(row.updatedAt).toLocaleString('id-ID')}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <button className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => onView(row)}>
                      Lihat
                    </button>
                    <button className="rounded border border-indigo-300 px-2 py-1 text-xs text-indigo-700" onClick={() => onEdit(row)}>
                      {['approved', 'locked'].includes(row.status) ? 'Lihat' : 'Edit'}
                    </button>
                    <button
                      className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={row.status !== 'draft'}
                      onClick={() => onDelete(row)}
                    >
                      Hapus
                    </button>
                    <button className="rounded border border-emerald-300 px-2 py-1 text-xs text-emerald-700" onClick={() => onPreview(row)}>
                      Preview
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={11} className="px-3 py-6 text-center text-sm text-slate-500">
                  Data belum tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2 text-xs">
        <button className="rounded border border-slate-300 px-2 py-1 disabled:opacity-40" disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
          Prev
        </button>
        <span>
          Halaman {page}/{maxPage}
        </span>
        <button className="rounded border border-slate-300 px-2 py-1 disabled:opacity-40" disabled={page === maxPage} onClick={() => setPage((prev) => Math.min(maxPage, prev + 1))}>
          Next
        </button>
      </div>
    </section>
  );
}
