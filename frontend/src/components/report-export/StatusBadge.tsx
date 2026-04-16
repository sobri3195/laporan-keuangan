import { ReportStatus } from '../../features/report-export/types';

const tones: Record<ReportStatus, string> = {
  draft: 'bg-slate-100 text-slate-800',
  final: 'bg-blue-100 text-blue-700',
  revision_requested: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  locked: 'bg-rose-100 text-rose-700',
  archived: 'bg-slate-200 text-slate-500'
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tones[status]}`}>{status.replace('_', ' ')}</span>;
}
