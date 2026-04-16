import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { reportFormSchema, ReportFormValues } from '../../features/report-export/validation';
import { HospitalOption, PeriodOption, ReportRecord } from '../../features/report-export/types';

const numberFields = ['saldoAwal', 'pendapatan', 'pengeluaran', 'piutang', 'persediaan', 'hutang'] as const;

type Props = {
  open: boolean;
  editing: ReportRecord | null;
  periods: PeriodOption[];
  hospitals: HospitalOption[];
  onClose: () => void;
  onSubmit: (values: ReportFormValues) => Promise<void>;
};

export function ReportFormModal({ open, editing, periods, hospitals, onClose, onSubmit }: Props) {
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      period: periods[0]?.id ?? '',
      hospitalId: hospitals[0]?.id ?? '',
      entityType: 'PNBP',
      status: 'draft',
      saldoAwal: null,
      pendapatan: null,
      pengeluaran: null,
      piutang: null,
      persediaan: null,
      hutang: null
    }
  });

  useEffect(() => {
    if (!editing) return;
    form.reset({
      period: editing.period,
      hospitalId: editing.hospitalId,
      entityType: editing.entityType,
      status: editing.status === 'final' ? 'final' : 'draft',
      saldoAwal: editing.saldoAwal,
      pendapatan: editing.pendapatan,
      pengeluaran: editing.pengeluaran,
      piutang: editing.piutang,
      persediaan: editing.persediaan,
      hutang: editing.hutang
    });
  }, [editing, form]);

  if (!open) return null;

  const isLocked = editing ? ['approved', 'locked'].includes(editing.status) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <form
        className="w-full max-w-3xl space-y-4 rounded-xl bg-white p-5 shadow-2xl"
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values);
          onClose();
        })}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-800">{editing ? 'Edit Data Laporan' : 'Tambah Data Laporan'}</h3>
          <button type="button" className="rounded border px-2 py-1 text-xs" onClick={onClose}>
            Tutup
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="text-sm">
            Periode
            <select className="mt-1 w-full rounded border px-2 py-2" disabled={isLocked} {...form.register('period')}>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Rumah Sakit
            <select className="mt-1 w-full rounded border px-2 py-2" disabled={isLocked} {...form.register('hospitalId')}>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Jenis Entitas
            <select className="mt-1 w-full rounded border px-2 py-2" disabled={isLocked} {...form.register('entityType')}>
              <option value="PNBP">PNBP</option>
              <option value="BLU">BLU</option>
            </select>
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {numberFields.map((field) => (
            <label key={field} className="text-sm capitalize">
              {field.replace(/[A-Z]/g, (char) => ` ${char.toLowerCase()}`)}
              <input
                className="mt-1 w-full rounded border px-2 py-2"
                disabled={isLocked || (field === 'saldoAwal' && form.watch('entityType') !== 'BLU')}
                {...form.register(field)}
                placeholder="Kosongkan bila null"
              />
              {form.formState.errors[field] ? <span className="text-xs text-rose-600">{form.formState.errors[field]?.message as string}</span> : null}
            </label>
          ))}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className="rounded border px-3 py-2 text-sm" onClick={() => form.setValue('status', 'draft')}>
            Simpan Draft
          </button>
          <button type="button" className="rounded border px-3 py-2 text-sm" onClick={() => form.setValue('status', 'final')}>
            Tandai Final
          </button>
          <button type="submit" className="rounded bg-primary px-3 py-2 text-sm font-semibold text-white" disabled={isLocked}>
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
