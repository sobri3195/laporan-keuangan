import { PeriodOption, ReportEntityType } from './types';

export type ColumnDefinition = {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: number;
  kind?: 'currency' | 'ratio' | 'text';
};

const sharedTailColumns: ColumnDefinition[] = [
  { key: 'piutang', label: 'PIUTANG', align: 'right', width: 16, kind: 'currency' },
  { key: 'persediaan', label: 'PERSEDIAAN', align: 'right', width: 16, kind: 'currency' },
  { key: 'asetLancar', label: 'JUMLAH ASET LANCAR', align: 'right', width: 18, kind: 'currency' },
  { key: 'hutang', label: 'HUTANG', align: 'right', width: 16, kind: 'currency' },
  { key: 'ekuitas', label: 'EKUITAS', align: 'right', width: 16, kind: 'currency' },
  { key: 'currentRatio', label: 'CURRENT RATIO', align: 'center', width: 14, kind: 'ratio' },
  { key: 'cashRatio', label: 'CASH RATIO', align: 'center', width: 14, kind: 'ratio' }
];

export const PREVIEW_COLUMNS: Record<ReportEntityType, ColumnDefinition[]> = {
  PNBP: [
    { key: 'hospitalName', label: 'NAMA RS TNI AU', align: 'left', width: 28, kind: 'text' },
    { key: 'pendapatan', label: 'PENDAPATAN', align: 'right', width: 16, kind: 'currency' },
    { key: 'pengeluaran', label: 'PENGELUARAN', align: 'right', width: 16, kind: 'currency' },
    { key: 'sisaSaldo', label: 'SISA SALDO', align: 'right', width: 16, kind: 'currency' },
    ...sharedTailColumns
  ],
  BLU: [
    { key: 'hospitalName', label: 'NAMA RS TNI AU', align: 'left', width: 28, kind: 'text' },
    { key: 'saldoAwal', label: 'SISA SALDO AWAL', align: 'right', width: 16, kind: 'currency' },
    { key: 'pendapatan', label: 'PENDAPATAN', align: 'right', width: 16, kind: 'currency' },
    { key: 'pengeluaran', label: 'PENGELUARAN', align: 'right', width: 16, kind: 'currency' },
    { key: 'sisaSaldoAkhir', label: 'SISA SALDO AKHIR', align: 'right', width: 16, kind: 'currency' },
    ...sharedTailColumns
  ]
};

export const PREVIEW_TITLE_LINES = {
  institution: 'PUSAT KESEHATAN TNI ANGKATAN UDARA',
  directorate: 'DITBINYANKES',
  monitoring: 'MONITORING LAPORAN KEUANGAN RS TNI AU'
} as const;

export const getPeriodLabel = (periodId: string | null | undefined, periods: PeriodOption[]) => {
  if (!periodId) return 'Periode belum dipilih';
  return periods.find((period) => period.id === periodId)?.label ?? periodId;
};

export const getSheetName = (type: ReportEntityType, periodLabel: string) => `${type} ${periodLabel}`;

export const getExcelBaseColumns = (type: ReportEntityType) => PREVIEW_COLUMNS[type].map((column) => column.label);
