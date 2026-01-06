'use client'

/**
 * 인증 관련 훅
 */

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

/**
 * 현재 사용자 정보
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}

/**
 * 인증 필수 체크
 * 로그인 안되어 있으면 로그인 페이지로 이동
 */
export function useRequireAuth(redirectTo = '/login') {
  const { user, loading } = useUser()

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = redirectTo
    }
  }, [user, loading, redirectTo])

  return { user, loading }
}

/**
 * 관리자 권한 체크
 */
export function useAdminAuth() {
  const { user, loading } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (user) {
      // TODO: 실제 관리자 권한 체크 로직
      // user.app_metadata.role === 'admin' 등
      setIsAdmin(user.email?.endsWith('@admin.com') ?? false)
    }
  }, [user])

  return { user, loading, isAdmin }
}
