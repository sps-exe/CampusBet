import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Plus, Search, X, SlidersHorizontal, ChevronRight, Users, Zap, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '../components/layout/AppShell';
import RightStatsPanel from '../components/dashboard/RightStatsPanel';
import useTournaments from '../hooks/useTournaments';
import { formatCredits } from '../utils/formatters';
import { GAMES } from '../utils/constants';

const STATUSES = [
  { value: '',           label: 'All'      },
  { value: 'upcoming',  label: 'Upcoming'  },
  { value: 'live',      label: 'Live'      },
  { value: 'completed', label: 'Ended'     },
];

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex-shrink-0 transition-all
        ${active
          ? 'bg-crimson border-crimson text-white shadow-glow-crimson-sm'
          : 'bg-wine-card border-wine-elevated text-white/50 hover:border-crimson/40 hover:text-white/70'
        }`}
    >
      {children}
    </button>
  );
}

function TournamentCard({ tournament, index }) {
  const navigate = useNavigate();

  const STATUS_STYLE = {
    upcoming:  { bar: 'from-purple-600 to-crimson', badge: 'bg-purple-500/15 border-purple-500/30 text-purple-400' },
    live:      { bar: 'from-success to-cyan-500',   badge: 'bg-success/15     border-success/30     text-success'  },
    completed: { bar: 'from-white/10 to-white/5',   badge: 'bg-white/10       border-white/10       text-white/40' },
  };
  const style      = STATUS_STYLE[tournament.status] || STATUS_STYLE.completed;
  const spotsLeft  = (tournament.maxParticipants || 0) - (tournament.registrations?.length || 0);
  const isFree     = !tournament.entryFee || tournament.entryFee === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => navigate(`/tournaments/${tournament._id}`)}
      className="bg-wine-card border border-wine-elevated rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Status bar */}
      <div className={`h-1 bg-gradient-to-r ${style.bar}`} />

      <div className="p-5">
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${style.badge}`}>
            {tournament.status || 'Upcoming'}
          </span>
          <span className="px-2 py-1 bg-wine-elevated border border-white/5 rounded-full text-white/40 text-[10px]">
            {tournament.format || 'Single Elim'}
          </span>
          <span className="px-2 py-1 bg-wine-elevated border border-white/5 rounded-full text-white/40 text-[10px]">
            {tournament.game}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-3 group-hover:text-crimson/90 transition-colors">
          {tournament.title}
        </h3>

        {/* 3 stat boxes */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-wine-elevated rounded-lg p-2 text-center">
            <Zap className="w-3 h-3 text-credits mx-auto mb-0.5" />
            <p className="text-credits text-[10px] font-bold">{isFree ? 'Free' : formatCredits(tournament.entryFee, false)}</p>
            <p className="text-white/30 text-[9px]">Entry</p>
          </div>
          <div className="bg-wine-elevated rounded-lg p-2 text-center">
            <Trophy className="w-3 h-3 text-credits mx-auto mb-0.5" />
            <p className="text-credits text-[10px] font-bold">{formatCredits(tournament.prizePool, false)}</p>
            <p className="text-white/30 text-[9px]">Prize</p>
          </div>
          <div className="bg-wine-elevated rounded-lg p-2 text-center">
            <Users className="w-3 h-3 text-white/40 mx-auto mb-0.5" />
            <p className="text-white text-[10px] font-bold">{spotsLeft > 0 ? spotsLeft : 'Full'}</p>
            <p className="text-white/30 text-[9px]">Spots</p>
          </div>
        </div>

        {/* Date + action */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-white/30 text-[10px]">
            <Calendar className="w-3 h-3" />
            {new Date(tournament.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
          <span className="flex items-center gap-1 text-crimson text-[10px] font-semibold group-hover:gap-2 transition-all">
            View <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function BrowseTournaments() {
  const navigate = useNavigate();
  const { tournaments, isLoading, fetchTournaments } = useTournaments();
  const [search, setSearch]       = useState('');
  const [status, setStatus]       = useState('');
  const [game,   setGame]         = useState('');
  const [showF,  setShowF]        = useState(false);

  useEffect(() => { fetchTournaments(); }, [fetchTournaments]);

  const filtered = tournaments.filter(t => {
    const matchSearch = !search || t.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !status || t.status === status;
    const matchGame   = !game   || t.game   === game;
    return matchSearch && matchStatus && matchGame;
  });

  const activeFilters = [status, game].filter(Boolean).length;

  return (
    <AppShell rightPanel={<RightStatsPanel />}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-wine-elevated flex-shrink-0">
        <div>
          <h1 className="text-white font-bold text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-credits" /> Tournaments
          </h1>
          <p className="text-white/40 text-xs">{filtered.length} tournaments · Register before spots run out</p>
        </div>
        <button
          onClick={() => navigate('/tournaments/create')}
          className="flex items-center gap-2 px-4 py-2 bg-crimson hover:bg-crimson-light rounded-xl text-white text-sm font-semibold transition-colors shadow-glow-crimson-sm"
        >
          <Plus className="w-4 h-4" /> Create
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
              placeholder="Search tournaments..."
              className="flex-1 bg-transparent text-white text-sm placeholder-white/25 outline-none"
            />
            {search && <button onClick={() => setSearch('')}><X className="w-3.5 h-3.5 text-white/30" /></button>}
          </div>
          <button
            onClick={() => setShowF(v => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors relative
              ${showF ? 'bg-crimson/15 border-crimson text-crimson' : 'bg-wine-card border-wine-elevated text-white/50'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilters > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-crimson rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showF && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-wine-card border border-wine-elevated rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-white/40 text-xs mb-2">Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {STATUSES.map(s => (
                      <FilterPill key={s.value} active={status === s.value} onClick={() => setStatus(s.value)}>
                        {s.label}
                      </FilterPill>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-2">Game</p>
                  <div className="flex gap-2 flex-wrap">
                    <FilterPill active={!game} onClick={() => setGame('')}>All</FilterPill>
                    {GAMES.map(g => (
                      <FilterPill key={g} active={game === g} onClick={() => setGame(g)}>{g}</FilterPill>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {Array(6).fill(0).map((_, i) => <div key={i} className="h-64 bg-wine-card animate-pulse rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/30 gap-3">
            <Trophy className="w-12 h-12 opacity-40" />
            <p>No tournaments found</p>
            <button onClick={() => navigate('/tournaments/create')} className="px-4 py-2 bg-crimson text-white rounded-xl text-sm">
              Create One
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {filtered.map((t, i) => <TournamentCard key={t._id} tournament={t} index={i} />)}
          </div>
        )}
      </div>
    </AppShell>
  );
}
