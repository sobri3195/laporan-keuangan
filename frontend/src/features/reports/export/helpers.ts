import type { Period, Report } from '../../../types/domain';
import { hospitals, periods, reports } from '../../../mocks/seedData';
import type { BluExportRow, MonitoringPeriodMeta, PnbpExportRow } from './types';

const MONTH_LABELS_ID = ['JAN', 'FEB', 'MARET', 'APR', 'MEI', 'JUN', 'JUL', 'AGT', 'SEP', 'OKT', 'NOV', 'DES'];
const QUARTER_ROMAN = ['I', 'II', 'III', 'IV'] as const;

const pnbpDetailByReportId: Record<string, Omit<PnbpExportRow, 'hospitalName'>> = {
  R1: { pendapatan: 1250000000, pengeluaran: 955000000, piutang: 25000000, persediaan: 128000000, hutang: 315000000 },
  R3: { pendapatan: 980000000, pengeluaran: 810000000, piutang: null, persediaan: 84500000, hutang: 220000000 }
};

const bluDetailByReportId: Record<string, Omit<BluExportRow, 'hospitalName'>> = {
  R2: { saldoAwal: 300000000, pendapatan: 1200000000, pengeluaran: 950000000, piutang: 78000000, persediaan: 145000000, hutang: 410000000 }
};

export function getQuarterFromMonth(month: number): 1 | 2 | 3 | 4 {
  return (Math.floor((month - 1) / 3) + 1) as 1 | 2 | 3 | 4;
}

export function quarterToRoman(quarter: 1 | 2 | 3 | 4): MonitoringPeriodMeta['quarterRoman'] {
  return QUARTER_ROMAN[quarter - 1];
}

export function buildPeriodMeta(period: Period): MonitoringPeriodMeta {
  const quarter = getQuarterFromMonth(period.month);
  const quarterRoman = quarterToRoman(quarter);
  const startMonthIndex = (quarter - 1) * 3;
  const endMonthIndex = startMonthIndex + 2;

  return {
    label: period.label,
    year: period.year,
    quarter,
    quarterRoman,
    titleText: `TRIWULAN ${quarter} TAHUN ${period.year}`,
    dateRangeLabel: `1 ${MONTH_LABELS_ID[startMonthIndex]} ${period.year} SD 31 ${MONTH_LABELS_ID[endMonthIndex]} ${period.year}`,
    startDateLabel: `1 ${MONTH_LABELS_ID[startMonthIndex]} ${period.year}`,
    endDateLabel: `31 ${MONTH_LABELS_ID[endMonthIndex]} ${period.year}`
  };
}

export function buildExportFilename(period: MonitoringPeriodMeta, timestamp = new Date()): string {
  const datePart = timestamp.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  return `MONITORING_LAPORAN_KEUANGAN_RS_TNI_AU_TW${period.quarter}_${period.year}_${datePart}.xlsx`;
}

export function buildMockExportRows(periodId?: string): { period: MonitoringPeriodMeta; pnbpRows: PnbpExportRow[]; bluRows: BluExportRow[] } {
  const activePeriod = periods.find((period) => period.id === periodId) ?? periods.find((period) => period.isActive) ?? periods[0];
  const period = buildPeriodMeta(activePeriod);
  const sourceReports: Report[] = reports.filter((report) => report.periodId === activePeriod.id);

  const pnbpRows = sourceReports
    .filter((report) => report.entityType === 'PNBP')
    .map((report) => {
      const hospitalName = hospitals.find((hospital) => hospital.id === report.hospitalId)?.name ?? report.hospitalId;
      const detail = pnbpDetailByReportId[report.id] ?? {
        pendapatan: null,
        pengeluaran: null,
        piutang: null,
        persediaan: null,
        hutang: null
      };

      return { hospitalName, ...detail };
    });

  const bluRows = sourceReports
    .filter((report) => report.entityType === 'BLU')
    .map((report) => {
      const hospitalName = hospitals.find((hospital) => hospital.id === report.hospitalId)?.name ?? report.hospitalId;
      const detail = bluDetailByReportId[report.id] ?? {
        saldoAwal: null,
        pendapatan: null,
        pengeluaran: null,
        piutang: null,
        persediaan: null,
        hutang: null
      };

      return { hospitalName, ...detail };
    });

  return { period, pnbpRows, bluRows };
}

export function toExcelNumber(value: number | null | undefined): number | null {
  return typeof value === 'number' ? value : null;
}
