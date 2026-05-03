import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { PageLoader } from '../ui/Skeleton';

/**
 * ProtectedRoute — redirects unauthenticated users to /login
 * Passes the attempted URL as state so login can redirect back.
 */
const ProtectedRoute = ({ children, requireHost = false }) => {
  const { isAuthenticated, isLoading, isHost } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireHost && !isHost) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
