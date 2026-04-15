import { Link } from 'react-router-dom';
import { reports } from '../mocks/seedData';
import { STATUS_LABEL } from '../lib/constants';
import { Table } from '../components/common/Table';

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Link className="rounded bg-primary px-3 py-2 text-white" to="/reports/pnbp/new">+ PNBP</Link>
        <Link className="rounded bg-secondary px-3 py-2 text-white" to="/reports/blu/new">+ BLU</Link>
      </div>
      <Table
        data={reports}
        columns={[
          { key: 'id', title: 'ID' },
          { key: 'entityType', title: 'Entity' },
          { key: 'status', title: 'Status', render: (r) => STATUS_LABEL[r.status] },
          { key: 'completenessScore', title: 'Completeness' },
          { key: 'updatedAt', title: 'Updated' },
          { key: 'action', title: 'Action', render: (r) => <Link className="text-primary" to={`/reports/${r.id}`}>Detail</Link> }
        ]}
      />
    </div>
  );
}
