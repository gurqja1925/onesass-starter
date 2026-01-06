'use client'

/**
 * Testimonials 컴포넌트
 * 고객 후기 섹션
 */

import { Star } from 'lucide-react'

export interface Testimonial {
  content: string
  author: {
    name: string
    role?: string
    company?: string
    avatar?: string
  }
  rating?: number
}

export interface TestimonialsProps {
  title?: string
  subtitle?: string
  testimonials: Testimonial[]
  columns?: 2 | 3
  variant?: 'cards' | 'quotes'
  className?: string
}

export function Testimonials({
  title = '고객 후기',
  subtitle,
  testimonials,
  columns = 3,
  variant = 'cards',
  className = '',
}: TestimonialsProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
  }

  return (
    <section className={`py-20 ${className}`} style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          {subtitle && (
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              {subtitle}
            </p>
          )}
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
              {title}
            </h2>
          )}
        </div>

        <div className={`grid ${gridCols[columns]} gap-8`}>
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              {item.rating && (
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`w-5 h-5 ${j < item.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              )}

              <p className="text-lg mb-6 leading-relaxed" style={{ color: 'var(--color-text)' }}>
                "{item.content}"
              </p>

              <div className="flex items-center gap-3">
                {item.author.avatar ? (
                  <img src={item.author.avatar} alt="" className="w-12 h-12 rounded-full" />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    {item.author.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>{item.author.name}</p>
                  {(item.author.role || item.author.company) && (
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {item.author.role}{item.author.role && item.author.company && ', '}{item.author.company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
