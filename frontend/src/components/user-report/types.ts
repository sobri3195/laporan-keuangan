import { EntityType, ReportStatus } from '../../types/domain';

export type FinancialValues = {
  saldoAwal?: number;
  pendapatan?: number;
  pengeluaran?: number;
  piutang?: number;
  persediaan?: number;
  hutang?: number;
};

export type CalculationValues = {
  sisaSaldo?: number | null;
  sisaSaldoAkhir?: number | null;
  asetLancar: number | null;
  ekuitas: number | null;
  currentRatio: number | null;
  cashRatio: number | null;
};

export type RevisionNotes = {
  revisedAt: string;
  generalNote: string;
  fieldNotes: Partial<Record<keyof FinancialValues, string>>;
};

export type ValidationErrors = Partial<Record<keyof FinancialValues | 'periodId' | 'hospitalId', string>>;

export type PreviewData = {
  sheetName: string;
  institution: string;
  title: string;
  periodLabel: string;
  entityType: EntityType;
  hospitalName: string;
  values: FinancialValues;
  calculations: CalculationValues;
};

export type UserReportRecord = {
  id: string;
  periodId: string;
  hospitalId: string;
  entityType: EntityType;
  status: ReportStatus;
  lastInputAt: string;
  values: FinancialValues;
};
