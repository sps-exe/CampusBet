/**
 * CampusArena — Navbar
 * Sticky top navigation with auth-aware state and mobile drawer.
 */

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Trophy, Zap, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NAV_LINKS } from '../../utils/constants';
import Button from '../ui/Button';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { isAuthenticated, user, logout, isHost } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();

  // Darken navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'all 0.3s ease',
          background: scrolled
            ? 'rgba(10, 10, 15, 0.92)'
            : 'rgba(10, 10, 15, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled
            ? '1px solid var(--color-border)'
            : '1px solid transparent',
          boxShadow: scrolled
            ? '0 4px 24px rgba(0,0,0,0.3)'
            : 'none',
        }}
      >
        <div
          className="container-xl"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
          }}
        >
          {/* ── Logo ── */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(139,92,246,0.4)',
              }}
            >
              <Trophy size={18} color="#fff" />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.3px',
              }}
            >
              Campus<span className="text-gradient">Arena</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          {isAuthenticated && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
              className="hidden-mobile"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: '14px',
                    fontWeight: 500,
                    color: isActive(link.path)
                      ? 'var(--color-primary)'
                      : 'var(--color-text-secondary)',
                    background: isActive(link.path)
                      ? 'rgba(139,92,246,0.1)'
                      : 'transparent',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(link.path)) {
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(link.path)) {
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {isHost && (
                <Link
                  to="/host"
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: '14px',
                    fontWeight: 500,
                    color: isActive('/host') ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    background: isActive('/host') ? 'rgba(6,182,212,0.1)' : 'transparent',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                  }}
                >
                  Host Dashboard
                </Link>
              )}
            </div>
          )}

          {/* ── Desktop Right ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hidden-mobile">
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px',
                    borderRadius: 10,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border-hover)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    color: 'var(--color-text-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#fff',
                    }}
                  >
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="var(--color-text-secondary)" />
                </button>

                {/* User dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border-hover)',
                        borderRadius: 12,
                        minWidth: 180,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        overflow: 'hidden',
                        zIndex: 200,
                      }}
                    >
                      <Link
                        to="/profile"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '12px 16px',
                          color: 'var(--color-text-secondary)',
                          fontSize: 14,
                          transition: 'all 0.15s',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--color-surface-2)';
                          e.currentTarget.style.color = 'var(--color-text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--color-text-secondary)';
                        }}
                      >
                        <User size={15} />
                        View Profile
                      </Link>
                      <div style={{ height: 1, background: 'var(--color-border)' }} />
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '12px 16px',
                          color: 'var(--color-error)',
                          fontSize: 14,
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <LogOut size={15} />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" icon={<Zap size={14} />}>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="show-mobile"
            style={{
              padding: 8,
              borderRadius: 8,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 64,
              right: 0,
              bottom: 0,
              width: '80%',
              maxWidth: 320,
              background: 'var(--color-surface)',
              borderLeft: '1px solid var(--color-border)',
              zIndex: 99,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {isAuthenticated ? (
              <>
                {/* User info */}
                <div
                  style={{
                    padding: '12px 16px',
                    background: 'var(--color-surface-2)',
                    borderRadius: 10,
                    marginBottom: 8,
                  }}
                >
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{user?.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {user?.college}
                  </p>
                </div>

                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: 500,
                      color: isActive(link.path) ? 'var(--color-primary)' : 'var(--color-text-primary)',
                      background: isActive(link.path) ? 'rgba(139,92,246,0.1)' : 'transparent',
                      textDecoration: 'none',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}

                {isHost && (
                  <Link to="/host" style={{ padding: '12px 16px', borderRadius: 10, fontSize: 15, color: 'var(--color-accent)', textDecoration: 'none' }}>
                    Host Dashboard
                  </Link>
                )}

                <Link to="/profile" style={{ padding: '12px 16px', borderRadius: 10, fontSize: 15, color: 'var(--color-text-primary)', textDecoration: 'none' }}>
                  My Profile
                </Link>

                <div style={{ flex: 1 }} />

                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 16px',
                    borderRadius: 10,
                    fontSize: 15,
                    color: 'var(--color-error)',
                    background: 'rgba(239,68,68,0.08)',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" size="md" fullWidth>Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="md" fullWidth>Create Account</Button>
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile overlay backdrop ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            top: 64,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 98,
          }}
        />
      )}

      {/* ── Spacer so content doesn't go under fixed nav ── */}
      <div style={{ height: 64 }} />

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
