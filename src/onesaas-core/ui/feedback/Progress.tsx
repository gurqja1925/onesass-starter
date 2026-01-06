'use client'

/**
 * Progress 컴포넌트
 * 진행률 표시
 */

import { HTMLAttributes, forwardRef } from 'react'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
  showValue?: boolean
  animated?: boolean
  striped?: boolean
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      size = 'md',
      variant = 'default',
      showValue = false,
      animated = false,
      striped = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizes = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-4',
    }

    const colors = {
      default: 'var(--color-accent)',
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
    }

    return (
      <div className={className}>
        {showValue && (
          <div className="flex justify-between mb-1">
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--color-text)' }}
            >
              진행률
            </span>
            <span
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {Math.round(percentage)}%
            </span>
          </div>
        )}

        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={`w-full rounded-full overflow-hidden ${sizes[size]}`}
          style={{ background: 'var(--color-border)' }}
          {...props}
        >
          <div
            className={`
              h-full rounded-full transition-all duration-300 ease-out
              ${striped ? 'bg-stripes' : ''}
              ${animated ? 'animate-progress-stripes' : ''}
            `}
            style={{
              width: `${percentage}%`,
              background: striped
                ? `repeating-linear-gradient(
                    45deg,
                    ${colors[variant]},
                    ${colors[variant]} 10px,
                    ${colors[variant]}80 10px,
                    ${colors[variant]}80 20px
                  )`
                : colors[variant],
            }}
          />
        </div>
      </div>
    )
  }
)

Progress.displayName = 'Progress'

// 원형 프로그레스
export interface CircularProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  showValue?: boolean
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value,
      max = 100,
      size = 100,
      strokeWidth = 8,
      showValue = true,
      variant = 'default',
      className = '',
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (percentage / 100) * circumference

    const colors = {
      default: 'var(--color-accent)',
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
    }

    return (
      <div
        ref={ref}
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* 배경 원 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={strokeWidth}
          />
          {/* 진행 원 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors[variant]}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {showValue && (
          <span
            className="absolute text-lg font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    )
  }
)

CircularProgress.displayName = 'CircularProgress'
