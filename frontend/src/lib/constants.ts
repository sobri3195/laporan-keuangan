import { ReportStatus, Role } from '../types/domain';

export const ROLE_LABEL: Record<Role, string> = {
  [Role.ADMIN_PUSAT]: 'Admin Pusat',
  [Role.ADMIN_RS]: 'Admin RS',
  [Role.VIEWER]: 'Viewer'
};

export const STATUS_LABEL: Record<ReportStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  IN_REVIEW: 'In Review',
  REVISION_REQUESTED: 'Revision Requested',
  APPROVED: 'Approved',
  LOCKED: 'Locked'
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
