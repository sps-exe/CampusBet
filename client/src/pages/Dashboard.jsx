// no React imports needed — hooks are imported from their own modules
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ShoppingCart, ChevronRight, Zap, Trophy, Swords } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import AppShell from '../components/layout/AppShell';
import HeroLobbyCard from '../components/lobby/HeroLobbyCard';
import GamingLobbyCard from '../components/lobby/GamingLobbyCard';
import RightStatsPanel from '../components/dashboard/RightStatsPanel';

import useAuth from '../hooks/useAuth';
import useLobbies from '../hooks/useLobbies';
import useMyMatches from '../hooks/useMyMatches';

import { timeFromNow } from '../utils/formatters';
import { GAME_ICONS } from '../utils/constants';

/* ─── Top bar inside main panel ─── */
function TopBar() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-wine-elevated flex-shrink-0">
      <div>
        <p className="text-white/50 text-sm">
          {greeting},{' '}
          <span className="text-white font-bold">{user?.name?.split(' ')[0]?.toUpperCase() || 'PLAYER'}</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 bg-wine-card border border-wine-elevated rounded-xl text-white/30 text-sm w-44">
          <Search className="w-4 h-4 flex-shrink-0" />
          <span>Search</span>
        </div>
        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center bg-wine-card border border-wine-elevated rounded-xl text-white/40 hover:text-white hover:border-crimson transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-crimson rounded-full" />
        </button>
        {/* Cart */}
        <button className="w-9 h-9 flex items-center justify-center bg-wine-card border border-wine-elevated rounded-xl text-white/40 hover:text-white hover:border-crimson transition-colors">
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Section header ─── */
function SectionHeader({ title, to, navigate }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-white font-bold text-base">{title}</h2>
      <button
        onClick={() => navigate(to)}
        className="flex items-center gap-1 text-crimson text-xs font-medium hover:text-crimson-light transition-colors"
      >
        See More <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ─── Recent match row ─── */
function MatchRow({ match }) {
  const gameIcon = GAME_ICONS[match.game] || '🎮';
  const isWon    = match.result === 'won';
  const isLost   = match.result === 'lost';

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-3 p-3 rounded-xl bg-wine-card border transition-colors hover:border-wine-elevated cursor-pointer
        ${isWon ? 'border-l-2 border-l-success border-wine-card' : isLost ? 'border-l-2 border-l-error border-wine-card' : 'border-wine-card'}`}
    >
      {/* Game icon box */}
      <div className="w-12 h-12 rounded-xl bg-wine-elevated flex items-center justify-center text-2xl flex-shrink-0">
        {gameIcon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{match.title}</p>
        <span className="inline-block mt-0.5 px-2 py-0.5 bg-wine-elevated rounded-full text-white/40 text-[10px]">
          {match.game}
        </span>
      </div>

      {/* Time */}
      <p className="text-white/30 text-xs">{timeFromNow(match.date)}</p>

      {/* Status + credit change */}
      <div className="flex flex-col items-end gap-1">
        {match.result !== 'pending' && (
          <span className={`text-xs font-semibold ${isWon ? 'text-success' : 'text-error'}`}>
            {isWon ? 'Won' : 'Lost'}
          </span>
        )}
        {match.creditsChange !== 0 && (
          <span className={`text-xs font-bold ${match.creditsChange > 0 ? 'text-credits' : 'text-error'}`}>
            {match.creditsChange > 0 ? '+' : ''}{match.creditsChange} ⚡
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main Dashboard page ─── */
export default function Dashboard() {
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const { lobbies, isLoading: lobbiesLoading, joinLobby } = useLobbies();
  const { matches, isLoading: matchesLoading } = useMyMatches();

  // ── Site-owner featured lobby ──────────────────────────────────────────────
  // Only lobbies created by the platform owner appear in the "Popular" hero
  // slot. Change this ID if ownership transfers.
  const OWNER_ID = '8f0bc8de-1cf0-47dc-9c34-de2a84a71c62'; // Shaurya Pratap Singh

  const openLobbies   = lobbies.filter(l => l.status === 'open');
  const ownerLobbies  = openLobbies.filter(l => l.hostId === OWNER_ID);
  const featuredLobby = ownerLobbies[0] || null;          // only owner's lobby shown as Popular
  const cardLobbies   = openLobbies.slice(0, 4);          // all open lobbies shown in the grid

  const recentMatches = matches.slice(0, 3);

  // Aggregate per-game win counts from real match history
  const gameCounts = matches.reduce((acc, m) => {
    if (m.game) acc[m.game] = (acc[m.game] || 0) + (m.result === 'won' ? 1 : 0);
    return acc;
  }, {});

  async function handleJoin(lobbyId) {
    const res = await joinLobby(lobbyId);
    if (!res?.success) toast.error(res?.message || 'Could not join lobby');
  }

  return (
    <AppShell rightPanel={<RightStatsPanel gameCounts={gameCounts} />}>
      {/* Top bar */}
      <TopBar />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

        {/* ── HERO LOBBY ── */}
        {lobbiesLoading ? (
          <div className="h-52 bg-wine-card animate-pulse rounded-2xl" />
        ) : featuredLobby ? (
          <HeroLobbyCard
            lobby={featuredLobby}
            currentUserId={user?._id}
            onJoin={handleJoin}
          />
        ) : (
          <div className="h-52 bg-wine-card rounded-2xl border border-wine-elevated flex flex-col items-center justify-center gap-3">
            <Swords className="w-10 h-10 text-crimson/40" />
            <p className="text-white/40 text-sm">No open lobbies yet</p>
            <button
              onClick={() => navigate('/lobbies/create')}
              className="px-4 py-2 bg-crimson text-white rounded-xl text-sm font-semibold hover:bg-crimson-light transition-colors"
            >
              + Create First Lobby
            </button>
          </div>
        )}

        {/* ── OPEN LOBBIES grid ── */}
        <div>
          <SectionHeader title="Open Lobbies" to="/lobbies" navigate={navigate} />
          {lobbiesLoading ? (
            <div className="flex gap-4">
              {[1, 2, 3].map(i => <div key={i} className="w-48 h-52 bg-wine-card animate-pulse rounded-2xl flex-shrink-0" />)}
            </div>
          ) : cardLobbies.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {cardLobbies.map((lobby, i) => (
                <GamingLobbyCard
                  key={lobby._id}
                  lobby={lobby}
                  currentUserId={user?._id}
                  onJoin={handleJoin}
                  index={i}
                />
              ))}
              {/* "See more" card */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => navigate('/lobbies')}
                className="w-12 h-52 flex-shrink-0 bg-wine-card border border-wine-elevated rounded-2xl flex items-center justify-center text-white/30 hover:text-crimson hover:border-crimson transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="w-48 h-52 bg-wine-card border border-dashed border-wine-elevated rounded-2xl flex flex-col items-center justify-center gap-2 text-white/30">
                <Trophy className="w-8 h-8" />
                <p className="text-xs">No lobbies</p>
              </div>
            </div>
          )}
        </div>

        {/* ── RECENT MATCHES ── */}
        <div>
          <SectionHeader title="Recent Matches" to="/wallet" navigate={navigate} />
          {matchesLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-wine-card animate-pulse rounded-xl" />)}
            </div>
          ) : recentMatches.length > 0 ? (
            <div className="space-y-2">
              {recentMatches.map(m => <MatchRow key={m._id} match={m} />)}
            </div>
          ) : (
            <div className="h-20 bg-wine-card border border-dashed border-wine-elevated rounded-xl flex items-center justify-center text-white/30 text-sm gap-2">
              <Zap className="w-4 h-4" />
              No matches yet — join a lobby to start!
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
