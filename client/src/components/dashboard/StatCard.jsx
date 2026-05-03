import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * StatCard — dashboard metric tile
 * @param {string} label - e.g. "Matches Won"
 * @param {string|number} value - e.g. "22"
 * @param {string} [sub] - sub-label e.g. "of 34 played"
 * @param {React.ElementType} [icon] - lucide icon
 * @param {'purple'|'cyan'|'success'|'warning'} [accent]
 * @param {number} [trend] - positive = up, negative = down, 0 = flat
 */
const StatCard = ({ label, value, sub, icon: Icon, accent = 'purple', trend }) => {
  const accents = {
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'text-purple-400', val: 'text-purple-400' },
    cyan:   { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   icon: 'text-cyan-400',   val: 'text-cyan-400' },
    success:{ bg: 'bg-success/10',    border: 'border-success/20',    icon: 'text-success',    val: 'text-success' },
    warning:{ bg: 'bg-warning/10',    border: 'border-warning/20',    icon: 'text-warning',    val: 'text-warning' },
  };
  const c = accents[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-bg-card border ${c.border} rounded-xl p-5 flex flex-col gap-3`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted font-medium">{label}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${c.icon}`} />
          </div>
        )}
      </div>
      <div>
        <p className={`font-display text-3xl font-bold ${c.val}`}>{value}</p>
        {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 text-xs">
          {trend > 0 ? (
            <><TrendingUp className="w-3 h-3 text-success" /><span className="text-success">+{trend}% vs last week</span></>
          ) : trend < 0 ? (
            <><TrendingDown className="w-3 h-3 text-error" /><span className="text-error">{trend}% vs last week</span></>
          ) : (
            <><Minus className="w-3 h-3 text-text-muted" /><span className="text-text-muted">No change</span></>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
