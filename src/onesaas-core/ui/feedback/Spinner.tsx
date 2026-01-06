'use client'

/**
 * Spinner 컴포넌트
 * 로딩 스피너
 */

import { HTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'dots' | 'bars' | 'ring'
  color?: string
  label?: string
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      variant = 'default',
      color,
      label = '로딩 중...',
      className = '',
      ...props
    },
    ref
  ) => {
    const sizes = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    }

    const spinnerColor = color || 'var(--color-accent)'

    // 기본 스피너 (Lucide)
    if (variant === 'default') {
      return (
        <div
          ref={ref}
          role="status"
          aria-label={label}
          className={`inline-flex items-center justify-center ${className}`}
          {...props}
        >
          <Loader2
            className={`animate-spin ${sizes[size]}`}
            style={{ color: spinnerColor }}
          />
          <span className="sr-only">{label}</span>
        </div>
      )
    }

    // 점 스피너
    if (variant === 'dots') {
      const dotSizes = {
        xs: 'w-1 h-1',
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-3 h-3',
        xl: 'w-4 h-4',
      }

      return (
        <div
          ref={ref}
          role="status"
          aria-label={label}
          className={`inline-flex items-center gap-1 ${className}`}
          {...props}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${dotSizes[size]} rounded-full animate-bounce`}
              style={{
                background: spinnerColor,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
          <span className="sr-only">{label}</span>
        </div>
      )
    }

    // 바 스피너
    if (variant === 'bars') {
      const barSizes = {
        xs: 'w-0.5 h-3',
        sm: 'w-1 h-4',
        md: 'w-1 h-5',
        lg: 'w-1.5 h-6',
        xl: 'w-2 h-8',
      }

      return (
        <div
          ref={ref}
          role="status"
          aria-label={label}
          className={`inline-flex items-end gap-0.5 ${className}`}
          {...props}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`${barSizes[size]} rounded-full animate-pulse`}
              style={{
                background: spinnerColor,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
          <span className="sr-only">{label}</span>
        </div>
      )
    }

    // 링 스피너
    if (variant === 'ring') {
      const ringSizes = {
        xs: 12,
        sm: 16,
        md: 24,
        lg: 32,
        xl: 48,
      }

      const ringSize = ringSizes[size]
      const strokeWidth = size === 'xs' || size === 'sm' ? 2 : 3

      return (
        <div
          ref={ref}
          role="status"
          aria-label={label}
          className={`inline-flex items-center justify-center ${className}`}
          {...props}
        >
          <svg
            className="animate-spin"
            width={ringSize}
            height={ringSize}
            viewBox={`0 0 ${ringSize} ${ringSize}`}
          >
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={(ringSize - strokeWidth * 2) / 2}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={(ringSize - strokeWidth * 2) / 2}
              fill="none"
              stroke={spinnerColor}
              strokeWidth={strokeWidth}
              strokeDasharray={`${(ringSize - strokeWidth * 2) * Math.PI * 0.75} ${(ringSize - strokeWidth * 2) * Math.PI}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="sr-only">{label}</span>
        </div>
      )
    }

    return null
  }
)

Spinner.displayName = 'Spinner'

// 전체 화면 로딩
export function FullScreenSpinner({ label = '로딩 중...' }: { label?: string }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="text-center">
        <Spinner size="xl" className="mb-4" />
        <p
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {label}
        </p>
      </div>
    </div>
  )
}

// 인라인 로딩
export function InlineSpinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Spinner size="sm" />
      {label && (
        <span
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {label}
        </span>
      )}
    </span>
  )
}
