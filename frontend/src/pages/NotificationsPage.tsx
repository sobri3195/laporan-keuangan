import { useMemo, useState } from 'react';
import { Badge } from '../components/common/Badge';
import { mockNotifications } from '../mocks/activityData';

const categoryTone = {
  APPROVAL: 'success',
  REVISION: 'warning',
  REMINDER: 'default',
  SYSTEM: 'default'
} as const;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'APPROVAL' | 'REVISION' | 'REMINDER' | 'SYSTEM'>('ALL');

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((notification) => {
        if (filter === 'ALL') return true;
        if (filter === 'UNREAD') return !notification.isRead;
        return notification.category === filter;
      }),
    [filter, notifications]
  );

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const markRead = (id: string) => {
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
  };

  const markAllRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
  };

  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">Notifikasi</h1>
            <p className="text-sm text-slate-600">Pantau approval, revisi, reminder deadline, dan pemberitahuan sistem.</p>
          </div>
          <Badge tone={unreadCount > 0 ? 'warning' : 'success'}>{unreadCount} belum dibaca</Badge>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'UNREAD', 'APPROVAL', 'REVISION', 'REMINDER', 'SYSTEM'].map((value) => (
            <button
              key={value}
              type="button"
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                filter === value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              onClick={() => setFilter(value as typeof filter)}
            >
              {value}
            </button>
          ))}
          <button
            type="button"
            onClick={markAllRead}
            className="ml-auto rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Tandai semua dibaca
          </button>
        </div>
      </section>

      <section className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">Tidak ada notifikasi.</div>
        ) : (
          filteredNotifications.map((notification) => (
            <article key={notification.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-slate-800">{notification.title}</h2>
                    <Badge tone={categoryTone[notification.category]}>{notification.category}</Badge>
                    {!notification.isRead && <Badge tone="warning">Baru</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{notification.message}</p>
                  <p className="mt-1 text-xs text-slate-500">{new Date(notification.createdAt).toLocaleString('id-ID')}</p>
                </div>
                {!notification.isRead && (
                  <button
                    type="button"
                    onClick={() => markRead(notification.id)}
                    className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
