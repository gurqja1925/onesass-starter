'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import AuthModal from '@/components/AuthModal'

function SignupPageContent() {
  const [showModal, setShowModal] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const plan = searchParams.get('plan') || ''

  useEffect(() => {
    // 페이지 로드 시 모달 자동 열기
    setShowModal(true)
  }, [])

  const handleClose = () => {
    setShowModal(false)
    // 모달 닫으면 홈으로 이동
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <AuthModal
        isOpen={showModal}
        onClose={handleClose}
        redirectUrl={plan ? `/service?plan=${plan}` : '/service'}
      />
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
               style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--color-text-secondary)' }}>로딩 중...</p>
        </div>
      </div>
    }>
      <SignupPageContent />
    </Suspense>
  )
}
