import { useAuthStore } from '../../store/authStore';

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
      <div className="min-w-0">
        <p className="text-xs text-slate-500 sm:text-sm">Sistem Monitoring Laporan Keuangan RS</p>
        <p className="truncate font-semibold">Selamat datang, {user?.fullName}</p>
      </div>
    </header>
  );
}
