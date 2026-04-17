import { formatCurrency, formatRatio } from '../../lib/formatters';
import { PreviewData } from './types';

export function SpreadsheetPreview({ data, zoom, onZoomChange, onRefresh }: {
  data: PreviewData | null;
  zoom: 'small' | 'normal';
  onZoomChange: (zoom: 'small' | 'normal') => void;
  onRefresh: () => void;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-900">Preview XLS (Spreadsheet)</h3>
        <div className="flex gap-2">
          <button type="button" onClick={onRefresh} className="rounded-lg border border-slate-300 px-3 py-1 text-sm">Refresh Preview</button>
          <select className="rounded-lg border border-slate-300 px-2 py-1 text-sm" value={zoom} onChange={(e) => onZoomChange(e.target.value as 'small' | 'normal')}>
            <option value="small">Zoom Kecil</option>
            <option value="normal">Zoom Normal</option>
          </select>
        </div>
      </div>

      {!data ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
          Belum ada laporan untuk periode ini. Silakan isi data terlebih dahulu.
        </div>
      ) : (
        <div className={`overflow-auto rounded-lg border border-slate-300 ${zoom === 'small' ? 'text-xs' : 'text-sm'}`}>
          <table className="min-w-full border-collapse">
            <tbody>
              <Row label="Sheet" value={data.sheetName} header />
              <Row label="Instansi" value={data.institution} />
              <Row label="Judul Monitoring" value={data.title} />
              <Row label="Periode" value={data.periodLabel} />
              <Row label="RS" value={data.hospitalName} />
              <Row label="Entitas" value={data.entityType} />
              <Row label="Pendapatan" value={formatCurrency(data.values.pendapatan ?? null)} />
              <Row label="Pengeluaran" value={formatCurrency(data.values.pengeluaran ?? null)} />
              {data.entityType === 'BLU' && <Row label="Saldo Awal" value={formatCurrency(data.values.saldoAwal ?? null)} />}
              <Row label="Piutang" value={formatCurrency(data.values.piutang ?? null)} />
              <Row label="Persediaan" value={formatCurrency(data.values.persediaan ?? null)} />
              <Row label="Hutang" value={formatCurrency(data.values.hutang ?? null)} />
              <Row label="Aset Lancar" value={formatCurrency(data.calculations.asetLancar)} />
              <Row label="Ekuitas" value={formatCurrency(data.calculations.ekuitas)} />
              <Row label="Current Ratio" value={formatRatio(data.calculations.currentRatio)} />
              <Row label="Cash Ratio" value={formatRatio(data.calculations.cashRatio)} />
              <tr>
                <td className="border border-slate-300 bg-slate-50 p-2">Area Template Kosong</td>
                <td className="border border-slate-300 p-8" />
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Row({ label, value, header = false }: { label: string; value: string; header?: boolean }) {
  return (
    <tr>
      <td className={`border border-slate-300 p-2 ${header ? 'bg-slate-200 font-semibold' : 'bg-slate-50 font-medium'}`}>{label}</td>
      <td className="border border-slate-300 p-2">{value}</td>
    </tr>
  );
}
