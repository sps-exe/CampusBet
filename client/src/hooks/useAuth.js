/**
 * CampusArena — useAuth Hook
 * A clean wrapper around the Zustand auth store.
 * Always use this hook instead of accessing the store directly.
 */

import { useAuthStore } from '../store/authStore';

/**
 * @returns {{
 *   user: object | null,
 *   token: string | null,
 *   isAuthenticated: boolean,
 *   isLoading: boolean,
 *   error: string | null,
 *   isHost: boolean,
 *   isAdmin: boolean,
 *   login: Function,
 *   signup: Function,
 *   logout: Function,
 *   clearError: Function,
 *   loadUser: Function,
 * }}
 */
export const useAuth = () => {
  const store = useAuthStore();

  return {
    user:            store.user,
    token:           store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading:       store.isLoading,
    error:           store.error,

    // Derived role helpers
    isHost:  store.user?.role === 'host'  || store.user?.role === 'admin',
    isAdmin: store.user?.role === 'admin',

    // Actions
    login:      store.login,
    signup:     store.signup,
    logout:     store.logout,
    clearError: store.clearError,
    loadUser:   store.loadUser,
  };
};
