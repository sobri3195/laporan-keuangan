import { NavLink } from 'react-router-dom';

const navs = [
  ['/dashboard', 'Dashboard'],
  ['/dashboard/executive', 'Executive'],
  ['/reports', 'Reports'],
  ['/monitoring', 'Monitoring'],
  ['/master/hospitals', 'Master Hospitals'],
  ['/master/users', 'Master Users'],
  ['/master/periods', 'Master Periods'],
  ['/notifications', 'Notifications'],
  ['/audit-logs', 'Audit Logs'],
  ['/profile', 'Profile']
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-primary text-white min-h-screen p-4">
      <h1 className="text-lg font-bold">SIMON Keuangan RS</h1>
      <nav className="mt-4 space-y-1">
        {navs.map(([to, label]) => (
          <NavLink key={to} to={to} className="block rounded px-3 py-2 hover:bg-blue-700">
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
