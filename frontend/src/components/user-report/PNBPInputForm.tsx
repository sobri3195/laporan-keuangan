import { FinancialValues, ValidationErrors } from './types';

const fields: Array<{ key: keyof FinancialValues; label: string; helper: string; placeholder: string }> = [
  { key: 'pendapatan', label: 'Pendapatan', helper: 'Masukkan total pendapatan selama periode', placeholder: 'Contoh: 150000000' },
  { key: 'pengeluaran', label: 'Pengeluaran', helper: 'Masukkan total pengeluaran selama periode', placeholder: 'Contoh: 120000000' },
  { key: 'piutang', label: 'Piutang', helper: 'Masukkan total piutang per akhir periode', placeholder: 'Contoh: 10000000' },
  { key: 'persediaan', label: 'Persediaan', helper: 'Masukkan nilai persediaan per akhir periode', placeholder: 'Contoh: 5000000' },
  { key: 'hutang', label: 'Hutang', helper: 'Masukkan total hutang per akhir periode', placeholder: 'Contoh: 8000000' }
];

export function PNBPInputForm({ values, errors, disabled, highlighted, onChange }: {
  values: FinancialValues;
  errors: ValidationErrors;
  disabled?: boolean;
  highlighted: string[];
  onChange: (key: keyof FinancialValues, value: number | undefined) => void;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-slate-900">Isi Data Keuangan PNBP</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <NumericField
            key={field.key}
            label={field.label}
            helper={field.helper}
            placeholder={field.placeholder}
            value={values[field.key]}
            error={errors[field.key]}
            disabled={disabled}
            highlighted={highlighted.includes(field.key)}
            onChange={(value) => onChange(field.key, value)}
          />
        ))}
      </div>
    </section>
  );
}

function NumericField({ label, helper, placeholder, value, error, disabled, highlighted, onChange }: {
  label: string;
  helper: string;
  placeholder: string;
  value?: number;
  error?: string;
  disabled?: boolean;
  highlighted: boolean;
  onChange: (value: number | undefined) => void;
}) {
  return (
    <label className="space-y-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        className={`w-full rounded-lg border p-2 ${highlighted ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        placeholder={placeholder}
        disabled={disabled}
      />
      <p className="text-xs text-slate-500">{helper}</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </label>
  );
}
