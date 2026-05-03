import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Button — primary UI button component
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon = null,
  onClick,
  type = 'button',
  className = '',
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary';

  const variants = {
    primary:
      'bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-500 shadow-glow-purple-sm hover:shadow-glow-purple active:scale-95',
    secondary:
      'bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-500 hover:shadow-glow-cyan active:scale-95',
    outline:
      'border border-purple-500/60 text-purple-400 hover:bg-purple-500/10 focus:ring-purple-500 active:scale-95',
    ghost:
      'text-text-secondary hover:text-text-primary hover:bg-white/5 focus:ring-white/20 active:scale-95',
    danger:
      'bg-error hover:bg-red-700 text-white focus:ring-error active:scale-95',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
