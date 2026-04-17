import { useEffect, useMemo, useState } from 'react';
import { calculateBLU, calculatePNBP } from '../../lib/calculations';
import { hospitals, periods } from '../../mocks/seedData';
import { ReportStatus } from '../../types/domain';
import { useAuthStore } from '../../store/authStore';
import { AutoCalculationPanel } from './AutoCalculationPanel';
import { BLUInputForm } from './BLUInputForm';
import { PNBPInputForm } from './PNBPInputForm';
import { ReportHeaderCard } from './ReportHeaderCard';
import { ReportIdentitySection } from './ReportIdentitySection';
import { ReportStepper } from './ReportStepper';
import { RevisionNotesPanel } from './RevisionNotesPanel';
import { SpreadsheetPreview } from './SpreadsheetPreview';
import { StickyActionFooter } from './StickyActionFooter';
import { SubmitConfirmationDialog } from './SubmitConfirmationDialog';
import { ValidationSummary } from './ValidationSummary';
import { CalculationValues, FinancialValues, PreviewData, RevisionNotes, UserReportRecord, ValidationErrors } from './types';
import { createReport, exportReportXls, getCurrentReport, getReportPreview, getRevisionNotes, submitReport, updateReport } from '../../features/user-report/api';
import { ExportActions } from './ExportActions';

const initialValues: FinancialValues = {};

