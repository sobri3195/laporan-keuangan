import { FormEvent, useMemo, useState } from 'react';
import { Badge } from '../components/common/Badge';
import { ROLE_LABEL } from '../lib/constants';
import { mockAuditLogs } from '../mocks/activityData';
import { users } from '../mocks/seedData';
import { useAuthStore } from '../store/authStore';

export default function ProfilePage() {
  const sessionUser = useAuthStore((state) => state.user);
  const user = sessionUser ?? users[0];

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  const recentActivities = useMemo(
    () => mockAuditLogs.filter((item) => item.actorId === user?.id).slice(0, 3),
    [user?.id]
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveMessage(`Perubahan profil untuk ${fullName} berhasil disimpan (simulasi).`);
  };

  if (!user) {
    return <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">Profil tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-800">Profil Pengguna</h1>
        <p className="text-sm text-slate-600">Kelola identitas akun dan preferensi notifikasi pribadi.</p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm text-slate-700">
              Nama lengkap
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </label>
            <label className="text-sm text-slate-700">
              Email
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
          </div>

          <div className="rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
            <p>
              Role: <Badge>{ROLE_LABEL[user.role]}</Badge>
            </p>
            <p className="mt-2">ID pengguna: {user.id}</p>
          </div>

          <fieldset className="space-y-2 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
            <legend className="px-1 font-semibold">Preferensi notifikasi</legend>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={notifyInApp} onChange={(event) => setNotifyInApp(event.target.checked)} />
              Notifikasi in-app
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={notifyEmail} onChange={(event) => setNotifyEmail(event.target.checked)} />
              Notifikasi email
            </label>
          </fieldset>

          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Simpan perubahan
          </button>

          {saveMessage && <p className="text-sm text-emerald-700">{saveMessage}</p>}
        </form>

        <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">Aktivitas terbaru</h2>
          {recentActivities.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">Belum ada aktivitas.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="rounded-md border border-slate-200 px-3 py-2">
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-xs text-slate-500">{new Date(activity.timestamp).toLocaleString('id-ID')}</p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </section>
    </div>
  );
}
