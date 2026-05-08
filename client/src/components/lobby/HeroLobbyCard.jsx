import { useNavigate } from 'react-router-dom';
import { Zap, Users, Flame, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCredits, countdown, getInitials } from '../../utils/formatters';
import { GAME_ICONS } from '../../utils/constants';

/**
 * HeroLobbyCard
 * The large featured lobby card at the top of the dashboard.
 * Matches the "Valorant / Popular" hero card from the reference image.
 * All data comes from the lobby object — zero hardcoding.
 */
export default function HeroLobbyCard({ lobby, onJoin, currentUserId }) {
  const navigate = useNavigate();
  if (!lobby) return null;

  const gameIcon   = GAME_ICONS[lobby.game] || '🎮';
  const isJoined   = lobby.currentPlayers?.includes(currentUserId);
  const isFull     = lobby.currentPlayers?.length >= lobby.maxPlayers;
  const canJoin    = lobby.status === 'open' && !isJoined && !isFull;
  const playerList = lobby.lobby_players || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl overflow-hidden bg-wine-card border border-wine-elevated shadow-card-lg flex-shrink-0"
      style={{ minHeight: '200px' }}
    >
      {/* Background game-art gradient (simulates the blended artwork) */}
      <div className="absolute inset-0 bg-gradient-to-r from-wine-card via-wine-card/90 to-crimson/20 pointer-events-none" />
      {/* Faint grid texture */}
      <div className="absolute inset-0 bg-wine-grid opacity-60 pointer-events-none" />
      {/* Right side color burst — simulates game character glow */}
      <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-crimson/30 via-credits/10 to-transparent pointer-events-none" />
      {/* Large game emoji as "artwork" placeholder */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[120px] opacity-20 select-none pointer-events-none">
        {gameIcon}
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col gap-3">
        {/* Top badges row */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2.5 py-1 bg-credits/15 border border-credits/30 rounded-full text-credits text-xs font-semibold">
            <Flame className="w-3 h-3" /> Popular
          </span>
          <span className="px-2 py-1 bg-wine-elevated rounded-full text-white/50 text-xs border border-white/5">
            {lobby.game}
          </span>
          <span className="px-2 py-1 bg-wine-elevated rounded-full text-white/50 text-xs border border-white/5">
            {lobby.college}
          </span>
        </div>

        {/* Game / Lobby title */}
        <h2 className="text-3xl font-bold text-white font-display leading-tight">
          {lobby.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-white/50 max-w-xs leading-relaxed line-clamp-2">
          {lobby.description || `Join this ${lobby.game} lobby. ${lobby.maxPlayers}-player match with ${formatCredits(lobby.bidAmount)} on the line.`}
        </p>

        {/* Player avatars + watcher count */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {playerList.slice(0, 4).map((p, i) => (
              <div
                key={p.user_id || i}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-crimson to-credits border-2 border-wine-card flex items-center justify-center text-white text-[10px] font-bold"
              >
                {getInitials(p.profiles?.name || '?')}
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({ length: Math.max(0, lobby.maxPlayers - playerList.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="w-7 h-7 rounded-full bg-wine-elevated border-2 border-wine-card border-dashed" />
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-wine-elevated border border-white/10 rounded-full text-white/60 text-xs hover:border-crimson hover:text-white transition-colors">
            <Eye className="w-3 h-3" />
            {playerList.length}/{lobby.maxPlayers} joined · {countdown(lobby.scheduledAt)}
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-1">
          {canJoin ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onJoin?.(lobby._id)}
              className="flex items-center gap-2 px-5 py-2.5 bg-crimson hover:bg-crimson-light rounded-xl text-white font-semibold text-sm transition-colors shadow-glow-crimson-sm"
            >
              <Zap className="w-4 h-4 text-credits" />
              Join — {formatCredits(lobby.bidAmount)}
            </motion.button>
          ) : isJoined ? (
            <span className="px-4 py-2 bg-cyan-500/15 border border-cyan-500/30 rounded-xl text-cyan-400 font-semibold text-sm">
              You're In ✓
            </span>
          ) : (
            <span className="px-4 py-2 bg-wine-elevated border border-white/10 rounded-xl text-white/40 text-sm">
              {lobby.status === 'completed' ? 'Completed' : isFull ? 'Full' : 'Closed'}
            </span>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/lobbies/${lobby._id}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-white/15 hover:border-white/40 rounded-xl text-white/70 hover:text-white font-semibold text-sm transition-colors"
          >
            <Users className="w-4 h-4" />
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
