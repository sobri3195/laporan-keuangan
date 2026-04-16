import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { SummaryCharts } from '../components/charts/SummaryCharts';
import { MonitoringExcelExportButtons } from '../features/reports/export/MonitoringExcelExportButtons';

const kpiCards = [
  { title: 'KPI Kepatuhan', value: '92%', delta: '+4% dari bulan lalu', tone: 'success' as const },
  { title: 'Laporan Submitted', value: '24', delta: '3 menunggu review', tone: 'default' as const },
  { title: 'Need Revision', value: '3', delta: 'Perlu tindak lanjut RS', tone: 'warning' as const },
  { title: 'Anomali Tinggi', value: '2', delta: 'Fokus audit prioritas', tone: 'danger' as const }
];

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-gradient-to-r from-primary to-blue-500 p-5 text-white shadow">
        <p className="text-sm text-blue-100">Ringkasan Nasional</p>
        <h2 className="mt-1 text-xl font-bold">Monitoring Laporan Keuangan Rumah Sakit</h2>
        <p className="mt-2 text-sm text-blue-100">Pantau kepatuhan, kualitas data, dan tindak lanjut revisi dalam satu dashboard.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((item) => (
          <Card key={item.title} title={item.title}>
            <p className="text-2xl font-bold text-slate-800">{item.value}</p>
            <div className="mt-2">
              <Badge tone={item.tone}>{item.delta}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Quick Export</h3>
        <MonitoringExcelExportButtons />
      </div>

      <SummaryCharts />
    </div>
  );
}
