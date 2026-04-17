import { useMemo, useState } from 'react';
import { mapPreviewSheets } from '../../features/report-export/previewMapper';
import { PreviewSheetType, PreviewZoom } from '../../features/report-export/previewTypes';
import { getPeriodLabel } from '../../features/report-export/selectors';
import { HospitalOption, PeriodOption, ReportRecord } from '../../features/report-export/types';
import { PreviewEmptyState } from './PreviewEmptyState';
import { PreviewGrid } from './PreviewGrid';
import { PreviewSheetTabs } from './PreviewSheetTabs';
import { PreviewTitleBlock } from './PreviewTitleBlock';
import { PreviewToolbar } from './PreviewToolbar';

type Props = {
  activeReport: ReportRecord | null;
  reports: ReportRecord[];
  hospitals: HospitalOption[];
  periods: PeriodOption[];
  loading?: boolean;
  error?: string | null;
  onRefresh: () => void;
  onExportCurrent: (entityType: PreviewSheetType) => void;
  onExportAll: () => void;
};

export function SpreadsheetPreview({
  activeReport,
  reports,
  hospitals,
  periods,
  loading,
  error,
  onRefresh,
  onExportCurrent,
  onExportAll
}: Props) {
  const [zoom, setZoom] = useState<PreviewZoom>(100);
  const [activeType, setActiveType] = useState<PreviewSheetType>(activeReport?.entityType ?? 'PNBP');

  const pnbpRecord = useMemo(
    () => (activeReport?.entityType === 'PNBP' ? activeReport : reports.find((row) => row.entityType === 'PNBP') ?? null),
    [activeReport, reports]
  );
  const bluRecord = useMemo(
    () => (activeReport?.entityType === 'BLU' ? activeReport : reports.find((row) => row.entityType === 'BLU') ?? null),
    [activeReport, reports]
  );

  const periodLabel = getPeriodLabel(activeReport?.period ?? reports[0]?.period, periods);
  const sheetsMap = mapPreviewSheets({
    pnbpRecord,
    bluRecord,
    hospitals,
    context: { periodLabel }
  });

  const sheets = [sheetsMap.PNBP, sheetsMap.BLU];
  const activeSheet = sheetsMap[activeType];

  const hasAnyData = Boolean(pnbpRecord || bluRecord);

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <PreviewToolbar
        zoom={zoom}
        onZoomChange={setZoom}
        onRefresh={onRefresh}
        onExportCurrent={() => onExportCurrent(activeType)}
        onExportAll={onExportAll}
      />

      <PreviewSheetTabs sheets={sheets} activeType={activeType} onChange={setActiveType} />

      <PreviewTitleBlock sheet={activeSheet} />

      {loading ? <p className="text-xs text-slate-500">Preview sedang memuat data...</p> : null}
      {error ? <p className="text-xs text-rose-600">Gagal memuat preview: {error}</p> : null}

      {!hasAnyData ? <PreviewEmptyState /> : null}

      <PreviewGrid rows={activeSheet.rows} zoom={zoom} />
    </section>
  );
}
