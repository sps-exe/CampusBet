// App.jsx — root component. Sets up routing, navbar, and toast notifications.
// All page components are lazy-loaded so the initial bundle stays small.
// Each page is only downloaded when the user first navigates to it.

import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import useAuthStore from './store/authStore';

import ProtectedRoute from './components/layout/ProtectedRoute';

// Public pages — loaded immediately (small, needed before auth check)
import Landing  from './pages/Landing';
import Login    from './pages/Login';
import Signup   from './pages/Signup';
import NotFound from './pages/NotFound';

// Authenticated pages — lazy-loaded (only downloaded when the user navigates there)
const Dashboard         = lazy(() => import('./pages/Dashboard'));
const BrowseLobbies     = lazy(() => import('./pages/BrowseLobbies'));
const LobbyDetail       = lazy(() => import('./pages/LobbyDetail'));
const CreateLobby       = lazy(() => import('./pages/CreateLobby'));
const BrowseTournaments = lazy(() => import('./pages/BrowseTournaments'));
const CreateTournament  = lazy(() => import('./pages/CreateTournament'));
const TournamentDetail  = lazy(() => import('./pages/TournamentDetail'));
const Leaderboard       = lazy(() => import('./pages/Leaderboard'));
const Profile           = lazy(() => import('./pages/Profile'));
const Wallet            = lazy(() => import('./pages/Wallet'));

// Minimal spinner shown while a lazy page chunk is downloading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
  </div>
);

const App = () => {
  useEffect(() => {
    // Restore session from localStorage on first load
    useAuthStore.getState().loadUser();

    // Keep state in sync when the user logs in/out in another tab
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        useAuthStore.setState({ user: null, session: null, isAuthenticated: false });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        useAuthStore.getState().loadUser();
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  return (
    <BrowserRouter>

      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#321318',
            color: '#f4f4f5',
            border: '1px solid rgba(180,40,40,0.3)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          },
          success: { iconTheme: { primary: '#4CAF50', secondary: '#321318' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#321318' } },
        }}
      />

      {/* Suspense wraps all lazy routes — shows the spinner while the chunk loads */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public — anyone can visit */}
          <Route path="/"       element={<Landing />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected — redirects to /login if not authenticated */}
          <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/lobbies"         element={<ProtectedRoute><BrowseLobbies /></ProtectedRoute>} />
          <Route path="/lobbies/create"  element={<ProtectedRoute><CreateLobby /></ProtectedRoute>} />
          <Route path="/lobbies/:id"     element={<ProtectedRoute><LobbyDetail /></ProtectedRoute>} />
          <Route path="/tournaments"     element={<ProtectedRoute><BrowseTournaments /></ProtectedRoute>} />
          <Route path="/tournaments/create"   element={<ProtectedRoute><CreateTournament /></ProtectedRoute>} />
          <Route path="/tournaments/:id"      element={<ProtectedRoute><TournamentDetail /></ProtectedRoute>} />
          <Route path="/leaderboard"     element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/wallet"          element={<ProtectedRoute><Wallet /></ProtectedRoute>} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
