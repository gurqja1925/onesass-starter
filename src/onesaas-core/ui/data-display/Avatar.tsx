'use client'

/**
 * Avatar 컴포넌트
 * 사용자 아바타
 */

import { HTMLAttributes, forwardRef, useState } from 'react'
import { User } from 'lucide-react'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'circle' | 'square' | 'rounded'
  status?: 'online' | 'offline' | 'busy' | 'away'
  bordered?: boolean
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = 'md',
      shape = 'circle',
      status,
      bordered = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false)

    const sizes = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
      '2xl': 'w-24 h-24 text-3xl',
    }

    const shapes = {
      circle: 'rounded-full',
      square: 'rounded-none',
      rounded: 'rounded-xl',
    }

    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      busy: 'bg-red-500',
      away: 'bg-yellow-500',
    }

    const statusSizes = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
      '2xl': 'w-5 h-5',
    }

    // 이니셜 생성
    const getInitials = (name?: string) => {
      if (!name) return ''
      const parts = name.split(' ')
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      }
      return name.slice(0, 2).toUpperCase()
    }

    const showImage = src && !imageError
    const initials = getInitials(name)

    return (
      <div
        ref={ref}
        className={`
          relative inline-flex items-center justify-center flex-shrink-0
          ${sizes[size]}
          ${shapes[shape]}
          ${bordered ? 'ring-2 ring-[var(--color-bg)] ring-offset-2' : ''}
          ${className}
        `}
        style={{ background: 'var(--color-bg-secondary)' }}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover ${shapes[shape]}`}
          />
        ) : initials ? (
          <span
            className="font-medium"
            style={{ color: 'var(--color-text)' }}
          >
            {initials}
          </span>
        ) : (
          <User
            className="w-1/2 h-1/2"
            style={{ color: 'var(--color-text-secondary)' }}
          />
        )}

        {/* 상태 표시 */}
        {status && (
          <span
            className={`
              absolute bottom-0 right-0 border-2 rounded-full
              ${statusSizes[size]}
              ${statusColors[status]}
            `}
            style={{ borderColor: 'var(--color-bg)' }}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

// 아바타 그룹
export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number
  size?: AvatarProps['size']
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max, size = 'md', className = '', children, ...props }, ref) => {
    const avatars = Array.isArray(children) ? children : [children]
    const displayedAvatars = max ? avatars.slice(0, max) : avatars
    const remainingCount = max ? Math.max(0, avatars.length - max) : 0

    return (
      <div
        ref={ref}
        className={`flex -space-x-3 ${className}`}
        {...props}
      >
        {displayedAvatars.map((child, index) => (
          <div key={index} className="relative ring-2 ring-[var(--color-bg)] rounded-full">
            {child}
          </div>
        ))}

        {remainingCount > 0 && (
          <Avatar
            size={size}
            name={`+${remainingCount}`}
            className="ring-2 ring-[var(--color-bg)]"
          />
        )}
      </div>
    )
  }
)

AvatarGroup.displayName = 'AvatarGroup'
