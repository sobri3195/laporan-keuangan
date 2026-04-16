import { useMemo, useState } from 'react';
import { MonitoringExcelExportButtons } from '../features/reports/export/MonitoringExcelExportButtons';
import { periods, reports } from '../mocks/seedData';

const exportFormats = [
  { id: 'xls', label: 'Excel (.xls)', description: 'Format baku template monitoring pusat.' },
  { id: 'csv', label: 'CSV (.csv)', description: 'Ringan untuk analisis lanjutan.' },
  { id: 'pdf', label: 'PDF (.pdf)', description: 'Siap cetak untuk rapat.' }
] as const;

type ExportHistory = {
  id: string;
  periodLabel: string;
  entity: 'PNBP' | 'BLU' | 'ALL';
  format: (typeof exportFormats)[number]['id'];
  createdAt: string;
};

export default function ExportsPage() {
  const [selectedPeriodId, setSelectedPeriodId] = useState(periods.find((period) => period.isActive)?.id ?? periods[0]?.id ?? '');
  const [selectedEntity, setSelectedEntity] = useState<'ALL' | 'PNBP' | 'BLU'>('ALL');
  const [history, setHistory] = useState<ExportHistory[]>([]);

  const selectedPeriod = periods.find((period) => period.id === selectedPeriodId);

  const totalReportsInScope = useMemo(
    () =>
      reports.filter(
        (report) =>
          report.periodId === selectedPeriodId &&
          (selectedEntity === 'ALL' || report.entityType === selectedEntity)
      ).length,
    [selectedEntity, selectedPeriodId]
  );

  const queueExport = (format: (typeof exportFormats)[number]['id']) => {
    if (!selectedPeriod) return;
    setHistory((current) => [
      {
        id: `EX-${current.length + 1}`,
        periodLabel: selectedPeriod.label,
        entity: selectedEntity,
        format,
        createdAt: new Date().toISOString()
      },
      ...current
    ]);
  };

  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-800">Laporan & Export</h1>
        <p className="text-sm text-slate-600">Pilih periode, entitas, lalu ekspor laporan sesuai kebutuhan operasional dan audit.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Filter export</h2>
          <div className="space-y-3">
            <label className="block text-sm text-slate-700">
              Periode
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                value={selectedPeriodId}
                onChange={(event) => setSelectedPeriodId(event.target.value)}
              >
                {periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm text-slate-700">
              Entitas
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                value={selectedEntity}
                onChange={(event) => setSelectedEntity(event.target.value as typeof selectedEntity)}
              >
                <option value="ALL">PNBP + BLU</option>
                <option value="PNBP">PNBP</option>
                <option value="BLU">BLU</option>
              </select>
            </label>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Total laporan pada scope saat ini: <span className="font-semibold text-slate-900">{totalReportsInScope}</span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Template baku monitoring</h2>
          <MonitoringExcelExportButtons />
          <p className="mt-3 text-xs text-slate-500">Gunakan tombol ini untuk export sesuai format template pusat yang sudah disepakati.</p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Export cepat</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {exportFormats.map((format) => (
            <button
              key={format.id}
              type="button"
              onClick={() => queueExport(format.id)}
              className="rounded-lg border border-slate-300 p-3 text-left hover:bg-slate-50"
            >
              <p className="text-sm font-semibold text-slate-800">{format.label}</p>
              <p className="text-xs text-slate-600">{format.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Riwayat export sesi ini</h2>
        {history.length === 0 ? (
          <p className="text-sm text-slate-600">Belum ada export yang dijalankan.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {history.map((row) => (
              <li key={row.id} className="rounded-md border border-slate-200 px-3 py-2 text-slate-700">
                [{row.format.toUpperCase()}] {row.periodLabel} · {row.entity} · {new Date(row.createdAt).toLocaleString('id-ID')}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
