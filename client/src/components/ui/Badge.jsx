/**
 * Badge — status / label pill
 * @param {'purple'|'cyan'|'success'|'error'|'warning'|'muted'} variant
 * @param {'sm'|'md'} size
 */
const Badge = ({ children, variant = 'purple', size = 'sm', className = '' }) => {
  const variants = {
    purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    cyan:   'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    success:'bg-success/15 text-success border border-success/30',
    error:  'bg-error/15 text-error border border-error/30',
    warning:'bg-warning/15 text-warning border border-warning/30',
    muted:  'bg-white/5 text-text-muted border border-white/10',
  };
  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
