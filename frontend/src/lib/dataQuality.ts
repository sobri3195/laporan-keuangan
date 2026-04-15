import { BluDetail, PnbpDetail } from '../types/domain';

const EXTREME_THRESHOLD = 1_000_000_000;

type Common = PnbpDetail & { saldoAwal?: number | null };

export function evaluateDataQuality(current: Common, previous?: Common) {
  const fields = ['pendapatan', 'pengeluaran', 'piutang', 'persediaan', 'hutang'] as const;
  const filled = fields.filter((f) => current[f] != null).length;
  const completenessScore = Math.round((filled / fields.length) * 100);
  const warnings: string[] = [];

  Object.entries(current).forEach(([k, v]) => {
    if (typeof v === 'number' && v < 0) warnings.push(`${k.toUpperCase()}_NEGATIVE`);
    if (typeof v === 'number' && Math.abs(v) > EXTREME_THRESHOLD) warnings.push(`${k.toUpperCase()}_EXTREME`);
  });

  if ((current.pendapatan ?? 0) < (current.pengeluaran ?? 0)) warnings.push('PENGELUARAN_GT_PENDAPATAN');

  if (previous?.pendapatan != null && current.pendapatan != null) {
    const delta = Math.abs(current.pendapatan - previous.pendapatan) / Math.max(previous.pendapatan, 1);
    if (delta > 0.5) warnings.push('DRASTIC_CHANGE_PENDAPATAN');
  }

  const validityScore = Math.max(0, 100 - warnings.length * 10);
  return { completenessScore, validityScore, anomalyFlags: warnings };
}

export function isBluDetail(detail: Common): detail is BluDetail {
  return 'saldoAwal' in detail;
}
