import { reports } from '../mocks/seedData';
import { Table } from '../components/common/Table';

export default function MonitoringPage() {
  return <Table data={reports} columns={[{ key: 'hospitalId', title: 'Hospital' }, { key: 'periodId', title: 'Period' }, { key: 'status', title: 'Status' }, { key: 'completenessScore', title: 'Completeness' }, { key: 'validityScore', title: 'Validity' }]} />;
}
