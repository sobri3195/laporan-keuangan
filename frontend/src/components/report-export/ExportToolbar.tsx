import { exportMonitoringWorkbook } from '../../features/report-export/exportExcel';
import { ReportRecord } from '../../features/report-export/types';

type Props = {
  rows: ReportRecord[];
  selected: ReportRecord | null;
  period: string;
};

export function ExportToolbar({ rows, selected, period }: Props) {
  return (
    <div className="sticky top-16 z-10 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <button className="rounded bg-primary px-3 py-2 text-sm font-semibold text-white" onClick={() => void exportMonitoringWorkbook(rows, period, 'filtered')}>
        Export XLS
      </button>
      <button className="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white" onClick={() => void exportMonitoringWorkbook(rows, period, 'template')}>
        Export Template Format
      </button>
      <button
        className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-emerald-300"
        disabled={!selected}
        onClick={() => selected && void exportMonitoringWorkbook([selected], selected.period, 'filtered')}
      >
        Export Current Preview
      </button>
      <button className="rounded border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700" onClick={() => void exportMonitoringWorkbook(rows, period, 'filtered')}>
        Export All Data
      </button>
    </div>
  );
}
