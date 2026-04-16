import { useEffect } from 'react';
import { create } from 'zustand';
import { reportExportApi } from './api';
import { ReportFilters, ReportInput, ReportRecord } from './types';

type ToastState = { id: number; message: string; tone: 'success' | 'danger' } | null;

type StoreState = {
  loading: boolean;
  error: string | null;
  reports: ReportRecord[];
  selectedReportId: string | null;
  filters: ReportFilters;
  toast: ToastState;
  setFilters: (next: Partial<ReportFilters>) => void;
  setSelectedReportId: (id: string | null) => void;
  dismissToast: () => void;
  loadReports: () => Promise<void>;
  saveReport: (payload: ReportInput, editingId?: string) => Promise<ReportRecord>;
  removeReport: (id: string) => Promise<void>;
};

const initialFilters: ReportFilters = { search: '', period: '', entityType: 'ALL', hospitalId: '' };

export const useReportExportStore = create<StoreState>((set, get) => ({
  loading: false,
  error: null,
  reports: [],
  selectedReportId: null,
  filters: initialFilters,
  toast: null,
  setFilters: (next) => set((state) => ({ filters: { ...state.filters, ...next } })),
  setSelectedReportId: (id) => set({ selectedReportId: id }),
  dismissToast: () => set({ toast: null }),
  loadReports: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await reportExportApi.getReports(get().filters);
      set({ reports: data, loading: false });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
    }
  },
  saveReport: async (payload, editingId) => {
    set({ loading: true, error: null });
    try {
      const response = editingId ? await reportExportApi.updateReport(editingId, payload) : await reportExportApi.createReport(payload);
      await get().loadReports();
      set({
        selectedReportId: response.data.id,
        toast: { id: Date.now(), message: response.message ?? 'Data tersimpan', tone: 'success' }
      });
      return response.data;
    } catch (error) {
      const message = (error as Error).message;
      set({ loading: false, error: message, toast: { id: Date.now(), message, tone: 'danger' } });
      throw error;
    }
  },
  removeReport: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await reportExportApi.deleteReport(id);
      await get().loadReports();
      set({ toast: { id: Date.now(), message: response.message ?? 'Data dihapus', tone: 'success' } });
    } catch (error) {
      const message = (error as Error).message;
      set({ loading: false, error: message, toast: { id: Date.now(), message, tone: 'danger' } });
      throw error;
    }
  }
}));

export const useBootstrapReportExport = () => {
  const loadReports = useReportExportStore((state) => state.loadReports);
  useEffect(() => {
    void loadReports();
  }, [loadReports]);
};
