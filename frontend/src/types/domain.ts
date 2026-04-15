export enum Role {
  ADMIN_PUSAT = 'ADMIN_PUSAT',
  ADMIN_RS = 'ADMIN_RS',
  VIEWER = 'VIEWER'
}

export enum ReportStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  IN_REVIEW = 'IN_REVIEW',
  REVISION_REQUESTED = 'REVISION_REQUESTED',
  APPROVED = 'APPROVED',
  LOCKED = 'LOCKED'
}

export type EntityType = 'PNBP' | 'BLU';

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  hospitalId: string | null;
};

export type Hospital = { id: string; code: string; name: string; province: string; active: boolean };
export type Period = { id: string; label: string; year: number; month: number; isLocked: boolean; isActive: boolean };

export type Report = {
  id: string;
  hospitalId: string;
  periodId: string;
  entityType: EntityType;
  status: ReportStatus;
  completenessScore: number;
  validityScore: number;
  anomalyFlags: string[];
  revisionNote?: string;
  updatedAt: string;
};

export type PnbpDetail = {
  pendapatan: number | null;
  pengeluaran: number | null;
  piutang: number | null;
  persediaan: number | null;
  hutang: number | null;
};

export type BluDetail = PnbpDetail & { saldoAwal: number | null };
