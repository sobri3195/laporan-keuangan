import { hospitals, periods } from '../../mocks/seedData';
import { buildCalculatedValues } from './calculations';
import { HospitalOption, PeriodOption, ReportApiResponse, ReportFilters, ReportInput, ReportRecord } from './types';

const API_BASE_URL = import.meta.env.VITE_APPS_SCRIPT_BASE_URL ?? '';
const STORAGE_KEY = 'report-export-module-data-v1';

const wait = async () => new Promise((resolve) => setTimeout(resolve, 200));

const createMockRecord = (id: string, input: ReportInput): ReportRecord => {
  const now = new Date().toISOString();
  return {
    id,
    ...input,
    ...buildCalculatedValues(input.entityType, input),
    createdAt: now,
    updatedAt: now,
    deletedAt: null
  };
};

const readLocal = (): ReportRecord[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw) as ReportRecord[];

  const seeded: ReportRecord[] = [
    createMockRecord('RX-1', {
      period: periods[0]?.id ?? '2026-Q1',
      hospitalId: hospitals[0]?.id ?? 'H1',
      entityType: 'PNBP',
      status: 'draft',
      saldoAwal: null,
      pendapatan: 150000000,
      pengeluaran: 120000000,
      piutang: 14000000,
      persediaan: 10000000,
      hutang: 20000000
    }),
    createMockRecord('RX-2', {
      period: periods[0]?.id ?? '2026-Q1',
      hospitalId: hospitals[1]?.id ?? 'H2',
      entityType: 'BLU',
      status: 'final',
      saldoAwal: 50000000,
      pendapatan: 140000000,
      pengeluaran: 90000000,
      piutang: 5000000,
      persediaan: 7000000,
      hutang: 28000000
    })
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
};

const writeLocal = (rows: ReportRecord[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
};

const applyFilters = (rows: ReportRecord[], filters: ReportFilters) =>
  rows.filter((row) => {
    if (row.deletedAt) return false;
    if (filters.period && row.period !== filters.period) return false;
    if (filters.entityType !== 'ALL' && row.entityType !== filters.entityType) return false;
    if (filters.hospitalId && row.hospitalId !== filters.hospitalId) return false;
    if (!filters.search) return true;
    const label = `${row.id}-${row.period}-${row.entityType}`.toLowerCase();
    return label.includes(filters.search.toLowerCase());
  });

export const reportExportApi = {
  async getOptions(): Promise<{ periods: PeriodOption[]; hospitals: HospitalOption[] }> {
    return {
      periods: periods.map((period) => ({ id: period.id, label: period.label })),
      hospitals: hospitals.map((hospital) => ({ id: hospital.id, name: hospital.name }))
    };
  },
  async getReports(filters: ReportFilters): Promise<ReportApiResponse<ReportRecord[]>> {
    await wait();
    if (API_BASE_URL) {
      const searchParams = new URLSearchParams({
        period: filters.period,
        entity_type: filters.entityType,
        hospital_id: filters.hospitalId,
        q: filters.search
      });
      const res = await fetch(`${API_BASE_URL}/reports?${searchParams.toString()}`);
      if (!res.ok) throw new Error('Gagal memuat data laporan');
      return (await res.json()) as ReportApiResponse<ReportRecord[]>;
    }
    return { success: true, data: applyFilters(readLocal(), filters) };
  },
  async getReport(id: string): Promise<ReportApiResponse<ReportRecord>> {
    await wait();
    if (API_BASE_URL) {
      const res = await fetch(`${API_BASE_URL}/reports/${id}`);
      if (!res.ok) throw new Error('Gagal memuat detail');
      return (await res.json()) as ReportApiResponse<ReportRecord>;
    }
    const record = readLocal().find((row) => row.id === id && !row.deletedAt);
    if (!record) throw new Error('Data tidak ditemukan');
    return { success: true, data: record };
  },
  async createReport(payload: ReportInput): Promise<ReportApiResponse<ReportRecord>> {
    await wait();
    if (API_BASE_URL) {
      const res = await fetch(`${API_BASE_URL}/reports`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Gagal menyimpan data');
      return (await res.json()) as ReportApiResponse<ReportRecord>;
    }
    const current = readLocal();
    const created = createMockRecord(`RX-${Date.now()}`, payload);
    const next = [created, ...current];
    writeLocal(next);
    return { success: true, data: created, message: 'Draft disimpan' };
  },
  async updateReport(id: string, payload: ReportInput): Promise<ReportApiResponse<ReportRecord>> {
    await wait();
    if (API_BASE_URL) {
      const res = await fetch(`${API_BASE_URL}/reports/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Gagal update data');
      return (await res.json()) as ReportApiResponse<ReportRecord>;
    }
    const current = readLocal();
    const next = current.map((row) =>
      row.id === id
        ? {
            ...row,
            ...payload,
            ...buildCalculatedValues(payload.entityType, payload),
            updatedAt: new Date().toISOString()
          }
        : row
    );
    writeLocal(next);
    const updated = next.find((row) => row.id === id);
    if (!updated) throw new Error('Data tidak ditemukan saat update');
    return { success: true, data: updated, message: 'Data diperbarui' };
  },
  async deleteReport(id: string): Promise<ReportApiResponse<{ id: string }>> {
    await wait();
    if (API_BASE_URL) {
      const res = await fetch(`${API_BASE_URL}/reports/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus data');
      return (await res.json()) as ReportApiResponse<{ id: string }>;
    }
    const next = readLocal().map((row) => (row.id === id ? { ...row, deletedAt: new Date().toISOString(), status: 'archived' as const } : row));
    writeLocal(next);
    return { success: true, data: { id }, message: 'Data diarsipkan' };
  },
  async getPreview(id: string): Promise<ReportApiResponse<ReportRecord>> {
    await wait();
    if (API_BASE_URL) {
      const res = await fetch(`${API_BASE_URL}/reports/preview/${id}`);
      if (!res.ok) throw new Error('Gagal memuat preview');
      return (await res.json()) as ReportApiResponse<ReportRecord>;
    }
    return this.getReport(id);
  },
  getExportUrl(filters: Pick<ReportFilters, 'period' | 'entityType'>) {
    const params = new URLSearchParams({ period_id: filters.period, entity_type: filters.entityType });
    return `${API_BASE_URL}/reports/export?${params.toString()}`;
  },
  getTemplateExportUrl() {
    return `${API_BASE_URL}/reports/export-template`;
  }
};
