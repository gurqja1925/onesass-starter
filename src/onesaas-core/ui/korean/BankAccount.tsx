'use client'

/**
 * BankAccount 컴포넌트
 * 한국 은행 계좌번호 입력
 */

import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { Building, ChevronDown, Check } from 'lucide-react'

const KOREAN_BANKS = [
  { code: '004', name: 'KB국민은행' },
  { code: '088', name: '신한은행' },
  { code: '020', name: '우리은행' },
  { code: '081', name: '하나은행' },
  { code: '011', name: 'NH농협은행' },
  { code: '003', name: '기업은행' },
  { code: '023', name: 'SC제일은행' },
  { code: '027', name: '씨티은행' },
  { code: '039', name: '경남은행' },
  { code: '034', name: '광주은행' },
  { code: '031', name: '대구은행' },
  { code: '032', name: '부산은행' },
  { code: '045', name: '새마을금고' },
  { code: '007', name: '수협은행' },
  { code: '035', name: '제주은행' },
  { code: '037', name: '전북은행' },
  { code: '071', name: '우체국' },
  { code: '089', name: '케이뱅크' },
  { code: '090', name: '카카오뱅크' },
  { code: '092', name: '토스뱅크' },
]

export interface BankAccountProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  error?: string
  bankCode?: string
  accountNumber?: string
  onBankChange?: (bankCode: string) => void
  onAccountChange?: (accountNumber: string) => void
  showHolderName?: boolean
  holderName?: string
  onHolderChange?: (name: string) => void
}

export const BankAccount = forwardRef<HTMLInputElement, BankAccountProps>(
  ({
    label,
    error,
    bankCode = '',
    accountNumber = '',
    onBankChange,
    onAccountChange,
    showHolderName = false,
    holderName = '',
    onHolderChange,
    className = '',
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false)

    const selectedBank = KOREAN_BANKS.find(b => b.code === bankCode)

    const formatAccountNumber = (input: string): string => {
      return input.replace(/\D/g, '').slice(0, 16)
    }

    const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatAccountNumber(e.target.value)
      onAccountChange?.(formatted)
    }

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
            {label}
          </label>
        )}

        <div className="space-y-2">
          {/* 은행 선택 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border"
              style={{
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                borderColor: error ? '#ef4444' : 'var(--color-border)',
              }}
            >
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                <span>{selectedBank?.name || '은행을 선택하세요'}</span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div
                className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg border shadow-lg"
                style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
              >
                {KOREAN_BANKS.map((bank) => (
                  <button
                    key={bank.code}
                    type="button"
                    onClick={() => {
                      onBankChange?.(bank.code)
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span style={{ color: 'var(--color-text)' }}>{bank.name}</span>
                    {bank.code === bankCode && (
                      <Check className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 계좌번호 입력 */}
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            value={accountNumber}
            onChange={handleAccountChange}
            placeholder="계좌번호를 입력하세요 (- 없이)"
            maxLength={16}
            className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2"
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              borderColor: error ? '#ef4444' : 'var(--color-border)',
            }}
            {...props}
          />

          {/* 예금주명 */}
          {showHolderName && (
            <input
              type="text"
              value={holderName}
              onChange={(e) => onHolderChange?.(e.target.value)}
              placeholder="예금주명"
              className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2"
              style={{
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
            />
          )}
        </div>

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

BankAccount.displayName = 'BankAccount'
