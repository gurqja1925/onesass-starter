'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import Link from 'next/link'

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams()
  const [subscriptionInfo, setSubscriptionInfo] = useState({
    planName: '',
    customerKey: '',
  })

  useEffect(() => {
    const planName = searchParams.get('planName') || ''
    const customerKey = searchParams.get('customerKey') || ''

    setSubscriptionInfo({ planName, customerKey })
  }, [searchParams])

  return (
    <DashboardLayout title="구독 완료">
      <div className="max-w-2xl mx-auto">
        <div
          className="p-8 rounded-2xl text-center"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          {/* Success Icon */}
          <div className="mb-6">
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl"
              style={{ background: 'var(--color-accent)' }}
            >
              🔄
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">구독이 완료되었습니다!</h1>
          <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            정기결제가 성공적으로 등록되었습니다. 매월 자동으로 결제됩니다.
          </p>

          {/* Subscription Info */}
          <div
            className="p-6 rounded-xl mb-8"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
          >
            <div className="space-y-4 text-left">
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>플랜</span>
                <span className="font-medium">{subscriptionInfo.planName}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>구독 키</span>
                <span className="font-mono text-sm">{subscriptionInfo.customerKey}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>상태</span>
                <span className="font-bold" style={{ color: 'var(--color-accent)' }}>
                  활성화
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Link
              href="/service"
              className="px-6 py-3 rounded-lg font-medium transition-all hover:opacity-80"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              홈으로
            </Link>
            <Link
              href="/service/payment/history"
              className="px-6 py-3 rounded-lg font-medium transition-all hover:opacity-80"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              결제 내역 보기
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
