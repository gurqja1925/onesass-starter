'use client'

/**
 * Skeleton 컴포넌트
 * 로딩 플레이스홀더
 */

import { HTMLAttributes, forwardRef } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      width,
      height,
      animation = 'pulse',
      className = '',
      ...props
    },
    ref
  ) => {
    const variants = {
      text: 'rounded-md',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      rounded: 'rounded-xl',
    }

    const animations = {
      pulse: 'animate-pulse',
      wave: 'animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%]',
      none: '',
    }

    const defaultHeight = variant === 'text' ? '1em' : variant === 'circular' ? width : '100px'

    return (
      <div
        ref={ref}
        className={`
          ${variants[variant]}
          ${animations[animation]}
          ${className}
        `}
        style={{
          width: width ?? '100%',
          height: height ?? defaultHeight,
          background: 'var(--color-border)',
        }}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

// 스켈레톤 그룹
export interface SkeletonGroupProps extends HTMLAttributes<HTMLDivElement> {
  count?: number
  gap?: 'sm' | 'md' | 'lg'
}

export const SkeletonGroup = forwardRef<HTMLDivElement, SkeletonGroupProps>(
  ({ count = 3, gap = 'md', className = '', children, ...props }, ref) => {
    const gaps = {
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
    }

    return (
      <div ref={ref} className={`flex flex-col ${gaps[gap]} ${className}`} {...props}>
        {children || Array.from({ length: count }).map((_, i) => <Skeleton key={i} />)}
      </div>
    )
  }
)

SkeletonGroup.displayName = 'SkeletonGroup'

// 카드 스켈레톤
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`p-4 rounded-xl ${className}`}
      style={{ background: 'var(--color-bg-secondary)' }}
    >
      <Skeleton variant="rectangular" height={160} className="mb-4" />
      <Skeleton variant="text" width="70%" height={24} className="mb-2" />
      <Skeleton variant="text" width="100%" className="mb-1" />
      <Skeleton variant="text" width="80%" />
    </div>
  )
}

// 아바타 + 텍스트 스켈레톤
export function SkeletonAvatar({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1">
        <Skeleton variant="text" width="40%" height={16} className="mb-1" />
        <Skeleton variant="text" width="60%" height={12} />
      </div>
    </div>
  )
}

// 테이블 스켈레톤
export function SkeletonTable({ rows = 5, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={className}>
      {/* 헤더 */}
      <div className="flex gap-4 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="text" width="25%" height={16} />
        ))}
      </div>

      {/* 행 */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
          {[1, 2, 3, 4].map((j) => (
            <Skeleton key={j} variant="text" width="25%" height={14} />
          ))}
        </div>
      ))}
    </div>
  )
}
