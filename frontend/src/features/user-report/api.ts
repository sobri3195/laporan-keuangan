import { ReportStatus } from '../../types/domain';
import { UserReportRecord, RevisionNotes, PreviewData } from '../../components/user-report/types';

const sleep = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const db: Record<string, UserReportRecord> = {};
const revisionDb: Record<string, RevisionNotes> = {};

const key = (periodId: string, entityType: string, hospitalId: string) => `${periodId}:${entityType}:${hospitalId}`;

// GET /reports/current?period_id=...&entity_type=...
export async function getCurrentReport(periodId: string, entityType: string, hospitalId: string) {
  await sleep();
  return db[key(periodId, entityType, hospitalId)] ?? null;
}

// POST /reports
export async function createReport(payload: UserReportRecord) {
  await sleep();
  db[key(payload.periodId, payload.entityType, payload.hospitalId)] = payload;
  return payload;
}

// PUT /reports/:id
export async function updateReport(payload: UserReportRecord) {
  await sleep();
  db[key(payload.periodId, payload.entityType, payload.hospitalId)] = payload;
  return payload;
}

// POST /reports/:id/submit
export async function submitReport(payload: UserReportRecord) {
  await sleep();
  const next = { ...payload, status: ReportStatus.SUBMITTED };
  db[key(payload.periodId, payload.entityType, payload.hospitalId)] = next;
  return next;
}

// GET /reports/revision-notes/:id
export async function getRevisionNotes(reportId: string) {
  await sleep(250);
  return revisionDb[reportId] ?? null;
}

// GET /reports/preview/:id
export async function getReportPreview(data: PreviewData) {
  await sleep(250);
  return data;
}

// GET /reports/export/:id
export async function exportReportXls(filename: string) {
  await sleep(350);
  return { url: `/mock-download/${filename}` };
}

export function mockMarkAsRevision(reportId: string, note: RevisionNotes) {
  revisionDb[reportId] = note;
}
