import { Card } from '../components/common/Card';

export default function ExecutiveDashboardPage() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card title="Risk Indicator">3 RS dengan anomali tinggi.</Card>
      <Card title="Top Compliance">RSUP Harapan (98).</Card>
      <Card title="Trend">Peningkatan submit +12% MoM.</Card>
    </div>
  );
}
