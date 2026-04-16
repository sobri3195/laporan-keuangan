import { mapReportToPreview } from '../../features/report-export/previewMapper';
import { HospitalOption, PeriodOption, ReportRecord } from '../../features/report-export/types';
import { EmptyState } from './EmptyState';
import { PreviewGrid } from './PreviewGrid';
import { PreviewSheetTabs } from './PreviewSheetTabs';
import { PreviewTitleBlock } from './PreviewTitleBlock';

export function SpreadsheetPreview({
  report,
  hospitals,
  periods
}: {
  report: ReportRecord | null;
  hospitals: HospitalOption[];
  periods: PeriodOption[];
}) {
  if (!report) {
    return <EmptyState message="Pilih data laporan untuk menampilkan preview worksheet XLS." />;
  }

  const mapped = mapReportToPreview(report, hospitals, periods);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2">
        <PreviewSheetTabs sheetName={mapped.sheetName} />
      </div>
      <PreviewTitleBlock titles={mapped.titleRows} />
      <div className="h-3" />
      <PreviewGrid headers={mapped.headers} rows={mapped.rows} />
    </section>
  );
}
