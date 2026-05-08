import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import useAuth from '../../hooks/useAuth';
import { formatCredits, calcWinRate } from '../../utils/formatters';
import { GAME_ICONS, GAMES } from '../../utils/constants';

/** Donut chart showing match stats */
function StatsDonut({ stats }) {
  const won    = stats?.matchesWon    || 0;
  const played = stats?.matchesPlayed || 0;
  const lost   = Math.max(0, played - won);

  const data = played > 0
    ? [{ v: won }, { v: lost }]
    : [{ v: 1 }]; // empty state — full grey ring

  const COLORS = played > 0
    ? ['#C0392B', '#3D1A1F']
    : ['#3D1A1F'];

  return (
    <div className="relative w-36 h-36 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={46}
            outerRadius={62}
            startAngle={90}
            endAngle={-270}
            dataKey="v"
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-white/40 text-[10px]">Total matches</p>
        <p className="text-white font-bold text-2xl font-display leading-tight">{played}</p>
      </div>
    </div>
  );
}

/** Single popular-game row */
function PopularRow({ game }) {
  const icon = GAME_ICONS[game] || '🎮';
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-wine-elevated transition-colors cursor-pointer group">
      <div className="w-10 h-10 rounded-lg bg-wine-elevated border border-wine-card flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">{game}</p>
        <p className="text-white/40 text-xs">Active on campus</p>
      </div>
      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-crimson transition-colors flex-shrink-0" />
    </div>
  );
}

/** Per-game mini stat */
function GameStat({ game, wins }) {
  const icon = GAME_ICONS[game] || '🎮';
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-10 h-10 rounded-full bg-wine-elevated border border-crimson/30 flex items-center justify-center text-xl">
        {icon}
      </div>
      <p className="text-white font-bold text-sm">{wins}</p>
      <p className="text-white/40 text-[10px]">Wins</p>
    </div>
  );
}

/**
 * RightStatsPanel — the right sidebar matching the reference image
 * Shows: Popular games list + Your Stats donut chart
 * All data from existing auth store / passed props
 */
export default function RightStatsPanel({ popularGames = [], gameCounts = {} }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const stats    = user?.stats || {};

  // Use top 3 games from the GAMES constant, or passed prop
  const games = popularGames.length ? popularGames : GAMES.slice(0, 3);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* ── Popular Now ── */}
      <div className="p-4 border-b border-wine-elevated">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm">Popular Now</h3>
          <button
            onClick={() => navigate('/lobbies')}
            className="flex items-center gap-1 text-crimson text-xs hover:text-crimson-light transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {games.map((g) => <PopularRow key={g} game={g} />)}
        </div>
      </div>

      {/* ── Your Stats ── */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-sm">Your Stats</h3>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-1 text-crimson text-xs hover:text-crimson-light transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Donut chart */}
        <div className="bg-wine-elevated rounded-2xl p-4">
          <StatsDonut stats={stats} />

          {/* Per-game wins — from real match history if available, else total wins */}
          <div className="flex items-center justify-around mt-5 pt-4 border-t border-wine-card">
            {Object.keys(gameCounts).length > 0
              ? Object.entries(gameCounts).slice(0, 3).map(([game, count]) => (
                  <GameStat key={game} game={game} wins={count} />
                ))
              : GAMES.slice(0, 3).map((game) => (
                  <GameStat key={game} game={game} wins={0} />
                ))
            }
          </div>
        </div>

        {/* Credits balance */}
        <div className="mt-3 p-3 bg-wine-elevated rounded-xl border border-credits/20">
          <p className="text-white/40 text-[10px] mb-0.5">Campus Credits</p>
          <p className="text-credits font-bold text-lg">{formatCredits(user?.credits || 0)}</p>
          <p className="text-white/30 text-[10px]">Win Rate: {calcWinRate(stats.matchesWon, stats.matchesPlayed)}</p>
        </div>
      </div>
    </div>
  );
}
