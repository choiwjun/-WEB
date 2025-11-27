import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  language: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  demoLogin: (role: 'admin' | 'user' | 'counselor') => void;
  register: (data: { email: string; password: string; name: string; companyCode?: string }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.login({ email, password });
          api.setTokens(response.accessToken, response.refreshToken);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'ログインに失敗しました',
            isLoading: false,
          });
          throw error;
        }
      },

      // Demo login for testing/demonstration purposes
      demoLogin: (role: 'admin' | 'user' | 'counselor') => {
        const demoUsers: Record<string, User> = {
          admin: {
            id: 'demo-admin-001',
            email: 'admin@shindan.com',
            name: '管理者',
            role: 'SUPER_ADMIN',
            language: 'JA',
          },
          user: {
            id: 'demo-user-001',
            email: 'user@shindan.com',
            name: 'テストユーザー',
            role: 'USER',
            language: 'JA',
          },
          counselor: {
            id: 'demo-counselor-001',
            email: 'counselor@shindan.com',
            name: '田中美咲',
            role: 'COUNSELOR',
            language: 'JA',
          },
        };

        set({
          user: demoUsers[role],
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.register(data);
          api.setTokens(response.accessToken, response.refreshToken);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || '登録に失敗しました',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        api.clearTokens();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      loadUser: async () => {
        api.loadTokens();
        set({ isLoading: true });
        try {
          const user = await api.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          api.clearTokens();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
