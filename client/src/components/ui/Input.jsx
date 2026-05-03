/**
 * CampusArena — Input Component
 *
 * @prop {string} label - Field label text
 * @prop {'text'|'email'|'password'|'number'|'tel'} type
 * @prop {string} value
 * @prop {Function} onChange
 * @prop {string} error - Error message to display below input
 * @prop {string} hint - Hint text below input (shown when no error)
 * @prop {React.ReactNode} icon - Lucide icon to show on the left
 * @prop {React.ReactNode} rightElement - Element on the right (e.g. toggle)
 * @prop {string} placeholder
 * @prop {string} name
 * @prop {boolean} disabled
 * @prop {boolean} required
 * @prop {string} className
 * @prop {string} success - Success message (e.g. "Detected: IIT Delhi")
 */

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  success,
  icon: Icon,
  rightElement,
  placeholder,
  name,
  id,
  disabled = false,
  required = false,
  className = '',
  ...rest
}) => {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  const inputClass = [
    'input-base',
    Icon ? 'pl-10' : '',
    rightElement ? 'pr-10' : '',
    error ? 'input-error' : '',
    success && !error ? 'input-success' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.3px',
          }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--color-error)', marginLeft: 2 }}>*</span>
          )}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        {/* Left icon */}
        {Icon && (
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              display: 'flex',
              pointerEvents: 'none',
            }}
          >
            <Icon size={16} />
          </span>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClass}
          {...rest}
        />

        {/* Right element (e.g. show/hide password) */}
        {rightElement && (
          <span
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
            }}
          >
            {rightElement}
          </span>
        )}
      </div>

      {/* Success message */}
      {success && !error && (
        <p style={{ fontSize: '12px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4 }}>
          ✓ {success}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p style={{ fontSize: '12px', color: 'var(--color-error)' }}>
          {error}
        </p>
      )}

      {/* Hint (shown when no error and no success) */}
      {hint && !error && !success && (
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
