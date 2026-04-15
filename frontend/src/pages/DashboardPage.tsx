import { Card } from '../components/common/Card';
import { SummaryCharts } from '../components/charts/SummaryCharts';

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card title="KPI Kepatuhan">92%</Card>
        <Card title="Laporan Submitted">24</Card>
        <Card title="Need Revision">3</Card>
        <Card title="Anomali Tinggi">2</Card>
      </div>
      <SummaryCharts />
    </div>
  );
}
