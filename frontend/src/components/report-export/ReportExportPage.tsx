import { useEffect, useMemo, useState } from 'react';
import { reportExportApi } from '../../features/report-export/api';
import { buildCalculatedValues } from '../../features/report-export/calculations';
import { exportMonitoringWorkbook } from '../../features/report-export/exportExcel';
import { useBootstrapReportExport, useReportExportStore } from '../../features/report-export/hooks';
import { HospitalOption, PeriodOption, ReportRecord } from '../../features/report-export/types';
import { ReportFormValues } from '../../features/report-export/validation';
import { ErrorState } from './ErrorState';
import { ExportToolbar } from './ExportToolbar';
import { ReportDataTable } from './ReportDataTable';
import { ReportFormModal } from './ReportFormModal';
import { SpreadsheetPreview } from './SpreadsheetPreview';

export default function ReportExportPage() {
  useBootstrapReportExport();

  const { reports, filters, setFilters, loadReports, saveReport, removeReport, selectedReportId, setSelectedReportId, loading, error, toast, dismissToast } =
    useReportExportStore();

  const [periods, setPeriods] = useState<PeriodOption[]>([]);
  const [hospitals, setHospitals] = useState<HospitalOption[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ReportRecord | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ReportRecord | null>(null);

  useEffect(() => {
    void reportExportApi.getOptions().then((options) => {
      setPeriods(options.periods);
      setHospitals(options.hospitals);
      if (!filters.period && options.periods[0]) {
        setFilters({ period: options.periods[0].id });
      }
    });
  }, [filters.period, setFilters]);

  useEffect(() => {
    if (filters.period) {
      void loadReports();
    }
  }, [filters, loadReports]);

  const selected = useMemo(() => reports.find((row) => row.id === selectedReportId) ?? null, [reports, selectedReportId]);

  const handleSave = async (values: ReportFormValues) => {
    const payload = {
      ...values,
      ...buildCalculatedValues(values.entityType, values)
    };

    await saveReport(
      {
        period: payload.period,
        hospitalId: payload.hospitalId,
        entityType: payload.entityType,
        status: payload.status,
        saldoAwal: payload.saldoAwal,
        pendapatan: payload.pendapatan,
        pengeluaran: payload.pengeluaran,
        piutang: payload.piutang,
        persediaan: payload.persediaan,
        hutang: payload.hutang
      },
      editing?.id
    );
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-800">Laporan & Export XLS</h1>
        <p className="text-sm text-slate-600">Modul gabungan CRUD data laporan, preview seperti worksheet XLS, dan export format monitoring.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-4">
          <input className="rounded border px-3 py-2 text-sm" placeholder="Search..." value={filters.search} onChange={(event) => setFilters({ search: event.target.value })} />
          <select className="rounded border px-3 py-2 text-sm" value={filters.period} onChange={(event) => setFilters({ period: event.target.value })}>
            <option value="">Semua periode</option>
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.label}
              </option>
            ))}
          </select>
          <select className="rounded border px-3 py-2 text-sm" value={filters.entityType} onChange={(event) => setFilters({ entityType: event.target.value as typeof filters.entityType })}>
            <option value="ALL">Semua entitas</option>
            <option value="PNBP">PNBP</option>
            <option value="BLU">BLU</option>
          </select>
          <select className="rounded border px-3 py-2 text-sm" value={filters.hospitalId} onChange={(event) => setFilters({ hospitalId: event.target.value })}>
            <option value="">Semua RS</option>
            {hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="rounded bg-primary px-3 py-2 text-sm font-semibold text-white" onClick={() => setModalOpen(true)}>
            Tambah Data
          </button>
          <button className="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white" onClick={() => void exportMonitoringWorkbook(reports, filters.period, 'filtered')}>
            Export XLS
          </button>
          <button className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white" onClick={() => void exportMonitoringWorkbook(reports, filters.period, 'template')}>
            Export Template Format
          </button>
        </div>
      </header>

      <ExportToolbar rows={reports} selected={selected} period={filters.period} />

      {error ? <ErrorState message={error} /> : null}
      {loading ? <p className="text-sm text-slate-500">Loading data laporan...</p> : null}

      <ReportDataTable
        data={reports}
        periods={periods}
        hospitals={hospitals}
        onView={(row) => setSelectedReportId(row.id)}
        onPreview={(row) => setSelectedReportId(row.id)}
        onEdit={(row) => {
          setEditing(row);
          setModalOpen(true);
        }}
        onDelete={(row) => setConfirmDelete(row)}
      />

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-700">Area Preview XLS</h2>
        <div className="mb-2 flex gap-2">
          <button className="rounded border border-slate-300 px-3 py-2 text-xs" onClick={() => selected && void loadReports()}>
            Refresh Preview
          </button>
        </div>
        <SpreadsheetPreview report={selected} hospitals={hospitals} periods={periods} />
      </div>

      <ReportFormModal
        open={modalOpen}
        editing={editing}
        periods={periods}
        hospitals={hospitals}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSave}
      />

      {confirmDelete ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg">
            <h3 className="font-semibold text-slate-800">Konfirmasi Hapus</h3>
            <p className="mt-2 text-sm text-slate-600">Hapus/arsipkan data draft ini?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded border px-3 py-2 text-sm" onClick={() => setConfirmDelete(null)}>
                Batal
              </button>
              <button
                className="rounded bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
                onClick={() => {
                  void removeReport(confirmDelete.id);
                  setConfirmDelete(null);
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className={`fixed bottom-4 right-4 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${toast.tone === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          <div className="flex items-center gap-3">
            <span>{toast.message}</span>
            <button className="text-xs underline" onClick={dismissToast}>
              Tutup
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
