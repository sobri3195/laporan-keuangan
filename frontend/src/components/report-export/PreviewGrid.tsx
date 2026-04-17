import { PreviewRow as PreviewRowType } from '../../features/report-export/previewTypes';
import { PreviewRow } from './PreviewRow';

type Props = {
  rows: PreviewRowType[];
  zoom: 90 | 100 | 125;
};

export function PreviewGrid({ rows, zoom }: Props) {
  const scale = zoom / 100;

  return (
    <div className="overflow-x-auto border border-slate-300 bg-white">
      <table className="w-full min-w-max border-collapse font-[Arial,_ui-sans-serif] text-xs">
        <tbody>
          {rows.map((row) => (
            <PreviewRow key={row.key} row={row} scale={scale} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
