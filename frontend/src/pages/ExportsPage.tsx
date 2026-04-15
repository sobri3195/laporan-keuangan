import { reports } from '../mocks/seedData';
import { MonitoringExcelExportButtons } from '../features/reports/export/MonitoringExcelExportButtons';

const exportFormats = [
  { id: 'xlsx', label: 'Export Excel (.xlsx)' },
  { id: 'pdf', label: 'Export PDF (.pdf)' },
  { id: 'csv', label: 'Export CSV (.csv)' }
];

export default function ExportsPage() {
  const totalReports = reports.length;

  return (
    <div className="space-y-4 rounded-xl bg-white p-4">
      <div>
        <h2 className="text-lg font-semibold">Laporan & Export</h2>
        <p className="text-sm text-slate-600">Unduh rekap laporan untuk periode aktif dalam berbagai format.</p>
      </div>

      <div className="rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
        Total laporan tersedia: <span className="font-semibold">{totalReports}</span>
      </div>

      <div className="rounded-lg border border-slate-200 p-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Template Monitoring Keuangan RS</h3>
        <MonitoringExcelExportButtons />
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        {exportFormats.map((format) => (
          <button
            key={format.id}
            type="button"
            className="rounded-md border border-slate-300 px-3 py-2 text-left text-sm hover:bg-slate-50"
          >
            {format.label}
          </button>
        ))}
      </div>
    </div>
  );
}
