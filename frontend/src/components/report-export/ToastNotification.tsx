type Toast = { id: number; message: string; tone: 'success' | 'danger' };

export function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div className={`fixed bottom-4 right-4 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${toast.tone === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
      <div className="flex items-center gap-3">
        <span>{toast.message}</span>
        <button className="text-xs underline" onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
}
