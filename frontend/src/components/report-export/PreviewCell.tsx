import clsx from 'clsx';
import { PreviewCell as PreviewCellType } from '../../features/report-export/previewTypes';

type Props = {
  cell: PreviewCellType;
  scale: number;
};

export function PreviewCell({ cell, scale }: Props) {
  return (
    <td
      colSpan={cell.colSpan}
      rowSpan={cell.rowSpan}
      className={clsx('px-2 py-1 text-[11px] leading-snug text-slate-800', {
        'border border-slate-300': cell.bordered,
        'font-semibold': cell.bold,
        italic: cell.italic,
        'text-left': cell.align === 'left' || !cell.align,
        'text-center': cell.align === 'center',
        'text-right': cell.align === 'right',
        'whitespace-normal': cell.isHeader,
        'whitespace-nowrap': !cell.isHeader
      })}
      style={{
        backgroundColor: cell.fill,
        minWidth: `${Math.round(95 * scale)}px`
      }}
    >
      {cell.displayValue}
    </td>
  );
}
