'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { formatPrice } from '@/onesaas-core/payment/config'
import Link from 'next/link'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [paymentInfo, setPaymentInfo] = useState({
    orderId: '',
    amount: 0,
    orderName: '',
  })

  useEffect(() => {
    const orderId = searchParams.get('orderId') || ''
    const amount = parseInt(searchParams.get('amount') || '0')
    const orderName = searchParams.get('orderName') || ''

    setPaymentInfo({ orderId, amount, orderName })
  }, [searchParams])

  return (
    <DashboardLayout title="결제 완료">
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
              ✓
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">결제가 완료되었습니다!</h1>
          <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            감사합니다. 결제가 성공적으로 처리되었습니다.
          </p>

          {/* Payment Info */}
          <div
            className="p-6 rounded-xl mb-8"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
          >
            <div className="space-y-4 text-left">
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>주문번호</span>
                <span className="font-medium">{paymentInfo.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>상품명</span>
                <span className="font-medium">{paymentInfo.orderName}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>결제금액</span>
                <span className="text-xl font-bold" style={{ color: 'var(--color-accent)' }}>
                  {formatPrice(paymentInfo.amount)}
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
              href="/service/payment"
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


export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
