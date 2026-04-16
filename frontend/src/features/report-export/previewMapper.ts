import { formatCurrency, formatRatio } from '../../lib/formatters';
import { HospitalOption, PeriodOption, ReportRecord, SpreadsheetCell, SpreadsheetPreviewModel } from './types';

const alignRight: Pick<SpreadsheetCell, 'align'> = { align: 'right' };

export const mapReportToPreview = (
  report: ReportRecord,
  hospitals: HospitalOption[],
  periods: PeriodOption[]
): SpreadsheetPreviewModel => {
  const hospitalName = hospitals.find((hospital) => hospital.id === report.hospitalId)?.name ?? report.hospitalId;
  const periodLabel = periods.find((period) => period.id === report.period)?.label ?? report.period;

  const headers = [
    'Periode',
    'Rumah Sakit',
    'Jenis',
    report.entityType === 'BLU' ? 'Saldo Awal' : 'Sisa Saldo',
    'Pendapatan',
    'Pengeluaran',
    'Piutang',
    'Persediaan',
    'Hutang',
    'Aset Lancar',
    'Ekuitas',
    'Current Ratio',
    'Cash Ratio'
  ];

  const row: SpreadsheetCell[] = [
    { value: periodLabel },
    { value: hospitalName },
    { value: report.entityType, align: 'center' },
    { value: formatCurrency(report.entityType === 'BLU' ? report.saldoAwal : report.sisaSaldo), ...alignRight },
    { value: formatCurrency(report.pendapatan), ...alignRight },
    { value: formatCurrency(report.pengeluaran), ...alignRight },
    { value: formatCurrency(report.piutang), ...alignRight },
    { value: formatCurrency(report.persediaan), ...alignRight },
    { value: formatCurrency(report.hutang), ...alignRight },
    { value: formatCurrency(report.asetLancar), ...alignRight },
    { value: formatCurrency(report.ekuitas), ...alignRight },
    { value: formatRatio(report.currentRatio), ...alignRight },
    { value: formatRatio(report.cashRatio), ...alignRight }
  ];

  return {
    sheetName: report.entityType === 'PNBP' ? 'PNBP TW 1 TA 2026' : 'BLU TW I TA 2026',
    titleRows: ['KEMENTERIAN KESEHATAN RI', 'MONITORING LAPORAN KEUANGAN RS', `${report.entityType} - ${periodLabel}`],
    headers,
    rows: [row]
  };
};
