import { PreviewContext, PreviewRow, PreviewSheet } from './previewTypes';
import { PREVIEW_COLUMNS, PREVIEW_TITLE_LINES, getSheetName } from './selectors';
import { computeDerivedRecord, resolveHospitalName, toDisplayValue, asPreviewCell, PREVIEW_CELL_FILL } from './previewUtils';
import { HospitalOption, ReportEntityType, ReportRecord } from './types';

const buildHeaderRow = (entityType: ReportEntityType): PreviewRow => ({
  key: `${entityType}-header`,
  cells: PREVIEW_COLUMNS[entityType].map((column) =>
    asPreviewCell({
      key: `${entityType}-header-${column.key}`,
      value: column.label,
      displayValue: column.label,
      align: 'center',
      bold: true,
      fill: PREVIEW_CELL_FILL.header,
      isHeader: true
    })
  )
});

const buildDataRow = (entityType: ReportEntityType, record: ReportRecord, hospitals: HospitalOption[]): PreviewRow => {
  const normalized = computeDerivedRecord(record);
  const hospitalName = resolveHospitalName(record.hospitalId, hospitals);
  const values: Record<string, number | string | null> = {
    hospitalName,
    saldoAwal: normalized.saldoAwal,
    pendapatan: normalized.pendapatan,
    pengeluaran: normalized.pengeluaran,
    sisaSaldo: normalized.sisaSaldo,
    sisaSaldoAkhir: normalized.sisaSaldoAkhir,
    piutang: normalized.piutang,
    persediaan: normalized.persediaan,
    asetLancar: normalized.asetLancar,
    hutang: normalized.hutang,
    ekuitas: normalized.ekuitas,
    currentRatio: normalized.currentRatio,
    cashRatio: normalized.cashRatio
  };

  return {
    key: `${entityType}-${record.id}`,
    cells: PREVIEW_COLUMNS[entityType].map((column) => {
      const value = values[column.key] ?? null;
      return asPreviewCell({
        key: `${record.id}-${column.key}`,
        value,
        displayValue: toDisplayValue(value, column.kind),
        align: column.align ?? 'left'
      });
    })
  };
};

const buildCalculatedRow = (entityType: ReportEntityType, record: ReportRecord): PreviewRow => {
  const normalized = computeDerivedRecord(record);
  const columns = PREVIEW_COLUMNS[entityType];
  const cells = columns.map((column, index) => {
    if (index === 0) {
      return asPreviewCell({
        key: `${record.id}-calculated-label`,
        value: 'HASIL KALKULASI',
        displayValue: 'HASIL KALKULASI',
        bold: true,
        fill: PREVIEW_CELL_FILL.title,
        align: 'left'
      });
    }

    const fieldValue = (normalized as unknown as Record<string, number | null>)[column.key] ?? null;
    const shouldShow = ['sisaSaldo', 'sisaSaldoAkhir', 'asetLancar', 'ekuitas', 'currentRatio', 'cashRatio'].includes(column.key);

    return asPreviewCell({
      key: `${record.id}-calculated-${column.key}`,
      value: shouldShow ? fieldValue : null,
      displayValue: shouldShow ? toDisplayValue(fieldValue, column.kind) : '',
      align: column.align ?? 'left',
      bold: shouldShow
    });
  });

  return { key: `${entityType}-${record.id}-calculated`, cells };
};

const buildEmptyDataRow = (entityType: ReportEntityType): PreviewRow => ({
  key: `${entityType}-empty-row`,
  cells: PREVIEW_COLUMNS[entityType].map((column, index) =>
    asPreviewCell({
      key: `${entityType}-empty-${column.key}`,
      value: index === 0 ? 'Belum ada data untuk dipreview' : null,
      displayValue: index === 0 ? 'Belum ada data untuk dipreview' : '',
      align: index === 0 ? 'left' : column.align,
      italic: index === 0,
      bordered: true
    })
  )
});

const buildSheet = (entityType: ReportEntityType, record: ReportRecord | null, hospitals: HospitalOption[], context: PreviewContext): PreviewSheet => {
  const rowBlocks: PreviewRow[] = [buildHeaderRow(entityType), record ? buildDataRow(entityType, record, hospitals) : buildEmptyDataRow(entityType)];

  if (record) {
    rowBlocks.push(buildCalculatedRow(entityType, record));
  }

  return {
    type: entityType,
    name: getSheetName(entityType, context.periodLabel),
    title: PREVIEW_TITLE_LINES.institution,
    subtitle: PREVIEW_TITLE_LINES.directorate,
    periodLabel: context.periodLabel,
    rows: rowBlocks
  };
};

export const mapPNBPPreview = (record: ReportRecord | null, hospitals: HospitalOption[], context: PreviewContext) =>
  buildSheet('PNBP', record, hospitals, context);

export const mapBLUPreview = (record: ReportRecord | null, hospitals: HospitalOption[], context: PreviewContext) =>
  buildSheet('BLU', record, hospitals, context);

export const mapPreviewSheets = (args: {
  pnbpRecord: ReportRecord | null;
  bluRecord: ReportRecord | null;
  hospitals: HospitalOption[];
  context: PreviewContext;
}) => ({
  PNBP: mapPNBPPreview(args.pnbpRecord, args.hospitals, args.context),
  BLU: mapBLUPreview(args.bluRecord, args.hospitals, args.context)
});
