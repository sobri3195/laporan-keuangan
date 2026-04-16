import { useMemo, useState } from 'react';
import { Badge } from '../components/common/Badge';
import { Table } from '../components/common/Table';
import { periods as initialPeriods } from '../mocks/seedData';
import { Period } from '../types/domain';

const PERIOD_DEADLINES: Record<string, string> = {
  '2026-Q1': '2026-04-20',
  '2025-Q4': '2026-01-15'
};

export default function MasterPeriodsPage() {
  const [periodRows, setPeriodRows] = useState(initialPeriods);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'LOCKED' | 'OPEN'>('ALL');

  const filteredPeriods = useMemo(() => {
    const lowerSearch = search.toLowerCase().trim();

    return periodRows.filter((period) => {
      const matchSearch = lowerSearch.length === 0 || period.label.toLowerCase().includes(lowerSearch);
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && period.isActive) ||
        (statusFilter === 'LOCKED' && period.isLocked) ||
        (statusFilter === 'OPEN' && !period.isLocked);
      return matchSearch && matchStatus;
    });
  }, [periodRows, search, statusFilter]);

  const summary = useMemo(() => {
    const activeCount = periodRows.filter((period) => period.isActive).length;
    const lockedCount = periodRows.filter((period) => period.isLocked).length;
    const openCount = periodRows.length - lockedCount;
    return { total: periodRows.length, activeCount, lockedCount, openCount };
  }, [periodRows]);

  const setActivePeriod = (periodId: string) => {
    setPeriodRows((current) => current.map((period) => ({ ...period, isActive: period.id === periodId })));
  };

  const toggleLock = (periodId: string) => {
    setPeriodRows((current) => current.map((period) => (period.id === periodId ? { ...period, isLocked: !period.isLocked } : period)));
  };

  const renderDeadline = (period: Period) => {
    const deadline = PERIOD_DEADLINES[period.id];
    if (!deadline) return <span className="text-slate-500">Belum diatur</span>;

    const dayDiff = Math.ceil((new Date(`${deadline}T00:00:00Z`).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (dayDiff < 0) return <Badge tone="danger">Lewat {Math.abs(dayDiff)} hari</Badge>;
    if (dayDiff === 0) return <Badge tone="warning">Hari ini</Badge>;
    return <Badge tone="success">H-{dayDiff}</Badge>;
  };

  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-800">Pengaturan Periode</h1>
        <p className="text-sm text-slate-600">Kelola periode aktif, status lock, dan pantau deadline pelaporan.</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total periode" value={summary.total} />
        <SummaryCard label="Periode aktif" value={summary.activeCount} />
        <SummaryCard label="Periode terbuka" value={summary.openCount} />
        <SummaryCard label="Periode terkunci" value={summary.lockedCount} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            placeholder="Cari nama periode..."
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          >
            <option value="ALL">Semua status</option>
            <option value="ACTIVE">Aktif</option>
            <option value="OPEN">Terbuka</option>
            <option value="LOCKED">Locked</option>
          </select>
        </div>
      </section>

      <Table
        data={filteredPeriods}
        emptyMessage="Tidak ada periode yang sesuai filter."
        columns={[
          { key: 'label', title: 'Periode' },
          { key: 'year', title: 'Tahun' },
          {
            key: 'isActive',
            title: 'Status aktif',
            render: (period) => (period.isActive ? <Badge tone="success">Aktif</Badge> : <Badge>Non-aktif</Badge>)
          },
          {
            key: 'isLocked',
            title: 'Lock',
            render: (period) => (period.isLocked ? <Badge tone="danger">Locked</Badge> : <Badge tone="warning">Open</Badge>)
          },
          {
            key: 'deadline',
            title: 'Sisa deadline',
            render: (period) => renderDeadline(period)
          },
          {
            key: 'actions',
            title: 'Aksi',
            className: 'whitespace-nowrap',
            render: (period) => (
              <div className="flex gap-2">
                <button
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => setActivePeriod(period.id)}
                  type="button"
                >
                  Jadikan aktif
                </button>
                <button
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
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
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </article>
  );
}
