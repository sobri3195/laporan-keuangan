import { ReportCalculated, ReportEntityType, ReportInput } from './types';

const hasNumber = (value: number | null): value is number => typeof value === 'number' && Number.isFinite(value);

const addNullable = (...values: Array<number | null>) => {
  if (values.some((value) => !hasNumber(value))) return null;
  return values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
};

const subtractNullable = (left: number | null, right: number | null) => {
  if (!hasNumber(left) || !hasNumber(right)) return null;
  return left - right;
};

const divideNullable = (numerator: number | null, denominator: number | null) => {
  if (!hasNumber(numerator) || !hasNumber(denominator) || denominator === 0) return null;
  return numerator / denominator;
};

export const buildCalculatedValues = (entityType: ReportEntityType, input: ReportInput): ReportCalculated => {
  if (entityType === 'PNBP') {
    const sisaSaldo = subtractNullable(input.pendapatan, input.pengeluaran);
    const asetLancar = addNullable(sisaSaldo, input.piutang, input.persediaan);

    return {
      sisaSaldo,
      sisaSaldoAkhir: null,
      asetLancar,
      ekuitas: subtractNullable(asetLancar, input.hutang),
      currentRatio: divideNullable(asetLancar, input.hutang),
      cashRatio: divideNullable(sisaSaldo, input.hutang)
    };
  }

  const sisaSaldoAkhir = addNullable(input.saldoAwal, input.pendapatan, hasNumber(input.pengeluaran) ? -input.pengeluaran : null);
  const asetLancar = addNullable(sisaSaldoAkhir, input.piutang, input.persediaan);

  return {
    sisaSaldo: null,
    sisaSaldoAkhir,
    asetLancar,
    ekuitas: subtractNullable(asetLancar, input.hutang),
    currentRatio: divideNullable(asetLancar, input.hutang),
    cashRatio: divideNullable(sisaSaldoAkhir, input.hutang)
  };
};

export const toNullableNumber = (value: string): number | null => {
  if (!value.trim()) return null;
  const normalized = Number(value.replace(/,/g, '.'));
  return Number.isFinite(normalized) ? normalized : null;
};
