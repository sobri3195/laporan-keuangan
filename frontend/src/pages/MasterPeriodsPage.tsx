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
      <header className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 p-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-100">Master Data</p>
        <h1 className="mt-1 text-xl font-semibold">Pengaturan Periode</h1>
        <p className="mt-2 max-w-2xl text-sm text-indigo-100">
          Kelola periode aktif, status lock, dan pantau deadline pelaporan agar proses rekapitulasi berjalan tepat waktu.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total periode" value={summary.total} icon="📅" />
        <SummaryCard label="Periode aktif" value={summary.activeCount} icon="✅" />
        <SummaryCard label="Periode terbuka" value={summary.openCount} icon="🔓" />
        <SummaryCard label="Periode terkunci" value={summary.lockedCount} icon="🔒" />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_240px] md:items-end">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cari periode</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="Contoh: Q1 2026"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filter status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="ALL">Semua status</option>
              <option value="ACTIVE">Aktif</option>
              <option value="OPEN">Terbuka</option>
              <option value="LOCKED">Locked</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2.5 py-1">Menampilkan {filteredPeriods.length} dari {summary.total} periode</span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">{summary.activeCount} aktif</span>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">{summary.openCount} terbuka</span>
          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700">{summary.lockedCount} locked</span>
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
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">{label}</p>
        <span className="text-lg" aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </article>
  );
}
