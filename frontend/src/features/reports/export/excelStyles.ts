import type { Alignment, Border, Fill, Font } from 'exceljs';

export const excelFonts = {
  heading: { name: 'Arial', size: 15, bold: true } satisfies Partial<Font>,
  titleBand: { name: 'Arial', size: 15, bold: true } satisfies Partial<Font>,
  header: { name: 'Arial', size: 15, bold: true } satisfies Partial<Font>,
  data: { name: 'Arial', size: 12 } satisfies Partial<Font>
};

export const excelFills = {
  titleBand: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF93C47D' }
  } satisfies Fill,
  headerBand: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFB4A7D6' }
  } satisfies Fill
};

export const thinBorder = {
  style: 'thin',
  color: { argb: 'FF000000' }
} as const;

export const allThinBorder = {
  top: thinBorder,
  left: thinBorder,
  bottom: thinBorder,
  right: thinBorder
} satisfies Partial<Border>;

export const alignments = {
  centered: { horizontal: 'center', vertical: 'middle' } satisfies Partial<Alignment>,
  centeredWrapped: { horizontal: 'center', vertical: 'middle', wrapText: true } satisfies Partial<Alignment>,
  leftMiddle: { horizontal: 'left', vertical: 'middle' } satisfies Partial<Alignment>,
  rightMiddle: { horizontal: 'right', vertical: 'middle' } satisfies Partial<Alignment>
};
