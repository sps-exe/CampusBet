import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Zap, Calendar, Trophy } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatCredits, getTournamentStatus, formatDateShort } from '../../utils/formatters';
import { GAME_ICONS } from '../../utils/constants';

const TournamentCard = ({ tournament, currentUserId }) => {
  const navigate = useNavigate();
  const status = getTournamentStatus(tournament.status);
  const gameIcon = GAME_ICONS[tournament.game] || '🎮';
  const filled = tournament.participants?.length || 0;
  const isRegistered = tournament.participants?.includes(currentUserId);

  const statusVariant = {
    upcoming: 'purple',
    live: 'success',
    completed: 'muted',
    cancelled: 'error',
  }[tournament.status] || 'muted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-bg-card border border-white/5 rounded-xl overflow-hidden flex flex-col hover:border-purple-500/30 transition-colors"
    >
      {/* Top gradient band */}
      <div className="h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Title + status */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-text-primary text-base leading-snug flex-1 line-clamp-2">
            {gameIcon} {tournament.title}
          </h3>
          <Badge variant={statusVariant} size="sm">{status.label}</Badge>
        </div>

        <p className="text-xs text-text-muted">{tournament.college} · {tournament.format?.replace('-', ' ')}</p>

        {/* Prize pool */}
        <div className="flex items-center gap-1.5 text-sm font-bold text-cyan-400">
          <Trophy className="w-4 h-4" />
          {formatCredits(tournament.prizePool)} prize pool
        </div>

        {/* Slots */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {filled} / {tournament.maxParticipants} registered</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {formatCredits(tournament.entryCredits, false)} entry</span>
          </div>
          <div className="w-full bg-bg-elevated rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
              style={{ width: `${Math.min((filled / tournament.maxParticipants) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <Calendar className="w-3 h-3" />
          {formatDateShort(tournament.startDate)} → {formatDateShort(tournament.endDate)}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/tournaments/${tournament._id}`)}>
          Details
        </Button>
        {isRegistered ? (
          <Badge variant="cyan" size="md" className="flex-1 justify-center">Registered ✓</Badge>
        ) : tournament.status === 'upcoming' && (
          <Button variant="primary" size="sm" className="flex-1" onClick={() => navigate(`/tournaments/${tournament._id}`)}>
            Register
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default TournamentCard;
