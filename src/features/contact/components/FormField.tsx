'use client';

import type { UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'textarea';
  error?: string;
  required?: boolean;
  placeholder?: string;
  registration: UseFormRegisterReturn;
}

export function FormField({
  label,
  name,
  type = 'text',
  error,
  required = false,
  placeholder,
  registration,
}: FormFieldProps) {
  const id = `field-${name}`;
  const isTextarea = type === 'textarea';
  const Tag = isTextarea ? 'textarea' : 'input';

  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="form-field__label mono-label">
        {label}
        {required && <span className="form-field__required" aria-hidden="true">*</span>}
      </label>
      <Tag
        id={id}
        type={isTextarea ? undefined : type}
        required={required}
        placeholder={placeholder}
        className="form-field__input"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        rows={isTextarea ? 6 : undefined}
        {...registration}
      />
      {error && (
        <p id={`${id}-error`} className="form-field__error" role="alert">
          {error}
        </p>
      )}

      <style jsx>{`
        .form-field {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .form-field__label {
          color: var(--color-text-secondary);
        }

        .form-field__required {
          color: var(--color-error);
          font-weight: 700;
          font-size: 1.1em;
        }

        .form-field__input {
          padding: var(--space-3) var(--space-4);
          background: rgba(26, 26, 38, 0.6);
          border: var(--border-thin);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: var(--text-base);
          transition: border-color var(--duration-fast) var(--ease-out),
                      box-shadow var(--duration-fast) var(--ease-out);
          outline: none;
          resize: vertical;
        }

        .form-field__input:focus-visible {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-glow);
        }

        .has-error .form-field__input {
          border-color: var(--color-error);
        }

        .form-field__input::placeholder {
          color: var(--color-text-tertiary);
        }

        .form-field__error {
          font-size: var(--text-sm);
          color: var(--color-error);
        }
      `}</style>
    </div>
  );
}
