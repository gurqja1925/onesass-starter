'use client'

/**
 * Badge 컴포넌트
 * 상태 배지 및 라벨
 */

import { HTMLAttributes, forwardRef, ReactNode } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  outline?: boolean
  dot?: boolean
  icon?: ReactNode
  removable?: boolean
  onRemove?: () => void
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      rounded = false,
      outline = false,
      dot = false,
      icon,
      removable = false,
      onRemove,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: outline
        ? 'border-[var(--color-border)] text-[var(--color-text)]'
        : 'bg-[var(--color-bg-secondary)] text-[var(--color-text)]',
      primary: outline
        ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
        : 'bg-[var(--color-accent)] text-[var(--color-bg)]',
      secondary: outline
        ? 'border-gray-500 text-gray-600'
        : 'bg-gray-500 text-white',
      success: outline
        ? 'border-green-500 text-green-600'
        : 'bg-green-500 text-white',
      warning: outline
        ? 'border-yellow-500 text-yellow-600'
        : 'bg-yellow-500 text-white',
      error: outline
        ? 'border-red-500 text-red-600'
        : 'bg-red-500 text-white',
      info: outline
        ? 'border-blue-500 text-blue-600'
        : 'bg-blue-500 text-white',
    }

    const dotColors = {
      default: 'bg-[var(--color-text-secondary)]',
      primary: 'bg-[var(--color-accent)]',
      secondary: 'bg-gray-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
    }

    const sizes = {
      sm: 'px-1.5 py-0.5 text-xs',
      md: 'px-2 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    }

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1 font-medium
          ${rounded ? 'rounded-full' : 'rounded-md'}
          ${outline ? 'border' : ''}
          ${sizes[size]}
          ${variants[variant]}
          ${className}
        `}
        {...props}
      >
        {dot && (
          <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
        )}
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {removable && (
          <button
            onClick={onRemove}
            className="flex-shrink-0 ml-0.5 hover:opacity-70"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

// 숫자 배지
export interface CountBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  count: number
  max?: number
  showZero?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'error'
}

export const CountBadge = forwardRef<HTMLSpanElement, CountBadgeProps>(
  (
    {
      count,
      max = 99,
      showZero = false,
      size = 'md',
      variant = 'primary',
      className = '',
      ...props
    },
    ref
  ) => {
    if (count === 0 && !showZero) return null

    const displayCount = count > max ? `${max}+` : count

    const sizes = {
      sm: 'min-w-4 h-4 text-[10px] px-1',
      md: 'min-w-5 h-5 text-xs px-1.5',
      lg: 'min-w-6 h-6 text-sm px-2',
    }

    const variants = {
      default: 'bg-[var(--color-bg-secondary)] text-[var(--color-text)]',
      primary: 'bg-[var(--color-accent)] text-[var(--color-bg)]',
      error: 'bg-red-500 text-white',
    }

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-full font-medium
          ${sizes[size]}
          ${variants[variant]}
          ${className}
        `}
        {...props}
      >
        {displayCount}
      </span>
    )
  }
)

CountBadge.displayName = 'CountBadge'
