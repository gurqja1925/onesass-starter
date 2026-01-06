'use client'

/**
 * Radio 컴포넌트
 * 라디오 버튼 그룹
 */

import { forwardRef, InputHTMLAttributes } from 'react'

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  label?: string
  error?: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className = '', id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <div className="relative flex items-center mt-0.5">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            className="peer sr-only"
            {...props}
          />
          <div
            className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
              peer-checked:border-[var(--color-accent)]
              peer-focus:ring-2 peer-focus:ring-[var(--color-accent)] peer-focus:ring-offset-2
              peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
              cursor-pointer
            `}
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full scale-0 peer-checked:scale-100 transition-transform"
              style={{ background: 'var(--color-accent)' }}
            />
          </div>
        </div>

        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={radioId}
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
          </div>
        )}
      </div>
    )
  }
)

Radio.displayName = 'Radio'

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  label,
  error,
  orientation = 'vertical',
  className = '',
}: RadioGroupProps) {
  return (
    <div className={className}>
      {label && (
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--color-text)' }}
        >
          {label}
        </label>
      )}

      <div
        className={`
          flex gap-3
          ${orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}
        `}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
          />
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}
