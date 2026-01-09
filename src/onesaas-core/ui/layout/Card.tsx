'use client'

/**
 * Card 컴포넌트
 * 콘텐츠 카드
 */

import { HTMLAttributes, forwardRef, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  hoverable?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      rounded = 'xl',
      hoverable = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)]',
      outlined: 'bg-transparent border-2 border-[var(--color-border)]',
      elevated: 'bg-[var(--color-bg-secondary)] shadow-lg',
      ghost: 'bg-transparent',
    }

    const paddings = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-8',
    }

    const radiuses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
    }

    return (
      <div
        ref={ref}
        className={`
          ${variants[variant]}
          ${paddings[padding]}
          ${radiuses[rounded]}
          ${hoverable ? 'transition-all hover:shadow-lg hover:-translate-y-1' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// 카드 서브 컴포넌트
export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex items-start justify-between mb-4 ${className}`}
      {...props}
    >
      <div>
        {title && (
          <h3
            className="font-bold text-lg"
            style={{ color: 'var(--color-text)' }}
          >
            {title}
          </h3>
        )}
        {subtitle && (
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

export const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  )
)

CardBody.displayName = 'CardBody'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`mt-4 pt-4 border-t ${className}`}
      style={{ borderColor: 'var(--color-border)' }}
      {...props}
    >
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'
