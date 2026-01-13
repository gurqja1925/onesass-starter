/**
 * 사용자 권한 체크 미들웨어
 * 구독 상태와 플랜에 따른 접근 제어
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: string
  plan: string
  status: string
}

export interface SubscriptionInfo {
  id: string
  plan: string
  status: string
  currentPeriodEnd: Date
  nextBillingDate?: Date
  isExpired: boolean
  isTrialing: boolean
  daysLeft?: number
}

/**
 * 인증 사용자 정보 가져오기
 */
export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user?.email) {
      return null
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        status: true,
      },
    })

    if (!dbUser) {
      return null
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name || undefined,
      role: dbUser.role,
      plan: dbUser.plan,
      status: dbUser.status,
    }
  } catch (error) {
    console.error('Error getting auth user:', error)
    return null
  }
}

/**
 * 사용자 구독 정보 가져오기
 */
export async function getUserSubscription(userId: string): Promise<SubscriptionInfo | null> {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: {
          in: ['active', 'trial', 'past_due']
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!subscription) {
      return null
    }

    const now = new Date()
    const currentPeriodEnd = new Date(subscription.currentPeriodEnd)
    const isExpired = now > currentPeriodEnd
    const isTrialing = Boolean(
      subscription.status === 'trial' && 
      subscription.trialEnd && 
      now < new Date(subscription.trialEnd)
    )

    let daysLeft: number | undefined
    if (!isExpired) {
      daysLeft = Math.ceil((currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    }

    return {
      id: subscription.id,
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodEnd,
      nextBillingDate: subscription.nextBillingDate ? new Date(subscription.nextBillingDate) : undefined,
      isExpired,
      isTrialing,
      daysLeft,
    }
  } catch (error) {
    console.error('Error getting user subscription:', error)
    return null
  }
}

/**
 * 플랜별 접근 권한 체크
 */
export function hasPlanAccess(userPlan: string, requiredPlan: 'free' | 'pro' | 'enterprise'): boolean {
  const planHierarchy: Record<string, number> = {
    free: 0,
    pro: 1,
    enterprise: 2,
  }

  return (planHierarchy[userPlan] || 0) >= (planHierarchy[requiredPlan] || 0)
}

/**
 * 관리자 권한 체크
 */
export function isAdmin(user: AuthUser): boolean {
  return user.role === 'admin'
}

/**
 * 활성 사용자 체크
 */
export function isActiveUser(user: AuthUser): boolean {
  return user.status === 'active'
}

/**
 * 유효한 구독 체크
 */
export function hasValidSubscription(subscription: SubscriptionInfo | null): boolean {
  if (!subscription) return false
  return !subscription.isExpired && ['active', 'trial'].includes(subscription.status)
}

/**
 * 권한 기반 접근 제어 미들웨어
 */
export function createAuthMiddleware(options: {
  requiredPlan?: 'free' | 'pro' | 'enterprise'
  requireAdmin?: boolean
  requireSubscription?: boolean
  allowInactive?: boolean
}) {
  return async (req: NextRequest) => {
    try {
      // 1. 사용자 인증 체크
      const user = await getAuthUser(req)
      if (!user) {
        return NextResponse.json(
          { error: '인증이 필요합니다.' },
          { status: 401 }
        )
      }

      // 2. 활성 사용자 체크
      if (!options.allowInactive && !isActiveUser(user)) {
        return NextResponse.json(
          { error: '계정이 비활성화되었습니다.' },
          { status: 403 }
        )
      }

      // 3. 관리자 권한 체크
      if (options.requireAdmin && !isAdmin(user)) {
        return NextResponse.json(
          { error: '관리자 권한이 필요합니다.' },
          { status: 403 }
        )
      }

      // 4. 플랜 권한 체크
      if (options.requiredPlan && !hasPlanAccess(user.plan, options.requiredPlan)) {
        return NextResponse.json(
          { 
            error: `${options.requiredPlan} 플랜 이상이 필요합니다.`,
            currentPlan: user.plan,
            requiredPlan: options.requiredPlan
          },
          { status: 403 }
        )
      }

      // 5. 구독 상태 체크
      if (options.requireSubscription) {
        const subscription = await getUserSubscription(user.id)
        if (!hasValidSubscription(subscription)) {
          return NextResponse.json(
            { 
              error: '유효한 구독이 필요합니다.',
              subscription: subscription
            },
            { status: 403 }
          )
        }
      }

      // 모든 체크 통과 - 사용자 정보와 구독 정보 반환
      const subscription = options.requireSubscription ? 
        await getUserSubscription(user.id) : null

      return {
        user,
        subscription,
      }
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { error: '서버 오류가 발생했습니다.' },
        { status: 500 }
      )
    }
  }
}

// 미들웨어 생성기 편의 함수
export const requireAuth = createAuthMiddleware({})
export const requirePro = createAuthMiddleware({ requiredPlan: 'pro' })
export const requireEnterprise = createAuthMiddleware({ requiredPlan: 'enterprise' })
export const requireAdmin = createAuthMiddleware({ requireAdmin: true })
export const requireSubscription = createAuthMiddleware({ requireSubscription: true })
export const requireProSubscription = createAuthMiddleware({ 
  requiredPlan: 'pro', 
  requireSubscription: true 
})