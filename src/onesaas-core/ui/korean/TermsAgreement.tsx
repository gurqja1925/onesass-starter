'use client'

/**
 * TermsAgreement 컴포넌트
 * 약관 동의 (한국 법적 요구사항)
 */

import { useState, useEffect } from 'react'
import { Check, ChevronDown, ExternalLink } from 'lucide-react'

export interface TermItem {
  id: string
  title: string
  required: boolean
  content?: string
  link?: string
}

export interface TermsAgreementProps {
  terms: TermItem[]
  value?: string[]
  onChange?: (agreed: string[]) => void
  showContent?: boolean
  error?: string
  className?: string
}

export function TermsAgreement({
  terms,
  value = [],
  onChange,
  showContent = true,
  error,
  className = '',
}: TermsAgreementProps) {
  const [agreed, setAgreed] = useState<string[]>(value)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    setAgreed(value)
  }, [value])

  const allRequired = terms.filter(t => t.required).every(t => agreed.includes(t.id))
  const allAgreed = terms.every(t => agreed.includes(t.id))

  const toggleTerm = (id: string) => {
    const newAgreed = agreed.includes(id)
      ? agreed.filter(a => a !== id)
      : [...agreed, id]
    setAgreed(newAgreed)
    onChange?.(newAgreed)
  }

  const toggleAll = () => {
    const newAgreed = allAgreed ? [] : terms.map(t => t.id)
    setAgreed(newAgreed)
    onChange?.(newAgreed)
  }

  return (
    <div className={className}>
      {/* 전체 동의 */}
      <button
        type="button"
        onClick={toggleAll}
        className="w-full flex items-center gap-3 p-4 rounded-lg border mb-3"
        style={{
          background: allAgreed ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
          borderColor: error ? '#ef4444' : 'var(--color-border)',
        }}
      >
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center border-2"
          style={{
            borderColor: allAgreed ? 'transparent' : 'var(--color-border)',
            background: allAgreed ? 'var(--color-bg)' : 'transparent',
          }}
        >
          {allAgreed && <Check className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />}
        </div>
        <span
          className="font-medium"
          style={{ color: allAgreed ? 'var(--color-bg)' : 'var(--color-text)' }}
        >
          전체 동의하기
        </span>
      </button>

      {/* 개별 약관 */}
      <div
        className="rounded-lg border divide-y"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}
      >
        {terms.map((term) => (
          <div key={term.id}>
            <div className="flex items-center gap-3 p-4">
              {/* 체크박스 */}
              <button
                type="button"
                onClick={() => toggleTerm(term.id)}
                className="w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0"
                style={{
                  borderColor: agreed.includes(term.id) ? 'var(--color-accent)' : 'var(--color-border)',
                  background: agreed.includes(term.id) ? 'var(--color-accent)' : 'transparent',
                }}
              >
                {agreed.includes(term.id) && <Check className="w-3 h-3 text-white" />}
              </button>

              {/* 제목 */}
              <span className="flex-1 text-sm" style={{ color: 'var(--color-text)' }}>
                {term.required ? (
                  <span className="text-red-500 mr-1">[필수]</span>
                ) : (
                  <span style={{ color: 'var(--color-text-secondary)' }} className="mr-1">[선택]</span>
                )}
                {term.title}
              </span>

              {/* 링크 또는 펼치기 */}
              {term.link ? (
                <a
                  href={term.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : term.content && showContent ? (
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === term.id ? null : term.id)}
                  className="p-1"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedId === term.id ? 'rotate-180' : ''}`}
                  />
                </button>
              ) : null}
            </div>

            {/* 약관 내용 */}
            {showContent && term.content && expandedId === term.id && (
              <div
                className="px-4 pb-4 text-xs leading-relaxed max-h-40 overflow-auto"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {term.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 필수 항목 안내 */}
      {!allRequired && (
        <p className="mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          * 필수 항목에 모두 동의해주세요
        </p>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
