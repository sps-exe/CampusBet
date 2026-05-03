import useAuthStore from '../store/authStore';

/**
 * useAuth — convenient hook to access auth state + actions
 * Always use this instead of accessing the store directly.
 */
const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const logout = useAuthStore((s) => s.logout);
  const loadUser = useAuthStore((s) => s.loadUser);
  const updateUser = useAuthStore((s) => s.updateUser);
  const deductCredits = useAuthStore((s) => s.deductCredits);
  const addCredits = useAuthStore((s) => s.addCredits);

  const isHost = user?.role === 'host' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isHost,
    isAdmin,
    login,
    signup,
    logout,
    loadUser,
    updateUser,
    deductCredits,
    addCredits,
  };
};

export default useAuth;
