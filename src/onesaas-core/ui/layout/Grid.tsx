'use client'

/**
 * Grid 컴포넌트
 * CSS Grid 레이아웃
 */

import { HTMLAttributes, forwardRef } from 'react'

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto'
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      cols = 3,
      gap = 'md',
      responsive = true,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const colsMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
      auto: 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
    }

    const responsiveMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
      6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
      12: 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-12',
      auto: 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
    }

    const gaps = {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    }

    return (
      <div
        ref={ref}
        className={`
          grid
          ${responsive ? responsiveMap[cols] : colsMap[cols]}
          ${gaps[gap]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Grid.displayName = 'Grid'
