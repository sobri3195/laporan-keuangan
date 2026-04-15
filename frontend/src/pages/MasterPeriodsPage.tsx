import { periods } from '../mocks/seedData';
import { Table } from '../components/common/Table';

export default function MasterPeriodsPage() {
  return <Table data={periods} columns={[{ key: 'label', title: 'Periode' }, { key: 'isLocked', title: 'Locked' }, { key: 'isActive', title: 'Active' }]} />;
}
