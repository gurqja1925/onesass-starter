'use client'

/**
 * KRWPrice 컴포넌트
 * 원화 가격 표시 (₩1,000,000 형식)
 */

export interface KRWPriceProps {
  value: number
  showSymbol?: boolean
  showVAT?: boolean
  vatRate?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  discount?: number
  className?: string
}

export function KRWPrice({
  value,
  showSymbol = true,
  showVAT = false,
  vatRate = 0.1,
  size = 'md',
  discount,
  className = '',
}: KRWPriceProps) {
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(num))
  }

  const discountedPrice = discount ? value * (1 - discount / 100) : value
  const vatAmount = discountedPrice * vatRate
  const totalWithVAT = discountedPrice + vatAmount

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl font-bold',
  }

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className="flex items-baseline gap-2">
        {/* 할인 전 가격 */}
        {discount && (
          <span
            className="text-sm line-through"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {showSymbol && '₩'}{formatNumber(value)}
          </span>
        )}

        {/* 현재 가격 */}
        <span className={sizes[size]} style={{ color: 'var(--color-text)' }}>
          {showSymbol && <span style={{ color: 'var(--color-accent)' }}>₩</span>}
          {formatNumber(discountedPrice)}
        </span>

        {/* 할인율 */}
        {discount && (
          <span className="text-sm font-medium text-red-500">
            -{discount}%
          </span>
        )}
      </div>

      {/* 부가세 정보 */}
      {showVAT && (
        <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          <span>부가세 포함 {showSymbol && '₩'}{formatNumber(totalWithVAT)}</span>
          <span className="mx-1">|</span>
          <span>VAT {showSymbol && '₩'}{formatNumber(vatAmount)}</span>
        </div>
      )}
    </div>
  )
}
