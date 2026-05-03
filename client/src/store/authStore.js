/**
 * CampusArena — Auth Store (Zustand)
 *
 * STUB IMPLEMENTATION — Dev 2 will replace login/signup/loadUser
 * with real API calls. Do NOT change function signatures.
 *
 * The persist middleware automatically syncs state to localStorage
 * under the key 'campusarena-auth'. No need to touch localStorage directly.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ─── State ───────────────────────────────────────────────────────────────
      /** @type {null | { id: string, name: string, email: string, college: string, role: 'player'|'host'|'admin', stats: object, badges: string[], avatarUrl: string|null }} */
      user: null,
      /** @type {null | string} */
      token: null,
      isAuthenticated: false,
      isLoading: false,
      /** @type {null | string} */
      error: null,

      // ─── Actions ─────────────────────────────────────────────────────────────

      /**
       * Log in with email and password.
       * STUB: Dev 2 replaces body with POST /api/auth/login
       *
       * @param {string} email
       * @param {string} password
       * @returns {Promise<{ success: boolean, error?: string }>}
       */
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // STUB: simulate network latency
          await new Promise((r) => setTimeout(r, 800));

          if (!email || !password) throw new Error('Email and password required');

          // Mock user object — Dev 2 replaces with real API response
          const mockUser = {
            id: 'mock-user-1',
            name: 'Demo Player',
            email,
            college: 'IIT Delhi',
            role: 'player',
            stats: {
              tournamentsPlayed: 12,
              tournamentsWon: 3,
              matchesPlayed: 47,
              matchesWon: 28,
            },
            badges: ['First Win', 'Tournament Finalist'],
            avatarUrl: null,
          };

          set({
            user: mockUser,
            token: 'mock-jwt-' + Date.now(),
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (err) {
          set({ error: err.message, isLoading: false, isAuthenticated: false });
          return { success: false, error: err.message };
        }
      },

      /**
       * Create a new account.
       * STUB: Dev 2 replaces body with POST /api/auth/signup
       *
       * @param {{ name: string, email: string, college: string, password: string, role: string }} data
       * @returns {Promise<{ success: boolean, error?: string }>}
       */
      signup: async (data) => {
        set({ isLoading: true, error: null });
        try {
          // STUB: simulate network latency
          await new Promise((r) => setTimeout(r, 1000));

          const mockUser = {
            id: 'mock-user-' + Date.now(),
            name: data.name,
            email: data.email,
            college: data.college,
            role: data.role || 'player',
            stats: {
              tournamentsPlayed: 0,
              tournamentsWon: 0,
              matchesPlayed: 0,
              matchesWon: 0,
            },
            badges: [],
            avatarUrl: null,
          };

          set({
            user: mockUser,
            token: 'mock-jwt-' + Date.now(),
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (err) {
          set({ error: err.message, isLoading: false });
          return { success: false, error: err.message };
        }
      },

      /**
       * Log out and clear all auth state.
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
      },

      /**
       * Clear the current error message.
       */
      clearError: () => set({ error: null }),

      /**
       * Load the current user from the backend (on app mount).
       * STUB: Dev 2 replaces with GET /api/auth/me using stored token.
       *
       * @returns {Promise<object|null>}
       */
      loadUser: async () => {
        // STUB: just return what's in state (already persisted)
        return get().user;
      },
    }),
    {
      name: 'campusarena-auth',
      // Only persist these fields — never persist isLoading or error
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
