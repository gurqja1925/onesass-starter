'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  // 로그인 페이지는 인증 체크 건너뛰기
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // 로그인 페이지는 인증 없이 바로 표시
    if (isLoginPage) {
      setIsChecking(false)
      setIsAuthorized(true)
      return
    }

    // 로그인 및 관리자 권한 확인
    const checkAuth = async () => {
      try {
        // 잠시 대기하여 DB 동기화 완료 시간 확보
        await new Promise(resolve => setTimeout(resolve, 1000))

        const response = await fetch('/api/auth/session')
        const data = await response.json()

        if (data.user) {
          // 관리자 권한 확인 (isAdmin 필드 사용)
          if (data.user.isAdmin) {
            setIsAuthorized(true)
          } else {
            // 권한 없음 - 홈으로 리다이렉트
            router.push('/')
          }
        } else {
          // 로그인 안 됨 - 관리자 로그인 페이지로 리다이렉트
          router.push('/admin/login')
        }
        setIsChecking(false)
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/login?redirect=/admin')
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [router, isLoginPage])

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
