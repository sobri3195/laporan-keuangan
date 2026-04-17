import { ReportStatus } from '../../types/domain';

const statusMap: Record<ReportStatus, { label: string; className: string }> = {
  DRAFT: { label: 'Draft belum lengkap', className: 'bg-amber-100 text-amber-800' },
  SUBMITTED: { label: 'Submitted', className: 'bg-blue-100 text-blue-800' },
  IN_REVIEW: { label: 'Sedang direview', className: 'bg-indigo-100 text-indigo-800' },
  REVISION_REQUESTED: { label: 'Perlu Revisi', className: 'bg-red-100 text-red-700' },
  APPROVED: { label: 'Approved', className: 'bg-emerald-100 text-emerald-700' },
  LOCKED: { label: 'Locked', className: 'bg-slate-200 text-slate-700' }
};

export function DraftStatusBadge({ status }: { status: ReportStatus }) {
  const meta = statusMap[status];
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.className}`}>{meta.label}</span>;
}
