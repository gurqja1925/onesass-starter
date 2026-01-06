/**
 * 뱃지 컴포넌트
 */

import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variants = {
    default: {
      background: 'var(--color-bg-secondary)',
      color: 'var(--color-text)',
      border: '1px solid var(--color-border)',
    },
    success: {
      background: '#10b981',
      color: '#ffffff',
    },
    warning: {
      background: '#f59e0b',
      color: '#000000',
    },
    danger: {
      background: '#ef4444',
      color: '#ffffff',
    },
    info: {
      background: '#3b82f6',
      color: '#ffffff',
    },
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizes[size]}`}
      style={variants[variant]}
    >
      {children}
    </span>
  )
}

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'error'
  label?: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const statusMap = {
    active: { variant: 'success' as const, defaultLabel: '활성' },
    inactive: { variant: 'default' as const, defaultLabel: '비활성' },
    pending: { variant: 'warning' as const, defaultLabel: '대기중' },
    error: { variant: 'danger' as const, defaultLabel: '오류' },
  }

  const { variant, defaultLabel } = statusMap[status]

  return <Badge variant={variant}>{label || defaultLabel}</Badge>
}
