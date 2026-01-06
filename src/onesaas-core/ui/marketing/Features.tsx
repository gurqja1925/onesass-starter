'use client'

/**
 * Features 컴포넌트
 * 기능 소개 섹션
 */

import { ReactNode } from 'react'

export interface Feature {
  icon: ReactNode
  title: string
  description: string
  link?: { label: string; href: string }
}

export interface FeaturesProps {
  title?: string
  subtitle?: string
  description?: string
  features: Feature[]
  columns?: 2 | 3 | 4
  variant?: 'cards' | 'list' | 'minimal'
  align?: 'left' | 'center'
  className?: string
}

export function Features({
  title,
  subtitle,
  description,
  features,
  columns = 3,
  variant = 'cards',
  align = 'center',
  className = '',
}: FeaturesProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className={`py-20 ${className}`} style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {(title || subtitle || description) && (
          <div className={`mb-16 ${align === 'center' ? 'text-center max-w-3xl mx-auto' : ''}`}>
            {subtitle && (
              <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                {description}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${gridCols[columns]} gap-8`}>
          {features.map((feature, i) => (
            <div
              key={i}
              className={`
                ${variant === 'cards' ? 'p-6 rounded-2xl border' : 'p-4'}
                ${variant === 'minimal' ? 'text-center' : ''}
              `}
              style={{
                background: variant === 'cards' ? 'var(--color-bg-secondary)' : 'transparent',
                borderColor: 'var(--color-border)',
              }}
            >
              <div
                className={`
                  ${variant === 'minimal' ? 'w-16 h-16 mx-auto' : 'w-12 h-12'}
                  rounded-xl flex items-center justify-center mb-4
                `}
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                {feature.title}
              </h3>

              <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                {feature.description}
              </p>

              {feature.link && (
                <a
                  href={feature.link.href}
                  className="text-sm font-medium inline-flex items-center gap-1"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {feature.link.label}
                  <span>→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
