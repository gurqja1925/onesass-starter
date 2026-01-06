'use client'

/**
 * FAQ 컴포넌트
 * 자주 묻는 질문 섹션
 */

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQProps {
  title?: string
  subtitle?: string
  items: FAQItem[]
  columns?: 1 | 2
  className?: string
}

export function FAQ({
  title = '자주 묻는 질문',
  subtitle,
  items,
  columns = 1,
  className = '',
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null) // 모두 닫힌 상태로 시작

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const gridCols = columns === 2 ? 'lg:grid-cols-2' : ''

  return (
    <section className={`py-20 ${className}`} style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* 헤더 */}
        <div className="text-center mb-12">
          {subtitle && (
            <p
              className="text-sm uppercase tracking-wider mb-3 font-medium"
              style={{ color: 'var(--color-accent)' }}
            >
              {subtitle}
            </p>
          )}
          {title && (
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}
            >
              {title}
            </h2>
          )}
        </div>

        {/* FAQ 리스트 */}
        <div className={`grid ${gridCols} gap-4`}>
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                boxShadow: openIndex === i ? '0 8px 32px rgba(0,0,0,0.12)' : 'none',
              }}
            >
              {/* 질문 버튼 */}
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-4 p-6 text-left transition-colors hover:opacity-90"
                style={{
                  background: openIndex === i ? 'var(--color-accent)' : 'transparent',
                }}
              >
                <HelpCircle
                  className="w-5 h-5 flex-shrink-0"
                  style={{
                    color: openIndex === i ? 'var(--color-bg)' : 'var(--color-accent)'
                  }}
                />
                <span
                  className="font-semibold flex-1 text-base leading-relaxed"
                  style={{
                    color: openIndex === i ? 'var(--color-bg)' : 'var(--color-text)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                  style={{
                    color: openIndex === i ? 'var(--color-bg)' : 'var(--color-text-secondary)'
                  }}
                />
              </button>

              {/* 답변 영역 */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div
                    className="px-6 pb-6 pt-4 text-base leading-relaxed"
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-body)',
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
