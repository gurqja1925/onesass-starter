'use client'

/**
 * PhoneInput 컴포넌트
 * 한국 전화번호 입력 (010-XXXX-XXXX)
 */

import { forwardRef, InputHTMLAttributes, useState, useEffect } from 'react'
import { Phone } from 'lucide-react'

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  error?: string
  value?: string
  onChange?: (value: string) => void
  format?: 'mobile' | 'landline' | 'any'
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, value = '', onChange, format = 'any', className = '', ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('')

    // 전화번호 포맷팅
    const formatPhone = (input: string): string => {
      const numbers = input.replace(/\D/g, '')

      if (numbers.length <= 3) return numbers
      if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }

    useEffect(() => {
      setDisplayValue(formatPhone(value))
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhone(e.target.value)
      setDisplayValue(formatted)
      onChange?.(formatted.replace(/-/g, ''))
    }

    const validate = (phone: string): boolean => {
      const cleaned = phone.replace(/-/g, '')
      if (format === 'mobile') return /^01[0-9]{8,9}$/.test(cleaned)
      if (format === 'landline') return /^0[2-6][0-9]{7,8}$/.test(cleaned)
      return /^0[0-9]{9,10}$/.test(cleaned)
    }

    const isValid = !value || validate(value)

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
            {label}
          </label>
        )}

        <div className="relative">
          <Phone
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'var(--color-text-secondary)' }}
          />
          <input
            ref={ref}
            type="tel"
            value={displayValue}
            onChange={handleChange}
            placeholder="010-1234-5678"
            maxLength={13}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none focus:ring-2"
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              borderColor: error || !isValid ? '#ef4444' : 'var(--color-border)',
            }}
            {...props}
          />
        </div>

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {!isValid && !error && (
          <p className="mt-1 text-xs text-red-500">올바른 전화번호를 입력해주세요</p>
        )}
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'
