import { motion } from 'framer-motion';
import { getInitials } from '../../utils/formatters';

/**
 * Avatar — user avatar with initials fallback
 */
const Avatar = ({ user, size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const initials = getInitials(user?.name || '?');

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}>
      {user?.avatarUrl ? (
        <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
      ) : (
        <span className="font-display">{initials}</span>
      )}
    </div>
  );
};

/**
 * ParticipantList — grid of participants with slot count
 */
const ParticipantList = ({ participants = [], maxParticipants = 16, resolvedUsers = [] }) => {
  const slots = Array.from({ length: maxParticipants }, (_, i) => resolvedUsers[i] || null);
  const filled = participants.length;
  const remaining = maxParticipants - filled;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary font-medium">{filled} / {maxParticipants} registered</span>
        {remaining > 0 && (
          <span className="text-text-muted">{remaining} slots open</span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {slots.map((user, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-2.5 p-3 rounded-xl border ${
              user
                ? 'bg-bg-elevated border-white/10'
                : 'border-dashed border-white/10 bg-transparent'
            }`}
          >
            {user ? (
              <>
                <Avatar user={user} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">{user.name}</p>
                  <p className="text-xs text-text-muted truncate">{user.college}</p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 opacity-30">
                <div className="w-8 h-8 rounded-full border border-dashed border-white/30" />
                <span className="text-xs text-text-muted">Empty slot</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export { Avatar };
export default ParticipantList;
