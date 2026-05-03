import { motion } from 'framer-motion';

/** Pulsing skeleton loader block */
export const Skeleton = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

/** Full card skeleton for lobby/tournament lists */
export const CardSkeleton = () => (
  <div className="bg-bg-card border border-white/5 rounded-xl p-5 space-y-3">
    <Skeleton className="h-5 w-2/3" />
    <Skeleton className="h-4 w-1/3" />
    <div className="flex gap-2 pt-1">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-20" />
    </div>
    <Skeleton className="h-10 w-full mt-2" />
  </div>
);

/** Stat card skeleton */
export const StatSkeleton = () => (
  <div className="bg-bg-card border border-white/5 rounded-xl p-5 space-y-2">
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-8 w-1/3" />
  </div>
);

/** Avatar skeleton */
export const AvatarSkeleton = ({ size = 10 }) => (
  <Skeleton className={`rounded-full w-${size} h-${size}`} />
);

/** Generic page loading spinner */
export const PageLoader = () => (
  <div className="min-h-screen bg-grid flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full"
    />
  </div>
);

/** Empty state */
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-purple-400" />
      </div>
    )}
    <h3 className="font-display text-lg font-semibold text-text-primary mb-2">{title}</h3>
    {description && <p className="text-text-muted text-sm max-w-xs mb-6">{description}</p>}
    {action}
  </div>
);
