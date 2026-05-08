import { Calendar, Clock } from 'lucide-react';
import Input from './Input';

/**
 * DateTimeField — simple shared date + time input pair.
 * Easier to use and easier to explain than a native datetime-local field.
 */
const DateTimeField = ({
  label,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-secondary">
        {label}{required ? ' *' : ''}
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          type="date"
          icon={Calendar}
          value={dateValue}
          onChange={(event) => onDateChange(event.target.value)}
          error={dateError}
        />

        <Input
          type="time"
          icon={Clock}
          value={timeValue}
          onChange={(event) => onTimeChange(event.target.value)}
          error={timeError}
        />
      </div>
    </div>
  );
};

export default DateTimeField;
