import { PREVIEW_TITLE_LINES } from '../../features/report-export/selectors';
import { PreviewSheet } from '../../features/report-export/previewTypes';

type Props = {
  sheet: PreviewSheet;
};

export function PreviewTitleBlock({ sheet }: Props) {
  return (
    <div className="space-y-0.5 border border-slate-300 bg-emerald-100 px-3 py-2 text-center text-xs text-slate-800">
      <p className="font-bold">{PREVIEW_TITLE_LINES.institution}</p>
      <p className="font-bold">{PREVIEW_TITLE_LINES.directorate}</p>
      <p className="font-bold">{PREVIEW_TITLE_LINES.monitoring}</p>
      <p className="pt-1 font-semibold">Periode: {sheet.periodLabel}</p>
      <p className="font-semibold">Jenis Laporan: {sheet.type}</p>
    </div>
  );
}
