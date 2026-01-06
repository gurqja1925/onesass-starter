'use client'

/**
 * Pricing 컴포넌트
 * 가격표 섹션
 */

import { useState, ReactNode } from 'react'
import { Check } from 'lucide-react'

export interface PricingPlan {
  name: string
  description?: string
  price: { monthly: number | string; yearly?: number | string }
  currency?: string
  features: string[]
  cta: { label: string; href?: string; onClick?: () => void }
  popular?: boolean
  badge?: string
}

export interface PricingProps {
  title?: string
  subtitle?: string
  description?: string
  plans: PricingPlan[]
  showToggle?: boolean
  className?: string
}

export function Pricing({
  title = '가격 안내',
  subtitle,
  description,
  plans,
  showToggle = true,
  className = '',
}: PricingProps) {
  const [isYearly, setIsYearly] = useState(false)

  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') return price
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  return (
    <section className={`py-20 ${className}`} style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
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
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              {description}
            </p>
          )}

          {showToggle && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <span style={{ color: !isYearly ? 'var(--color-text)' : 'var(--color-text-secondary)' }}>월간</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative w-14 h-8 rounded-full transition-colors"
                style={{ background: isYearly ? 'var(--color-accent)' : 'var(--color-border)' }}
              >
                <span
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span style={{ color: isYearly ? 'var(--color-text)' : 'var(--color-text-secondary)' }}>
                연간 <span className="text-sm" style={{ color: 'var(--color-accent)' }}>20% 할인</span>
              </span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`
                relative rounded-2xl p-8 border
                ${plan.popular ? 'ring-2 ring-[var(--color-accent)]' : ''}
              `}
              style={{
                background: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)',
              }}
            >
              {plan.popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  {plan.badge || '인기'}
                </span>
              )}

              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>{plan.name}</h3>
              {plan.description && (
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>{plan.description}</p>
              )}

              <div className="mb-6">
                <span className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {plan.currency || '₩'}{formatPrice(isYearly && plan.price.yearly ? plan.price.yearly : plan.price.monthly)}
                </span>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  /{isYearly ? '년' : '월'}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-accent)' }} />
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.cta.href ? (
                <a
                  href={plan.cta.href}
                  className={`
                    block w-full py-3 rounded-xl text-center font-medium transition-all
                    ${plan.popular ? 'bg-[var(--color-accent)] text-[var(--color-bg)]' : 'border border-[var(--color-border)] text-[var(--color-text)]'}
                  `}
                >
                  {plan.cta.label}
                </a>
              ) : (
                <button
                  onClick={plan.cta.onClick}
                  className={`
                    w-full py-3 rounded-xl font-medium transition-all
                    ${plan.popular ? 'bg-[var(--color-accent)] text-[var(--color-bg)]' : 'border border-[var(--color-border)] text-[var(--color-text)]'}
                  `}
                >
                  {plan.cta.label}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
