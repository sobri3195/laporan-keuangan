import { useMemo, useState } from 'react';
import { periods } from '../../../mocks/seedData';
import { buildMockExportRows } from './helpers';
import { exportMonitoringWorkbook } from './exportMonitoringWorkbook';

type MonitoringExcelExportButtonsProps = {
  className?: string;
};

export function MonitoringExcelExportButtons({ className }: MonitoringExcelExportButtonsProps) {
  const defaultPeriodId = periods.find((period) => period.isActive)?.id ?? periods[0]?.id;
  const [selectedPeriodId, setSelectedPeriodId] = useState(defaultPeriodId);

  const payload = useMemo(() => buildMockExportRows(selectedPeriodId), [selectedPeriodId]);

  const handleExport = async () => {
    await exportMonitoringWorkbook(payload);
  };

  return (
    <div className={className}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="period-export-select">
          Periode:
        </label>
        <select
          id="period-export-select"
          className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          value={selectedPeriodId}
          onChange={(event) => setSelectedPeriodId(event.target.value)}
        >
          {periods.map((period) => (
            <option key={period.id} value={period.id}>
              {period.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleExport}
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:brightness-95"
        >
          Export Excel
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="rounded-md border border-primary px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5"
        >
          Export Template Format
        </button>
      </div>
    </div>
  );
}
