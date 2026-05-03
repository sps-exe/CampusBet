/**
 * CampusArena — App-wide Constants
 */

// ─── Supported Games ──────────────────────────────────────────────────────────

export const SUPPORTED_GAMES = [
  { id: 'valorant',    name: 'Valorant',         icon: '🎯', banner: '/images/game-valorant.png',    category: 'fps' },
  { id: 'bgmi',        name: 'BGMI',              icon: '🪂', banner: '/images/game-bgmi.png',        category: 'battle-royale' },
  { id: 'fifa',        name: 'FIFA / EA FC',      icon: '⚽', banner: '/images/game-fifa.png',        category: 'sports' },
  { id: 'chess',       name: 'Chess',             icon: '♟️', banner: '/images/game-chess.png',       category: 'strategy' },
  { id: 'smash',       name: 'Super Smash Bros',  icon: '👊', banner: '/images/game-fighting.png',    category: 'fighting' },
  { id: 'mario-kart',  name: 'Mario Kart',        icon: '🏎️', banner: '/images/game-racing.png',     category: 'racing' },
  { id: 'carrom',      name: 'Carrom',            icon: '🎱', banner: '/images/game-carrom.png',      category: 'board' },
  { id: 'tt',          name: 'Table Tennis',      icon: '🏓', banner: '/images/game-tt.png',          category: 'sports' },
  { id: 'custom',      name: 'Custom Game',       icon: '🎮', banner: '/images/game-custom.png',      category: 'custom' },
];

// ─── Tournament Formats ───────────────────────────────────────────────────────

export const TOURNAMENT_FORMATS = [
  { id: 'single-elim',  label: 'Single Elimination',  description: 'Lose once, you\'re out' },
  { id: 'double-elim',  label: 'Double Elimination',  description: 'Two losses before elimination' },
  { id: 'round-robin',  label: 'Round Robin',          description: 'Everyone plays everyone' },
];

// ─── Tournament Statuses ──────────────────────────────────────────────────────

export const TOURNAMENT_STATUS = {
  UPCOMING:  'upcoming',
  LIVE:      'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const STATUS_LABELS = {
  upcoming:  'Upcoming',
  live:      'Live',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const STATUS_BADGE_VARIANT = {
  upcoming:  'purple',
  live:      'cyan',
  completed: 'success',
  cancelled: 'error',
};

// ─── User Roles ───────────────────────────────────────────────────────────────

export const USER_ROLES = {
  PLAYER: 'player',
  HOST:   'host',
  ADMIN:  'admin',
};

// ─── Navigation Links ─────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: 'Tournaments', path: '/tournaments', protected: true },
  { label: 'Leaderboard', path: '/leaderboard',  protected: true },
  { label: 'Dashboard',   path: '/dashboard',    protected: true },
];

// ─── Password Requirements ────────────────────────────────────────────────────

export const PASSWORD_REQUIREMENTS = [
  { label: 'At least 8 characters',    test: (p) => p.length >= 8 },
  { label: 'One uppercase letter',      test: (p) => /[A-Z]/.test(p) },
  { label: 'One number',               test: (p) => /\d/.test(p) },
  { label: 'One special character',     test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

// ─── College Email Regex ──────────────────────────────────────────────────────

export const COLLEGE_EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|ac\.in|edu\.in|ac\.uk|edu\.au|ac\.nz)$/i;

// ─── API Config ───────────────────────────────────────────────────────────────

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Mock / Fallback Stats (Landing Page) ────────────────────────────────────

export const PLATFORM_STATS = [
  { label: 'Active Players',  value: '500+',  icon: '🎮' },
  { label: 'Tournaments',     value: '100+',  icon: '🏆' },
  { label: 'Colleges',        value: '20+',   icon: '🎓' },
  { label: 'Prize Sponsors',  value: '15+',   icon: '🤝' },
];
