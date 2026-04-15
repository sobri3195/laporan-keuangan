import { create } from 'zustand';
import { User } from '../types/domain';

type AuthState = {
  token: string | null;
  user: User | null;
  setSession: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setSession: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null })
}));
