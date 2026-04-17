import { HospitalOption, PeriodOption, ReportFilters } from '../../features/report-export/types';
import { FilterBar } from './FilterBar';

type Props = {
  filters: ReportFilters;
  periods: PeriodOption[];
  hospitals: HospitalOption[];
  onFilterChange: (next: Partial<ReportFilters>) => void;
  onAdd: () => void;
  onExportXls: () => void;
  onExportTemplate: () => void;
};

export function PageHeader({ filters, periods, hospitals, onFilterChange, onAdd, onExportXls, onExportTemplate }: Props) {
  return (
    <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h1 className="text-lg font-semibold text-slate-800">Laporan & Export XLS</h1>
      <p className="text-sm text-slate-600">Modul gabungan CRUD data laporan, preview worksheet XLS, dan export format monitoring resmi.</p>

      <FilterBar filters={filters} periods={periods} hospitals={hospitals} onFilterChange={onFilterChange} />

      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded bg-primary px-3 py-2 text-sm font-semibold text-white" onClick={onAdd}>
          Tambah Data
        </button>
        <button className="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white" onClick={onExportXls}>
          Export XLS
        </button>
        <button className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white" onClick={onExportTemplate}>
          Export Template Format
        </button>
      </div>
    </header>
  );
}
