'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { useAuth } from '@/onesaas-core/auth/provider'
import { usePayment } from '@/onesaas-core/payment/hooks'
import { formatPrice } from '@/onesaas-core/payment/config'
import { PaymentTerms } from '@/onesaas-core/payment/terms'
import Link from 'next/link'

interface Plan {
  id: string
  name: string
  price: number
  yearlyPrice: number
  features: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 10000,
    yearlyPrice: 96000,
    features: ['기본 기능', '월 1,000회 API 호출', '이메일 지원', '1GB 저장공간']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 30000,
    yearlyPrice: 288000,
    features: ['모든 기본 기능', '월 10,000회 API 호출', '우선 지원', '10GB 저장공간', '고급 분석'],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 100000,
    yearlyPrice: 960000,
    features: ['모든 Pro 기능', '무제한 API 호출', '24/7 전화 지원', '무제한 저장공간', '맞춤 개발']
  }
]

export default function PaymentPage() {
  const { user } = useAuth()
  const { subscribe, isReady } = usePayment()
  const [isYearly, setIsYearly] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const handlePayment = async (plan: Plan) => {
    // 약관 동의 화면 표시
    setSelectedPlan(plan)
    setShowTerms(true)
  }

  const proceedPayment = async () => {
    if (!selectedPlan || !isReady) {
      return
    }

    setShowTerms(false)
    setPaymentLoading(true)

    try {
      // 구독 결제 (정기결제)
      const planName = `${selectedPlan.name} ${isYearly ? '연간' : '월간'} 구독`

      await subscribe({
        planName,
        customerName: user?.user_metadata?.name || user?.email?.split('@')[0] || '사용자',
        customerEmail: user?.email || '',
        customerPhone: '01012345678'
      })
      // 성공 시 자동으로 successUrl로 리다이렉트
    } catch (error) {
      alert('구독 등록 중 오류가 발생했습니다.')
      console.error('Subscription error:', error)
    } finally {
      setPaymentLoading(false)
    }
  }

  return (
    <DashboardLayout title="결제">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🔄 구독 플랜 선택</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            플랜을 선택하고 정기 구독을 시작하세요
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <span style={{ color: isYearly ? 'var(--color-text-secondary)' : 'var(--color-text)' }}>
            월간
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-14 h-7 rounded-full transition-all"
            style={{ background: isYearly ? 'var(--color-accent)' : 'var(--color-border)' }}
          >
            <div
              className="absolute top-1 w-5 h-5 rounded-full transition-all"
              style={{
                background: '#fff',
                left: isYearly ? 'calc(100% - 24px)' : '4px'
              }}
            />
          </button>
          <span style={{ color: isYearly ? 'var(--color-text)' : 'var(--color-text-secondary)' }}>
            연간
          </span>
          {isYearly && (
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              20% 할인
            </span>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.price

            return (
              <div
                key={plan.id}
                className="p-6 rounded-2xl transition-all relative"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: plan.popular ? '2px solid var(--color-accent)' : '1px solid var(--color-border)'
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    인기
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{formatPrice(price)}</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    {isYearly ? '/년' : '/월'}
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span style={{ color: 'var(--color-accent)' }}>✓</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePayment(plan)}
                  disabled={paymentLoading || !isReady}
                  className="w-full py-3 rounded-lg font-medium transition-all hover:opacity-80 disabled:opacity-50"
                  style={{
                    background: plan.popular ? 'var(--color-accent)' : 'var(--color-bg)',
                    color: plan.popular ? 'var(--color-bg)' : 'var(--color-text)',
                    border: plan.popular ? 'none' : '1px solid var(--color-border)'
                  }}
                >
                  {paymentLoading ? '처리 중...' : '🔄 구독하기'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Subscription Info */}
        <div
          className="p-6 rounded-2xl"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <h3 className="text-xl font-bold mb-4">📌 구독 안내</h3>
          <ul className="space-y-2 mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            <li>✓ <strong>정기 구독:</strong> 선택한 주기(월간/연간)로 자동 결제됩니다</li>
            <li>✓ <strong>안전한 결제:</strong> TossPayments 결제 시스템 사용</li>
            <li>✓ <strong>언제든 취소:</strong> 구독은 언제든지 취소 가능하며, 현재 기간까지 서비스 이용 가능</li>
            <li>✓ <strong>플랜 변경:</strong> 구독 관리에서 언제든 플랜 변경 가능</li>
            <li>✓ <strong>테스트 모드:</strong> 현재 테스트 모드로 실제 결제는 되지 않습니다</li>
          </ul>
          <Link
            href="/service/refund-policy"
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--color-accent)' }}
          >
            📋 취소 및 환불 정책 자세히 보기 →
          </Link>
        </div>
      </div>

      {/* Payment Terms Modal */}
      {showTerms && (
        <PaymentTerms
          onAgree={proceedPayment}
          onCancel={() => {
            setShowTerms(false)
            setSelectedPlan(null)
          }}
        />
      )}
    </DashboardLayout>
  )
}
