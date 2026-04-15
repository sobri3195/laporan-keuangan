import { Link } from 'react-router-dom';
import { Table } from '../components/common/Table';
import { reports } from '../mocks/seedData';
import { STATUS_LABEL } from '../lib/constants';

const actionableStatuses = new Set(['SUBMITTED', 'REVISED']);

export default function ApprovalsPage() {
  const approvalQueue = reports.filter((report) => actionableStatuses.has(report.status));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Approval & Revisi</h2>
        <p className="text-sm text-slate-600">Daftar laporan yang menunggu verifikasi, approval, atau revisi.</p>
      </div>

      <Table
        data={approvalQueue}
        columns={[
          { key: 'id', title: 'ID' },
          { key: 'hospitalId', title: 'RS' },
          { key: 'entityType', title: 'Jenis Data' },
          { key: 'status', title: 'Status', render: (row) => STATUS_LABEL[row.status] },
          { key: 'updatedAt', title: 'Update Terakhir' },
          {
            key: 'action',
            title: 'Aksi',
            render: (row) => (
              <div className="flex gap-2">
                <Link className="text-primary" to={`/reports/${row.id}`}>
                  Review
                </Link>
                <Link className="text-secondary" to={`/reports/${row.id}/edit`}>
                  Revisi
                </Link>
              </div>
            )
          }
        ]}
      />
    </div>
  );
}
