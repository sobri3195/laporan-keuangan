import { RevisionNotes } from './types';

export function RevisionNotesPanel({ notes }: { notes: RevisionNotes | null }) {
  if (!notes) return null;

  return (
    <section className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
      <h3 className="font-semibold text-red-700">Catatan Revisi dari Admin</h3>
      <p className="text-sm text-red-700">Tanggal revisi: {new Date(notes.revisedAt).toLocaleString('id-ID')}</p>
      <p className="rounded-lg bg-white/70 p-2 text-sm text-red-700">{notes.generalNote}</p>
      {Object.keys(notes.fieldNotes).length > 0 && (
        <ul className="list-disc pl-5 text-sm text-red-700">
          {Object.entries(notes.fieldNotes).map(([field, note]) => <li key={field}><strong>{field}</strong>: {note}</li>)}
        </ul>
      )}
    </section>
  );
}
