import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Trophy, SlidersHorizontal, X, Plus } from 'lucide-react';
import useTournamentStore from '../store/tournamentStore';
import useAuth from '../hooks/useAuth';
import TournamentCard from '../components/tournament/TournamentCard';
import { CardSkeleton, EmptyState } from '../components/ui/Skeleton';
import { GAMES } from '../utils/constants';
import Button from '../components/ui/Button';

const BrowseTournaments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tournaments, isLoading, filters, setFilters, fetchTournaments } = useTournamentStore();
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { fetchTournaments(); }, [fetchTournaments, filters]);

  useEffect(() => {
    const t = setTimeout(() => setFilters({ search: searchInput }), 400);
    return () => clearTimeout(t);
  }, [searchInput, setFilters]);

  const activeCount = [filters.game, filters.status].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-grid pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              <span className="gradient-text">Tournaments</span>
            </h1>
            <p className="text-text-muted text-sm mt-1">{tournaments.length} tournaments · Entry via campus credits</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => navigate('/tournaments/create')}>
            Host Tournament
          </Button>
        </div>

        {/* Search + filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tournaments..."
              className="w-full bg-bg-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              showFilters || activeCount > 0 ? 'bg-purple-500/15 border-purple-500/40 text-purple-400' : 'bg-bg-card border-white/10 text-text-secondary hover:border-white/20'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {activeCount > 0 && `(${activeCount})`}
          </button>
          {activeCount > 0 && (
            <button onClick={() => setFilters({ game: '', status: '' })} className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm text-error hover:bg-error/10 border border-error/20 transition-colors">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

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
                <option value="">All</option>
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : tournaments.length === 0 ? (
          <EmptyState icon={Trophy} title="No tournaments found" description="Check back soon or adjust your filters." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tournaments.map((t) => (
              <TournamentCard key={t._id} tournament={t} currentUserId={user?._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseTournaments;
