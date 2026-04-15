import { Card } from '../components/common/Card';
import { SummaryCharts } from '../components/charts/SummaryCharts';
import { MonitoringExcelExportButtons } from '../features/reports/export/MonitoringExcelExportButtons';

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card title="KPI Kepatuhan">92%</Card>
        <Card title="Laporan Submitted">24</Card>
        <Card title="Need Revision">3</Card>
        <Card title="Anomali Tinggi">2</Card>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Quick Export</h3>
        <MonitoringExcelExportButtons />
      </div>
      <SummaryCharts />
    </div>
  );
}
