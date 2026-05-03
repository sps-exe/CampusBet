/**
 * CampusArena — Badge Component
 *
 * @prop {'purple'|'cyan'|'success'|'error'|'warning'} variant
 * @prop {React.ReactNode} icon - Optional icon before label
 * @prop {string} className
 * @prop {React.ReactNode} children
 */

const Badge = ({
  variant = 'purple',
  icon,
  className = '',
  children,
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
