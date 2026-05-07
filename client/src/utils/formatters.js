import { formatDistanceToNow, format } from 'date-fns';

/** Format a number as campus credits: 1450 → "1,450 ⚡" */
export const formatCredits = (amount, showIcon = true) => {
  const formatted = Number(amount).toLocaleString('en-IN');
  return showIcon ? `${formatted} ⚡` : formatted;
};

/** +150 → "+150 ⚡" | -200 → "-200 ⚡" */
export const formatCreditChange = (amount) => {
  const sign = amount >= 0 ? '+' : '';
  return `${sign}${amount.toLocaleString('en-IN')} ⚡`;
};

/** "2 hours ago" or "in 3 hours" */
export const timeFromNow = (dateStr) => {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return 'Unknown';
  }
};

/** "May 6, 2025 at 4:00 PM" */
export const formatDateTime = (dateStr) => {
  try {
    return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return 'Unknown';
  }
};

/** "May 6" */
export const formatDateShort = (dateStr) => {
  try {
    return format(new Date(dateStr), 'MMM d');
  } catch {
    return 'TBD';
  }
};

/** 22/34 → "65%" */
export const calcWinRate = (won, played) => {
  if (!played) return '0%';
  return `${Math.round((won / played) * 100)}%`;
};

/** Get lobby status label + color class */
export const getLobbyStatus = (status) => {
  const map = {
    open: { label: 'Open', color: 'text-success', dot: 'status-live', bg: 'bg-success/10' },
    'in-progress': { label: 'Live', color: 'text-warning', dot: 'status-upcoming', bg: 'bg-warning/10' },
    completed: { label: 'Ended', color: 'text-text-muted', dot: 'status-ended', bg: 'bg-white/5' },
    cancelled: { label: 'Cancelled', color: 'text-error', dot: 'status-ended', bg: 'bg-error/10' },
  };
  return map[status] || map.completed;
};

/** Get tournament status label + color */
export const getTournamentStatus = (status) => {
  const map = {
    upcoming: { label: 'Upcoming', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    live: { label: 'Live', color: 'text-success', bg: 'bg-success/10' },
    completed: { label: 'Completed', color: 'text-text-muted', bg: 'bg-white/5' },
    cancelled: { label: 'Cancelled', color: 'text-error', bg: 'bg-error/10' },
  };
  return map[status] || map.upcoming;
};

/** Get initials from a name */
export const getInitials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

/** Slots label: "3 / 4 slots filled" */
export const slotsLabel = (current, max) => `${current} / ${max} slots`;

/** Is the match joinable? */
export const canJoinLobby = (lobby, userId) => {
  if (lobby.status !== 'open') return false;
  if (lobby.currentPlayers.includes(userId)) return false;
  if (lobby.currentPlayers.length >= lobby.maxPlayers) return false;
  return true;
};

/** Countdown string for a future date */
export const countdown = (dateStr) => {
  const ms = new Date(dateStr) - Date.now();
  if (ms <= 0) return 'Starting now';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h > 24) return `in ${Math.floor(h / 24)}d`;
  if (h > 0) return `in ${h}h ${m}m`;
  return `in ${m}m`;
};
