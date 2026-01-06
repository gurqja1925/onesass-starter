'use client'

/**
 * Divider 컴포넌트
 * 구분선
 */

import { HTMLAttributes, forwardRef, ReactNode } from 'react'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  thickness?: 'thin' | 'medium' | 'thick'
  label?: ReactNode
  labelPosition?: 'left' | 'center' | 'right'
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'solid',
      thickness = 'thin',
      label,
      labelPosition = 'center',
      className = '',
      ...props
    },
    ref
  ) => {
    const thicknesses = {
      thin: orientation === 'horizontal' ? 'h-px' : 'w-px',
      medium: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
      thick: orientation === 'horizontal' ? 'h-1' : 'w-1',
    }

    const variants = {
      solid: '',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    }

    const labelPositions = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    }

    if (label) {
      return (
        <div
          ref={ref}
          className={`flex items-center ${labelPositions[labelPosition]} ${className}`}
          {...props}
        >
          <div
            className={`flex-1 ${thicknesses[thickness]}`}
            style={{ background: 'var(--color-border)' }}
          />
          <span
            className="px-4 text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {label}
          </span>
          <div
            className={`flex-1 ${thicknesses[thickness]}`}
            style={{ background: 'var(--color-border)' }}
          />
        </div>
      )
    }

    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          className={`self-stretch ${thicknesses[thickness]} ${className}`}
          style={{ background: 'var(--color-border)' }}
          {...props}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={`w-full ${thicknesses[thickness]} ${className}`}
        style={{ background: 'var(--color-border)' }}
        {...props}
      />
    )
  }
)

Divider.displayName = 'Divider'
