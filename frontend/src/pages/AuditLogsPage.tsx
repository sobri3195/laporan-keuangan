import { useMemo, useState } from 'react';
import { Badge } from '../components/common/Badge';
import { Table } from '../components/common/Table';
import { mockAuditLogs } from '../mocks/activityData';
import { users } from '../mocks/seedData';

const actionTone = {
  CREATE: 'success',
  UPDATE: 'warning',
  SUBMIT: 'default',
  APPROVE: 'success',
  EXPORT: 'default',
  LOGIN: 'default'
} as const;

export default function AuditLogsPage() {
  const [query, setQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<'ALL' | 'PERIOD' | 'REPORT' | 'EXPORT' | 'ACCOUNT' | 'NOTIFICATION'>('ALL');

  const rows = useMemo(() => {
    const lowerQuery = query.toLowerCase().trim();

    return mockAuditLogs.filter((row) => {
      const actor = users.find((user) => user.id === row.actorId)?.fullName ?? row.actorId;
      const searchableText = `${row.target} ${row.description} ${actor}`.toLowerCase();
      const matchesQuery = lowerQuery.length === 0 || searchableText.includes(lowerQuery);
      const matchesModule = moduleFilter === 'ALL' || row.module === moduleFilter;
      return matchesQuery && matchesModule;
    });
  }, [moduleFilter, query]);

  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-800">Audit Trail</h1>
        <p className="text-sm text-slate-600">Jejak aktivitas penting pengguna untuk kepatuhan, investigasi, dan validasi proses bisnis.</p>
      </header>

      <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          placeholder="Cari aktor, target, atau deskripsi..."
        />
        <select
          value={moduleFilter}
          onChange={(event) => setModuleFilter(event.target.value as typeof moduleFilter)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="ALL">Semua modul</option>
          <option value="PERIOD">Period</option>
          <option value="REPORT">Report</option>
          <option value="EXPORT">Export</option>
          <option value="ACCOUNT">Account</option>
          <option value="NOTIFICATION">Notification</option>
        </select>
      </section>

      <Table
        data={rows}
        emptyMessage="Audit log tidak ditemukan untuk filter saat ini."
        columns={[
          {
            key: 'timestamp',
            title: 'Waktu',
            render: (row) => new Date(row.timestamp).toLocaleString('id-ID')
          },
          {
            key: 'actorId',
            title: 'Aktor',
            render: (row) => users.find((user) => user.id === row.actorId)?.fullName ?? row.actorId
          },
          { key: 'module', title: 'Modul' },
          {
            key: 'action',
            title: 'Aksi',
            render: (row) => <Badge tone={actionTone[row.action]}>{row.action}</Badge>
          },
          { key: 'target', title: 'Target' },
          { key: 'description', title: 'Deskripsi' }
        ]}
      />
    </div>
  );
}
