import { z } from 'zod';

const numberField = z
  .union([z.number(), z.nan()])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined;
    if (Number.isNaN(value)) return undefined;
    return value;
  });

export const reportBaseSchema = z.object({
  periodId: z.string().min(1, 'Periode wajib dipilih.'),
  hospitalId: z.string().min(1, 'Rumah sakit wajib dipilih.'),
  pendapatan: numberField,
  pengeluaran: numberField,
  piutang: numberField,
  persediaan: numberField,
  hutang: numberField,
  attachment: z.any().optional()
});

const pnbpSchemaBase = reportBaseSchema.extend({
  pendapatan: z.number({ required_error: 'Pendapatan wajib diisi.' }).min(0, 'Pendapatan tidak boleh negatif.'),
  pengeluaran: z.number({ required_error: 'Pengeluaran wajib diisi.' }).min(0, 'Pengeluaran tidak boleh negatif.'),
  piutang: z.number({ required_error: 'Piutang wajib diisi.' }).min(0, 'Piutang tidak boleh negatif.'),
  persediaan: z.number({ required_error: 'Persediaan wajib diisi.' }).min(0, 'Persediaan tidak boleh negatif.'),
  hutang: z.number({ required_error: 'Hutang wajib diisi.' }).min(0, 'Hutang tidak boleh negatif.')
});

export const pnbpSchema = pnbpSchemaBase.superRefine((value, ctx) => {
  if (value.pengeluaran > value.pendapatan * 5) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['pengeluaran'],
      message: 'Pengeluaran sangat ekstrem dibanding pendapatan. Mohon verifikasi.'
    });
  }
});

export const bluSchema = pnbpSchemaBase
  .extend({
    saldoAwal: z.number({ required_error: 'Saldo awal wajib diisi.' }).min(0, 'Saldo awal tidak boleh negatif.')
  })
  .superRefine((value, ctx) => {
    if (value.pengeluaran > value.pendapatan * 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pengeluaran'],
        message: 'Pengeluaran sangat ekstrem dibanding pendapatan. Mohon verifikasi.'
      });
    }
  });

export type ReportPNBPInput = z.infer<typeof pnbpSchema>;
export type ReportBLUInput = z.infer<typeof bluSchema>;
