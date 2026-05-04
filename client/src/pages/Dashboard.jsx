import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Gamepad2, Trophy, Zap, Plus, ArrowRight,
  TrendingUp, Clock, Swords,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useLobbies from '../hooks/useLobbies';
import StatCard from '../components/dashboard/StatCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import LobbyCard from '../components/lobby/LobbyCard';
import { CardSkeleton, StatSkeleton } from '../components/ui/Skeleton';
import { formatCredits, calcWinRate } from '../utils/formatters';
import { MOCK_MY_MATCHES } from '../utils/mockData';

const Dashboard = () => {
  const { user } = useAuth();
  const { lobbies, isLoading, fetchLobbies, joinLobby } = useLobbies();
  const navigate = useNavigate();

  useEffect(() => { fetchLobbies(); }, []);

  const stats = user?.stats || {};
  const openLobbies = lobbies.filter((l) => l.status === 'open').slice(0, 3);

  return (
    <div className="min-h-screen bg-grid pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Welcome header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> ⚡
            </h1>
            <p className="text-text-muted text-sm mt-1">{user?.college} · {user?.role}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold">
              <Zap className="w-4 h-4" />
              {formatCredits(user?.credits || 0)}
            </div>
            <button
              onClick={() => navigate('/lobbies/create')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm transition-all shadow-glow-purple-sm hover:shadow-glow-purple"
            >
              <Plus className="w-4 h-4" /> New Lobby
            </button>
          </div>
        </motion.div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading && !stats.matchesPlayed ? (
            Array(4).fill(0).map((_, i) => <StatSkeleton key={i} />)
          ) : (
            <>
              <StatCard label="Matches Played" value={stats.matchesPlayed || 0} icon={Swords} accent="purple" />
              <StatCard label="Matches Won" value={stats.matchesWon || 0} sub={`of ${stats.matchesPlayed || 0} played`} icon={Trophy} accent="cyan" />
              <StatCard label="Win Rate" value={calcWinRate(stats.matchesWon, stats.matchesPlayed)} icon={TrendingUp} accent="success" />
              <StatCard label="Campus Rank" value={`#${user?.rank || '—'}`} icon={BarChart2Placeholder} accent="warning" />
            </>
          )}
        </div>

        {/* ── Main content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Open lobbies */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-purple-400" /> Open Lobbies
              </h2>
              <Link to="/lobbies" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid gap-4">
                {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : openLobbies.length ? (
              <div className="grid gap-4">
                {openLobbies.map((lobby) => (
                  <LobbyCard
                    key={lobby._id}
                    lobby={lobby}
                    currentUserId={user?._id}
                    onJoin={(id) => joinLobby(id, user?._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-bg-card border border-dashed border-white/10 rounded-xl p-10 text-center">
                <Gamepad2 className="w-8 h-8 text-purple-400/40 mx-auto mb-3" />
                <p className="text-text-muted text-sm">No open lobbies right now</p>
                <button
                  onClick={() => navigate('/lobbies/create')}
                  className="mt-4 text-purple-400 hover:text-purple-300 text-sm font-medium"
                >
                  Create one →
                </button>
              </div>
            )}
          </div>

          {/* Activity feed */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" /> Recent Activity
            </h2>
            <div className="bg-bg-card border border-white/5 rounded-xl p-4">
              <ActivityFeed matches={MOCK_MY_MATCHES} />
            </div>

            {/* Quick actions */}
            <div className="bg-bg-card border border-white/5 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Quick Actions</p>
              {[
                { label: 'Browse Lobbies', to: '/lobbies', icon: Gamepad2, color: 'text-purple-400' },
                { label: 'Tournaments', to: '/tournaments', icon: Trophy, color: 'text-cyan-400' },
                { label: 'Leaderboard', to: '/leaderboard', icon: TrendingUp, color: 'text-warning' },
              ].map(({ label, to, icon: Icon, color }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{label}</span>
                  <ArrowRight className="w-3 h-3 text-text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inline placeholder to avoid circular import
const BarChart2Placeholder = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export default Dashboard;
