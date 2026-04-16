export function PreviewSheetTabs({ sheetName }: { sheetName: string }) {
  return (
    <div className="inline-flex rounded-t-md border border-b-0 border-slate-300 bg-slate-100 px-4 py-1 text-xs font-semibold text-slate-700">
      {sheetName}
    </div>
  );
}
