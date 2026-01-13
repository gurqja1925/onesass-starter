/**
 * 권한 체크를 위한 React Hook
 */

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { AuthUser, SubscriptionInfo } from '@/lib/auth-middleware'

export interface UseAuthReturn {
  user: AuthUser | null
  subscription: SubscriptionInfo | null
  loading: boolean
  error: string | null
  isAdmin: boolean
  isPro: boolean
  isEnterprise: boolean
  hasValidSubscription: boolean
  refresh: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser?.email) {
        setUser(null)
        setSubscription(null)
        return
      }

      // 사용자 정보와 구독 정보 가져오기
      const response = await fetch('/api/subscription')
      
      if (!response.ok) {
        throw new Error('사용자 정보를 가져오는데 실패했습니다.')
      }

      const data = await response.json()
      setUser(data.user)
      setSubscription(data.subscription)
    } catch (err) {
      console.error('Auth error:', err)
      setError(err instanceof Error ? err.message : '알 수 없는 오류')
      setUser(null)
      setSubscription(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()

    // 인증 상태 변경 리스너
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          fetchUserData()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // 권한 관련 computed values
  const isAdmin = user?.role === 'admin'
  const isPro = user?.plan === 'pro' || user?.plan === 'enterprise'
  const isEnterprise = user?.plan === 'enterprise'
  const hasValidSubscription = Boolean(
    subscription && 
    !subscription.isExpired && 
    ['active', 'trial'].includes(subscription.status)
  )

  return {
    user,
    subscription,
    loading,
    error,
    isAdmin,
    isPro,
    isEnterprise,
    hasValidSubscription,
    refresh: fetchUserData,
  }
}

/**
 * 특정 플랜이 필요한 컴포넌트를 위한 Hook
 */
export function requirePlan(requiredPlan: 'free' | 'pro' | 'enterprise') {
  const auth = useAuth()

  const hasRequiredPlan = () => {
    if (!auth.user) return false
    
    const planHierarchy = {
      free: 0,
      pro: 1,
      enterprise: 2,
    }

    const userLevel = planHierarchy[auth.user.plan as keyof typeof planHierarchy] || 0
    const requiredLevel = planHierarchy[requiredPlan]

    return userLevel >= requiredLevel
  }

  return {
    ...auth,
    hasRequiredPlan: hasRequiredPlan(),
  }
}

/**
 * 관리자 권한이 필요한 컴포넌트를 위한 Hook
 */
export function requireAdmin() {
  const auth = useAuth()
  
  return {
    ...auth,
    isAdmin: auth.isAdmin,
    canAccess: auth.isAdmin,
  }
}

/**
 * 구독이 필요한 컴포넌트를 위한 Hook
 */
export function requireSubscription() {
  const auth = useAuth()
  
  return {
    ...auth,
    hasSubscription: auth.hasValidSubscription,
    canAccess: auth.hasValidSubscription,
  }
}