import { ExportActions } from './ExportActions';

export function StickyActionFooter({
  onSaveDraft,
  onSubmitFinal,
  onRefresh,
  onReset,
  onExportPreview,
  onExportTemplate,
  disableSubmit,
  loading
}: {
  onSaveDraft: () => void;
  onSubmitFinal: () => void;
  onRefresh: () => void;
  onReset: () => void;
  onExportPreview: () => void;
  onExportTemplate: () => void;
  disableSubmit: boolean;
  loading: boolean;
}) {
  return (
    <div className="sticky bottom-0 z-20 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onSaveDraft} disabled={loading} className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white">Simpan Draft</button>
        <button type="button" onClick={onSubmitFinal} disabled={disableSubmit || loading} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">Submit Final</button>
        <button type="button" onClick={onRefresh} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">Refresh Preview</button>
        <button type="button" onClick={onReset} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">Reset Form</button>
        <div className="ml-auto">
          <ExportActions onExportPreview={onExportPreview} onExportTemplate={onExportTemplate} loading={loading} />
        </div>
      </div>
    </div>
  );
}
