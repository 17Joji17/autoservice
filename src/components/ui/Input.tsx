import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className = '', ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="ui-field">
      <label htmlFor={inputId} className="ui-label">
        {label}
      </label>

      <input
        id={inputId}
        ref={ref}
        className={`ui-input ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />

      {error && (
        <span id={`${inputId}-error`} className="ui-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

export default Input;
