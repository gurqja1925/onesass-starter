'use client'

/**
 * Tooltip 컴포넌트
 * 툴팁 표시
 */

import { HTMLAttributes, forwardRef, ReactNode, useState, useRef, useEffect } from 'react'

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  content: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
  arrow?: boolean
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      position = 'top',
      delay = 200,
      disabled = false,
      arrow = true,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout>()

    const handleMouseEnter = () => {
      if (disabled) return
      timeoutRef.current = setTimeout(() => setIsVisible(true), delay)
    }

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsVisible(false)
    }

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    const positions = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    }

    const arrows = {
      top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--color-bg-secondary)] border-x-transparent border-b-transparent',
      bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--color-bg-secondary)] border-x-transparent border-t-transparent',
      left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--color-bg-secondary)] border-y-transparent border-r-transparent',
      right: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--color-bg-secondary)] border-y-transparent border-l-transparent',
    }

    return (
      <div
        ref={ref}
        className={`relative inline-block ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        {...props}
      >
        {children}

        {isVisible && content && (
          <div
            role="tooltip"
            className={`
              absolute z-50 px-3 py-1.5 text-sm rounded-lg whitespace-nowrap
              animate-in fade-in zoom-in-95 duration-100
              ${positions[position]}
            `}
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            {content}

            {arrow && (
              <span
                className={`
                  absolute w-0 h-0 border-4
                  ${arrows[position]}
                `}
              />
            )}
          </div>
        )}
      </div>
    )
  }
)

Tooltip.displayName = 'Tooltip'
