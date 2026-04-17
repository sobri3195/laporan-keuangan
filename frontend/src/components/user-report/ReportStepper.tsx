const steps = ['Pilih Periode', 'Isi Data', 'Cek Preview', 'Simpan / Export'];

export function ReportStepper({ currentStep }: { currentStep: number }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-2 md:grid-cols-4">
        {steps.map((step, index) => {
          const active = index <= currentStep;
          return (
            <div key={step} className={`rounded-lg border p-3 text-sm ${active ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500'}`}>
              <p className="text-xs">Langkah {index + 1}</p>
              <p className="font-semibold">{step}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
