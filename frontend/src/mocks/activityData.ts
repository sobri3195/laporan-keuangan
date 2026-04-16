import { periods, users } from './seedData';

export type AuditAction = 'CREATE' | 'UPDATE' | 'SUBMIT' | 'APPROVE' | 'EXPORT' | 'LOGIN';

export type AuditLogItem = {
  id: string;
  timestamp: string;
  actorId: string;
  module: 'PERIOD' | 'REPORT' | 'EXPORT' | 'ACCOUNT' | 'NOTIFICATION';
  action: AuditAction;
  target: string;
  description: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  category: 'APPROVAL' | 'REVISION' | 'REMINDER' | 'SYSTEM';
  isRead: boolean;
};

const activePeriodLabel = periods.find((period) => period.isActive)?.label ?? periods[0]?.label ?? 'Periode aktif';

export const mockAuditLogs: AuditLogItem[] = [
  {
    id: 'AL-1001',
    timestamp: '2026-04-15T09:22:10Z',
    actorId: 'U1',
    module: 'PERIOD',
    action: 'UPDATE',
    target: activePeriodLabel,
    description: 'Deadline periode diperbarui menjadi 20 April 2026.'
  },
  {
    id: 'AL-1002',
    timestamp: '2026-04-15T10:01:22Z',
    actorId: 'U2',
    module: 'REPORT',
    action: 'SUBMIT',
    target: 'Laporan PNBP RSAU001',
    description: 'Laporan dikirim untuk proses review admin pusat.'
  },
  {
    id: 'AL-1003',
    timestamp: '2026-04-15T11:13:45Z',
    actorId: 'U1',
    module: 'REPORT',
    action: 'APPROVE',
    target: 'Laporan BLU RSAU001',
    description: 'Laporan BLU disetujui tanpa catatan revisi.'
  },
  {
    id: 'AL-1004',
    timestamp: '2026-04-14T04:02:03Z',
    actorId: 'U4',
    module: 'EXPORT',
    action: 'EXPORT',
    target: 'Rekap nasional TW I',
    description: 'Ekspor CSV dilakukan untuk kebutuhan rapat evaluasi.'
  },
  {
    id: 'AL-1005',
    timestamp: '2026-04-14T01:10:00Z',
    actorId: 'U3',
    module: 'ACCOUNT',
    action: 'LOGIN',
    target: users[2]?.email ?? 'charles@simon.go.id',
    description: 'Login berhasil dari perangkat terdaftar.'
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'NTF-1',
    title: 'Laporan BLU disetujui',
    message: 'Admin pusat menyetujui laporan BLU RSAU001 periode Triwulan I 2026.',
    createdAt: '2026-04-15T11:15:00Z',
    category: 'APPROVAL',
    isRead: false
  },
  {
    id: 'NTF-2',
    title: 'Revisi dibutuhkan',
    message: 'Mohon lengkapi catatan pendukung pada laporan PNBP RSAU002.',
    createdAt: '2026-04-15T07:30:00Z',
    category: 'REVISION',
    isRead: false
  },
  {
    id: 'NTF-3',
    title: 'Pengingat batas waktu',
    message: 'Batas submit periode Triwulan I 2026 tersisa 4 hari.',
    createdAt: '2026-04-14T09:00:00Z',
    category: 'REMINDER',
    isRead: true
  },
  {
    id: 'NTF-4',
    title: 'Pemeliharaan sistem',
    message: 'Aplikasi akan maintenance Sabtu, 18 April 2026 pukul 22.00 WIB.',
    createdAt: '2026-04-13T12:00:00Z',
    category: 'SYSTEM',
    isRead: true
  }
];
