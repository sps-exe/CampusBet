/**
 * CampusArena — Button Component
 *
 * @prop {'primary'|'secondary'|'outline'|'ghost'|'accent'} variant
 * @prop {'sm'|'md'|'lg'} size
 * @prop {boolean} loading - Shows a spinner and disables interaction
 * @prop {boolean} disabled
 * @prop {boolean} fullWidth
 * @prop {React.ReactNode} icon - Icon to show before children
 * @prop {string} className - Additional classes
 * @prop {React.ReactNode} children
 * @prop {Function} onClick
 */

import { Loader2 } from 'lucide-react';

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  className = '',
  children,
  onClick,
  type = 'button',
  ...rest
}) => {
  const variantClass = `btn-${variant}`;
  const sizeClass    = `btn-${size}`;
  const widthClass   = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} className="animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
