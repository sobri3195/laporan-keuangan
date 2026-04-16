import { Hospital, Period, Report, ReportStatus, Role, User } from '../types/domain';

const hospitalNames = [
  'RS ANGKATAN UDARA DR. EFRAM HARSANA',
  'RSAU DR. CHARLES P. J. SUOTH LANUD SAM RATULANGI',
  'RSAU DR. M. HASSAN TOTO',
  'RSAU DR. YUNIATI WISMA KARYANI',
  'RS ANGKATAN UDARA DR. MUNIR LANUD ABDULRACHMAN SALEH',
  'RSAU DR. HOEDIYONO LANUD SURYADARMA',
  'RSAU DR. SISWANTO LANUD ADI SOEMARMO',
  'RS UMUM TK. IV LANUD BALIKPAPAN',
  'RS GIGI DAN MULUT ANGKATAN UDARA',
  'RSAU DR. ABDUL MALIK',
  'KLINIK LANUD EL TARI',
  'RS ANGKATAN UDARA DR. MOHAMMAD SUTOMO LANUD SUPADIO',
  'RS UMUM TNI AU LANUD SULAIMAN',
  'RS AU DR. DODY SARDJOTO',
  'RS SOEMITRO LANUD MOELJONO SURABAYA',
  'RS TNI AU SJAMSUDIN NOOR',
  'RS AU DR. MOHAMMAD MOENIR',
  'RS ANGKATAN UDARA DR. SUKIRMAN LANUD ROESMIN NURJADIN',
  'RS AU TKT. IV LANUD SILAS PAPARE',
  'KLINIK PRATAMA MANUHUA'
] as const;

export const hospitals: Hospital[] = hospitalNames.map((name, index) => ({
  id: `H${index + 1}`,
  code: `RSAU${String(index + 1).padStart(3, '0')}`,
  name,
  province: 'Indonesia',
  active: true
}));

export const periods: Period[] = [
  { id: '2026-Q1', label: 'Triwulan I 2026', year: 2026, month: 3, isLocked: false, isActive: true },
  { id: '2025-Q4', label: 'Triwulan IV 2025', year: 2025, month: 12, isLocked: true, isActive: false }
];

export const users: User[] = [
  { id: 'U1', fullName: 'Admin Pusat', email: 'pusat@simon.go.id', role: Role.ADMIN_PUSAT, hospitalId: null },
  { id: 'U2', fullName: 'Admin RSAU Efram Harsana', email: 'efram@simon.go.id', role: Role.ADMIN_RS, hospitalId: 'H1' },
  { id: 'U3', fullName: 'Admin RSAU Charles', email: 'charles@simon.go.id', role: Role.ADMIN_RS, hospitalId: 'H2' },
  { id: 'U4', fullName: 'Viewer Nasional', email: 'viewer@simon.go.id', role: Role.VIEWER, hospitalId: null }
];

const now = '2026-04-01T00:00:00Z';

export const reports: Report[] = hospitals.flatMap((hospital) => [
  {
    id: `R-PNBP-${hospital.id}`,
    hospitalId: hospital.id,
    periodId: '2026-Q1',
    entityType: 'PNBP' as const,
    status: ReportStatus.DRAFT,
    completenessScore: 100,
    validityScore: 100,
    anomalyFlags: [],
    updatedAt: now
  },
  {
    id: `R-BLU-${hospital.id}`,
    hospitalId: hospital.id,
    periodId: '2026-Q1',
    entityType: 'BLU' as const,
    status: ReportStatus.DRAFT,
    completenessScore: 100,
    validityScore: 100,
    anomalyFlags: [],
    updatedAt: now
  }
]);
