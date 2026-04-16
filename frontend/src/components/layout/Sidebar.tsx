import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '../../store/authStore';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const navs = [
  ['/dashboard', '📊', 'Dashboard utama'],
  ['/reports/pnbp/new', '🧾', 'Data input PNBP'],
  ['/reports/blu/new', '🏥', 'Data input BLU'],
  ['/reports', '📁', 'Daftar laporan'],
  ['/monitoring', '🛰️', 'Monitoring status RS'],
  ['/approvals', '✅', 'Approval & revisi'],
  ['/master/periods', '🗓️', 'Pengaturan periode'],
  ['/exports', '⬇️', 'Laporan & export'],
  ['/laporan-export', '📗', 'Laporan & Export XLS'],
  ['/audit-logs', '🧷', 'Audit trail'],
  ['/profile', '👤', 'Profil pengguna'],
  ['/notifications', '🔔', 'Notifikasi']
] as const;

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuthStore();

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-30 bg-slate-900/50 transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col bg-primary p-4 text-white transition-transform lg:static lg:min-h-screen lg:w-64 lg:translate-x-0',
          isOpen && 'translate-x-0'
        )}
      >
        <div className="flex items-center gap-3 border-b border-blue-700 pb-3">
          <img src="/logo-simon.svg" alt="Logo SIMON" className="h-10 w-10 rounded bg-white p-1" />
          <div>
            <h1 className="text-base font-bold leading-tight">SIMON Keuangan RS</h1>
            <p className="text-xs text-blue-100">Kementerian Kesehatan RI</p>
          </div>
        </div>

        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto pr-1">
          {navs.map(([to, icon, label]) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-blue-700/80',
                  isActive && 'bg-blue-700 font-semibold'
                )
              }
            >
              <span aria-hidden>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 border-t border-blue-700 pt-3">
          <p className="truncate text-sm font-semibold">{user?.fullName}</p>
          <p className="mb-3 truncate text-xs text-blue-100">{user?.email}</p>
          <button onClick={logout} className="w-full rounded bg-secondary px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
