import { formatCurrency, formatRatio } from '../../lib/formatters';
import { CalculationValues } from './types';

export function AutoCalculationPanel({ entityType, values, warnings }: { entityType: 'PNBP' | 'BLU'; values: CalculationValues; warnings: string[] }) {
  const saldoLabel = entityType === 'BLU' ? 'Sisa Saldo Akhir' : 'Sisa Saldo';
  const saldoValue = entityType === 'BLU' ? values.sisaSaldoAkhir : values.sisaSaldo;

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-slate-900">Summary Perhitungan Otomatis</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        <Metric label={saldoLabel} value={formatCurrency(saldoValue ?? null)} tone={getTone((saldoValue ?? 0) >= 0)} />
        <Metric label="Aset Lancar" value={formatCurrency(values.asetLancar)} tone={getTone((values.asetLancar ?? 0) >= 0)} />
        <Metric label="Ekuitas" value={formatCurrency(values.ekuitas)} tone={getTone((values.ekuitas ?? 0) >= 0)} />
        <Metric label="Current Ratio" value={formatRatio(values.currentRatio)} tone={getRatioTone(values.currentRatio)} />
        <Metric label="Cash Ratio" value={formatRatio(values.cashRatio)} tone={getRatioTone(values.cashRatio)} />
      </div>
      {warnings.length > 0 && (
        <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
          <p className="font-semibold">Perlu perhatian:</p>
          <ul className="list-disc pl-4">
            {warnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}

function getTone(ok: boolean) {
  return ok ? 'green' : 'red';
}

function getRatioTone(value: number | null) {
  if (value == null) return 'yellow';
  if (value >= 1) return 'green';
  if (value >= 0.5) return 'yellow';
  return 'red';
}

function Metric({ label, value, tone }: { label: string; value: string; tone: 'green' | 'yellow' | 'red' }) {
  const toneClass = tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : tone === 'yellow' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-red-200 bg-red-50 text-red-700';
  return (
    <div className={`rounded-lg border p-3 ${toneClass}`}>
      <p className="text-xs">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