export default function UserReportPage() {
  const { user } = useAuthStore();
  const activePeriod = periods.find((item) => item.isActive) ?? periods[0];
  const [selectedPeriod, setSelectedPeriod] = useState(activePeriod.id);
  const [selectedEntityType, setSelectedEntityType] = useState<'PNBP' | 'BLU'>('PNBP');
  const [currentReport, setCurrentReport] = useState<UserReportRecord | null>(null);
  const [draftValues, setDraftValues] = useState<FinancialValues>(initialValues);
  const [calculatedValues, setCalculatedValues] = useState<CalculationValues>({ asetLancar: null, ekuitas: null, currentRatio: null, cashRatio: null });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [revisionNotes, setRevisionNotes] = useState<RevisionNotes | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [zoom, setZoom] = useState<'small' | 'normal'>('normal');
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const status = currentReport?.status ?? ReportStatus.DRAFT;
  const hospitalId = user?.hospitalId ?? hospitals[0].id;
  const selectedHospital = hospitals.find((item) => item.id === hospitalId);

  useEffect(() => {
    const load = async () => {
      const report = await getCurrentReport(selectedPeriod, selectedEntityType, hospitalId);
      if (report) {
        setCurrentReport(report);
        setDraftValues(report.values);
        if (report.status === ReportStatus.REVISION_REQUESTED) {
          const notes = await getRevisionNotes(report.id);
          setRevisionNotes(notes);
        } else {
          setRevisionNotes(null);
        }
      } else {
        setCurrentReport(null);
        setDraftValues({});
        setPreviewData(null);
        setRevisionNotes(null);
      }
      setIsDirty(false);
    };
    void load();
  }, [selectedPeriod, selectedEntityType, hospitalId]);

  useEffect(() => {
    const detail = {
      saldoAwal: draftValues.saldoAwal ?? null,
      pendapatan: draftValues.pendapatan ?? null,
      pengeluaran: draftValues.pengeluaran ?? null,
      piutang: draftValues.piutang ?? null,
      persediaan: draftValues.persediaan ?? null,
      hutang: draftValues.hutang ?? null
    };

    const result = selectedEntityType === 'BLU' ? calculateBLU(detail) : calculatePNBP(detail);
    setCalculatedValues(result);

    if (hasSufficientPreviewData(draftValues)) {
      const payload: PreviewData = {
        sheetName: selectedEntityType === 'BLU' ? 'BLU_MONITORING' : 'PNBP_MONITORING',
        institution: 'SIMON Keuangan RS TNI AU',
        title: 'Monitoring Laporan Keuangan RS',
        periodLabel: periods.find((item) => item.id === selectedPeriod)?.label ?? selectedPeriod,
        entityType: selectedEntityType,
        hospitalName: selectedHospital?.name ?? '-',
        values: draftValues,
        calculations: result
      };
      void getReportPreview(payload).then((preview) => setPreviewData(preview));
    }
  }, [draftValues, selectedEntityType, selectedPeriod, selectedHospital?.name]);

  const warnings = useMemo(() => {
    const items: string[] = [];
    const pendapatan = draftValues.pendapatan ?? 0;
    const pengeluaran = draftValues.pengeluaran ?? 0;
    if (pengeluaran > pendapatan && pendapatan > 0) items.push('Pengeluaran lebih besar dari pendapatan');
    if ((calculatedValues.ekuitas ?? 0) < 0) items.push('Ekuitas negatif');
    if ((calculatedValues.currentRatio ?? 1) < 1 && calculatedValues.currentRatio !== null) items.push('Current ratio rendah');
    if (!draftValues.hutang || draftValues.hutang === 0) items.push('Hutang kosong atau nol sehingga rasio tidak bisa dihitung');
    return items;
  }, [draftValues.hutang, draftValues.pendapatan, draftValues.pengeluaran, calculatedValues.ekuitas, calculatedValues.currentRatio]);

  const revisionFields = useMemo(() => Object.keys(revisionNotes?.fieldNotes ?? {}), [revisionNotes?.fieldNotes]);
  const readOnly = [ReportStatus.SUBMITTED, ReportStatus.APPROVED, ReportStatus.LOCKED].includes(status);

  const stepIndex = useMemo(() => {
    if (!selectedPeriod || !selectedEntityType) return 0;
    if (!hasAnyInput(draftValues)) return 1;
    if (previewData) return 2;
    return 1;
  }, [selectedPeriod, selectedEntityType, draftValues, previewData]);

  const handleFieldChange = (field: keyof FinancialValues, value: number | undefined) => {
    setDraftValues((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    setIsDirty(true);
  };

  const validateForSubmit = () => {
    const errors: ValidationErrors = {};
    const requiredFields: Array<keyof FinancialValues> = selectedEntityType === 'BLU'
      ? ['saldoAwal', 'pendapatan', 'pengeluaran', 'piutang', 'persediaan', 'hutang']
      : ['pendapatan', 'pengeluaran', 'piutang', 'persediaan', 'hutang'];

    for (const field of requiredFields) {
      const value = draftValues[field];
      const label = toLabel(field);
      if (value === undefined || value === null) {
        errors[field] = `${label} wajib diisi`;
      } else if (Number.isNaN(value)) {
        errors[field] = `${label} harus berupa angka`;
      } else if (value < 0) {
        errors[field] = `${label} tidak boleh bernilai negatif`;
      }
    }

    if (!Number.isFinite(calculatedValues.currentRatio ?? 0) && calculatedValues.currentRatio !== null) {
      errors.hutang = 'Current ratio tidak valid';
    }
    if (!Number.isFinite(calculatedValues.cashRatio ?? 0) && calculatedValues.cashRatio !== null) {
      errors.hutang = 'Cash ratio tidak valid';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      document.querySelector<HTMLInputElement>('input')?.focus();
      return false;
    }

    return true;
  };

  const saveDraft = async () => {
    setIsSaving(true);
    const payload = buildPayload({ status: ReportStatus.DRAFT, currentReport, selectedPeriod, selectedEntityType, hospitalId, draftValues });
    const saved = currentReport ? await updateReport(payload) : await createReport(payload);
    setCurrentReport(saved);
    setIsDirty(false);
    setIsSaving(false);
  };

  const submitFinal = async () => {
    const isValid = validateForSubmit();
    if (!isValid) return;
    setShowSubmitDialog(false);
    setIsSubmitting(true);
    const payload = buildPayload({ status: ReportStatus.SUBMITTED, currentReport, selectedPeriod, selectedEntityType, hospitalId, draftValues });
    const saved = currentReport ? await submitReport(payload) : await submitReport(await createReport(payload));
    setCurrentReport(saved);
    setIsDirty(false);
    setIsSubmitting(false);
    alert('Submit berhasil. Laporan sudah dikirim dan menunggu review.');
  };

  const refreshPreview = () => {
    if (!previewData) return;
    void getReportPreview(previewData).then((preview) => setPreviewData(preview));
  };

  const exportPreview = async () => {
    setIsExporting(true);
    const filename = `MONITORING_RS_${(selectedHospital?.name ?? 'RS').replace(/\s+/g, '_')}_${selectedPeriod}_${Date.now()}.xlsx`;
    await exportReportXls(filename);
    setIsExporting(false);
    alert(`File export siap: ${filename}`);
  };

  const resetForm = () => {
    setDraftValues(currentReport?.values ?? {});
    setValidationErrors({});
    setIsDirty(false);
  };

  return (
    <div className="space-y-4 pb-24">
      <ReportHeaderCard activePeriod={activePeriod} user={user} status={status} />
      <ReportStepper currentStep={stepIndex} />
      <RevisionNotesPanel notes={revisionNotes} />

      <ReportIdentitySection
        periods={periods}
        hospitals={hospitals.filter((item) => item.active)}
        selectedPeriod={selectedPeriod}
        hospitalId={hospitalId}
        selectedEntityType={selectedEntityType}
        status={status}
        lastInputAt={currentReport?.lastInputAt ?? null}
        isAdminRs={user?.role === 'ADMIN_RS'}
        onChange={(patch) => {
          if (patch.periodId) setSelectedPeriod(patch.periodId);
          if (patch.entityType) setSelectedEntityType(patch.entityType);
        }}
      />

      <ValidationSummary errors={validationErrors} />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          {selectedEntityType === 'PNBP' ? (
            <PNBPInputForm values={draftValues} errors={validationErrors} disabled={readOnly} highlighted={revisionFields} onChange={handleFieldChange} />
          ) : (
            <BLUInputForm values={draftValues} errors={validationErrors} disabled={readOnly} highlighted={revisionFields} onChange={handleFieldChange} />
          )}
          <SpreadsheetPreview data={previewData} zoom={zoom} onZoomChange={setZoom} onRefresh={refreshPreview} />
        </div>
        <div className="space-y-4">
          <AutoCalculationPanel entityType={selectedEntityType} values={calculatedValues} warnings={warnings} />
          <ExportActions onExportPreview={exportPreview} onExportTemplate={exportPreview} loading={isExporting} />
          {status === ReportStatus.SUBMITTED && <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">Laporan sudah dikirim dan menunggu review.</p>}
          {isDirty && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">Perubahan belum disimpan.</p>}
        </div>
      </div>

      <StickyActionFooter
        onSaveDraft={saveDraft}
        onSubmitFinal={() => setShowSubmitDialog(true)}
        onRefresh={refreshPreview}
        onReset={resetForm}
        onExportPreview={exportPreview}
        onExportTemplate={exportPreview}
        disableSubmit={readOnly || isSubmitting}
        loading={isSaving || isSubmitting || isExporting}
      />

      <SubmitConfirmationDialog open={showSubmitDialog} onCancel={() => setShowSubmitDialog(false)} onConfirm={submitFinal} />
    </div>
  );
}

function hasAnyInput(values: FinancialValues) {
  return Object.values(values).some((value) => value !== undefined && value !== null && value !== 0);
}

function hasSufficientPreviewData(values: FinancialValues) {
  return values.pendapatan !== undefined || values.pengeluaran !== undefined || values.piutang !== undefined;
}

function toLabel(field: keyof FinancialValues) {
  const map: Record<keyof FinancialValues, string> = {
    saldoAwal: 'Saldo awal',
    pendapatan: 'Pendapatan',
    pengeluaran: 'Pengeluaran',
    piutang: 'Piutang',
    persediaan: 'Persediaan',
    hutang: 'Hutang'
  };
  return map[field];
}

function buildPayload({ status, currentReport, selectedPeriod, selectedEntityType, hospitalId, draftValues }: {
  status: ReportStatus;
  currentReport: UserReportRecord | null;
  selectedPeriod: string;
  selectedEntityType: 'PNBP' | 'BLU';
  hospitalId: string;
  draftValues: FinancialValues;
}): UserReportRecord {
  return {
    id: currentReport?.id ?? `report-${selectedPeriod}-${selectedEntityType}-${hospitalId}`,
    periodId: selectedPeriod,
    hospitalId,
    entityType: selectedEntityType,
    status,
    lastInputAt: new Date().toISOString(),
    values: draftValues
  };
}
