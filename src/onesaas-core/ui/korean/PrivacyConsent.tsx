'use client'

/**
 * PrivacyConsent 컴포넌트
 * 개인정보 수집/이용 동의 (한국 개인정보보호법)
 */

import { useState, useEffect } from 'react'
import { Check, Shield, ChevronDown } from 'lucide-react'

export interface ConsentItem {
  id: string
  purpose: string           // 수집 목적
  items: string[]           // 수집 항목
  retention: string         // 보유 기간
  required: boolean         // 필수 여부
}

export interface PrivacyConsentProps {
  consents: ConsentItem[]
  value?: string[]
  onChange?: (agreed: string[]) => void
  error?: string
  className?: string
}

export function PrivacyConsent({
  consents,
  value = [],
  onChange,
  error,
  className = '',
}: PrivacyConsentProps) {
  const [agreed, setAgreed] = useState<string[]>(value)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    setAgreed(value)
  }, [value])

  const toggleConsent = (id: string) => {
    const newAgreed = agreed.includes(id)
      ? agreed.filter(a => a !== id)
      : [...agreed, id]
    setAgreed(newAgreed)
    onChange?.(newAgreed)
  }

  return (
    <div className={className}>
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
        <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>
          개인정보 수집 및 이용 동의
        </h3>
      </div>

      {/* 동의 항목 */}
      <div
        className="rounded-lg border divide-y"
        style={{ borderColor: error ? '#ef4444' : 'var(--color-border)', background: 'var(--color-bg-secondary)' }}
      >
        {consents.map((consent) => (
          <div key={consent.id}>
            {/* 헤더 */}
            <div className="flex items-start gap-3 p-4">
              <button
                type="button"
                onClick={() => toggleConsent(consent.id)}
                className="w-5 h-5 mt-0.5 rounded flex items-center justify-center border-2 flex-shrink-0"
                style={{
                  borderColor: agreed.includes(consent.id) ? 'var(--color-accent)' : 'var(--color-border)',
                  background: agreed.includes(consent.id) ? 'var(--color-accent)' : 'transparent',
                }}
              >
                {agreed.includes(consent.id) && <Check className="w-3 h-3 text-white" />}
              </button>

              <div className="flex-1">
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                  {consent.required ? (
                    <span className="text-red-500 mr-1">[필수]</span>
                  ) : (
                    <span style={{ color: 'var(--color-text-secondary)' }} className="mr-1">[선택]</span>
                  )}
                  {consent.purpose}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setExpandedId(expandedId === consent.id ? null : consent.id)}
                className="p-1"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedId === consent.id ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {/* 상세 정보 */}
            {expandedId === consent.id && (
              <div className="px-4 pb-4 ml-8">
                <table className="w-full text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  <tbody>
                    <tr>
                      <td className="py-1 pr-4 font-medium whitespace-nowrap align-top">수집 항목</td>
                      <td className="py-1">{consent.items.join(', ')}</td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4 font-medium whitespace-nowrap align-top">보유 기간</td>
                      <td className="py-1">{consent.retention}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  * 동의를 거부할 권리가 있으며,
                  {consent.required
                    ? ' 필수 항목 미동의 시 서비스 이용이 제한됩니다.'
                    : ' 선택 항목 미동의 시에도 서비스 이용이 가능합니다.'}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
