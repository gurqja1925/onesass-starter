'use client'

/**
 * Checkbox 컴포넌트
 * 체크박스 입력
 */

import { forwardRef, InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className = '', id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="peer sr-only"
            {...props}
          />
          <div
            className={`
              w-5 h-5 rounded border-2 flex items-center justify-center transition-all
              peer-checked:bg-[var(--color-accent)] peer-checked:border-[var(--color-accent)]
              peer-focus:ring-2 peer-focus:ring-[var(--color-accent)] peer-focus:ring-offset-2
              peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
              cursor-pointer
            `}
            style={{ borderColor: error ? '#ef4444' : 'var(--color-border)' }}
          >
            <Check
              className="w-3 h-3 opacity-0 peer-checked:opacity-100 transition-opacity"
              style={{ color: 'var(--color-bg)' }}
            />
          </div>
        </div>

        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={checkboxId}
                className="block text-sm font-medium cursor-pointer"
                style={{ color: 'var(--color-text)' }}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                className="text-xs mt-0.5"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {description}
              </p>
            )}
            {error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
