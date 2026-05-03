import { motion } from 'framer-motion';
import { Zap, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Gift } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { formatCredits, formatCreditChange, timeFromNow } from '../utils/formatters';
import { MOCK_MY_MATCHES } from '../utils/mockData';

// Mock transactions derived from match history
const buildTransactions = (matches, credits) => {
  const txns = matches.map((m) => ({
    _id: m._id,
    type: m.result === 'won' ? 'credit' : 'debit',
    label: `${m.game} vs ${m.opponent?.name}`,
    amount: m.creditsChange,
    date: m.date,
    icon: m.result === 'won' ? TrendingUp : TrendingDown,
  }));
  // Add starter credit
  txns.push({ _id: 'starter', type: 'credit', label: 'Starter Credits — Welcome bonus', amount: 500, date: new Date(Date.now() - 864e5 * 7).toISOString(), icon: Gift });
  return txns.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const Wallet = () => {
  const { user } = useAuth();
  const transactions = buildTransactions(MOCK_MY_MATCHES, user?.credits);

  const totalWon = transactions.filter(t => t.type === 'credit' && t._id !== 'starter').reduce((s, t) => s + t.amount, 0);
  const totalSpent = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen bg-grid pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            <span className="gradient-text">Wallet</span>
          </h1>
          <p className="text-text-muted text-sm mt-1">Campus credits — virtual currency only</p>
        </div>

        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-bg-card border border-purple-500/20 rounded-2xl overflow-hidden p-8"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <p className="text-text-muted text-sm mb-2">Current Balance</p>
            <div className="flex items-end gap-3 mb-6">
              <span className="font-display text-5xl font-black gradient-text">{(user?.credits || 0).toLocaleString('en-IN')}</span>
              <span className="text-2xl font-bold text-cyan-400 mb-1">⚡</span>
            </div>
            <div className="flex gap-6">
              {[
                { label: 'Total Won', value: `+${totalWon}`, color: 'text-success', icon: TrendingUp },
                { label: 'Total Bid', value: `-${totalSpent}`, color: 'text-error', icon: TrendingDown },
              ].map(({ label, value, color, icon: Icon }) => (
                <div key={label}>
                  <p className="text-xs text-text-muted mb-0.5">{label}</p>
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    <span className={`font-display font-bold ${color}`}>{value} ⚡</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Info banner */}
        <div className="bg-bg-elevated border border-white/5 rounded-xl p-4 flex items-start gap-3">
          <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-muted leading-relaxed">
            Campus credits are <strong className="text-text-secondary">virtual currency</strong> with no monetary value.
            They can only be used within CampusBet to join matches and tournaments. Credits are earned by winning matches and cannot be withdrawn or exchanged for real money.
          </p>
        </div>

        {/* Transaction history */}
        <div className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="font-display font-semibold">Transaction History</h2>
          </div>
          <div className="divide-y divide-white/5">
            {transactions.map((txn, i) => {
              const isCredit = txn.type === 'credit';
              return (
                <motion.div
                  key={txn._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isCredit ? 'bg-success/10' : 'bg-error/10'}`}>
                    {isCredit
                      ? <ArrowDownLeft className="w-4 h-4 text-success" />
                      : <ArrowUpRight className="w-4 h-4 text-error" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{txn.label}</p>
                    <p className="text-xs text-text-muted">{timeFromNow(txn.date)}</p>
                  </div>
                  <span className={`text-sm font-bold font-display flex-shrink-0 ${isCredit ? 'text-success' : 'text-error'}`}>
                    {formatCreditChange(txn.amount)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
