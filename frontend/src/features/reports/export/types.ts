export type MonitoringPeriodMeta = {
  label: string;
  year: number;
  quarter: 1 | 2 | 3 | 4;
  quarterRoman: 'I' | 'II' | 'III' | 'IV';
  titleText: string;
  dateRangeLabel: string;
  startDateLabel: string;
  endDateLabel: string;
};

export type PnbpExportRow = {
  hospitalName: string;
  pendapatan: number | null;
  pengeluaran: number | null;
  piutang: number | null;
  persediaan: number | null;
  hutang: number | null;
};

export type BluExportRow = {
  hospitalName: string;
  saldoAwal: number | null;
  pendapatan: number | null;
  pengeluaran: number | null;
  piutang: number | null;
  persediaan: number | null;
  hutang: number | null;
};

export type ExportMonitoringWorkbookParams = {
  period: MonitoringPeriodMeta;
  pnbpRows: PnbpExportRow[];
  bluRows: BluExportRow[];
};
