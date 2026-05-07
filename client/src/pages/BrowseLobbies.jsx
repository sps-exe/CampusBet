import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Gamepad2, X } from 'lucide-react';
import useLobbies from '../hooks/useLobbies';
import useAuth from '../hooks/useAuth';
import LobbyCard from '../components/lobby/LobbyCard';
import { CardSkeleton, EmptyState } from '../components/ui/Skeleton';
import { GAMES } from '../utils/constants';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'Live' },
  { value: 'completed', label: 'Ended' },
];

const BrowseLobbies = () => {
  const { user } = useAuth();
  const { lobbies, isLoading, filters, setFilters, joinLobby } = useLobbies();
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setFilters({ search: searchInput }), 400);
    return () => clearTimeout(t);
  }, [searchInput, setFilters]);

  const activeFiltersCount = [filters.game, filters.status].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ game: '', status: '' });
    setSearchInput('');
  };

  return (
    <div className="min-h-screen bg-grid pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              Browse <span className="gradient-text">Lobbies</span>
            </h1>
            <p className="text-text-muted text-sm mt-1">{lobbies.length} lobbies found</p>
          </div>
        </div>

        {/* Search + filter bar */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search lobbies..."
              className="w-full bg-bg-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              showFilters || activeFiltersCount > 0
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-400'
                : 'bg-bg-card border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm text-error hover:bg-error/10 border border-error/20 transition-colors">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-card border border-white/10 rounded-xl p-5 flex flex-wrap gap-4"
          >
            <div className="flex flex-col gap-1.5 min-w-48">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Game</label>
              <select
                value={filters.game}
                onChange={(e) => setFilters({ game: e.target.value })}
                className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              >
                <option value="">All Games</option>
                {GAMES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 min-w-40">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ status: e.target.value })}
                className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              >
                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </motion.div>
        )}

        {/* Lobby grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : lobbies.length === 0 ? (
          <EmptyState
            icon={Gamepad2}
            title="No lobbies found"
            description="Try adjusting your filters or be the first to create a lobby."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {lobbies.map((lobby) => (
              <LobbyCard
                key={lobby._id}
                lobby={lobby}
                currentUserId={user?._id}
                onJoin={(id) => joinLobby(id, user?._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseLobbies;
