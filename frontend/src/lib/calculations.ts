import { BluDetail, PnbpDetail } from '../types/domain';

const asNumber = (v: number | null) => (v == null ? null : Number(v));
const safeDiv = (a: number | null, b: number | null) => (a == null || b == null || b <= 0 ? null : a / b);

export function calculatePNBP(detail: PnbpDetail) {
  const pendapatan = asNumber(detail.pendapatan);
  const pengeluaran = asNumber(detail.pengeluaran);
  const sisaSaldo = pendapatan == null || pengeluaran == null ? null : pendapatan - pengeluaran;
  const asetLancar = sisaSaldo == null || detail.piutang == null || detail.persediaan == null ? null : sisaSaldo + detail.piutang + detail.persediaan;
  const ekuitas = asetLancar == null || detail.hutang == null ? null : asetLancar - detail.hutang;
  return {
    sisaSaldo,
    asetLancar,
    ekuitas,
    currentRatio: safeDiv(asetLancar, detail.hutang),
    cashRatio: safeDiv(sisaSaldo, detail.hutang)
  };
}

export function calculateBLU(detail: BluDetail) {
  const sisaSaldoAkhir = detail.saldoAwal == null || detail.pendapatan == null || detail.pengeluaran == null
    ? null
    : detail.saldoAwal + detail.pendapatan - detail.pengeluaran;
  const asetLancar = sisaSaldoAkhir == null || detail.piutang == null || detail.persediaan == null ? null : sisaSaldoAkhir + detail.piutang + detail.persediaan;
  const ekuitas = asetLancar == null || detail.hutang == null ? null : asetLancar - detail.hutang;
  return {
    sisaSaldoAkhir,
    asetLancar,
    ekuitas,
    currentRatio: safeDiv(asetLancar, detail.hutang),
    cashRatio: safeDiv(sisaSaldoAkhir, detail.hutang)
  };
}
