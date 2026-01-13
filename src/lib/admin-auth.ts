import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

/**
 * 관리자 권한 확인 유틸리티
 */

export interface AdminUser {
  id: string
  email: string
  name: string | null
  role: string
  plan: string
  status: string
  isFirstUser: boolean
  isAdmin: boolean
  hasValidSubscription: boolean
  activeSubscription?: {
    plan: string
    currentPeriodEnd: Date
    status: string
  }
}

/**
 * 관리자 권한 확인
 */
export async function getAdminUser(request: NextRequest): Promise<{ 
  authorized: boolean
  user?: AdminUser
  error?: string 
}> {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return { authorized: false, error: 'Unauthorized' }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        status: true,
        subscriptions: {
          where: { status: 'active' },
          select: {
            plan: true,
            currentPeriodEnd: true,
            status: true
          },
          orderBy: { currentPeriodEnd: 'desc' },
          take: 1
        }
      }
    })

    if (!user) {
      return { authorized: false, error: 'User not found' }
    }

    // 첫 번째 가입자인지 확인
    const userCount = await prisma.user.count()
    const isFirstUser = userCount === 1

    // 관리자 권한 확인
    const isAdmin = user.role === 'admin' || isFirstUser

    if (!isAdmin) {
      return { authorized: false, error: 'Insufficient permissions' }
    }

    // 구독 상태 확인
    const activeSubscription = user.subscriptions[0]
    const hasValidSubscription = activeSubscription && 
      new Date(activeSubscription.currentPeriodEnd) > new Date()

    const adminUser: AdminUser = {
      ...user,
      isFirstUser,
      isAdmin,
      hasValidSubscription,
      activeSubscription
    }

    return { authorized: true, user: adminUser }
  } catch (error) {
    console.error('Admin permission check error:', error)
    return { authorized: false, error: 'Internal server error' }
  }
}

/**
 * 사용자 구독 상태 확인
 */
export async function checkUserSubscription(userId: string): Promise<{
  hasActiveSubscription: boolean
  subscription?: {
    id: string
    plan: string
    status: string
    currentPeriodEnd: Date
    nextBillingDate?: Date | null
  }
}> {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trial'] }
      },
      orderBy: { currentPeriodEnd: 'desc' }
    })

    if (!subscription) {
      return { hasActiveSubscription: false }
    }

    const now = new Date()
    const isActive = subscription.status === 'active' && 
      new Date(subscription.currentPeriodEnd) > now

    // 만료된 구독 상태 업데이트
    if (!isActive && subscription.status === 'active') {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { 
          status: 'expired',
          endDate: now
        }
      })
    }

    return {
      hasActiveSubscription: isActive,
      subscription: isActive ? subscription : undefined
    }
  } catch (error) {
    console.error('Subscription check error:', error)
    return { hasActiveSubscription: false }
  }
}

/**
 * API 라우트 미들웨어
 */
export async function withAdminAuth(
  request: NextRequest,
  handler: (user: AdminUser) => Promise<Response>
): Promise<Response> {
  const { authorized, user, error } = await getAdminUser(request)

  if (!authorized) {
    return new Response(JSON.stringify({ error }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { 
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return handler(user)
}