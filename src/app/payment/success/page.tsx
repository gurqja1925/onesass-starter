'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/onesaas-core/ui/Card'
import { Button } from '@/onesaas-core/ui/Button'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')

  const impUid = searchParams.get('imp_uid')
  const merchantUid = searchParams.get('merchant_uid')
  const amount = searchParams.get('amount')

  useEffect(() => {
    const verifyPayment = async () => {
      if (!impUid || !merchantUid) {
        setError('결제 정보가 올바르지 않습니다')
        setVerifying(false)
        return
      }

      try {
        const res = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            impUid,
            merchantUid,
            amount: parseInt(amount || '0'),
          }),
        })

        const data = await res.json()

        if (data.verified) {
          setVerified(true)
        } else {
          setError(data.error || '결제 검증에 실패했습니다')
        }
      } catch {
        setError('결제 검증 중 오류가 발생했습니다')
      } finally {
        setVerifying(false)
      }
    }

    verifyPayment()
  }, [impUid, merchantUid, amount])

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--color-bg)' }}
    >
      <Card className="max-w-md w-full">
        <CardContent className="text-center py-12">
          {verifying ? (
            <>
              <div className="text-6xl mb-6 animate-pulse">⏳</div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                결제 확인 중...
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                잠시만 기다려주세요
              </p>
            </>
          ) : verified ? (
            <>
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                결제 완료!
              </h1>
              <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                결제가 성공적으로 처리되었습니다.
                <br />
                감사합니다!
              </p>
              <div className="space-y-3">
                <Link href="/dashboard">
                  <Button className="w-full">대시보드로 이동</Button>
                </Link>
                <Link href="/">
                  <Button variant="secondary" className="w-full">홈으로</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl mb-6">❌</div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                결제 확인 실패
              </h1>
              <p className="mb-6" style={{ color: '#ef4444' }}>
                {error}
              </p>
              <div className="space-y-3">
                <Link href="/pricing">
                  <Button className="w-full">다시 시도</Button>
                </Link>
                <Link href="/support">
                  <Button variant="secondary" className="w-full">고객지원 문의</Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
