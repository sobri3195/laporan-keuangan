import { saveAs } from './helpers';
import { ReportEntityType, ReportRecord } from './types';

type ExportMode = 'filtered' | 'template';

type ExcelJsModule = {
  Workbook: new () => {
    creator?: string;
    addWorksheet: (name: string) => WorksheetLike;
    xlsx: { writeBuffer: () => Promise<ArrayBuffer> };
  };
};

type WorksheetLike = {
  columns: Array<{ header: string; width: number }>;
  addWorksheet?: never;
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

type ThinBorder = {
  top: { style: 'thin' };
  left: { style: 'thin' };
  right: { style: 'thin' };
  bottom: { style: 'thin' };
};

const createThinBorder = (): ThinBorder => ({
  top: { style: 'thin' },
  left: { style: 'thin' },
  right: { style: 'thin' },
  bottom: { style: 'thin' }
});

const baseColumns = [
  'Periode',
  'Rumah Sakit',
  'Jenis Entitas',
  'Saldo Awal',
  'Pendapatan',
  'Pengeluaran',
  'Sisa Saldo',
  'Piutang',
  'Persediaan',
  'Hutang',
  'Aset Lancar',
  'Ekuitas',
  'Current Ratio',
  'Cash Ratio'
];

const getExcelJs = async (): Promise<ExcelJsModule | null> => {
  try {
    const moduleName = 'excel' + 'js';
    return (await import(/* @vite-ignore */ moduleName)) as unknown as ExcelJsModule;
  } catch {
    return null;
  }
};

const buildCsvFallback = (rows: ReportRecord[]) => {
  const header = baseColumns.join(',');
  const body = rows
    .map((row) =>
      [
        row.period,
        row.hospitalId,
        row.entityType,
        row.saldoAwal,
        row.pendapatan,
        row.pengeluaran,
        row.entityType === 'BLU' ? row.sisaSaldoAkhir : row.sisaSaldo,
        row.piutang,
        row.persediaan,
        row.hutang,
        row.asetLancar,
        row.ekuitas,
        row.currentRatio == null ? 'N/A' : row.currentRatio,
        row.cashRatio == null ? 'N/A' : row.cashRatio
      ]
        .map((value) => (value == null ? '' : value))
        .join(',')
    )
    .join('\n');
  return `${header}\n${body}`;
};

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

const buildSheet = (workbook: ExcelJsModule['Workbook'] extends new () => infer T ? T : never, sheetName: string, rows: ReportRecord[], entityType: ReportEntityType, formalTemplate = false) => {
  const sheet = workbook.addWorksheet(sheetName);
  sheet.columns = baseColumns.map((name) => ({ header: name, width: 17 }));
  sheet.mergeCells('A1:N1');
  sheet.getCell('A1').value = 'MONITORING LAPORAN KEUANGAN RUMAH SAKIT';
  sheet.getCell('A1').font = { name: 'Arial', bold: true, size: 13 };
  sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB7E1CD' } };
  sheet.mergeCells('A2:N2');
  sheet.getCell('A2').value = `${entityType} - Template Monitoring ${formalTemplate ? '(Template Format)' : ''}`;
  sheet.getCell('A2').alignment = { horizontal: 'center' };
  sheet.getCell('A2').font = { name: 'Arial', bold: true, size: 11 };
  sheet.getRow(4).values = baseColumns;
  fillHeaderStyle(sheet, 4);
  let rowStart = 5;
  rows.forEach((record) => {
    const rowIndex = rowStart++;
    sheet.getCell(`A${rowIndex}`).value = record.period;
    sheet.getCell(`B${rowIndex}`).value = record.hospitalId;
    sheet.getCell(`C${rowIndex}`).value = record.entityType;
    sheet.getCell(`D${rowIndex}`).value = record.entityType === 'BLU' ? record.saldoAwal : null;
    sheet.getCell(`E${rowIndex}`).value = record.pendapatan;
    sheet.getCell(`F${rowIndex}`).value = record.pengeluaran;
    sheet.getCell(`G${rowIndex}`).value = {
      formula: record.entityType === 'BLU' ? `IF(AND(D${rowIndex}="",E${rowIndex}="",F${rowIndex}=""),"",D${rowIndex}+E${rowIndex}-F${rowIndex})` : `IF(AND(E${rowIndex}="",F${rowIndex}=""),"",E${rowIndex}-F${rowIndex})`
    };
    sheet.getCell(`H${rowIndex}`).value = record.piutang;
    sheet.getCell(`I${rowIndex}`).value = record.persediaan;
    sheet.getCell(`J${rowIndex}`).value = record.hutang;
    sheet.getCell(`K${rowIndex}`).value = { formula: `IF(AND(G${rowIndex}="",H${rowIndex}="",I${rowIndex}=""),"",G${rowIndex}+H${rowIndex}+I${rowIndex})` };
    sheet.getCell(`L${rowIndex}`).value = { formula: `IF(OR(K${rowIndex}="",J${rowIndex}=""),"",K${rowIndex}-J${rowIndex})` };
    sheet.getCell(`M${rowIndex}`).value = { formula: `IF(OR(J${rowIndex}=0,J${rowIndex}="",K${rowIndex}=""),"N/A",K${rowIndex}/J${rowIndex})` };
    sheet.getCell(`N${rowIndex}`).value = { formula: `IF(OR(J${rowIndex}=0,J${rowIndex}="",G${rowIndex}=""),"N/A",G${rowIndex}/J${rowIndex})` };
    fillBodyStyle(sheet, rowIndex);
  });
};

const filename = (period: string) => `MONITORING_LAPORAN_KEUANGAN_RS_${period || 'ALL'}_${Date.now()}.xlsx`;

export const exportMonitoringWorkbook = async (rows: ReportRecord[], period: string, mode: ExportMode = 'filtered') => {
  const ExcelJS = await getExcelJs();
  if (!ExcelJS) {
    const csv = buildCsvFallback(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, filename(period).replace('.xlsx', '.csv'));
    return;
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SIMON Keuangan RS';
  buildSheet(workbook, 'PNBP TW 1 TA 2026', rows.filter((row) => row.entityType === 'PNBP'), 'PNBP', mode === 'template');
  buildSheet(workbook, 'BLU TW I TA 2026', rows.filter((row) => row.entityType === 'BLU'), 'BLU', mode === 'template');

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, filename(period));
};
