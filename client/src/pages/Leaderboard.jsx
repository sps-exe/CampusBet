import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import RightStatsPanel from '../components/dashboard/RightStatsPanel';
import useLeaderboard from '../hooks/useLeaderboard';
import useAuth from '../hooks/useAuth';
import { getInitials, calcWinRate } from '../utils/formatters';
import { GAMES } from '../utils/constants';

const PERIODS = ['All Time', 'This Week', 'This Month'];

function PodiumCard({ player, rank }) {
  const heights   = { 1: 'h-28', 2: 'h-20', 3: 'h-16' };
  const gradients = {
    1: 'from-credits via-credits/60 to-wine-card border-credits/40',
    2: 'from-white/20 via-white/10 to-wine-card border-white/20',
    3: 'from-[#CD7F32]/50 via-[#CD7F32]/20 to-wine-card border-[#CD7F32]/30',
  };
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={`flex flex-col items-center gap-2 ${rank === 1 ? 'order-2' : rank === 2 ? 'order-1' : 'order-3'}`}
    >
      {rank === 1 && <span className="text-2xl animate-float">👑</span>}
      <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-crimson to-credits flex items-center justify-center text-white text-xl font-bold shadow-glow-crimson-sm`}>
        {getInitials(player?.name || '?')}
      </div>
      <div className="text-center">
        <p className="text-white font-bold text-sm">{player?.name || '—'}</p>
        <p className="text-white/40 text-[10px] truncate max-w-[80px]">{player?.college}</p>
        <p className={`font-bold text-sm mt-1 ${rank === 1 ? 'text-credits' : 'text-white/60'}`}>{player?.matchesWon || 0} Wins</p>
      </div>
      <div className={`${heights[rank]} w-full max-w-[72px] bg-gradient-to-b ${gradients[rank]} rounded-t-xl border flex items-start justify-center pt-2 text-lg`}>
        {medals[rank]}
      </div>
    </motion.div>
  );
}

function PlayerRow({ player, rank, isMe }) {
  const winRate = calcWinRate(player.matchesWon, player.matchesPlayed);
  const medals  = { 1: '🥇', 2: '🥈', 3: '🥉' };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.03 }}
      className={`flex items-center gap-4 p-4 rounded-xl transition-colors
        ${isMe ? 'bg-crimson/10 border border-crimson/30' : 'bg-wine-elevated hover:bg-wine-card'}`}
    >
      {/* Rank */}
      <div className="w-8 text-center flex-shrink-0">
        {rank <= 3
          ? <span className="text-lg">{medals[rank]}</span>
          : <span className="text-white/40 font-bold text-sm">{rank}</span>
        }
      </div>
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-crimson to-credits flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {getInitials(player.name || '?')}
      </div>
      {/* Name + college */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">
          {player.name} {isMe && <span className="text-cyan-400 text-[10px] ml-1">(You)</span>}
        </p>
        <p className="text-white/40 text-xs truncate">{player.college}</p>
      </div>
      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6 text-center">
        <div>
          <p className="text-white font-bold text-sm">{player.matchesPlayed || 0}</p>
          <p className="text-white/30 text-[10px]">Matches</p>
        </div>
        <div>
          <p className="text-credits font-bold text-sm">{player.matchesWon || 0}</p>
          <p className="text-white/30 text-[10px]">Wins</p>
        </div>
        <div className="w-16">
          <p className="text-white font-bold text-sm">{winRate}</p>
          <div className="mt-1 h-1 bg-wine-card rounded-full overflow-hidden">
            <div className="h-full bg-crimson rounded-full" style={{ width: winRate }} />
          </div>
        </div>
        <div>
          <p className="text-credits font-bold text-sm">{player.credits || 0} ⚡</p>
          <p className="text-white/30 text-[10px]">Credits</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Leaderboard() {
  const { user }                          = useAuth();
  const { players, isLoading, fetchAll }  = useLeaderboard();
  const [period, setPeriod]               = useState('All Time');
  const [game,   setGame]                 = useState('');

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const top3 = players.slice(0, 3);
  return (
    <AppShell rightPanel={<RightStatsPanel />}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-wine-elevated flex-shrink-0">
        <div>
          <h1 className="text-white font-bold text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-credits" /> Leaderboard
          </h1>
          <p className="text-white/40 text-xs">Top players across campus</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            {PERIODS.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                  ${period === p ? 'bg-crimson border-crimson text-white' : 'bg-wine-card border-wine-elevated text-white/40 hover:text-white/60'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setGame('')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex-shrink-0
                ${!game ? 'bg-wine-elevated border-crimson/50 text-white' : 'bg-wine-card border-wine-elevated text-white/40'}`}
            >
              All Games
            </button>
            {GAMES.map(g => (
              <button
                key={g}
                onClick={() => setGame(g)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex-shrink-0
                  ${game === g ? 'bg-crimson border-crimson text-white' : 'bg-wine-card border-wine-elevated text-white/40'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => <div key={i} className="h-16 bg-wine-card animate-pulse rounded-xl" />)}
          </div>
        ) : players.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/30">
            <TrendingUp className="w-12 h-12 mb-3 opacity-50" />
            <p>No leaderboard data yet</p>
          </div>
        ) : (
          <>
            {/* Podium */}
            {top3.length >= 2 && (
              <div className="bg-wine-card border border-wine-elevated rounded-2xl p-6">
                <div className="flex items-end justify-center gap-6">
                  {top3.map((p, i) => <PodiumCard key={p._id || i} player={p} rank={i + 1} />)}
                </div>
              </div>
            )}

            {/* Full table */}
            <div className="space-y-2">
              <div className="hidden sm:flex items-center gap-4 px-4 pb-1">
                <div className="w-8" />
                <div className="w-9" />
                <div className="flex-1 text-white/30 text-xs">Player</div>
                <div className="flex gap-6 text-white/30 text-xs text-center">
                  <span className="w-12">Matches</span>
                  <span className="w-8">Wins</span>
                  <span className="w-16">Win Rate</span>
                  <span className="w-16">Credits</span>
                </div>
              </div>
              {players.map((p, i) => (
                <PlayerRow key={p._id || i} player={p} rank={i + 1} isMe={p._id === user?._id} />
              ))}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
