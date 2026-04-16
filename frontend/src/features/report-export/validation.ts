import { z } from 'zod';

const nullableNumericString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? Number(value) : null))
  .refine((value) => value === null || Number.isFinite(value), { message: 'Harus angka valid' });

export const reportFormSchema = z
  .object({
    period: z.string().min(1, 'Periode wajib dipilih'),
    hospitalId: z.string().min(1, 'Rumah sakit wajib dipilih'),
    entityType: z.enum(['PNBP', 'BLU']),
    status: z.enum(['draft', 'final']),
    saldoAwal: nullableNumericString,
    pendapatan: nullableNumericString,
    pengeluaran: nullableNumericString,
    piutang: nullableNumericString,
    persediaan: nullableNumericString,
    hutang: nullableNumericString
  })
  .superRefine((values, ctx) => {
    if (values.entityType === 'BLU' && values.saldoAwal === null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Saldo awal wajib untuk BLU', path: ['saldoAwal'] });
    }
  });

export type ReportFormValues = z.infer<typeof reportFormSchema>;
