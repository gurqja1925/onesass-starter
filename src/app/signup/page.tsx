'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    // /signup 접속 시 /auth/signup으로 리다이렉트
    router.replace('/auth/signup')
  }, [router])

  return null
}
