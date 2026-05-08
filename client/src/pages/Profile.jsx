import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit3, Mail, GraduationCap, Calendar, Gamepad2, Trophy, TrendingUp, Zap, Check } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Modal from '../components/ui/Modal';
import useAuth from '../hooks/useAuth';
import useMyMatches from '../hooks/useMyMatches';
import { getInitials, timeFromNow, calcWinRate } from '../utils/formatters';
import { GAME_ICONS } from '../utils/constants';

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-wine-card border border-wine-elevated rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color.bg}`}>
        <Icon className={`w-5 h-5 ${color.text}`} />
      </div>
      <div>
        <p className="text-white/40 text-xs">{label}</p>
        <p className={`font-bold text-xl ${color.text}`}>{value}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { matches, isLoading }  = useMyMatches();
  const [editModal, setEditModal] = useState(false);
  const [form, setForm]           = useState({ name: user?.name || '', college: user?.college || '' });
  const [saving, setSaving]       = useState(false);

  const stats    = user?.stats || {};
  const winRate  = calcWinRate(stats.matchesWon, stats.matchesPlayed);

  // Count games played from match history
  const gameCounts = matches.reduce((acc, m) => {
    acc[m.game] = (acc[m.game] || 0) + 1;
    return acc;
  }, {});

  const handleSave = async () => {
    setSaving(true);
    await updateProfile?.(form);
    setSaving(false);
    setEditModal(false);
  };

  return (
    <AppShell>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-wine-elevated flex-shrink-0">
        <h1 className="text-white font-bold text-lg flex items-center gap-2">
          <User className="w-5 h-5 text-crimson" /> Profile
        </h1>
        <button
          onClick={() => { setForm({ name: user?.name || '', college: user?.college || '' }); setEditModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-wine-card border border-wine-elevated hover:border-crimson/50 rounded-xl text-white/60 hover:text-white text-sm transition-colors"
        >
          <Edit3 className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

        {/* ── PROFILE HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-wine-card border border-wine-elevated rounded-2xl p-6 flex items-center gap-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-crimson-glow pointer-events-none opacity-50" />
          {/* Large avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-crimson to-credits flex items-center justify-center text-white text-2xl font-bold border-4 border-wine-elevated flex-shrink-0 shadow-glow-crimson-sm">
            {getInitials(user?.name || '?')}
          </div>
          <div className="relative">
            <h2 className="text-white font-bold text-2xl">{user?.name || '—'}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-white/40 text-sm">
                <GraduationCap className="w-4 h-4" /> {user?.college || '—'}
              </span>
              <span className="flex items-center gap-1 text-white/40 text-sm">
                <Mail className="w-4 h-4" /> {user?.email || '—'}
              </span>
              <span className="flex items-center gap-1 text-white/40 text-sm">
                <Calendar className="w-4 h-4" /> Joined {new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) || '—'}
              </span>
            </div>
            <span className="mt-3 inline-block px-2.5 py-1 bg-crimson/15 border border-crimson/30 rounded-full text-crimson text-xs font-semibold">
              Player
            </span>
          </div>
        </motion.div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Matches" value={stats.matchesPlayed || 0} icon={Gamepad2} color={{ bg: 'bg-purple-500/15', text: 'text-purple-400' }} />
          <StatCard label="Wins"    value={stats.matchesWon    || 0} icon={Trophy}   color={{ bg: 'bg-credits/15',    text: 'text-credits'    }} />
          <StatCard label="Win Rate"value={winRate}                  icon={TrendingUp}color={{ bg: 'bg-success/15',   text: 'text-success'    }} />
          <StatCard label="Credits" value={`${user?.credits || 0} ⚡`}icon={Zap}     color={{ bg: 'bg-crimson/15',   text: 'text-crimson'    }} />
        </div>

        {/* ── MATCH HISTORY + DETAILS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Match history — 60% */}
          <div className="lg:col-span-2 bg-wine-card border border-wine-elevated rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-wine-elevated">
              <h2 className="text-white font-semibold text-sm">Match History</h2>
            </div>
            {isLoading ? (
              <div className="p-5 space-y-3">
                {Array(4).fill(0).map((_, i) => <div key={i} className="h-14 bg-wine-elevated animate-pulse rounded-xl" />)}
              </div>
            ) : matches.length === 0 ? (
              <div className="p-8 text-center text-white/30 text-sm">No matches yet — join a lobby!</div>
            ) : (
              <div>
                {matches.slice(0, 6).map((match, i) => {
                  const isWon  = match.result === 'won';
                  const isLost = match.result === 'lost';
                  return (
                    <div
                      key={match._id || i}
                      className={`flex items-center gap-4 px-5 py-3.5 border-b border-wine-elevated last:border-0 hover:bg-wine-elevated transition-colors
                        ${isWon ? 'border-l-2 border-l-success' : isLost ? 'border-l-2 border-l-error' : ''}`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-wine-elevated flex items-center justify-center text-lg flex-shrink-0">
                        {GAME_ICONS[match.game] || '🎮'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{match.title}</p>
                        <p className="text-white/30 text-xs">{match.game}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex-shrink-0
                        ${isWon  ? 'bg-success/15 border-success/30 text-success' :
                          isLost ? 'bg-error/15   border-error/30   text-error'   :
                                   'bg-white/10   border-white/10   text-white/40'}`}>
                        {match.result || 'Pending'}
                      </span>
                      <p className={`font-bold text-sm flex-shrink-0 ${match.creditsChange > 0 ? 'text-credits' : match.creditsChange < 0 ? 'text-error' : 'text-white/30'}`}>
                        {match.creditsChange > 0 ? '+' : ''}{match.creditsChange || 0} ⚡
                      </p>
                      <p className="text-white/25 text-[10px] flex-shrink-0">{timeFromNow(match.date)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Side details — 40% */}
          <div className="space-y-4">
            {/* Games played */}
            <div className="bg-wine-card border border-wine-elevated rounded-2xl p-5">
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-crimson" /> Games Played
              </h3>
              {Object.entries(gameCounts).length === 0 ? (
                <p className="text-white/30 text-xs">No games yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(gameCounts).map(([game, count]) => (
                    <span key={game} className="flex items-center gap-1.5 px-3 py-1.5 bg-wine-elevated border border-wine-card rounded-full text-xs text-white/60">
                      {GAME_ICONS[game] || '🎮'} {game}
                      <span className="text-white/30">({count})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Account details */}
            <div className="bg-wine-card border border-wine-elevated rounded-2xl p-5 space-y-3">
              <h3 className="text-white font-semibold text-sm mb-1">Account Details</h3>
              {[
                { label: 'Email',    value: user?.email,   icon: Mail           },
                { label: 'College',  value: user?.college, icon: GraduationCap  },
                { label: 'Role',     value: 'Player',      icon: User           },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-white/30 flex-shrink-0" />
                  <div>
                    <p className="text-white/30 text-[10px]">{label}</p>
                    <p className="text-white text-xs font-medium">{value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── EDIT MODAL ── */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Profile" size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-white/50 text-xs mb-1.5 block">Full Name</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-wine-elevated border border-wine-card focus:border-crimson/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-white/50 text-xs mb-1.5 block">College</label>
            <input
              value={form.college}
              onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
              className="w-full bg-wine-elevated border border-wine-card focus:border-crimson/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => setEditModal(false)} className="flex-1 py-2.5 bg-wine-elevated border border-wine-card rounded-xl text-white/50 text-sm hover:text-white transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-crimson hover:bg-crimson-light rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
