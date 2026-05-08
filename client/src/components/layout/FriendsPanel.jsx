// FriendsPanel — right sidebar showing who is online RIGHT NOW.
// Uses Supabase Realtime Presence (no extra DB tables needed).

import usePresence from '../../hooks/usePresence';
import { getInitials } from '../../utils/formatters';

const AVATAR_COLORS = [
  'from-crimson to-credits',
  'from-purple-600 to-cyan-500',
  'from-credits to-ingame',
  'from-crimson to-purple-600',
  'from-cyan-500 to-success',
];

function OnlineAvatar({ player, index }) {
  const initials   = getInitials(player.name);
  const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <div className="relative group cursor-pointer flex-shrink-0">
      {/* Avatar circle */}
      <div
        className={`w-10 h-10 rounded-full bg-gradient-to-br ${colorClass}
          flex items-center justify-center text-white text-xs font-bold
          border-2 border-wine-deepest hover:border-crimson transition-colors`}
      >
        {initials}
      </div>

      {/* Green online dot */}
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full
        bg-success border-2 border-wine-deepest animate-pulse" />

      {/* Hover tooltip */}
      <span className="absolute right-full mr-3 px-2 py-1 bg-wine-card text-white
        text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none
        whitespace-nowrap z-50 border border-wine-elevated transition-opacity">
        {player.name}
        <span className="ml-1.5 text-[10px] text-success">● Online</span>
      </span>
    </div>
  );
}

export default function FriendsPanel() {
  const { online } = usePresence();

  return (
    <aside className="w-[68px] min-h-screen bg-wine-deepest flex flex-col
      items-center py-4 gap-3 border-l border-wine-card flex-shrink-0">

      {/* Label */}
      <p className="text-[9px] font-semibold text-white/25 uppercase tracking-widest mb-1">
        Online
      </p>

      {/* Online count badge */}
      {online.length > 0 && (
        <span className="px-1.5 py-0.5 bg-success/20 border border-success/40
          rounded-full text-success text-[9px] font-bold">
          {online.length}
        </span>
      )}

      {/* Player avatars */}
      <div className="flex flex-col items-center gap-3 flex-1 overflow-y-auto
        scrollbar-none">
        {online.length === 0 ? (
          // Empty state — ghost slots while waiting
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full bg-wine-card border border-dashed
                border-wine-elevated opacity-20"
            />
          ))
        ) : (
          online.map((player, i) => (
            <OnlineAvatar key={player.id} player={player} index={i} />
          ))
        )}
      </div>

      {/* Footer divider */}
      <div className="w-8 h-px bg-wine-card my-1" />
      <div
        title="Invite friends coming soon"
        className="w-9 h-9 rounded-full bg-wine-card border border-wine-elevated
          flex items-center justify-center text-white/30 text-sm
          hover:border-crimson hover:text-crimson transition-colors cursor-pointer"
      >
        +
      </div>
    </aside>
  );
}
