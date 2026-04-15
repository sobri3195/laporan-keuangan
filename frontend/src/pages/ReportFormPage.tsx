import { useLocation, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { calculateBLU, calculatePNBP } from '../lib/calculations';
import { formatRatio } from '../lib/formatters';

type FormData = {
  saldoAwal?: number;
  pendapatan?: number;
  pengeluaran?: number;
  piutang?: number;
  persediaan?: number;
  hutang?: number;
};

export default function ReportFormPage() {
  const { entity } = useParams();
  const location = useLocation();
  const resolvedEntity = entity ?? (location.pathname.includes('/blu/') ? 'BLU' : 'PNBP');
  const { register, watch } = useForm<FormData>();
  const values = watch();
  const detail = {
    saldoAwal: values.saldoAwal ?? null,
    pendapatan: values.pendapatan ?? null,
    pengeluaran: values.pengeluaran ?? null,
    piutang: values.piutang ?? null,
    persediaan: values.persediaan ?? null,
    hutang: values.hutang ?? null
  };
  const calc = resolvedEntity === 'BLU' ? calculateBLU(detail) : calculatePNBP(detail);

  return (
    <div className="rounded-xl bg-white p-4 space-y-3">
      <h2 className="font-bold">Form {resolvedEntity}</h2>
      <div className="grid md:grid-cols-3 gap-3">
        {resolvedEntity === 'BLU' && <input type="number" {...register('saldoAwal', { valueAsNumber: true })} placeholder="Saldo Awal" className="rounded border p-2" />}
        <input type="number" {...register('pendapatan', { valueAsNumber: true })} placeholder="Pendapatan" className="rounded border p-2" />
        <input type="number" {...register('pengeluaran', { valueAsNumber: true })} placeholder="Pengeluaran" className="rounded border p-2" />
        <input type="number" {...register('piutang', { valueAsNumber: true })} placeholder="Piutang" className="rounded border p-2" />
        <input type="number" {...register('persediaan', { valueAsNumber: true })} placeholder="Persediaan" className="rounded border p-2" />
        <input type="number" {...register('hutang', { valueAsNumber: true })} placeholder="Hutang" className="rounded border p-2" />
      </div>
      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <p>Current Ratio: {formatRatio(calc.currentRatio)}</p>
        <p>Cash Ratio: {formatRatio(calc.cashRatio)}</p>
      </div>
      <div className="flex gap-2">
        <button className="rounded bg-slate-600 px-3 py-2 text-white">Simpan Draft</button>
        <button className="rounded bg-primary px-3 py-2 text-white">Submit</button>
      </div>
    </div>
  );
}
