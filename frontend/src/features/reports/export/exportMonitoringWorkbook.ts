import ExcelJS, { Worksheet } from 'exceljs';
import { alignments, allThinBorder, excelFills, excelFonts } from './excelStyles';
import { buildExportFilename, toExcelNumber } from './helpers';
import type { BluExportRow, ExportMonitoringWorkbookParams, MonitoringPeriodMeta, PnbpExportRow } from './types';

const ORG_LINE_1 = 'PUSAT KESEHATAN TNI ANGKATAN UDARA';
const ORG_LINE_2 = '         DITBINYANKES';
const HEADER_ROW_INDEX = 7;
const DATA_START_ROW = 8;

const currencyFormat = '#,##0';
const ratioFormat = '0.00';

type SheetColumnConfig<T> = {
  key: keyof T | 'formula';
  header: string;
  width: number;
  alignment?: 'left' | 'right' | 'center';
  ratioColumn?: boolean;
};

const pnbpColumns: SheetColumnConfig<PnbpExportRow>[] = [
  { key: 'hospitalName', header: 'NAMA RS TNI AU', width: 42, alignment: 'left' },
  { key: 'pendapatan', header: 'PENDAPATAN {dateRange}', width: 22, alignment: 'right' },
  { key: 'pengeluaran', header: 'PENGELUARAN {dateRange}', width: 19, alignment: 'right' },
  { key: 'formula', header: 'SISA SALDO PER {endDate}', width: 16, alignment: 'right' },
  { key: 'piutang', header: 'PIUTANG', width: 15, alignment: 'right' },
  { key: 'persediaan', header: 'PERSEDIAAN', width: 18, alignment: 'right' },
  { key: 'formula', header: 'JUMLAH ASET LANCAR', width: 16, alignment: 'right' },
  { key: 'hutang', header: 'HUTANG', width: 15, alignment: 'right' },
  { key: 'formula', header: 'EKUITAS', width: 15, alignment: 'right' },
  { key: 'formula', header: 'CURRENT RATIO', width: 14, alignment: 'center', ratioColumn: true },
  { key: 'formula', header: 'CASH RATIO', width: 14, alignment: 'center', ratioColumn: true }
];

const bluColumns: SheetColumnConfig<BluExportRow>[] = [
  { key: 'hospitalName', header: 'NAMA RS TNI AU', width: 42, alignment: 'left' },
  { key: 'saldoAwal', header: 'SISA SALDO AWAL TA {year}', width: 16, alignment: 'right' },
  { key: 'pendapatan', header: 'PENDAPATAN {dateRange}', width: 20, alignment: 'right' },
  { key: 'pengeluaran', header: 'PENGELUARAN {dateRange}', width: 19, alignment: 'right' },
  { key: 'formula', header: 'SISA SALDO PER {endDate}', width: 16, alignment: 'right' },
  { key: 'piutang', header: 'PIUTANG', width: 15, alignment: 'right' },
  { key: 'persediaan', header: 'PERSEDIAAN', width: 18, alignment: 'right' },
  { key: 'formula', header: 'JUMLAH ASET LANCAR', width: 16, alignment: 'right' },
  { key: 'hutang', header: 'HUTANG', width: 15, alignment: 'right' },
  { key: 'formula', header: 'EKUITAS', width: 17, alignment: 'right' },
  { key: 'formula', header: 'CURRENT RATIO', width: 14, alignment: 'center', ratioColumn: true },
  { key: 'formula', header: 'CASH RATIO', width: 14, alignment: 'center', ratioColumn: true }
];

