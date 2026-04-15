export const formatCurrency = (value: number | null | undefined) =>
  value == null ? '-' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

export const formatRatio = (value: number | null | undefined) => (value == null ? 'N/A' : value.toFixed(2));
