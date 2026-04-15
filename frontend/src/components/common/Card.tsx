import { ReactNode } from 'react';

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
      <h3 className="mb-2 text-sm font-semibold text-slate-700">{title}</h3>
      {children}
    </section>
  );
}
