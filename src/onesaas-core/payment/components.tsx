'use client'

/**
 * 결제 관련 컴포넌트
 */

import { useState } from 'react'
import { usePayment, generateOrderId } from './hooks'
import { formatPrice, isPaymentEnabled } from './config'
import { Button } from '../ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card'

interface PaymentButtonProps {
  amount: number
  productName: string
  onSuccess?: (paymentId: string) => void
  onError?: (error: string) => void
  className?: string
}

/**
 * 결제 버튼
 */
export function PaymentButton({
  amount,
  productName,
  onSuccess,
  onError,
  className = '',
}: PaymentButtonProps) {
  const { isReady, pay } = usePayment()
  const [loading, setLoading] = useState(false)

  if (!isPaymentEnabled()) {
    return null
  }

  const handleClick = async () => {
    setLoading(true)
    const result = await pay({
      orderId: generateOrderId(),
      orderName: productName,
      amount,
    })
    setLoading(false)

    if (result.success && result.paymentId) {
      onSuccess?.(result.paymentId)
    } else {
      onError?.(result.error || '결제 실패')
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={!isReady || loading}
      loading={loading}
      className={className}
    >
      {formatPrice(amount)} 결제하기
    </Button>
  )
}

interface PricingPlan {
  id: string
  name: string
  price: number | null
  period?: 'month' | 'year'
  features: string[]
  popular?: boolean
}

interface PricingCardProps {
  plan: PricingPlan
  onSelect?: (planId: string) => void
}

/**
 * 가격 카드
 */
export function PricingCard({ plan, onSelect }: PricingCardProps) {
  const isPopular = plan.popular

  return (
    <Card
      className={`relative ${isPopular ? 'scale-105' : ''}`}
      padding="lg"
    >
      {isPopular && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full"
          style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
        >
          인기
        </span>
      )}

      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          {plan.price !== null ? (
            <>
              <span className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
                {formatPrice(plan.price)}
              </span>
              <span style={{ color: 'var(--color-text-secondary)' }}>
                /{plan.period === 'year' ? '년' : '월'}
              </span>
            </>
          ) : (
            <span className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
              문의
            </span>
          )}
        </div>

        <ul className="space-y-3">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <span style={{ color: 'var(--color-accent)' }}>✓</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          variant={isPopular ? 'primary' : 'secondary'}
          onClick={() => onSelect?.(plan.id)}
          className="w-full"
        >
          {plan.price !== null ? '시작하기' : '문의하기'}
        </Button>
      </CardFooter>
    </Card>
  )
}

interface PricingTableProps {
  plans: PricingPlan[]
  onSelectPlan?: (planId: string) => void
}

/**
 * 가격표
 */
export function PricingTable({ plans, onSelectPlan }: PricingTableProps) {
  const [annual, setAnnual] = useState(false)

  return (
    <div>
      {/* 월간/연간 토글 */}
      <div className="flex justify-center mb-8">
        <div
          className="inline-flex rounded-lg p-1"
          style={{ background: 'var(--color-bg-secondary)' }}
        >
          <button
            onClick={() => setAnnual(false)}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{
              background: !annual ? 'var(--color-accent)' : 'transparent',
              color: !annual ? 'var(--color-bg)' : 'var(--color-text)',
            }}
          >
            월간
          </button>
          <button
            onClick={() => setAnnual(true)}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{
              background: annual ? 'var(--color-accent)' : 'transparent',
              color: annual ? 'var(--color-bg)' : 'var(--color-text)',
            }}
          >
            연간 <span className="ml-1 text-xs opacity-70">20% 할인</span>
          </button>
        </div>
      </div>

      {/* 가격 카드 */}
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {plans.map((plan) => {
          const adjustedPlan = annual && plan.price
            ? { ...plan, price: Math.round(plan.price * 12 * 0.8), period: 'year' as const }
            : { ...plan, period: 'month' as const }

          return (
            <PricingCard
              key={plan.id}
              plan={adjustedPlan}
              onSelect={onSelectPlan}
            />
          )
        })}
      </div>
    </div>
  )
}
