'use client'

/**
 * Container 컴포넌트
 * 콘텐츠 래퍼 및 최대 너비 제한
 */

import { HTMLAttributes, forwardRef } from 'react'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  centered?: boolean
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = 'xl',
      padding = 'md',
      centered = true,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const sizes = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-5xl',
      xl: 'max-w-6xl',
      '2xl': 'max-w-7xl',
      full: 'max-w-full',
    }

    const paddings = {
      none: '',
      sm: 'px-4',
      md: 'px-6',
      lg: 'px-8',
    }

    return (
      <div
        ref={ref}
        className={`
          w-full
          ${sizes[size]}
          ${paddings[padding]}
          ${centered ? 'mx-auto' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'
