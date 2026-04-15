import { useAuthStore } from '../../store/authStore';

export function Header() {
  const { user, logout } = useAuthStore();
  return (
    <header className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
      <div>
        <p className="text-sm text-slate-500">Sistem Monitoring Laporan Keuangan RS</p>
        <p className="font-semibold">Selamat datang, {user?.fullName}</p>
      </div>
      <button onClick={logout} className="rounded bg-secondary px-3 py-2 text-white">Logout</button>
    </header>
  );
}
