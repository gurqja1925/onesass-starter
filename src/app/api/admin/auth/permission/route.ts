import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

/**
 * 사용자 권한 확인 미들웨어
 */
export async function checkUserPermission(request: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return { authorized: false, reason: 'Unauthorized' }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      email: true,
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
    return { authorized: false, reason: 'User not found' }
  }

  // 첫 번째 가입자인지 확인
  const userCount = await prisma.user.count()
  const isFirstUser = userCount === 1

  // 관리자 권한 확인
  const isAdmin = user.role === 'admin' || isFirstUser

  // 구독 상태 확인
  const activeSubscription = user.subscriptions[0]
  const hasValidSubscription = activeSubscription && 
    new Date(activeSubscription.currentPeriodEnd) > new Date()

  return {
    authorized: true,
    user: {
      ...user,
      isFirstUser,
      isAdmin,
      hasValidSubscription,
      activeSubscription
    }
  }
}

/**
 * 관리자 권한 확인 API
 */
export async function GET(request: NextRequest) {
  const permission = await checkUserPermission(request)

  if (!permission.authorized) {
    return NextResponse.json({
      error: permission.reason,
      authorized: false
    }, { status: 401 })
  }

  return NextResponse.json({
    authorized: true,
    user: permission.user
  })
}