/**
 * CampusArena — App Router
 * All routes defined here. Protected routes use <ProtectedRoute>.
 * Dev 2 pages are stubs — replace imports when pages are ready.
 */

import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'react-hot-toast';

// Dev 1 pages
import Landing from './pages/Landing';
import Login   from './pages/Login';
import Signup  from './pages/Signup';
import NotFound from './pages/NotFound';

// Dev 2 page stubs (replace when Dev 2 ships)
import {
  Dashboard,
  BrowseTournaments,
  TournamentDetail,
  CreateTournament,
  HostDashboard,
  Leaderboard,
  Profile,
} from './pages/Placeholders';

// Layout
import ProtectedRoute from './components/layout/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#13131a',
            color: '#f4f4f5',
            border: '1px solid #1e1e2e',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#13131a' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#13131a' },
          },
        }}
      />

      <Routes>
        {/* ── Public Routes ── */}
        <Route path="/"       element={<Landing />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ── Protected Routes (any authenticated user) ── */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/tournaments"
          element={<ProtectedRoute><BrowseTournaments /></ProtectedRoute>}
        />
        <Route
          path="/tournaments/:id"
          element={<ProtectedRoute><TournamentDetail /></ProtectedRoute>}
        />
        <Route
          path="/leaderboard"
          element={<ProtectedRoute><Leaderboard /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />

        {/* ── Host-only Routes ── */}
        <Route
          path="/tournaments/create"
          element={<ProtectedRoute requiredRole="host"><CreateTournament /></ProtectedRoute>}
        />
        <Route
          path="/host"
          element={<ProtectedRoute requiredRole="host"><HostDashboard /></ProtectedRoute>}
        />

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
