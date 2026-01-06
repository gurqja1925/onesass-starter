'use client'

/**
 * BusinessNumber 컴포넌트
 * 사업자등록번호 입력 (000-00-00000)
 */

import { forwardRef, InputHTMLAttributes, useState, useEffect } from 'react'
import { Building2, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export interface BusinessNumberProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  error?: string
  value?: string
  onChange?: (value: string) => void
  onValidate?: (isValid: boolean, number: string) => void
  showValidation?: boolean
}

export const BusinessNumber = forwardRef<HTMLInputElement, BusinessNumberProps>(
  ({ label, error, value = '', onChange, onValidate, showValidation = true, className = '', ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('')
    const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle')

    // 사업자등록번호 포맷팅
    const formatNumber = (input: string): string => {
      const numbers = input.replace(/\D/g, '')

      if (numbers.length <= 3) return numbers
      if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`
    }

    // 사업자등록번호 유효성 검사 (체크섬)
    const validateBusinessNumber = (number: string): boolean => {
      const cleaned = number.replace(/-/g, '')
      if (cleaned.length !== 10) return false

      const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5]
      let sum = 0

      for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned[i]) * weights[i]
      }

      sum += Math.floor((parseInt(cleaned[8]) * 5) / 10)
      const checkDigit = (10 - (sum % 10)) % 10

      return checkDigit === parseInt(cleaned[9])
    }

    useEffect(() => {
      setDisplayValue(formatNumber(value))
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatNumber(e.target.value)
      setDisplayValue(formatted)
      const cleaned = formatted.replace(/-/g, '')
      onChange?.(cleaned)

      if (cleaned.length === 10) {
        setValidationStatus('validating')
        // 간단한 검증 (실제로는 API 호출 필요)
        setTimeout(() => {
          const isValid = validateBusinessNumber(cleaned)
          setValidationStatus(isValid ? 'valid' : 'invalid')
          onValidate?.(isValid, cleaned)
        }, 500)
      } else {
        setValidationStatus('idle')
      }
    }

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
            {label}
          </label>
        )}

        <div className="relative">
          <Building2
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'var(--color-text-secondary)' }}
          />
          <input
            ref={ref}
            type="text"
            value={displayValue}
            onChange={handleChange}
            placeholder="000-00-00000"
            maxLength={12}
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border outline-none focus:ring-2"
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              borderColor: error || validationStatus === 'invalid' ? '#ef4444' :
                          validationStatus === 'valid' ? '#22c55e' : 'var(--color-border)',
            }}
            {...props}
          />

          {showValidation && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {validationStatus === 'validating' && (
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--color-text-secondary)' }} />
              )}
              {validationStatus === 'valid' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {validationStatus === 'invalid' && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {validationStatus === 'invalid' && !error && (
          <p className="mt-1 text-xs text-red-500">유효하지 않은 사업자등록번호입니다</p>
        )}
        {validationStatus === 'valid' && (
          <p className="mt-1 text-xs text-green-500">유효한 사업자등록번호입니다</p>
        )}
      </div>
    )
  }
)

BusinessNumber.displayName = 'BusinessNumber'
