import { HospitalOption, PeriodOption, ReportFilters } from '../../features/report-export/types';

type Props = {
  filters: ReportFilters;
  periods: PeriodOption[];
  hospitals: HospitalOption[];
  onFilterChange: (next: Partial<ReportFilters>) => void;
};

export function FilterBar({ filters, periods, hospitals, onFilterChange }: Props) {
  return (
    <div className="mt-4 grid gap-2 md:grid-cols-4">
      <input
        className="rounded border px-3 py-2 text-sm"
        placeholder="Search..."
        value={filters.search}
        onChange={(event) => onFilterChange({ search: event.target.value })}
      />
      <select className="rounded border px-3 py-2 text-sm" value={filters.period} onChange={(event) => onFilterChange({ period: event.target.value })}>
        <option value="">Semua periode</option>
        {periods.map((period) => (
          <option key={period.id} value={period.id}>
            {period.label}
          </option>
        ))}
      </select>
      <select
        className="rounded border px-3 py-2 text-sm"
        value={filters.entityType}
        onChange={(event) => onFilterChange({ entityType: event.target.value as ReportFilters['entityType'] })}
      >
        <option value="ALL">Semua entitas</option>
        <option value="PNBP">PNBP</option>
        <option value="BLU">BLU</option>
      </select>
      <select className="rounded border px-3 py-2 text-sm" value={filters.hospitalId} onChange={(event) => onFilterChange({ hospitalId: event.target.value })}>
        <option value="">Semua RS</option>
        {hospitals.map((hospital) => (
          <option key={hospital.id} value={hospital.id}>
            {hospital.name}
          </option>
        ))}
      </select>
    </div>
  );
}
