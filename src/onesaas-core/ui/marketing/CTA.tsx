'use client'

/**
 * CTA 컴포넌트
 * Call to Action 섹션
 */

import { ReactNode } from 'react'

export interface CTAProps {
  title: string
  description?: string
  primaryAction: { label: string; href?: string; onClick?: () => void }
  secondaryAction?: { label: string; href?: string; onClick?: () => void }
  variant?: 'default' | 'centered' | 'split'
  background?: 'accent' | 'gradient' | 'dark'
  className?: string
}

export function CTA({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'centered',
  background = 'accent',
  className = '',
}: CTAProps) {
  const backgrounds = {
    accent: 'bg-[var(--color-accent)]',
    gradient: 'bg-gradient-to-r from-[var(--color-accent)] to-purple-600',
    dark: 'bg-gray-900',
  }

  const textColor = background === 'dark' ? 'text-white' : 'text-[var(--color-bg)]'

  const ActionButton = ({ action, isPrimary }: { action: typeof primaryAction; isPrimary: boolean }) => {
    const baseStyle = 'px-6 py-3 rounded-xl font-medium transition-all'
    const style = isPrimary
      ? background === 'dark'
        ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
        : 'bg-[var(--color-bg)] text-[var(--color-text)]'
      : 'border border-current opacity-80 hover:opacity-100'

    return action.href ? (
      <a href={action.href} className={`${baseStyle} ${style}`}>{action.label}</a>
    ) : (
      <button onClick={action.onClick} className={`${baseStyle} ${style}`}>{action.label}</button>
    )
  }

  return (
    <section className={`py-16 ${backgrounds[background]} ${className}`}>
      <div className={`max-w-4xl mx-auto px-6 ${variant === 'centered' ? 'text-center' : ''}`}>
        {variant === 'split' ? (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${textColor}`}>{title}</h2>
              {description && <p className={`${textColor} opacity-80`}>{description}</p>}
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <ActionButton action={primaryAction} isPrimary />
              {secondaryAction && <ActionButton action={secondaryAction} isPrimary={false} />}
            </div>
          </div>
        ) : (
          <>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>{title}</h2>
            {description && <p className={`text-lg mb-8 ${textColor} opacity-80`}>{description}</p>}
            <div className="flex gap-4 justify-center flex-wrap">
              <ActionButton action={primaryAction} isPrimary />
              {secondaryAction && <ActionButton action={secondaryAction} isPrimary={false} />}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
