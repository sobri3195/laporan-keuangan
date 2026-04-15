import { reports } from '../mocks/seedData';
import { Table } from '../components/common/Table';
import { MonitoringExcelExportButtons } from '../features/reports/export/MonitoringExcelExportButtons';

export default function MonitoringPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Export Monitoring</h3>
        <MonitoringExcelExportButtons />
      </div>
      <Table
        data={reports}
        columns={[
          { key: 'hospitalId', title: 'Hospital' },
          { key: 'periodId', title: 'Period' },
          { key: 'status', title: 'Status' },
          { key: 'completenessScore', title: 'Completeness' },
          { key: 'validityScore', title: 'Validity' }
        ]}
      />
    </div>
  );
}
