'use client'

/**
 * Hero 컴포넌트
 * 랜딩 페이지 히어로 섹션
 */

import { ReactNode } from 'react'

export interface HeroProps {
  title: string | ReactNode
  subtitle?: string | ReactNode
  description?: string
  primaryAction?: { label: string; href?: string; onClick?: () => void }
  secondaryAction?: { label: string; href?: string; onClick?: () => void }
  image?: string | ReactNode
  imagePosition?: 'right' | 'left' | 'background'
  badge?: string
  stats?: { value: string; label: string }[]
  align?: 'left' | 'center'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Hero({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  image,
  imagePosition = 'right',
  badge,
  stats,
  align = 'left',
  size = 'md',
  className = '',
}: HeroProps) {
  const sizes = {
    sm: { title: 'text-3xl md:text-4xl', desc: 'text-base', padding: 'py-20 px-8' },
    md: { title: 'text-4xl md:text-5xl lg:text-6xl', desc: 'text-lg', padding: 'py-28 px-10' },
    lg: { title: 'text-5xl md:text-6xl lg:text-7xl', desc: 'text-xl', padding: 'py-36 px-12' },
  }

  const ActionButton = ({ action, variant }: { action: typeof primaryAction; variant: 'primary' | 'secondary' }) => {
    if (!action) return null
    const baseStyle = 'px-6 py-3 rounded-xl font-medium transition-all'
    const variantStyle = variant === 'primary'
      ? 'bg-[var(--color-accent)] text-[var(--color-bg)] hover:opacity-90'
      : 'border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]'

    return action.href ? (
      <a href={action.href} className={`${baseStyle} ${variantStyle}`}>{action.label}</a>
    ) : (
      <button onClick={action.onClick} className={`${baseStyle} ${variantStyle}`}>{action.label}</button>
    )
  }

  return (
    <section className={`${sizes[size].padding} ${className}`} style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`
          ${image && imagePosition !== 'background' ? 'grid lg:grid-cols-2 gap-12 items-center' : ''}
          ${image && imagePosition === 'left' ? 'lg:flex-row-reverse' : ''}
        `}>
          <div className={align === 'center' ? 'text-center mx-auto max-w-3xl' : ''}>
            {badge && (
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                {badge}
              </span>
            )}

            {subtitle && (
              <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
                {subtitle}
              </p>
            )}

            <h1 className={`${sizes[size].title} font-bold leading-tight mb-6`} style={{ color: 'var(--color-text)' }}>
              {title}
            </h1>

            {description && (
              <p className={`${sizes[size].desc} mb-8 max-w-2xl`} style={{ color: 'var(--color-text-secondary)' }}>
                {description}
              </p>
            )}

            {(primaryAction || secondaryAction) && (
              <div className={`flex gap-4 ${align === 'center' ? 'justify-center' : ''} flex-wrap`}>
                <ActionButton action={primaryAction} variant="primary" />
                <ActionButton action={secondaryAction} variant="secondary" />
              </div>
            )}

            {stats && stats.length > 0 && (
              <div className={`mt-12 flex gap-8 ${align === 'center' ? 'justify-center' : ''} flex-wrap`}>
                {stats.map((stat, i) => (
                  <div key={i}>
                    <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>{stat.value}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {image && imagePosition !== 'background' && (
            <div className="relative">
              {typeof image === 'string' ? (
                <img src={image} alt="" className="w-full rounded-2xl shadow-2xl" />
              ) : image}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
