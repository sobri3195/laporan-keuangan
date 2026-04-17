import { useEffect, useMemo, useState } from 'react';
import { reportExportApi } from '../../features/report-export/api';
import { buildCalculatedValues } from '../../features/report-export/calculations';
import { exportMonitoringWorkbook } from '../../features/report-export/exportExcel';
import { useBootstrapReportExport, useReportExportStore } from '../../features/report-export/hooks';
import { HospitalOption, PeriodOption, ReportRecord } from '../../features/report-export/types';
import { ReportFormValues } from '../../features/report-export/validation';
import { ConfirmDialog } from './ConfirmDialog';
import { ErrorState } from './ErrorState';
import { ExportToolbar } from './ExportToolbar';
import { PageHeader } from './PageHeader';
import { ReportDataTable } from './ReportDataTable';
import { ReportFormModal } from './ReportFormModal';
import { SpreadsheetPreview } from './SpreadsheetPreview';
import { ToastNotification } from './ToastNotification';

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

  const refreshPreview = async () => {
    if (!selectedReportId) return;
    const response = await reportExportApi.getPreview(selectedReportId);
    setSelectedReportId(response.data.id);
    await loadReports();
  };

  return (
    <div className="space-y-4">
      <PageHeader
        filters={filters}
        periods={periods}
        hospitals={hospitals}
        onFilterChange={setFilters}
        onAdd={() => setModalOpen(true)}
        onExportXls={() => void exportMonitoringWorkbook(reports, filters.period, 'filtered', 'xls')}
        onExportTemplate={() => void exportMonitoringWorkbook(reports, filters.period, 'template', 'xlsx')}
      />

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
          if (['approved', 'locked'].includes(row.status)) {
            setSelectedReportId(row.id);
            return;
          }
          setEditing(row);
          setModalOpen(true);
        }}
        onDelete={(row) => {
          if (row.status !== 'draft') return;
          setConfirmDelete(row);
        }}
      />

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-700">Area Preview XLS</h2>
        <div className="mb-2 flex gap-2">
          <button className="rounded border border-slate-300 px-3 py-2 text-xs" onClick={() => void refreshPreview()}>
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

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Konfirmasi Hapus"
        message="Hapus/arsipkan data draft ini?"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (!confirmDelete) return;
          void removeReport(confirmDelete.id);
          setConfirmDelete(null);
        }}
      />

      {toast ? <ToastNotification toast={toast} onClose={dismissToast} /> : null}
    </div>
  );
}
