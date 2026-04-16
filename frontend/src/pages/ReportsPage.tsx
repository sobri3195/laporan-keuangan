import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { reports } from '../mocks/seedData';
import { STATUS_LABEL } from '../lib/constants';
import { Table } from '../components/common/Table';
import { MonitoringExcelExportButtons } from '../features/reports/export/MonitoringExcelExportButtons';
import { Badge } from '../components/common/Badge';
import { ReportStatus } from '../types/domain';

const statusToneMap: Partial<Record<ReportStatus, 'default' | 'success' | 'warning' | 'danger'>> = {
  DRAFT: 'default',
  SUBMITTED: 'default',
  IN_REVIEW: 'warning',
  REVISION_REQUESTED: 'danger',
  APPROVED: 'success',
  LOCKED: 'default'
};

export default function ReportsPage() {
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ReportStatus>('ALL');

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchKeyword = [report.id, report.entityType, report.periodId]
        .join(' ')
        .toLowerCase()
        .includes(keyword.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || report.status === statusFilter;
      return matchKeyword && matchStatus;
    });
  }, [keyword, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Link className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm" to="/reports/pnbp/new">
          + PNBP
        </Link>
        <Link className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm" to="/reports/blu/new">
          + BLU
        </Link>
      </div>

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <label className="space-y-1 text-sm md:col-span-2">
          <span className="text-slate-600">Cari laporan</span>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari ID, entity, atau periode..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-primary/20 focus:ring"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-600">Filter status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'ALL' | ReportStatus)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-primary/20 focus:ring"
          >
            <option value="ALL">Semua status</option>
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Export Monitoring</h3>
        <MonitoringExcelExportButtons />
      </div>

      <Table
        data={filteredReports}
        emptyMessage="Tidak ada laporan yang sesuai filter saat ini."
        columns={[
          { key: 'id', title: 'ID' },
          { key: 'entityType', title: 'Entity' },
          {
            key: 'status',
            title: 'Status',
            render: (report) => <Badge tone={statusToneMap[report.status] ?? 'default'}>{STATUS_LABEL[report.status]}</Badge>
          },
          { key: 'completenessScore', title: 'Completeness', render: (report) => `${report.completenessScore}%` },
          { key: 'updatedAt', title: 'Updated', render: (report) => new Date(report.updatedAt).toLocaleString('id-ID') },
          {
            key: 'action',
            title: 'Action',
            render: (report) => (
              <Link className="font-semibold text-primary hover:underline" to={`/reports/${report.id}`}>
                Detail
              </Link>
            )
          }
        ]}
      />
    </div>
  );
}
