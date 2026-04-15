import { users } from '../mocks/seedData';
import { Table } from '../components/common/Table';

export default function MasterUsersPage() {
  return <Table data={users} columns={[{ key: 'fullName', title: 'Nama' }, { key: 'email', title: 'Email' }, { key: 'role', title: 'Role' }, { key: 'hospitalId', title: 'Hospital' }]} />;
}
