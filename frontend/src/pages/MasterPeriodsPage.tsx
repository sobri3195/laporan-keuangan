import { useState } from 'react';
import { Badge } from '../components/common/Badge';
import { Table } from '../components/common/Table';
import { periods as initialPeriods } from '../mocks/seedData';

export default function MasterPeriodsPage() {
  const [periodRows, setPeriodRows] = useState(initialPeriods);

  const setActivePeriod = (periodId: string) => {
    setPeriodRows((current) => current.map((period) => ({ ...period, isActive: period.id === periodId })));
  };

  const toggleLock = (periodId: string) => {
    setPeriodRows((current) => current.map((period) => (period.id === periodId ? { ...period, isLocked: !period.isLocked } : period)));
  };

  return (
    <Table
      data={periodRows}
      columns={[
        { key: 'label', title: 'Periode' },
        { key: 'year', title: 'Tahun' },
        {
          key: 'isActive',
          title: 'Status Aktif',
          render: (period) => (period.isActive ? <Badge tone="success">Aktif</Badge> : <Badge>Non-aktif</Badge>)
        },
        {
          key: 'isLocked',
          title: 'Status Lock',
          render: (period) => (period.isLocked ? <Badge tone="danger">Locked</Badge> : <Badge tone="warning">Open</Badge>)
        },
        {
          key: 'actions',
          title: 'Aksi',
          className: 'whitespace-nowrap',
          render: (period) => (
            <div className="flex gap-2">
              <button
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                onClick={() => setActivePeriod(period.id)}
                type="button"
              >
                Jadikan aktif
              </button>
              <button
                className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => toggleLock(period.id)}
                type="button"
              >
                {period.isLocked ? 'Buka lock' : 'Lock'}
              </button>
            </div>
          )
        }
      ]}
    />
  );
}
