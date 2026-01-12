'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import Link from 'next/link'

export default function PaymentFailPage() {
  const searchParams = useSearchParams()
  const [errorInfo, setErrorInfo] = useState({
    code: '',
    message: '',
  })

  useEffect(() => {
    const code = searchParams.get('code') || 'UNKNOWN'
    const message = searchParams.get('message') || '결제 처리 중 오류가 발생했습니다.'

    setErrorInfo({ code, message })
  }, [searchParams])

  return (
    <DashboardLayout title="결제 실패">
      <div className="max-w-2xl mx-auto">
        <div
          className="p-8 rounded-2xl text-center"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          {/* Error Icon */}
          <div className="mb-6">
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl"
              style={{ background: '#ef4444', color: '#fff' }}
            >
              ✕
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">결제에 실패했습니다</h1>
          <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            결제 처리 중 문제가 발생했습니다.
          </p>

          {/* Error Info */}
          <div
            className="p-6 rounded-xl mb-8"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
          >
            <div className="space-y-4 text-left">
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>오류 코드</span>
                <span className="font-medium">{errorInfo.code}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>오류 메시지</span>
                <span className="font-medium">{errorInfo.message}</span>
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
              다시 시도
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
