import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '../api/authApi';
import toast from 'react-hot-toast';
import { CURRENT_USER } from '../utils/mockData';

const USE_MOCK = true;

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          if (USE_MOCK) {
            await new Promise((r) => setTimeout(r, 700));
            if (!email.includes('@') || password.length < 6) throw new Error('Invalid credentials');
            const mockUser = { ...CURRENT_USER, email, name: email.split('@')[0], college: 'Demo University' };
            set({ user: mockUser, token: 'mock-jwt', isAuthenticated: true });
            toast.success(`Welcome back, ${mockUser.name}! ⚡`);
            return { success: true };
          }
          const { data } = await authApi.login({ email, password });
          localStorage.setItem('cb_token', data.token);
          set({ user: data.user, token: data.token, isAuthenticated: true });
          toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! ⚡`);
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || err.message || 'Login failed';
          toast.error(msg);
          return { success: false, message: msg };
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (formData) => {
        set({ isLoading: true });
        try {
          if (USE_MOCK) {
            await new Promise((r) => setTimeout(r, 900));
            const mockUser = {
              ...CURRENT_USER,
              _id: `u_${Date.now()}`,
              name: formData.name,
              email: formData.email,
              college: formData.college,
              credits: 500,
            };
            set({ user: mockUser, token: 'mock-jwt', isAuthenticated: true });
            toast.success('Account created! You got 500 ⚡ starter credits.');
            return { success: true };
          }
          const { data } = await authApi.signup(formData);
          localStorage.setItem('cb_token', data.token);
          set({ user: data.user, token: data.token, isAuthenticated: true });
          toast.success('Account created! You got 500 ⚡ starter credits.');
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || err.message || 'Signup failed';
          toast.error(msg);
          return { success: false, message: msg };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        if (!USE_MOCK) {
          try { await authApi.logout(); } catch { /* ignore */ }
          localStorage.removeItem('cb_token');
        }
        set({ user: null, token: null, isAuthenticated: false });
        toast.success('Logged out successfully.');
      },

      loadUser: async () => {
        if (USE_MOCK) return;
        const token = localStorage.getItem('cb_token');
        if (!token) return;
        set({ isLoading: true });
        try {
          const { data } = await authApi.getMe();
          set({ user: data, isAuthenticated: true });
        } catch {
          localStorage.removeItem('cb_token');
          set({ user: null, token: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      deductCredits: (amount) =>
        set((state) => ({
          user: { ...state.user, credits: (state.user?.credits || 0) - amount },
        })),

      addCredits: (amount) =>
        set((state) => ({
          user: { ...state.user, credits: (state.user?.credits || 0) + amount },
        })),
    }),
    {
      name: 'campusbet-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
