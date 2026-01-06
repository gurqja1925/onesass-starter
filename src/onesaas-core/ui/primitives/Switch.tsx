'use client'

/**
 * Switch 컴포넌트
 * 토글 스위치
 */

import { forwardRef, InputHTMLAttributes } from 'react'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, size = 'md', className = '', id, ...props }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`

    const sizes = {
      sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
      md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
      lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
    }

    const { track, thumb, translate } = sizes[size]

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            className="peer sr-only"
            {...props}
          />
          <div
            className={`
              ${track} rounded-full transition-colors cursor-pointer
              peer-checked:bg-[var(--color-accent)]
              peer-focus:ring-2 peer-focus:ring-[var(--color-accent)] peer-focus:ring-offset-2
              peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
            `}
            style={{ background: 'var(--color-border)' }}
          />
          <div
            className={`
              absolute top-0.5 left-0.5 ${thumb} rounded-full bg-white shadow transition-transform
              peer-checked:${translate}
            `}
          />
        </div>

        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={switchId}
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

Switch.displayName = 'Switch'
