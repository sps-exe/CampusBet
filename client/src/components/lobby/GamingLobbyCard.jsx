import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Users, Play } from 'lucide-react';
import { formatCredits } from '../../utils/formatters';
import { GAME_ICONS } from '../../utils/constants';

/**
 * GamingLobbyCard — Matches the "New Games" style cards from the reference image.
 * Vertical card with game emoji as artwork, title, description, action button.
 * All data is dynamic from the lobby object.
 */
export default function GamingLobbyCard({ lobby, currentUserId, onJoin, index = 0 }) {
  const navigate = useNavigate();
  if (!lobby) return null;

  const gameIcon = GAME_ICONS[lobby.game] || '🎮';
  const isJoined = lobby.currentPlayers?.includes(currentUserId);
  const isFull   = (lobby.currentPlayers?.length || 0) >= lobby.maxPlayers;
  const canJoin  = lobby.status === 'open' && !isJoined && !isFull;

  const STATUS_COLORS = {
    open:        'bg-success/15 text-success border-success/30',
    'in-progress':'bg-ingame/15 text-ingame border-ingame/30',
    completed:   'bg-white/10 text-white/40 border-white/10',
  };

  // Subtle per-card background tint variation for visual interest
  const TINTS = [
    'from-crimson/25 to-wine-elevated',
    'from-credits/20 to-wine-elevated',
    'from-purple-600/25 to-wine-elevated',
  ];
  const tint = TINTS[index % TINTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => navigate(`/lobbies/${lobby._id}`)}
      className="relative rounded-2xl overflow-hidden bg-wine-card border border-wine-elevated cursor-pointer group flex-shrink-0 w-48"
      style={{ minHeight: '220px' }}
    >
      {/* Background gradient art */}
      <div className={`absolute inset-0 bg-gradient-to-b ${tint} pointer-events-none`} />

      {/* Large emoji "artwork" */}
      <div className="absolute top-4 right-4 text-[64px] opacity-30 select-none group-hover:opacity-50 transition-opacity">
        {gameIcon}
      </div>

      {/* Play button top-left */}
      <button
        onClick={e => { e.stopPropagation(); canJoin && onJoin?.(lobby._id); }}
        className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10
          ${canJoin
            ? 'bg-crimson text-white shadow-glow-crimson-sm group-hover:scale-110'
            : 'bg-wine-elevated text-white/30'
          }`}
      >
        <Play className="w-3.5 h-3.5" fill={canJoin ? 'white' : 'none'} />
      </button>

      {/* Status badge top-right */}
      <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[lobby.status] || STATUS_COLORS.completed} z-10`}>
        {lobby.status === 'in-progress' ? 'Live' : lobby.status === 'open' ? 'Open' : 'Done'}
      </span>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-wine-card via-wine-card/90 to-transparent">
        <h3 className="font-bold text-white text-sm leading-tight mb-0.5 line-clamp-1">
          {lobby.title}
        </h3>
        <p className="text-white/45 text-[11px] line-clamp-2 leading-relaxed mb-2">
          {lobby.description || `${lobby.game} · ${lobby.maxPlayers}-player match`}
        </p>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-credits text-[11px] font-semibold">
            <Zap className="w-3 h-3" />
            {formatCredits(lobby.bidAmount, false)}
          </span>
          <span className="flex items-center gap-1 text-white/40 text-[11px]">
            <Users className="w-3 h-3" />
            {lobby.currentPlayers?.length || 0}/{lobby.maxPlayers}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
