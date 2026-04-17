export function SubmitConfirmationDialog({ open, onCancel, onConfirm }: { open: boolean; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
        <h3 className="text-lg font-bold">Konfirmasi Submit Final</h3>
        <p className="mt-2 text-sm text-slate-600">Data final akan dikirim ke admin pusat untuk direview. Pastikan semua nilai sudah benar.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">Batal</button>
          <button type="button" onClick={onConfirm} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">Ya, Submit</button>
        </div>
      </div>
    </div>
  );
}
