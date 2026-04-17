import { Hospital, Period, ReportStatus } from '../../types/domain';

export function ReportIdentitySection({
  periods,
  hospitals,
  selectedPeriod,
  hospitalId,
  selectedEntityType,
  status,
  lastInputAt,
  isAdminRs,
  onChange
}: {
  periods: Period[];
  hospitals: Hospital[];
  selectedPeriod: string;
  hospitalId: string;
  selectedEntityType: 'PNBP' | 'BLU';
  status: ReportStatus;
  lastInputAt: string | null;
  isAdminRs: boolean;
  onChange: (patch: { periodId?: string; hospitalId?: string; entityType?: 'PNBP' | 'BLU' }) => void;
}) {
  return (
    <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-5">
      <Field label="Periode">
        <select className="w-full rounded-lg border border-slate-300 p-2" value={selectedPeriod} onChange={(e) => onChange({ periodId: e.target.value })}>
          {periods.map((period) => <option key={period.id} value={period.id}>{period.label}</option>)}
        </select>
      </Field>
      <Field label="Rumah Sakit">
        <select className="w-full rounded-lg border border-slate-300 p-2" value={hospitalId} disabled={isAdminRs} onChange={(e) => onChange({ hospitalId: e.target.value })}>
          {hospitals.map((hospital) => <option key={hospital.id} value={hospital.id}>{hospital.name}</option>)}
        </select>
      </Field>
      <Field label="Jenis Entitas">
        <select className="w-full rounded-lg border border-slate-300 p-2" value={selectedEntityType} onChange={(e) => onChange({ entityType: e.target.value as 'PNBP' | 'BLU' })}>
          <option value="PNBP">PNBP</option>
          <option value="BLU">BLU</option>
        </select>
      </Field>
      <Field label="Status Laporan">
        <p className="rounded-lg border border-slate-300 bg-slate-50 p-2 text-sm">{status}</p>
      </Field>
      <Field label="Tanggal Input Terakhir">
        <p className="rounded-lg border border-slate-300 bg-slate-50 p-2 text-sm">{lastInputAt ? new Date(lastInputAt).toLocaleString('id-ID') : '-'}</p>
      </Field>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
