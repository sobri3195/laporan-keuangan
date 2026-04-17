import { Period, ReportStatus, User } from '../../types/domain';
import { DraftStatusBadge } from './DraftStatusBadge';

export function ReportHeaderCard({
  activePeriod,
  user,
  status
}: {
  activePeriod?: Period;
  user?: User | null;
  status: ReportStatus;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">Dashboard / Laporan & Export XLS / Input</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Input Laporan Keuangan RS</h1>
          <p className="text-sm text-slate-600">Isi data, cek hasil, lalu export</p>
        </div>
        <div className="space-y-1 text-right">
          <DraftStatusBadge status={status} />
          <p className="text-xs text-slate-500">Periode aktif: {activePeriod?.label ?? '-'}</p>
          <p className="text-xs text-slate-500">Login: {user?.fullName ?? '-'} ({user?.role ?? '-'})</p>
        </div>
      </div>
    </section>
  );
}
