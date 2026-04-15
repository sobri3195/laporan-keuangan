import { hospitals } from '../mocks/seedData';
import { Table } from '../components/common/Table';

export default function MasterHospitalsPage() {
  return <Table data={hospitals} columns={[{ key: 'code', title: 'Kode' }, { key: 'name', title: 'Nama RS' }, { key: 'province', title: 'Provinsi' }, { key: 'active', title: 'Status' }]} />;
}
