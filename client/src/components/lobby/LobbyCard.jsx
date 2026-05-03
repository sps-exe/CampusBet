import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Zap, Clock, Eye } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatCredits, getLobbyStatus, countdown, slotsLabel } from '../../utils/formatters';
import { GAME_ICONS } from '../../utils/constants';

/**
 * LobbyCard — displays a single lobby in the browse grid
 */
const LobbyCard = ({ lobby, onJoin, currentUserId }) => {
  const navigate = useNavigate();
  const status = getLobbyStatus(lobby.status);
  const gameIcon = GAME_ICONS[lobby.game] || '🎮';
  const filledSlots = lobby.currentPlayers?.length || 0;
  const isJoined = lobby.currentPlayers?.includes(currentUserId);
  const isFull = filledSlots >= lobby.maxPlayers;
  const canJoin = lobby.status === 'open' && !isJoined && !isFull;
  const spectatorCount = lobby.spectatorBids?.length || 0;

  const statusVariant = {
    open: 'success',
    'in-progress': 'warning',
    completed: 'muted',
    cancelled: 'error',
  }[lobby.status] || 'muted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-bg-card border border-white/5 rounded-xl overflow-hidden flex flex-col hover:border-purple-500/30 transition-colors"
    >
      {/* Header strip */}
      <div className="px-5 pt-5 pb-3 border-b border-white/5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-text-primary text-base leading-snug line-clamp-2 flex-1">
            {gameIcon} {lobby.title}
          </h3>
          <Badge variant={statusVariant} size="sm">{status.label}</Badge>
        </div>
        <p className="text-xs text-text-muted">{lobby.college} · hosted by {lobby.host?.name}</p>
      </div>

      {/* Meta info */}
      <div className="px-5 py-3 flex flex-col gap-2 flex-1">
        {/* Bid + slots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-cyan-400">
            <Zap className="w-4 h-4" />
            {formatCredits(lobby.bidAmount, false)} ⚡ bid
          </div>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <Users className="w-3 h-3" />
            {slotsLabel(filledSlots, lobby.maxPlayers)}
          </div>
        </div>

        {/* Slot bar */}
        <div className="w-full bg-bg-elevated rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all"
            style={{ width: `${(filledSlots / lobby.maxPlayers) * 100}%` }}
          />
        </div>

        {/* Schedule + spectators */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lobby.status === 'open' ? countdown(lobby.scheduledAt) : status.label}
          </span>
          {spectatorCount > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {spectatorCount} watching
            </span>
          )}
        </div>

        {/* Description snippet */}
        {lobby.description && (
          <p className="text-xs text-text-muted line-clamp-2 mt-1">{lobby.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 flex gap-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/lobbies/${lobby._id}`)}
        >
          View
        </Button>
        {canJoin && (
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onJoin?.(lobby._id)}
          >
            Join
          </Button>
        )}
        {isJoined && (
          <Badge variant="cyan" size="md" className="flex-1 justify-center">Joined ✓</Badge>
        )}
        {!canJoin && !isJoined && lobby.status === 'open' && (
          <Button variant="ghost" size="sm" className="flex-1" disabled>Full</Button>
        )}
      </div>
    </motion.div>
  );
};

export default LobbyCard;
