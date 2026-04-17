import { saveAs } from './helpers';
import { PREVIEW_COLUMNS, getSheetName } from './selectors';
import { ReportEntityType, ReportRecord } from './types';

type ExportMode = 'filtered' | 'template';
type ExportFileType = 'xlsx' | 'xls';

type ExcelJsModule = {
  Workbook: new () => {
    creator?: string;
    addWorksheet: (name: string) => WorksheetLike;
    xlsx: { writeBuffer: () => Promise<ArrayBuffer> };
  };
};

type WorksheetLike = {
  columns: Array<{ header: string; width: number }>;
  mergeCells: (range: string) => void;
  getCell: (address: string) => CellLike;
  getRow: (index: number) => RowLike;
};

type CellLike = {
  value: unknown;
  font?: unknown;
  alignment?: unknown;
  fill?: unknown;
  border?: unknown;
};

type RowLike = {
  values: unknown;
  height?: number;
  eachCell: (callback: (cell: CellLike) => void) => void;
};

type ColumnKey =
  | 'hospitalName'
  | 'saldoAwal'
  | 'pendapatan'
  | 'pengeluaran'
  | 'sisaSaldo'
  | 'sisaSaldoAkhir'
  | 'piutang'
  | 'persediaan'
  | 'asetLancar'
  | 'hutang'
  | 'ekuitas'
  | 'currentRatio'
  | 'cashRatio';

const createThinBorder = () => ({ top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' }, bottom: { style: 'thin' } });

const getExcelJs = async (): Promise<ExcelJsModule | null> => {
  try {
    const moduleName = 'excel' + 'js';
    return (await import(/* @vite-ignore */ moduleName)) as unknown as ExcelJsModule;
  } catch {
    return null;
  }
};

const fileName = (period: string, fileType: ExportFileType) => `MONITORING_LAPORAN_KEUANGAN_RS_${period || 'ALL'}_${Date.now()}.${fileType}`;

const fillHeaderStyle = (sheet: WorksheetLike, rowIndex: number) => {
  const row = sheet.getRow(rowIndex);
  row.height = 26;
  row.eachCell((cell) => {
    cell.font = { name: 'Arial', bold: true, size: 10 };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEDE9FE' } };
    cell.border = createThinBorder() as unknown;
  });
};

const fillBodyStyle = (sheet: WorksheetLike, rowIndex: number) => {
  const row = sheet.getRow(rowIndex);
  row.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10 };
    cell.border = createThinBorder() as unknown;
  });
};

const getColumnValue = (record: ReportRecord, key: ColumnKey) => {
  switch (key) {
    case 'hospitalName':
      return record.hospitalId;
    case 'saldoAwal':
      return record.saldoAwal;
    case 'pendapatan':
      return record.pendapatan;
    case 'pengeluaran':
      return record.pengeluaran;
    case 'sisaSaldo':
      return record.sisaSaldo;
    case 'sisaSaldoAkhir':
      return record.sisaSaldoAkhir;
    case 'piutang':
      return record.piutang;
    case 'persediaan':
      return record.persediaan;
    case 'asetLancar':
      return record.asetLancar;
    case 'hutang':
      return record.hutang;
    case 'ekuitas':
      return record.ekuitas;
    case 'currentRatio':
      return record.currentRatio == null ? 'N/A' : record.currentRatio;
    case 'cashRatio':
      return record.cashRatio == null ? 'N/A' : record.cashRatio;
  }
};

const buildSheet = (
  workbook: ExcelJsModule['Workbook'] extends new () => infer T ? T : never,
  entityType: ReportEntityType,
  periodLabel: string,
  rows: ReportRecord[],
  formalTemplate = false
) => {
  const columns = PREVIEW_COLUMNS[entityType];
  const sheet = workbook.addWorksheet(getSheetName(entityType, periodLabel));
  const lastColLetter = String.fromCharCode(65 + columns.length - 1);

  sheet.columns = columns.map((column) => ({ header: column.label, width: column.width ?? 17 }));

  sheet.mergeCells(`A1:${lastColLetter}1`);
  sheet.getCell('A1').value = 'MONITORING LAPORAN KEUANGAN RUMAH SAKIT';
  sheet.getCell('A1').font = { name: 'Arial', bold: true, size: 13 };
  sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB7E1CD' } };

  sheet.mergeCells(`A2:${lastColLetter}2`);
  sheet.getCell('A2').value = `${entityType} - ${periodLabel}${formalTemplate ? ' (Template Format)' : ''}`;
  sheet.getCell('A2').alignment = { horizontal: 'center' };
  sheet.getCell('A2').font = { name: 'Arial', bold: true, size: 11 };

  sheet.getRow(4).values = columns.map((column) => column.label);
  fillHeaderStyle(sheet, 4);

  let rowStart = 5;
  rows.forEach((record) => {
    const rowIndex = rowStart++;
    columns.forEach((column, idx) => {
      const address = `${String.fromCharCode(65 + idx)}${rowIndex}`;
      sheet.getCell(address).value = getColumnValue(record, column.key as ColumnKey);
    });
    fillBodyStyle(sheet, rowIndex);
  });
};

const buildCsvFallback = (rows: ReportRecord[]) => {
  const headers = Array.from(new Set([...PREVIEW_COLUMNS.PNBP, ...PREVIEW_COLUMNS.BLU].map((item) => item.label))).join(',');
  const body = rows
    .map((row) => {
      const cols = PREVIEW_COLUMNS[row.entityType];
      return cols.map((col) => getColumnValue(row, col.key as ColumnKey) ?? '').join(',');
    })
    .join('\n');
  return `${headers}\n${body}`;
};

const buildHtmlWorkbook = (rows: ReportRecord[]) => {
  const headers = Array.from(new Set([...PREVIEW_COLUMNS.PNBP, ...PREVIEW_COLUMNS.BLU].map((item) => item.label)));
  const headerHtml = headers.map((column) => `<th style="background:#ede9fe;border:1px solid #94a3b8;padding:6px;">${column}</th>`).join('');
  const bodyHtml = rows
    .map((row) => {
      const values = PREVIEW_COLUMNS[row.entityType].map((column) => getColumnValue(row, column.key as ColumnKey) ?? '');
      return `<tr>${values.map((value) => `<td style="border:1px solid #94a3b8;padding:6px;">${value}</td>`).join('')}</tr>`;
    })
    .join('');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8" /></head><body><table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></body></html>`;
};

export const exportMonitoringWorkbook = async (
  rows: ReportRecord[],
  period: string,
  mode: ExportMode = 'filtered',
  fileType: ExportFileType = 'xlsx'
) => {
  if (fileType === 'xls') {
    const html = buildHtmlWorkbook(rows);
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    saveAs(blob, fileName(period, 'xls'));
    return;
  }

  const ExcelJS = await getExcelJs();
  if (!ExcelJS) {
    const csv = buildCsvFallback(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, fileName(period, 'xlsx').replace('.xlsx', '.csv'));
    return;
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SIMON Keuangan RS';

  buildSheet(workbook, 'PNBP', period || 'TW 1 TA 2026', rows.filter((row) => row.entityType === 'PNBP'), mode === 'template');
  buildSheet(workbook, 'BLU', period || 'TW I TA 2026', rows.filter((row) => row.entityType === 'BLU'), mode === 'template');

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, fileName(period, 'xlsx'));
};
