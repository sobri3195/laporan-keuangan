import { reports } from '../../mocks/seedData';

export const reportApi = {
  list: async () => reports,
  getById: async (id: string) => reports.find((r) => r.id === id),
  submit: async (id: string) => ({ id, status: 'SUBMITTED' }),
  approve: async (id: string) => ({ id, status: 'APPROVED' }),
  requestRevision: async (id: string, note: string) => ({ id, status: 'REVISION_REQUESTED', note })
};
