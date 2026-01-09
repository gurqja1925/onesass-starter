'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/onesaas-core/ui/Card'
import { Button } from '@/onesaas-core/ui/Button'
import { Loading } from '@/onesaas-core/ui/Loading'

function PaymentFailContent() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('error_code')
  const errorMsg = searchParams.get('error_msg')

  const getErrorMessage = () => {
    if (errorMsg) return decodeURIComponent(errorMsg)
    switch (errorCode) {
      case 'USER_CANCEL':
        return '결제를 취소하셨습니다'
      case 'TIMEOUT':
        return '결제 시간이 초과되었습니다'
      case 'CARD_DECLINE':
        return '카드 승인이 거절되었습니다'
      default:
        return '결제 처리 중 오류가 발생했습니다'
    }
  }

  return (
    <Card className="max-w-md w-full">
      <CardContent className="text-center py-12">
        <div className="text-6xl mb-6">😢</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          결제 실패
        </h1>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          {getErrorMessage()}
        </p>

        {errorCode && (
          <p className="text-xs mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            오류 코드: {errorCode}
          </p>
        )}

        <div className="space-y-3">
          <Link href="/pricing">
            <Button className="w-full">다시 시도</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" className="w-full">홈으로</Button>
          </Link>
        </div>

        <p className="mt-6 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          문제가 지속되면{' '}
          <Link href="/support" style={{ color: 'var(--color-accent)' }}>
            고객지원
          </Link>
          으로 문의해주세요.
        </p>
      </CardContent>
    </Card>
  )
}

export default function PaymentFailPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--color-bg)' }}
    >
      <Suspense fallback={<Loading size="lg" text="로딩 중..." />}>
        <PaymentFailContent />
      </Suspense>
    </div>
  )
}
