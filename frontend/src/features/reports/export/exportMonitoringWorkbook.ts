import { buildExportFilename } from './helpers';
import type { BluExportRow, ExportMonitoringWorkbookParams, MonitoringPeriodMeta, PnbpExportRow } from './types';

const ORG_LINE_1 = 'PUSAT KESEHATAN TNI ANGKATAN UDARA';
const ORG_LINE_2 = 'DITBINYANKES';

const pnbpHeaders = [
  'NAMA RS TNI AU',
  'PENDAPATAN {dateRange}',
  'PENGELUARAN {dateRange}',
  'SISA SALDO PER {endDate}',
  'PIUTANG',
  'PERSEDIAAN',
  'JUMLAH ASET LANCAR',
  'HUTANG',
  'EKUITAS',
  'CURRENT RATIO',
  'CASH RATIO'
] as const;

const bluHeaders = [
  'NAMA RS TNI AU',
  'SISA SALDO AWAL TA {year}',
  'PENDAPATAN {dateRange}',
  'PENGELUARAN {dateRange}',
  'SISA SALDO PER {endDate}',
  'PIUTANG',
  'PERSEDIAAN',
  'JUMLAH ASET LANCAR',
  'HUTANG',
  'EKUITAS',
  'CURRENT RATIO',
  'CASH RATIO'
] as const;

export async function exportMonitoringWorkbook({ period, pnbpRows, bluRows }: ExportMonitoringWorkbookParams): Promise<void> {
  const csvContent = [
    ...buildSectionLines({
      period,
      title: 'MONITORING LAPORAN KEUANGAN RS TNI AU (PNBP)',
      headers: pnbpHeaders.map((header) => resolveHeaderLabel(header, period)),
      rows: pnbpRows.map((row) => mapPnbpRow(row))
    }),
    '',
    ...buildSectionLines({
      period,
      title: 'MONITORING LAPORAN KEUANGAN RS TNI AU (BLU)',
      headers: bluHeaders.map((header) => resolveHeaderLabel(header, period)),
      rows: bluRows.map((row) => mapBluRow(row))
    })
  ].join('\n');

  downloadBlob(csvContent, buildExportFilename(period).replace(/\.xlsx$/, '.csv'), 'text/csv;charset=utf-8;');
}

function buildSectionLines({
  period,
  title,
  headers,
  rows
}: {
  period: MonitoringPeriodMeta;
  title: string;
  headers: readonly string[];
  rows: string[][];
}): string[] {
  const dataRows = rows.length > 0 ? rows : [Array.from({ length: headers.length }, () => '')];

  return [
    toCsvRow([ORG_LINE_1]),
    toCsvRow([ORG_LINE_2]),
    toCsvRow([title]),
    toCsvRow([period.titleText]),
    toCsvRow(headers),
    ...dataRows.map((row) => toCsvRow(row))
  ];
}

function mapPnbpRow(row: PnbpExportRow): string[] {
  const sisaSaldo = safeSub(row.pendapatan, row.pengeluaran);
  const jumlahAsetLancar = safeSum([sisaSaldo, row.piutang, row.persediaan]);
  const ekuitas = safeSub(jumlahAsetLancar, row.hutang);
  const currentRatio = safeDiv(jumlahAsetLancar, row.hutang);
  const cashRatio = safeDiv(sisaSaldo, row.hutang);

  return [
    row.hospitalName,
    formatNumber(row.pendapatan),
    formatNumber(row.pengeluaran),
    formatNumber(sisaSaldo),
    formatNumber(row.piutang),
    formatNumber(row.persediaan),
    formatNumber(jumlahAsetLancar),
    formatNumber(row.hutang),
    formatNumber(ekuitas),
    formatRatio(currentRatio),
    formatRatio(cashRatio)
  ];
}

function mapBluRow(row: BluExportRow): string[] {
  const sisaSaldo = safeSum([row.saldoAwal, row.pendapatan, safeNegate(row.pengeluaran)]);
  const jumlahAsetLancar = safeSum([sisaSaldo, row.piutang, row.persediaan]);
  const ekuitas = safeSub(jumlahAsetLancar, row.hutang);
  const currentRatio = safeDiv(jumlahAsetLancar, row.hutang);
  const cashRatio = safeDiv(sisaSaldo, row.hutang);

  return [
    row.hospitalName,
    formatNumber(row.saldoAwal),
    formatNumber(row.pendapatan),
    formatNumber(row.pengeluaran),
    formatNumber(sisaSaldo),
    formatNumber(row.piutang),
    formatNumber(row.persediaan),
    formatNumber(jumlahAsetLancar),
    formatNumber(row.hutang),
    formatNumber(ekuitas),
    formatRatio(currentRatio),
    formatRatio(cashRatio)
  ];
}

function resolveHeaderLabel(labelTemplate: string, period: MonitoringPeriodMeta): string {
  return labelTemplate
    .replace('{dateRange}', period.dateRangeLabel)
    .replace('{endDate}', period.endDateLabel)
    .replace('{year}', String(period.year));
}

function toCsvRow(values: readonly string[]): string {
  return values.map((value) => escapeCsvValue(value)).join(',');
}

function escapeCsvValue(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

function formatNumber(value: number | null): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '';
  }

  return value.toLocaleString('id-ID', { maximumFractionDigits: 0 });
}

function formatRatio(value: number | null): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '';
  }

  return value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function safeSum(values: Array<number | null>): number | null {
  if (values.every((value) => value == null)) {
    return null;
  }

  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function safeSub(a: number | null, b: number | null): number | null {
  if (a == null || b == null) {
    return null;
  }

  return a - b;
}

function safeNegate(value: number | null): number | null {
  return value == null ? null : -value;
}

function safeDiv(numerator: number | null, denominator: number | null): number | null {
  if (numerator == null || denominator == null || denominator === 0) {
    return null;
  }

  return numerator / denominator;
}

function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
