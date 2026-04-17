import { PreviewZoom } from '../../features/report-export/previewTypes';

type Props = {
  zoom: PreviewZoom;
  onZoomChange: (zoom: PreviewZoom) => void;
  onRefresh: () => void;
  onExportCurrent: () => void;
  onExportAll: () => void;
};

const zoomLevels: PreviewZoom[] = [90, 100, 125];

export function PreviewToolbar({ zoom, onZoomChange, onRefresh, onExportCurrent, onExportAll }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 p-2">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={onRefresh}>
          Refresh Preview
        </button>
        <button type="button" className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={onExportCurrent}>
          Export Current Preview
        </button>
        <button type="button" className="rounded border border-slate-300 bg-white px-2 py-1 text-xs" onClick={onExportAll}>
          Export All Data
        </button>
      </div>
      <div className="flex items-center gap-1">
        {zoomLevels.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onZoomChange(level)}
            className={`rounded px-2 py-1 text-xs ${zoom === level ? 'bg-slate-800 text-white' : 'border border-slate-300 bg-white text-slate-700'}`}
          >
            Zoom {level}%
          </button>
        ))}
      </div>
    </div>
  );
}
