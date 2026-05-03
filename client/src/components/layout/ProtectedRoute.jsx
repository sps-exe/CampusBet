/**
 * CampusArena — ProtectedRoute
 * Redirects unauthenticated users to /login.
 * Optionally checks for required role (e.g. host-only routes).
 *
 * @prop {React.ReactNode} children
 * @prop {'player'|'host'|'admin'} requiredRole - If set, user must have this role (or admin)
 */

import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Not logged in → redirect to /login, preserve intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check (admin always passes)
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
