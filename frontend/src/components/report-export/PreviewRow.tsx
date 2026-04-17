import { PreviewRow as PreviewRowType } from '../../features/report-export/previewTypes';
import { PreviewCell } from './PreviewCell';

type Props = {
  row: PreviewRowType;
  scale: number;
};

export function PreviewRow({ row, scale }: Props) {
  return (
    <tr style={{ height: row.height ? `${row.height}px` : undefined }}>
      {row.cells.map((cell) => (
        <PreviewCell key={cell.key} cell={cell} scale={scale} />
      ))}
    </tr>
  );
}
