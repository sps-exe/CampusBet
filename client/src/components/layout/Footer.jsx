/**
 * CampusArena — Footer
 */

import { Link } from 'react-router-dom';
import { Trophy, Github, Twitter, Instagram, Mail } from 'lucide-react';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Browse Lobbies',      path: '/lobbies' },
    { label: 'Browse Tournaments', path: '/tournaments' },
    { label: 'Leaderboard',        path: '/leaderboard' },
    { label: 'Wallet',             path: '/wallet' },
  ],
  Play: [
    { label: 'Valorant',         path: '/tournaments' },
    { label: 'Chess',            path: '/tournaments' },
    { label: 'FIFA / EA FC',     path: '/tournaments' },
    { label: 'Mario Kart',       path: '/tournaments' },
  ],
  Organise: [
    { label: 'Host a Tournament', path: '/tournaments/create' },
    { label: 'Create a Lobby',    path: '/lobbies/create' },
    { label: 'Manage Profile',    path: '/profile' },
  ],
  Company: [
    { label: 'Dashboard',      path: '/dashboard' },
    { label: 'Profile',        path: '/profile' },
    { label: 'Login',          path: '/login' },
    { label: 'Signup',         path: '/signup' },
  ],
};

const SOCIALS = [
  { icon: <Github size={18} />,    href: 'https://github.com',    label: 'GitHub' },
  { icon: <Twitter size={18} />,   href: 'https://twitter.com',   label: 'Twitter' },
  { icon: <Instagram size={18} />, href: 'https://instagram.com', label: 'Instagram' },
  { icon: <Mail size={18} />,      href: 'mailto:hello@campusarena.app', label: 'Email' },
];

const Footer = () => {
  return (
    <footer
      style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        marginTop: 'auto',
      }}
    >
      <div className="container-xl" style={{ padding: '60px 24px 32px' }}>
        {/* Top grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 40,
            marginBottom: 48,
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Trophy size={16} color="#fff" />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '17px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}
              >
                Campus<span className="text-gradient">Bet</span>
              </span>
            </Link>
            <p
              style={{
                fontSize: 13,
                color: 'var(--color-text-muted)',
                lineHeight: 1.7,
                maxWidth: 220,
              }}
            >
              A simple campus gaming frontend for lobbies, tournaments, and virtual credit tracking.
            </p>

            {/* Socials */}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(139,92,246,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--color-text-muted)',
                  marginBottom: 14,
                }}
              >
                {heading}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    style={{
                      fontSize: 13,
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            paddingTop: 24,
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} CampusArena. Made for campus gamers.
          </p>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Virtual credits only · No real money · No gambling
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
