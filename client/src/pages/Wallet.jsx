import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, TrendingDown, Trophy, Gamepad2 } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import useAuth from '../hooks/useAuth';
import useMyMatches from '../hooks/useMyMatches';
import { timeFromNow, calcWinRate } from '../utils/formatters';

function StatCard({ label, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-wine-card border border-wine-elevated rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${colorClass.replace('text-', 'bg-').replace('-400', '/15').replace('-500', '/15')} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
      <div>
        <p className="text-white/40 text-xs">{label}</p>
        <p className={`font-bold text-xl ${colorClass}`}>{value}</p>
      </div>
    </div>
  );
}

export default function Wallet() {
  const { user }                     = useAuth();
  const { matches, isLoading }       = useMyMatches();
  const [page, setPage]              = useState(8);

  const won  = matches.filter(m => m.result === 'won').reduce((s, m) => s + (m.creditsChange || 0), 0);
  const lost = matches.filter(m => m.result === 'lost').reduce((s, m) => s + Math.abs(m.creditsChange || 0), 0);

  const txRows = matches.slice(0, page);
  const hasMore = matches.length > page;

  function txIcon(result) {
    if (result === 'won')    return { icon: Trophy, bg: 'bg-credits/15', color: 'text-credits' };
    if (result === 'lost')   return { icon: Zap,    bg: 'bg-error/15',   color: 'text-error'   };
    return                          { icon: Gamepad2,bg: 'bg-purple-500/15', color: 'text-purple-400' };
  }

  return (
    <AppShell>
      {/* Top bar */}
      <div className="px-6 py-4 border-b border-wine-elevated flex-shrink-0">
        <h1 className="text-white font-bold text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-credits" /> Wallet
        </h1>
        <p className="text-white/40 text-xs">Campus credits — no real money</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

        {/* ── BALANCE HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-wine-card border border-credits/20 rounded-2xl p-8 text-center relative overflow-hidden"
        >
          {/* Glow blob */}
          <div className="absolute inset-0 bg-credits-glow pointer-events-none" />
          <Zap className="w-10 h-10 text-credits mx-auto mb-3 opacity-80" />
          <p className="text-white/50 text-sm mb-1">Current Balance</p>
          <p className="text-credits font-bold text-5xl font-display">{user?.credits || 0} ⚡</p>
          <p className="text-white/30 text-xs mt-2">Campus credits only · No real money involved</p>

          {/* Mini stats */}
          <div className="flex gap-4 mt-6">
            <div className="flex-1 bg-success/10 border border-success/20 rounded-xl p-4">
              <TrendingUp className="w-4 h-4 text-success mx-auto mb-1" />
              <p className="text-success font-bold text-lg">+{won} ⚡</p>
              <p className="text-white/40 text-xs">Total Earned</p>
            </div>
            <div className="flex-1 bg-error/10 border border-error/20 rounded-xl p-4">
              <TrendingDown className="w-4 h-4 text-error mx-auto mb-1" />
              <p className="text-error font-bold text-lg">-{lost} ⚡</p>
              <p className="text-white/40 text-xs">Total Spent</p>
            </div>
          </div>
        </motion.div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Matches"  value={user?.stats?.matchesPlayed || 0}  icon={Gamepad2}    colorClass="text-purple-400" />
          <StatCard label="Matches Won"    value={user?.stats?.matchesWon    || 0}  icon={Trophy}      colorClass="text-credits"    />
          <StatCard label="Win Rate"       value={calcWinRate(user?.stats?.matchesWon, user?.stats?.matchesPlayed)} icon={TrendingUp} colorClass="text-success" />
          <StatCard label="Total Credits"  value={`${user?.credits || 0} ⚡`}       icon={Zap}         colorClass="text-crimson"    />
        </div>

        {/* ── TRANSACTION LIST ── */}
        <div className="bg-wine-card border border-wine-elevated rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-wine-elevated">
            <h2 className="text-white font-semibold text-sm">Transactions</h2>
          </div>

          {isLoading ? (
            <div className="p-5 space-y-3">
              {Array(5).fill(0).map((_, i) => <div key={i} className="h-14 bg-wine-elevated animate-pulse rounded-xl" />)}
            </div>
          ) : matches.length === 0 ? (
            <div className="p-10 text-center text-white/30 text-sm">No transactions yet</div>
          ) : (
            <div>
              {txRows.map((match, i) => {
                const { icon: Icon, bg, color } = txIcon(match.result);
                const isCredit = match.creditsChange > 0;
                return (
                  <motion.div
                    key={match._id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-4 px-5 py-4 border-b border-wine-elevated last:border-0 hover:bg-wine-elevated transition-colors
                      ${isCredit ? 'border-l-2 border-l-success' : match.result === 'lost' ? 'border-l-2 border-l-error' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{match.title}</p>
                      <p className="text-white/40 text-xs">Match result · {match.result || 'Pending'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-bold text-sm ${isCredit ? 'text-success' : match.creditsChange < 0 ? 'text-error' : 'text-white/40'}`}>
                        {match.creditsChange > 0 ? '+' : ''}{match.creditsChange || 0} ⚡
                      </p>
                      <p className="text-white/30 text-[10px]">{timeFromNow(match.date)}</p>
                    </div>
                  </motion.div>
                );
              })}
              {hasMore && (
                <div className="p-4 text-center">
                  <button
                    onClick={() => setPage(p => p + 8)}
                    className="text-crimson text-sm hover:text-crimson-light transition-colors"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="bg-wine-elevated border border-wine-card rounded-xl p-4 flex gap-3">
          <Zap className="w-4 h-4 text-credits mt-0.5 flex-shrink-0" />
          <div className="text-white/40 text-xs space-y-1">
            <p>• Credits are virtual campus tokens — never real money</p>
            <p>• Credits are earned by winning skill-based matches</p>
            <p>• Credits cannot be redeemed for cash or transferred outside the platform</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
