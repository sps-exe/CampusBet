/**
 * CampusArena — Card Component
 *
 * @prop {boolean} hover - Enable purple glow on hover
 * @prop {boolean} gradient - Show gradient border (purple→cyan)
 * @prop {boolean} glass - Glassmorphism style
 * @prop {string} className - Additional classes
 * @prop {React.ReactNode} children
 */

const Card = ({
  hover = false,
  gradient = false,
  glass = false,
  className = '',
  children,
  onClick,
  ...rest
}) => {
  const baseClass = glass
    ? 'card-glass'
    : gradient
    ? 'card-gradient-border'
    : 'card-base';

  const hoverClass = hover ? 'card-hover cursor-pointer' : '';

  return (
    <div
      className={`${baseClass} ${hoverClass} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
