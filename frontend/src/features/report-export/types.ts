export type ReportEntityType = 'PNBP' | 'BLU';

export type ReportStatus = 'draft' | 'final' | 'revision_requested' | 'approved' | 'locked' | 'archived';

export type ReportFilters = {
  search: string;
  period: string;
  entityType: 'ALL' | ReportEntityType;
  hospitalId: string;
};

export type ReportInput = {
  period: string;
  hospitalId: string;
  entityType: ReportEntityType;
  status: ReportStatus;
  saldoAwal: number | null;
  pendapatan: number | null;
  pengeluaran: number | null;
  piutang: number | null;
  persediaan: number | null;
  hutang: number | null;
};

export type ReportCalculated = {
  sisaSaldo: number | null;
  sisaSaldoAkhir: number | null;
  asetLancar: number | null;
  ekuitas: number | null;
  currentRatio: number | null;
  cashRatio: number | null;
};

export type ReportRecord = ReportInput &
  ReportCalculated & {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };

export type HospitalOption = {
  id: string;
  name: string;
};

export type PeriodOption = {
  id: string;
  label: string;
};

export type SpreadsheetCell = {
  value: string;
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
  bgClass?: string;
};

export type SpreadsheetPreviewModel = {
  sheetName: string;
  titleRows: string[];
  headers: string[];
  rows: SpreadsheetCell[][];
};

export type ReportApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};
