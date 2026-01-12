'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // 로그인 및 관리자 권한 확인
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          // 관리자 권한 확인 (첫 번째 가입자 또는 admin role)
          if (data.user.role === 'admin' || data.user.isFirstUser) {
            setIsAuthorized(true)
          } else {
            // 권한 없음 - 홈으로 리다이렉트
            router.push('/')
          }
        } else {
          // 로그인 안 됨 - 로그인 페이지로 리다이렉트
          router.push('/login?redirect=/admin')
        }
        setIsChecking(false)
      })
      .catch(() => {
        router.push('/login?redirect=/admin')
        setIsChecking(false)
      })
  }, [router])

  // 체크 중이거나 권한 없으면 아무것도 안 보여줌
  if (isChecking || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p style={{ color: 'var(--color-text-secondary)' }}>권한 확인 중...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
