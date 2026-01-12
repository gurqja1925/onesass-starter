import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

/**
 * 구독 상태 확인 API
 * 사용자의 현재 구독 상태를 확인하고 만료된 경우 처리
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 현재 활성 구독 조회
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ['active', 'trial', 'past_due'] }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!subscription) {
      return NextResponse.json({
        hasActiveSubscription: false,
        message: '활성 구독이 없습니다.'
      })
    }

    const now = new Date()
    const periodEnd = new Date(subscription.currentPeriodEnd)

    // 구독 만료 확인
    if (periodEnd < now && subscription.status === 'active') {
      // 자동 갱신 시도 또는 만료 처리
      if (subscription.cancelAtPeriodEnd) {
        // 취소 예정이었으면 만료 처리
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'expired',
            endDate: now
          }
        })

        return NextResponse.json({
          hasActiveSubscription: false,
          message: '구독이 만료되었습니다.',
          expiredAt: periodEnd
        })
      } else {
        // 자동 갱신 시도 (실제로는 결제 처리 필요)
        return NextResponse.json({
          hasActiveSubscription: false,
          needsRenewal: true,
          message: '구독 갱신이 필요합니다.',
          subscription: {
            id: subscription.id,
            plan: subscription.plan,
            amount: subscription.amount,
            nextBillingDate: subscription.nextBillingDate
          }
        })
      }
    }

    // 체험 기간 만료 확인
    if (subscription.status === 'trial' && subscription.trialEnd) {
      const trialEnd = new Date(subscription.trialEnd)
      if (trialEnd < now) {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'expired',
            endDate: now
          }
        })

        return NextResponse.json({
          hasActiveSubscription: false,
          message: '체험 기간이 만료되었습니다.',
          expiredAt: trialEnd
        })
      }
    }

    // 정상 구독 중
    return NextResponse.json({
      hasActiveSubscription: true,
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        planName: subscription.planName,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        nextBillingDate: subscription.nextBillingDate,
        amount: subscription.amount,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        daysRemaining: Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      }
    })

  } catch (error) {
    console.error('Subscription check error:', error)
    return NextResponse.json(
      { error: 'Failed to check subscription' },
      { status: 500 }
    )
  }
}
