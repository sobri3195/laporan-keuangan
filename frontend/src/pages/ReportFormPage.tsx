import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldPath, UseFormRegister, useForm } from 'react-hook-form';
import { calculateBLU, calculatePNBP } from '../lib/calculations';
import { formatCurrency, formatRatio } from '../lib/formatters';
import { bluSchema, pnbpSchema, ReportBLUInput, ReportPNBPInput } from '../schemas/reportSchema';
import { hospitals, periods } from '../mocks/seedData';
import { useAuthStore } from '../store/authStore';

type FormData = ReportPNBPInput & Partial<ReportBLUInput>;

function toNullableNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export default function ReportFormPage() {
  const { entity } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const resolvedEntity = entity ?? (location.pathname.includes('/blu/') ? 'BLU' : 'PNBP');
  const storageKey = `draft:${resolvedEntity}:${user?.id ?? 'anonymous'}`;
  const schema = resolvedEntity === 'BLU' ? bluSchema : pnbpSchema;

  const defaultHospitalId = user?.role === 'ADMIN_RS' && user.hospitalId ? user.hospitalId : '';

  const {
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      periodId: periods.find((p) => p.isActive)?.id ?? '',
      hospitalId: defaultHospitalId,
      pendapatan: undefined,
      pengeluaran: undefined,
      piutang: undefined,
      persediaan: undefined,
      hutang: undefined,
      saldoAwal: undefined
    }
  });

  const values = watch();
  const valuesMap = values as Record<string, unknown>;

  const requiredIdentityFields: Array<FieldPath<FormData>> = ['periodId', 'hospitalId'];
  const requiredFinancialFields: Array<FieldPath<FormData>> = resolvedEntity === 'BLU'
    ? ['saldoAwal', 'pendapatan', 'pengeluaran', 'piutang', 'persediaan', 'hutang']
    : ['pendapatan', 'pengeluaran', 'piutang', 'persediaan', 'hutang'];

  const countFilled = (fields: Array<FieldPath<FormData>>) =>
    fields.filter((field) => {
      const value = valuesMap[field];
      return value !== undefined && value !== null && value !== '' && !(typeof value === 'number' && Number.isNaN(value));
    }).length;

  const identityFilled = countFilled(requiredIdentityFields);
  const financialFilled = countFilled(requiredFinancialFields);
  const identityCompleteness = Math.round((identityFilled / requiredIdentityFields.length) * 100);
  const financialCompleteness = Math.round((financialFilled / requiredFinancialFields.length) * 100);
  const totalRequired = requiredIdentityFields.length + requiredFinancialFields.length;
  const totalFilled = identityFilled + financialFilled;
  const totalCompleteness = Math.round((totalFilled / totalRequired) * 100);
  const canSubmitFinal = totalCompleteness === 100 && isValid && !isSubmitting;

  const detail = {
    saldoAwal: toNullableNumber(values.saldoAwal),
    pendapatan: toNullableNumber(values.pendapatan),
    pengeluaran: toNullableNumber(values.pengeluaran),
    piutang: toNullableNumber(values.piutang),
    persediaan: toNullableNumber(values.persediaan),
    hutang: toNullableNumber(values.hutang)
  };

  const calc = resolvedEntity === 'BLU' ? calculateBLU(detail) : calculatePNBP(detail);

  const debtZeroWarning = useMemo(() => (values.hutang === 0 ? 'Hutang bernilai 0, rasio tidak dapat dihitung.' : null), [values.hutang]);

  useEffect(() => {
    const rawDraft = localStorage.getItem(storageKey);
    if (!rawDraft) return;
    try {
      const parsed = JSON.parse(rawDraft) as FormData;
      reset(parsed);
      setSavedAt(new Date().toISOString());
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey, reset]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const cleanDraft = Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined && value !== ''));
      localStorage.setItem(storageKey, JSON.stringify(cleanDraft));
      setSavedAt(new Date().toISOString());
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [values, storageKey]);

  const onSaveDraft = async (formValue: FormData) => {
    localStorage.setItem(storageKey, JSON.stringify(formValue));
    setSavedAt(new Date().toISOString());
    alert('Draft berhasil disimpan lokal. Integrasi API dapat diarahkan ke endpoint POST /laporan-* dengan status draft.');
  };

  const onSubmitFinal = async (formValue: FormData) => {
    const confirmed = window.confirm('Yakin submit final? Data akan masuk workflow review Admin Pusat.');
    if (!confirmed) return;

    localStorage.removeItem(storageKey);
    alert('Submit final berhasil (mock). Silakan hubungkan ke endpoint /submit/:id pada Apps Script.');
    navigate('/reports');
    console.log('payload submit final', { entity: resolvedEntity, ...formValue });
  };

  const clearDraft = () => {
    localStorage.removeItem(storageKey);
    reset({
      periodId: periods.find((p) => p.isActive)?.id ?? '',
      hospitalId: defaultHospitalId,
      attachment: undefined,
      pendapatan: undefined,
      pengeluaran: undefined,
      piutang: undefined,
      persediaan: undefined,
      hutang: undefined,
      saldoAwal: undefined
    });
    setSavedAt(null);
  };

  return (
    <div className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold">Form Input {resolvedEntity}</h2>
          <p className="text-xs text-slate-500">Lengkapi data lalu simpan draft atau submit final.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Kelengkapan Form: {totalFilled}/{totalRequired} ({totalCompleteness}%)
          </p>
          <p className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
            Autosave: {savedAt ? new Date(savedAt).toLocaleString('id-ID') : 'belum tersimpan'}
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Identitas Laporan</p>
          <p className="text-xs text-slate-500">
            Kelengkapan section: {identityFilled}/{requiredIdentityFields.length} ({identityCompleteness}%)
          </p>
        </div>
        <label className="space-y-1 text-sm">
          <span>Periode</span>
          <select className="w-full rounded-lg border border-slate-300 p-2" {...register('periodId')}>
            <option value="">Pilih periode</option>
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.label}
              </option>
            ))}
          </select>
          {errors.periodId && <p className="text-xs text-red-600">{errors.periodId.message}</p>}
        </label>

        <label className="space-y-1 text-sm">
          <span>Rumah Sakit</span>
          <select className="w-full rounded-lg border border-slate-300 p-2" {...register('hospitalId')} disabled={user?.role === 'ADMIN_RS'}>
            <option value="">Pilih rumah sakit</option>
            {hospitals
              .filter((hospital) => hospital.active)
              .map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.code} - {hospital.name}
                </option>
              ))}
          </select>
          {errors.hospitalId && <p className="text-xs text-red-600">{errors.hospitalId.message}</p>}
        </label>

        <label className="space-y-1 text-sm">
          <span>Lampiran (opsional, PDF/Excel)</span>
          <input
            type="file"
            accept=".pdf,.xls,.xlsx"
            className="w-full rounded-lg border border-slate-300 p-2"
            onChange={(event) => setValue('attachment', event.target.files?.[0])}
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Data Keuangan</p>
          <p className="text-xs text-slate-500">
            Kelengkapan section: {financialFilled}/{requiredFinancialFields.length} ({financialCompleteness}%)
          </p>
        </div>
        {resolvedEntity === 'BLU' && (
          <NumberField label="Saldo Awal" name="saldoAwal" register={register} error={errors.saldoAwal?.message as string | undefined} />
        )}
        <NumberField label="Pendapatan" name="pendapatan" register={register} error={errors.pendapatan?.message as string | undefined} />
        <NumberField label="Pengeluaran" name="pengeluaran" register={register} error={errors.pengeluaran?.message as string | undefined} />
        <NumberField label="Piutang" name="piutang" register={register} error={errors.piutang?.message as string | undefined} />
        <NumberField label="Persediaan" name="persediaan" register={register} error={errors.persediaan?.message as string | undefined} />
        <NumberField label="Hutang" name="hutang" register={register} error={errors.hutang?.message as string | undefined} />
      </div>

      {debtZeroWarning && <p className="rounded bg-amber-50 px-3 py-2 text-sm text-amber-700">⚠️ {debtZeroWarning}</p>}

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm md:grid-cols-2 xl:grid-cols-5">
        <SummaryItem label="Sisa Saldo" value={formatCurrency(('sisaSaldo' in calc ? calc.sisaSaldo : calc.sisaSaldoAkhir) ?? null)} />
        <SummaryItem label="Aset Lancar" value={formatCurrency(calc.asetLancar ?? null)} />
        <SummaryItem label="Ekuitas" value={formatCurrency(calc.ekuitas ?? null)} />
        <SummaryItem label="Current Ratio" value={formatRatio(calc.currentRatio)} />
        <SummaryItem label="Cash Ratio" value={formatRatio(calc.cashRatio)} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={handleSubmit(onSaveDraft)} className="rounded-lg bg-slate-600 px-3 py-2 text-sm font-semibold text-white" disabled={isSubmitting}>
          Simpan Draft
        </button>
        <button type="button" onClick={handleSubmit(onSubmitFinal)} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white" disabled={!canSubmitFinal}>
          Submit Final
        </button>
        <button type="button" onClick={clearDraft} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700" disabled={isSubmitting}>
          Hapus Draft Lokal
        </button>
      </div>
    </div>
  );
}

function NumberField({
  label,
  name,
  register,
  error
}: {
  label: string;
  name: FieldPath<FormData>;
  register: UseFormRegister<FormData>;
  error?: string;
}) {
  return (
    <label className="space-y-1 text-sm">
      <span>{label}</span>
      <input type="number" step="any" className="w-full rounded-lg border border-slate-300 p-2" {...register(name, { valueAsNumber: true })} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </label>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
}
