import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Input — styled form input with label and error state
 */
const Input = forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  hint,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full bg-bg-elevated border rounded-lg px-4 py-2.5 text-sm text-text-primary
            placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:border-transparent
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error
              ? 'border-error focus:ring-error/50'
              : 'border-white/10 focus:ring-purple-500/50 hover:border-white/20'}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-error">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-text-muted">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