export async function exportMonitoringWorkbook({ period, pnbpRows, bluRows }: ExportMonitoringWorkbookParams): Promise<void> {
  const workbook = new ExcelJS.Workbook();

  buildPnbpSheet(workbook.addWorksheet(`PNBP TW ${period.quarter} TA ${period.year}`), period, pnbpRows);
  buildBluSheet(workbook.addWorksheet(`BLU TW ${period.quarterRoman} TA ${period.year}`), period, bluRows);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = buildExportFilename(period);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function buildPnbpSheet(sheet: Worksheet, period: MonitoringPeriodMeta, rows: PnbpExportRow[]): void {
  configureBaseSheet(sheet, {
    period,
    title: 'MONITORING LAPORAN KEUANGAN RS TNI AU (PNBP)',
    lastColumn: 'K',
    columns: pnbpColumns,
    rowCount: rows.length
  });

  rows.forEach((row, index) => {
    const rowIndex = DATA_START_ROW + index;
    sheet.getCell(`A${rowIndex}`).value = row.hospitalName;
    sheet.getCell(`B${rowIndex}`).value = toExcelNumber(row.pendapatan);
    sheet.getCell(`C${rowIndex}`).value = toExcelNumber(row.pengeluaran);
    sheet.getCell(`D${rowIndex}`).value = { formula: `IF(OR(B${rowIndex}="",C${rowIndex}=""),"",B${rowIndex}-C${rowIndex})` };
    sheet.getCell(`E${rowIndex}`).value = toExcelNumber(row.piutang);
    sheet.getCell(`F${rowIndex}`).value = toExcelNumber(row.persediaan);
    sheet.getCell(`G${rowIndex}`).value = { formula: `IF(AND(D${rowIndex}="",E${rowIndex}="",F${rowIndex}=""),"",SUM(D${rowIndex}:F${rowIndex}))` };
    sheet.getCell(`H${rowIndex}`).value = toExcelNumber(row.hutang);
    sheet.getCell(`I${rowIndex}`).value = { formula: `IF(OR(G${rowIndex}="",H${rowIndex}=""),"",G${rowIndex}-H${rowIndex})` };
    sheet.getCell(`J${rowIndex}`).value = { formula: `IF(OR(H${rowIndex}="",H${rowIndex}=0),"",G${rowIndex}/H${rowIndex})` };
    sheet.getCell(`K${rowIndex}`).value = { formula: `IF(OR(H${rowIndex}="",H${rowIndex}=0),"",D${rowIndex}/H${rowIndex})` };
  });

  applyDataStyles(sheet, rows.length, 'K');
}

function buildBluSheet(sheet: Worksheet, period: MonitoringPeriodMeta, rows: BluExportRow[]): void {
  configureBaseSheet(sheet, {
    period,
    title: 'MONITORING LAPORAN KEUANGAN RS TNI AU (BLU)',
    lastColumn: 'L',
    columns: bluColumns,
    rowCount: rows.length
  });

  rows.forEach((row, index) => {
    const rowIndex = DATA_START_ROW + index;
    sheet.getCell(`A${rowIndex}`).value = row.hospitalName;
    sheet.getCell(`B${rowIndex}`).value = toExcelNumber(row.saldoAwal);
    sheet.getCell(`C${rowIndex}`).value = toExcelNumber(row.pendapatan);
    sheet.getCell(`D${rowIndex}`).value = toExcelNumber(row.pengeluaran);
    sheet.getCell(`E${rowIndex}`).value = { formula: `IF(OR(B${rowIndex}="",C${rowIndex}="",D${rowIndex}=""),"",B${rowIndex}+C${rowIndex}-D${rowIndex})` };
    sheet.getCell(`F${rowIndex}`).value = toExcelNumber(row.piutang);
    sheet.getCell(`G${rowIndex}`).value = toExcelNumber(row.persediaan);
    sheet.getCell(`H${rowIndex}`).value = { formula: `IF(AND(E${rowIndex}="",F${rowIndex}="",G${rowIndex}=""),"",SUM(E${rowIndex}:G${rowIndex}))` };
    sheet.getCell(`I${rowIndex}`).value = toExcelNumber(row.hutang);
    sheet.getCell(`J${rowIndex}`).value = { formula: `IF(OR(H${rowIndex}="",I${rowIndex}=""),"",H${rowIndex}-I${rowIndex})` };
    sheet.getCell(`K${rowIndex}`).value = { formula: `IF(OR(I${rowIndex}="",I${rowIndex}=0),"",H${rowIndex}/I${rowIndex})` };
    sheet.getCell(`L${rowIndex}`).value = { formula: `IF(OR(I${rowIndex}="",I${rowIndex}=0),"",E${rowIndex}/I${rowIndex})` };
  });

  applyDataStyles(sheet, rows.length, 'L');
}

function configureBaseSheet<T>(
  sheet: Worksheet,
  config: {
    period: MonitoringPeriodMeta;
    title: string;
    lastColumn: string;
    columns: SheetColumnConfig<T>[];
    rowCount: number;
  }
): void {
  const { period, title, lastColumn, columns, rowCount } = config;

  columns.forEach((column, index) => {
    sheet.getColumn(index + 1).width = column.width;
  });

  sheet.getCell('A1').value = ORG_LINE_1;
  sheet.getCell('A2').value = ORG_LINE_2;
  sheet.getCell('A4').value = title;
  sheet.getCell('A5').value = period.titleText;

  sheet.mergeCells(`A4:${lastColumn}4`);
  sheet.mergeCells(`A5:${lastColumn}5`);

  applyTitleCellStyle(sheet.getCell('A1'));
  applyTitleCellStyle(sheet.getCell('A2'));
  applyTitleBandStyle(sheet.getCell('A4'));
  applyTitleBandStyle(sheet.getCell('A5'));

  columns.forEach((column, index) => {
    const cell = sheet.getCell(HEADER_ROW_INDEX, index + 1);
    cell.value = resolveHeaderLabel(column.header, period);
    cell.font = { ...excelFonts.header, italic: column.ratioColumn ?? false };
    cell.fill = excelFills.headerBand;
    cell.border = allThinBorder;
    cell.alignment = alignments.centeredWrapped;
  });

  sheet.getRow(HEADER_ROW_INDEX).height = 50;
  sheet.getRow(1).height = 22;
  sheet.getRow(2).height = 22;
  sheet.getRow(4).height = 28;
  sheet.getRow(5).height = 28;
  sheet.getRow(3).height = 8;
  sheet.getRow(6).height = 8;

  if (rowCount === 0) {
    applyDataStyles(sheet, 1, lastColumn);
  }
}

function resolveHeaderLabel(labelTemplate: string, period: MonitoringPeriodMeta): string {
  return labelTemplate
    .replace('{dateRange}', period.dateRangeLabel)
    .replace('{endDate}', period.endDateLabel)
    .replace('{year}', String(period.year));
}

function applyTitleCellStyle(cell: ExcelJS.Cell): void {
  cell.font = excelFonts.heading;
  cell.alignment = alignments.centered;
}

function applyTitleBandStyle(cell: ExcelJS.Cell): void {
  cell.font = excelFonts.titleBand;
  cell.fill = excelFills.titleBand;
  cell.border = allThinBorder;
  cell.alignment = alignments.centered;
}

function applyDataStyles(sheet: Worksheet, rowCount: number, lastColumn: string): void {
  const finalRow = DATA_START_ROW + Math.max(rowCount, 1) - 1;

  for (let rowIndex = DATA_START_ROW; rowIndex <= finalRow; rowIndex += 1) {
    for (let colIndex = 1; colIndex <= sheet.getColumn(lastColumn).number; colIndex += 1) {
      const cell = sheet.getCell(rowIndex, colIndex);
      cell.font = excelFonts.data;
      cell.border = allThinBorder;

      if (colIndex === 1) {
        cell.alignment = alignments.leftMiddle;
      } else if (colIndex >= sheet.getColumn(lastColumn).number - 1) {
        cell.alignment = alignments.centered;
      } else {
        cell.alignment = alignments.rightMiddle;
      }

      if (colIndex > 1 && colIndex < sheet.getColumn(lastColumn).number - 1) {
        cell.numFmt = currencyFormat;
      }

      if (colIndex >= sheet.getColumn(lastColumn).number - 1) {
        cell.numFmt = ratioFormat;
      }
    }
  }
}
