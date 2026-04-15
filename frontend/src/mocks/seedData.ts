import { Hospital, Period, Report, ReportStatus, Role, User } from '../types/domain';

export const hospitals: Hospital[] = [
  { id: 'H1', code: 'RS001', name: 'RSUP Harapan', province: 'DKI Jakarta', active: true },
  { id: 'H2', code: 'RS002', name: 'RSUD Sehat Sentosa', province: 'Jawa Barat', active: true },
  { id: 'H3', code: 'RS003', name: 'RS Islam Amanah', province: 'Jawa Tengah', active: true }
];

export const periods: Period[] = [
  { id: '2026-01', label: 'Januari 2026', year: 2026, month: 1, isLocked: false, isActive: true },
  { id: '2026-02', label: 'Februari 2026', year: 2026, month: 2, isLocked: false, isActive: true },
  { id: '2025-12', label: 'Desember 2025', year: 2025, month: 12, isLocked: true, isActive: false }
];

export const users: User[] = [
  { id: 'U1', fullName: 'Admin Pusat', email: 'pusat@simon.go.id', role: Role.ADMIN_PUSAT, hospitalId: null },
  { id: 'U2', fullName: 'Admin RS Harapan', email: 'harapan@simon.go.id', role: Role.ADMIN_RS, hospitalId: 'H1' },
  { id: 'U3', fullName: 'Admin RS Sehat', email: 'sehat@simon.go.id', role: Role.ADMIN_RS, hospitalId: 'H2' },
  { id: 'U4', fullName: 'Viewer Nasional', email: 'viewer@simon.go.id', role: Role.VIEWER, hospitalId: null }
];

export const reports: Report[] = [
  { id: 'R1', hospitalId: 'H1', periodId: '2026-01', entityType: 'PNBP', status: ReportStatus.SUBMITTED, completenessScore: 95, validityScore: 92, anomalyFlags: [], updatedAt: '2026-02-05T07:00:00Z' },
  { id: 'R2', hospitalId: 'H2', periodId: '2026-01', entityType: 'BLU', status: ReportStatus.REVISION_REQUESTED, completenessScore: 88, validityScore: 70, anomalyFlags: ['PENGELUARAN_GT_PENDAPATAN'], revisionNote: 'Mohon cek kenaikan pengeluaran.', updatedAt: '2026-02-07T04:00:00Z' },
  { id: 'R3', hospitalId: 'H3', periodId: '2026-01', entityType: 'PNBP', status: ReportStatus.APPROVED, completenessScore: 99, validityScore: 98, anomalyFlags: [], updatedAt: '2026-02-10T10:00:00Z' }
];
