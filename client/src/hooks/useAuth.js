// useAuth — thin wrapper around the auth store.
// Components import this instead of the store directly so they get a clean API.
import useAuthStore from '../store/authStore';

const useAuth = () => {
  const user           = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading      = useAuthStore((s) => s.isLoading);
  const login          = useAuthStore((s) => s.login);
  const signup         = useAuthStore((s) => s.signup);
  const logout         = useAuthStore((s) => s.logout);
  const loadUser       = useAuthStore((s) => s.loadUser);
  const updateUser     = useAuthStore((s) => s.updateUser);
  const deductCredits  = useAuthStore((s) => s.deductCredits);
  const addCredits     = useAuthStore((s) => s.addCredits);
  const updateProfile  = useAuthStore((s) => s.updateProfile);

  // Derived flags based on the user's role field in the DB
  const isHost  = user?.role === 'host' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  return {
    user, isAuthenticated, isLoading,
    isHost, isAdmin,
    login, signup, logout, loadUser,
    updateUser, deductCredits, addCredits, updateProfile,
  };
};

export default useAuth;
