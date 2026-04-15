import { useParams } from 'react-router-dom';
import { reports } from '../mocks/seedData';
import { Badge } from '../components/common/Badge';

export default function ReportDetailPage() {
  const { id } = useParams();
  const report = reports.find((r) => r.id === id);
  if (!report) return <div className="rounded bg-white p-4">Data tidak ditemukan</div>;
  return (
    <div className="space-y-3 rounded-xl bg-white p-4">
      <h2 className="text-lg font-bold">Detail Report {report.id}</h2>
      <Badge tone={report.status === 'APPROVED' ? 'success' : report.status === 'REVISION_REQUESTED' ? 'warning' : 'default'}>{report.status}</Badge>
      <p>Completeness: {report.completenessScore}</p>
      <p>Validity: {report.validityScore}</p>
      <div className="rounded border border-amber-200 bg-amber-50 p-3">
        <h3 className="font-semibold">Revision Notes</h3>
        <p>{report.revisionNote ?? 'Tidak ada catatan revisi.'}</p>
      </div>
      <div className="flex gap-2">
        <button className="rounded bg-primary px-3 py-2 text-white">Approve</button>
        <button className="rounded bg-amber-500 px-3 py-2 text-white">Request Revision</button>
      </div>
    </div>
  );
}
