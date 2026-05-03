import { motion } from 'framer-motion';
import { Trophy, Sword, Clock, Zap } from 'lucide-react';
import { formatCreditChange, timeFromNow } from '../../utils/formatters';
import { GAME_ICONS } from '../../utils/constants';

const activityIcon = (type) => {
  if (type === 'won')  return { icon: Trophy, color: 'text-success',  bg: 'bg-success/10'  };
  if (type === 'lost') return { icon: Sword,  color: 'text-error',    bg: 'bg-error/10'    };
  return                      { icon: Clock,  color: 'text-text-muted', bg: 'bg-white/5'   };
};

/**
 * ActivityFeed — recent match history list
 * @param {Array} matches - array of match objects
 */
const ActivityFeed = ({ matches = [] }) => {
  if (!matches.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Zap className="w-8 h-8 text-purple-400/50 mb-3" />
        <p className="text-text-muted text-sm">No matches yet. Join a lobby to start!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {matches.map((match, i) => {
        const { icon: Icon, color, bg } = activityIcon(match.result);
        const gameIcon = GAME_ICONS[match.game] || '🎮';
        const creditDelta = formatCreditChange(match.creditsChange);
        const isWin = match.result === 'won';

        return (
          <motion.div
            key={match._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-3 rounded-xl bg-bg-elevated hover:bg-white/5 transition-colors"
          >
            {/* Icon */}
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {gameIcon} vs {match.opponent?.name || 'Unknown'}
              </p>
              <p className="text-xs text-text-muted">{timeFromNow(match.date)}</p>
            </div>

            {/* Credit change */}
            <span className={`text-sm font-bold font-display flex-shrink-0 ${isWin ? 'text-success' : 'text-error'}`}>
              {creditDelta}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
