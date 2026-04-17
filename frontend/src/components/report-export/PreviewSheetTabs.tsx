import clsx from 'clsx';
import { PreviewSheet } from '../../features/report-export/previewTypes';

type Props = {
  sheets: PreviewSheet[];
  activeType: 'PNBP' | 'BLU';
  onChange: (type: 'PNBP' | 'BLU') => void;
};

export function PreviewSheetTabs({ sheets, activeType, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-1 border-b border-slate-300 pb-1">
      {sheets.map((sheet) => (
        <button
          key={sheet.type}
          type="button"
          onClick={() => onChange(sheet.type)}
          className={clsx('rounded-t-md border px-3 py-1 text-xs font-semibold transition', {
            'border-slate-300 border-b-white bg-white text-slate-800': activeType === sheet.type,
            'border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-200': activeType !== sheet.type
          })}
        >
          {sheet.name}
        </button>
      ))}
    </div>
  );
}
