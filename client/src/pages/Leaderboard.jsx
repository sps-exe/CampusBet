import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, TrendingUp, Star } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { Avatar } from '../components/tournament/ParticipantList';
import Badge from '../components/ui/Badge';
import { calcWinRate, formatCredits } from '../utils/formatters';
import { MOCK_LEADERBOARD, CURRENT_USER } from '../utils/mockData';
import { GAMES, LEADERBOARD_PERIODS } from '../utils/constants';

const PodiumCard = ({ user, position }) => {
  const medals = { 1: { icon: '🥇', color: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/10', h: 'h-24' },
    2: { icon: '🥈', color: 'text-slate-400', border: 'border-slate-400/30', bg: 'bg-slate-400/10', h: 'h-16' },
    3: { icon: '🥉', color: 'text-orange-400', border: 'border-orange-400/30', bg: 'bg-orange-400/10', h: 'h-12' } };
  const m = medals[position];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position * 0.1 }}
      className={`flex flex-col items-center gap-2 ${position === 1 ? 'order-1' : position === 2 ? 'order-0' : 'order-2'}`}
    >
      <span className="text-2xl">{m.icon}</span>
      <Avatar user={user} size={position === 1 ? 'lg' : 'md'} />
      <div className="text-center">
        <p className="font-display font-bold text-sm text-text-primary">{user.name}</p>
        <p className="text-xs text-text-muted">{user.college}</p>
      </div>
      <div className={`w-full border ${m.border} ${m.bg} rounded-xl px-3 py-2 text-center`}>
        <p className={`font-display font-bold text-lg ${m.color}`}>{user.stats.matchesWon}W</p>
        <p className="text-xs text-text-muted">{calcWinRate(user.stats.matchesWon, user.stats.matchesPlayed)}</p>
      </div>
      <div className={`w-full ${m.bg} border ${m.border} rounded-lg ${m.h}`} />
    </motion.div>
  );
};

const Leaderboard = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('all');
  const [game, setGame] = useState('');

  const top3 = MOCK_LEADERBOARD.slice(0, 3);
  const rest = MOCK_LEADERBOARD.slice(3);
  const currentUserEntry = MOCK_LEADERBOARD.find(u => u._id === user?._id) || { ...CURRENT_USER, rank: 42, winRate: 60 };

  return (
    <div className="min-h-screen bg-grid pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Trophy className="w-7 h-7 text-warning" />
            <span className="gradient-text">Leaderboard</span>
          </h1>
          <p className="text-text-muted text-sm mt-1">Campus champions ranked by wins</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex rounded-xl overflow-hidden border border-white/10">
            {LEADERBOARD_PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  period === p.value ? 'bg-purple-500 text-white' : 'bg-bg-card text-text-muted hover:text-text-primary'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <select
            value={game}
            onChange={(e) => setGame(e.target.value)}
            className="bg-bg-card border border-white/10 rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          >
            <option value="">All Games</option>
            {GAMES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Podium */}
        <div className="bg-bg-card border border-white/5 rounded-2xl p-8">
          <div className="flex items-end justify-center gap-4 sm:gap-8">
            {[top3[1], top3[0], top3[2]].filter(Boolean).map((u, i) => {
              const pos = i === 0 ? 2 : i === 1 ? 1 : 3;
              return <PodiumCard key={u._id} user={u} position={pos} />;
            })}
          </div>
        </div>

        {/* Current user highlight */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-center gap-4">
          <span className="font-display font-black text-2xl text-purple-400 w-8 text-center">#{currentUserEntry.rank || 42}</span>
          <Avatar user={user} size="md" />
          <div className="flex-1">
            <p className="font-semibold text-text-primary text-sm">{user?.name} <span className="text-purple-400 text-xs">(You)</span></p>
            <p className="text-xs text-text-muted">{user?.college}</p>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-purple-400">{user?.stats?.matchesWon || 0}W</p>
            <p className="text-xs text-text-muted">{calcWinRate(user?.stats?.matchesWon, user?.stats?.matchesPlayed)}</p>
          </div>
        </div>

        {/* Rest of leaderboard */}
        <div className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-white/5">
            <span className="col-span-1">Rank</span>
            <span className="col-span-5">Player</span>
            <span className="col-span-2 text-center">Wins</span>
            <span className="col-span-2 text-center">Win Rate</span>
            <span className="col-span-2 text-center">Credits</span>
          </div>
          {rest.map((u, i) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-12 items-center px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors"
            >
              <span className="col-span-1 font-display font-bold text-text-muted">#{u.rank}</span>
              <div className="col-span-5 flex items-center gap-3">
                <Avatar user={u} size="sm" />
                <div>
                  <p className="text-sm font-medium text-text-primary">{u.name}</p>
                  <p className="text-xs text-text-muted">{u.college}</p>
                </div>
              </div>
              <span className="col-span-2 text-center font-display font-bold text-success">{u.stats.matchesWon}</span>
              <span className="col-span-2 text-center text-sm text-text-secondary">{calcWinRate(u.stats.matchesWon, u.stats.matchesPlayed)}</span>
              <span className="col-span-2 text-center text-sm text-cyan-400 font-semibold">{formatCredits(u.credits, false)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
