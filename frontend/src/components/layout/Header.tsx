import { useAuthStore } from '../../store/authStore';

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="min-w-0">
        <p className="text-xs text-slate-500 sm:text-sm">Sistem Monitoring Laporan Keuangan RS</p>
        <p className="truncate font-semibold">Selamat datang, {user?.fullName}</p>
      </div>
      <p className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
    </header>
  );
}
