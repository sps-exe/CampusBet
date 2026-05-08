import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Plus, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import AppShell from '../components/layout/AppShell';
import GamingLobbyCard from '../components/lobby/GamingLobbyCard';
import RightStatsPanel from '../components/dashboard/RightStatsPanel';
import { EmptyState } from '../components/ui/Skeleton';
import useAuth from '../hooks/useAuth';
import useLobbies from '../hooks/useLobbies';
import { GAMES } from '../utils/constants';

const STATUSES = [
  { value: '',            label: 'All' },
  { value: 'open',        label: 'Open' },
  { value: 'in-progress', label: 'Live' },
  { value: 'completed',   label: 'Ended' },
];

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border
        ${active
          ? 'bg-crimson border-crimson text-white shadow-glow-crimson-sm'
          : 'bg-wine-card border-wine-elevated text-white/50 hover:border-crimson/40 hover:text-white/80'
        }`}
    >
      {children}
    </button>
  );
}

export default function BrowseLobbies() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lobbies, isLoading, filters, setFilters, joinLobby } = useLobbies();

  const [search, setSearch]           = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setFilters({ search }), 400);
    return () => clearTimeout(t);
  }, [search, setFilters]);

  const activeCount = [filters.game, filters.status].filter(Boolean).length;

  async function handleJoin(lobbyId) {
    const res = await joinLobby(lobbyId);
    if (!res?.success) toast.error(res?.message || 'Could not join');
  }

  const clearFilters = () => {
    setFilters({ game: '', status: '', search: '' });
    setSearch('');
  };

  return (
    <AppShell rightPanel={<RightStatsPanel />}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-wine-elevated flex-shrink-0">
        <div>
          <h1 className="text-white font-bold text-lg">Browse Lobbies</h1>
          <p className="text-white/40 text-xs">{lobbies.length} lobbies found</p>
        </div>
        <button
          onClick={() => navigate('/lobbies/create')}
          className="flex items-center gap-2 px-4 py-2 bg-crimson hover:bg-crimson-light rounded-xl text-white text-sm font-semibold transition-colors shadow-glow-crimson-sm"
        >
          <Plus className="w-4 h-4" /> Create Lobby
        </button>
      </div>

      {/* Search + filters */}
      <div className="px-6 pt-4 pb-2 space-y-3 flex-shrink-0">
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-wine-card border border-wine-elevated rounded-xl focus-within:border-crimson/50 transition-colors">
            <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search lobbies..."
              className="flex-1 bg-transparent text-white text-sm placeholder-white/25 outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')}><X className="w-3.5 h-3.5 text-white/30 hover:text-white/60" /></button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors relative
              ${showFilters ? 'bg-crimson/15 border-crimson text-crimson' : 'bg-wine-card border-wine-elevated text-white/50 hover:border-crimson/40'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-crimson rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                {activeCount}
              </span>
            )}
          </button>
          {activeCount > 0 && (
            <button onClick={clearFilters} className="text-crimson text-xs hover:text-crimson-light transition-colors">
              Clear
            </button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-wine-card border border-wine-elevated rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-white/40 text-xs mb-2">Game</p>
                  <div className="flex flex-wrap gap-2">
                    <FilterPill active={!filters.game} onClick={() => setFilters({ game: '' })}>All</FilterPill>
                    {GAMES.map(g => (
                      <FilterPill key={g} active={filters.game === g} onClick={() => setFilters({ game: g })}>{g}</FilterPill>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-2">Status</p>
                  <div className="flex gap-2">
                    {STATUSES.map(s => (
                      <FilterPill key={s.value} active={filters.status === s.value} onClick={() => setFilters({ status: s.value })}>{s.label}</FilterPill>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lobby grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-wine-card animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : lobbies.length === 0 ? (
          <EmptyState
            icon={ChevronRight}
            title="No lobbies found"
            description="Try adjusting your filters or create the first lobby!"
            action={
              <button onClick={() => navigate('/lobbies/create')} className="mt-4 px-5 py-2.5 bg-crimson text-white rounded-xl text-sm font-semibold hover:bg-crimson-light transition-colors">
                + Create Lobby
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
            {lobbies.map((lobby, i) => (
              <GamingLobbyCard
                key={lobby._id}
                lobby={lobby}
                currentUserId={user?._id}
                onJoin={handleJoin}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
