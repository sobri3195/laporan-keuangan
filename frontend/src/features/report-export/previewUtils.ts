import { buildCalculatedValues } from './calculations';
import { PreviewCell } from './previewTypes';
import { ColumnDefinition } from './selectors';
import { HospitalOption, ReportRecord } from './types';

export const PREVIEW_CELL_FILL = {
  header: '#ede9fe',
  title: '#b7e1cd',
  neutral: '#ffffff'
} as const;

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

export const formatPreviewCurrency = (value: number | null | undefined) => {
  if (value == null || !Number.isFinite(value)) return '';
  return rupiahFormatter.format(value);
};

export const formatPreviewRatio = (value: number | null | undefined) => {
  if (value == null || !Number.isFinite(value)) return 'N/A';
  return value.toFixed(2);
};

export const asPreviewCell = (partial: Partial<PreviewCell> & Pick<PreviewCell, 'key'>): PreviewCell => ({
  value: null,
  displayValue: '',
  bordered: true,
  align: 'left',
  ...partial
});

export const resolveHospitalName = (hospitalId: string, hospitals: HospitalOption[]) =>
  hospitals.find((hospital) => hospital.id === hospitalId)?.name ?? hospitalId;

export const toDisplayValue = (value: number | string | null | undefined, kind: ColumnDefinition['kind']) => {
  if (value == null || value === '') return '';
  if (kind === 'currency') return formatPreviewCurrency(typeof value === 'number' ? value : Number(value));
  if (kind === 'ratio') return formatPreviewRatio(typeof value === 'number' ? value : Number(value));
  return String(value);
};

export const computeDerivedRecord = (record: ReportRecord): ReportRecord => ({
  ...record,
  ...buildCalculatedValues(record.entityType, record)
});
