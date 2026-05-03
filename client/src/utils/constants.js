export const APP_NAME = 'CampusBet';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const COLLEGE_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|ac\.in|edu\.in)$/;
export const COLLEGE_EMAIL_HINT = 'Must be a college-issued email (e.g. .edu or .ac.in)';

export const GAMES = [
  'Super Smash Bros',
  'Mario Kart',
  'FIFA / EA FC',
  'Chess',
  'Valorant',
  'BGMI / PUBG Mobile',
  'Carrom',
  'Table Tennis',
  'Custom',
];

export const GAME_ICONS = {
  'Valorant': '🎯',
  'Chess': '♟️',
  'FIFA / EA FC': '⚽',
  'BGMI / PUBG Mobile': '🔫',
  'Super Smash Bros': '💥',
  'Mario Kart': '🏎️',
  'Carrom': '🎱',
  'Table Tennis': '🏓',
  'Custom': '🎮',
};

export const LOBBY_FORMATS = [
  { value: '1v1', label: '1v1 (2 Players)' },
  { value: '2v2', label: '2v2 (4 Players)' },
  { value: 'squad', label: 'Squad (4 Players)' },
  { value: 'ffa', label: 'Free For All' },
];

export const TOURNAMENT_FORMATS = [
  { value: 'single-elim', label: 'Single Elimination' },
  { value: 'double-elim', label: 'Double Elimination' },
  { value: 'round-robin', label: 'Round Robin' },
];

export const STARTER_CREDITS = 500;

export const LEADERBOARD_PERIODS = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All Time' },
];

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  LOBBIES: '/lobbies',
  LOBBY_DETAIL: '/lobbies/:id',
  CREATE_LOBBY: '/lobbies/create',
  TOURNAMENTS: '/tournaments',
  TOURNAMENT_DETAIL: '/tournaments/:id',
  CREATE_TOURNAMENT: '/tournaments/create',
  LEADERBOARD: '/leaderboard',
  PROFILE: '/profile',
  WALLET: '/wallet',
};
