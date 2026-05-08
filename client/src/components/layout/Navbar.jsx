import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, LayoutDashboard, Gamepad2, Trophy, BarChart2,
  User, LogOut, Menu, X, Plus, Wallet,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { formatCredits } from '../../utils/formatters';
import { Avatar } from '../tournament/ParticipantList';

const navLinks = [
  { to: '/dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/lobbies',     label: 'Lobbies',       icon: Gamepad2 },
  { to: '/tournaments', label: 'Tournaments',   icon: Trophy },
  { to: '/leaderboard', label: 'Leaderboard',   icon: BarChart2 },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-bg-primary/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 font-display font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">CampusArena</span>
        </Link>

        {isAuthenticated ? (
          <>
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-purple-500/15 text-purple-400'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Credits wallet */}
              <Link
                to="/wallet"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold hover:bg-cyan-500/20 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                {formatCredits(user?.credits || 0, false)}
              </Link>

              {/* Create button */}
              <button
                onClick={() => navigate('/lobbies/create')}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" /> New Lobby
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2">
                  <Avatar user={user} size="sm" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-bg-card border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                          <p className="text-xs text-text-muted truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          {[
                            { to: '/profile', label: 'Profile', icon: User },
                            { to: '/wallet', label: 'Wallet', icon: Wallet },
                          ].map(({ to, label, icon: Icon }) => (
                            <Link
                              key={to}
                              to={to}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                            >
                              <Icon className="w-4 h-4" /> {label}
                            </Link>
                          ))}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Log out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Log in</Link>
            <Link to="/signup" className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition-colors">
              Get Started
            </Link>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-bg-primary overflow-hidden"
          >
            <nav className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-purple-500/15 text-purple-400' : 'text-text-secondary hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" /> {label}
                </NavLink>
              ))}
              <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-sm text-cyan-400 font-bold">{formatCredits(user?.credits || 0)}</span>
                <button onClick={handleLogout} className="text-sm text-error flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
