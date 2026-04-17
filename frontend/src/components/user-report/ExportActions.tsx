export function ExportActions({ onExportPreview, onExportTemplate, loading }: {
  onExportPreview: () => void;
  onExportTemplate: () => void;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={onExportPreview} disabled={loading} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Export Preview XLS</button>
      <button type="button" onClick={onExportTemplate} disabled={loading} className="rounded-lg border border-emerald-600 px-3 py-2 text-sm font-semibold text-emerald-700">Export Template Format</button>
    </div>
  );
}
