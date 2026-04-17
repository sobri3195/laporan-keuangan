import { ReportEntityType, ReportRecord } from './types';

export type PreviewSheetType = ReportEntityType;

export type PreviewCell = {
  key: string;
  value: string | number | null;
  displayValue: string;
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
  italic?: boolean;
  fill?: string;
  bordered?: boolean;
  colSpan?: number;
  rowSpan?: number;
  isHeader?: boolean;
  isTitle?: boolean;
};

export type PreviewRow = {
  key: string;
  cells: PreviewCell[];
  height?: number;
};

export type PreviewSheet = {
  type: PreviewSheetType;
  name: string;
  title: string;
  subtitle?: string;
  periodLabel: string;
  rows: PreviewRow[];
};

export type PreviewContext = {
  periodLabel: string;
};

export type PreviewSource = {
  activeType?: PreviewSheetType | null;
  recordByType: Partial<Record<PreviewSheetType, ReportRecord | null>>;
};

export type PreviewZoom = 90 | 100 | 125;
