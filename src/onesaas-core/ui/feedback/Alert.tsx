'use client'

/**
 * Alert 컴포넌트
 * 인라인 알림 메시지
 */

import { HTMLAttributes, forwardRef, ReactNode } from 'react'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  icon?: ReactNode
  closable?: boolean
  onClose?: () => void
  variant?: 'filled' | 'outlined' | 'soft'
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      type = 'info',
      title,
      icon,
      closable = false,
      onClose,
      variant = 'soft',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const icons = {
      success: <CheckCircle className="w-5 h-5" />,
      error: <AlertCircle className="w-5 h-5" />,
      warning: <AlertTriangle className="w-5 h-5" />,
      info: <Info className="w-5 h-5" />,
    }

    const colors = {
      success: {
        filled: 'bg-green-500 text-white',
        outlined: 'border-green-500 text-green-600',
        soft: 'bg-green-500/10 text-green-600 border-green-500/20',
      },
      error: {
        filled: 'bg-red-500 text-white',
        outlined: 'border-red-500 text-red-600',
        soft: 'bg-red-500/10 text-red-600 border-red-500/20',
      },
      warning: {
        filled: 'bg-yellow-500 text-white',
        outlined: 'border-yellow-500 text-yellow-600',
        soft: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      },
      info: {
        filled: 'bg-blue-500 text-white',
        outlined: 'border-blue-500 text-blue-600',
        soft: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      },
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={`
          flex items-start gap-3 p-4 rounded-xl border
          ${colors[type][variant]}
          ${className}
        `}
        {...props}
      >
        <span className="flex-shrink-0 mt-0.5">
          {icon || icons[type]}
        </span>

        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-medium">{title}</p>
          )}
          {children && (
            <div className={`text-sm ${title ? 'mt-1 opacity-90' : ''}`}>
              {children}
            </div>
          )}
        </div>

        {closable && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-lg transition-opacity hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    )
  }
)

Alert.displayName = 'Alert'
