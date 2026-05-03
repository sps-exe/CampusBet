/**
 * CampusBet — App Router (unified)
 * Merges Dev1 (auth/landing/UI) + Dev2 (lobbies/tournaments/dashboard/wallet)
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Dev1 pages
import Landing  from './pages/Landing';
import Login    from './pages/Login';
import Signup   from './pages/Signup';
import NotFound from './pages/NotFound';

// Dev2 pages
import Dashboard        from './pages/Dashboard';
import BrowseLobbies    from './pages/BrowseLobbies';
import LobbyDetail      from './pages/LobbyDetail';
import CreateLobby      from './pages/CreateLobby';
import BrowseTournaments from './pages/BrowseTournaments';
import TournamentDetail from './pages/TournamentDetail';
import Leaderboard      from './pages/Leaderboard';
import Profile          from './pages/Profile';
import Wallet           from './pages/Wallet';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#13131a',
            color: '#f4f4f5',
            border: '1px solid #1e1e2e',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#13131a' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#13131a' } },
        }}
      />

      <Routes>
        {/* ── Public ── */}
        <Route path="/"       element={<Landing />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ── Authenticated (any user) ── */}
        <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/lobbies"        element={<ProtectedRoute><BrowseLobbies /></ProtectedRoute>} />
        <Route path="/lobbies/create" element={<ProtectedRoute><CreateLobby /></ProtectedRoute>} />
        <Route path="/lobbies/:id"    element={<ProtectedRoute><LobbyDetail /></ProtectedRoute>} />
        <Route path="/tournaments"    element={<ProtectedRoute><BrowseTournaments /></ProtectedRoute>} />
        <Route path="/tournaments/:id" element={<ProtectedRoute><TournamentDetail /></ProtectedRoute>} />
        <Route path="/leaderboard"    element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/wallet"         element={<ProtectedRoute><Wallet /></ProtectedRoute>} />

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
