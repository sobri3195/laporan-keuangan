import { hospitals, periods, users } from '../../mocks/seedData';

export const masterApi = {
  getHospitals: async () => hospitals,
  getUsers: async () => users,
  getPeriods: async () => periods
};
