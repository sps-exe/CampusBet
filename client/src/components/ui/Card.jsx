import { motion } from 'framer-motion';

/**
 * Card — glass-style container component
 * @param {boolean} hover - Enable hover glow animation
 * @param {boolean} gradient - Add subtle gradient overlay
 * @param {'purple'|'cyan'|'none'} glowColor - Border glow color
 */
const Card = ({
  children,
  hover = false,
  gradient = false,
  glowColor = 'none',
  className = '',
  onClick,
}) => {
  const glowClasses = {
    purple: 'border-glow-purple',
    cyan: 'border-glow-cyan',
    none: 'border border-white/5',
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -2, scale: 1.005 } : {}}
      transition={{ duration: 0.2 }}
      className={`
        relative bg-bg-card rounded-xl overflow-hidden
        ${glowClasses[glowColor]}
        ${hover ? 'cursor-pointer' : ''}
        ${gradient
          ? 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/5 before:to-cyan-500/5 before:pointer-events-none'
          : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;
