'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/onesaas-core/auth/provider'

interface SubscriptionStatus {
  hasActiveSubscription: boolean
  subscription?: any
  message?: string
  needsRenewal?: boolean
  expiredAt?: string
}

/**
 * 구독 상태 확인 훅
 */
export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    checkSubscription()
  }, [user])

  const checkSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/check')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Failed to check subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  return { status, loading, refetch: checkSubscription }
}

/**
 * 구독 필수 컴포넌트 (구독이 없으면 결제 페이지로 리다이렉트)
 */
export function RequireSubscription({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { status, loading } = useSubscription()

  // 결제 관련 페이지는 허용
  const isPaymentPage = pathname?.startsWith('/service/payment') ||
                        pathname?.startsWith('/service/refund-policy')

  useEffect(() => {
    if (loading) return

    // 구독이 없고, 결제 페이지가 아니면 리다이렉트
    if (!status?.hasActiveSubscription && !isPaymentPage) {
      router.push('/service/payment?expired=true')
    }
  }, [status, loading, isPaymentPage, router])

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">⏳</div>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            구독 상태를 확인하는 중...
          </p>
        </div>
      </div>
    )
  }

  // 구독 만료됨
  if (!status?.hasActiveSubscription && !isPaymentPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          className="max-w-md w-full p-8 rounded-2xl text-center"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold mb-4">구독이 만료되었습니다</h1>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            {status?.message || '서비스를 계속 이용하시려면 구독을 갱신해주세요.'}
          </p>
          <button
            onClick={() => router.push('/service/payment')}
            className="w-full py-3 rounded-lg font-medium transition-all hover:opacity-80"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            💳 구독 갱신하기
          </button>
        </div>
      </div>
    )
  }

  // 정상 구독 중 또는 결제 페이지
  return <>{children}</>
}

/**
 * 구독 만료 경고 배너
 */
export function SubscriptionExpiryWarning() {
  const { status } = useSubscription()
  const router = useRouter()

  if (!status?.subscription) return null

  const daysRemaining = status.subscription.daysRemaining

  // 7일 이내 만료 예정이면 경고
  if (daysRemaining && daysRemaining <= 7 && daysRemaining > 0) {
    return (
      <div
        className="p-4 m-4 rounded-lg flex items-center justify-between"
        style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #f59e0b' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold">구독 만료 예정</p>
            <p className="text-sm">
              {daysRemaining}일 후 구독이 만료됩니다.
              {status.subscription.cancelAtPeriodEnd && ' (취소 예정)'}
            </p>
          </div>
        </div>
        {!status.subscription.cancelAtPeriodEnd && (
          <button
            onClick={() => router.push('/service/payment/history')}
            className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80"
            style={{ background: '#f59e0b', color: '#fff' }}
          >
            갱신하기
          </button>
        )}
      </div>
    )
  }

  // 취소 예정 알림
  if (status.subscription.cancelAtPeriodEnd) {
    return (
      <div
        className="p-4 m-4 rounded-lg flex items-center justify-between"
        style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #ef4444' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <p className="font-bold">구독 취소됨</p>
            <p className="text-sm">
              {new Date(status.subscription.currentPeriodEnd).toLocaleDateString()}
              까지 서비스를 이용할 수 있습니다.
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push('/service/payment')}
          className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80"
          style={{ background: '#ef4444', color: '#fff' }}
        >
          재구독하기
        </button>
      </div>
    )
  }

  return null
}
