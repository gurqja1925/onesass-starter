import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

// 플랜 정보
const PLANS = {
  starter: { name: 'Starter 월간 구독', amount: 10000 },
  pro: { name: 'Pro 월간 구독', amount: 30000 },
  enterprise: { name: 'Enterprise 월간 구독', amount: 100000 },
}

/**
 * 플랜 변경 API
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()

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

    const body = await request.json()
    const { subscriptionId, newPlan, immediate } = body

    // 새 플랜 정보 확인
    const newPlanInfo = PLANS[newPlan as keyof typeof PLANS]
    if (!newPlanInfo) {
      return NextResponse.json(
        { error: '유효하지 않은 플랜입니다.' },
        { status: 400 }
      )
    }

    // 현재 구독 조회
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: user.id,
        status: 'active'
      }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: '활성 구독을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 동일한 플랜 체크
    if (subscription.plan === newPlan) {
      return NextResponse.json(
        { error: '이미 해당 플랜을 사용 중입니다.' },
        { status: 400 }
      )
    }

    const now = new Date()

    if (immediate) {
      // 즉시 변경: 차액 정산
      const daysRemaining = Math.ceil(
        (new Date(subscription.currentPeriodEnd).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24)
      )
      const daysInPeriod = 30
      const remainingValue = Math.floor((subscription.amount / daysInPeriod) * daysRemaining)
      const newPlanProration = Math.floor((newPlanInfo.amount / daysInPeriod) * daysRemaining)
      const difference = newPlanProration - remainingValue

      // 플랜 즉시 변경
      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          plan: newPlan,
          planName: newPlanInfo.name,
          amount: newPlanInfo.amount,
          scheduledPlanChange: null,
          planChangeDate: null
        }
      })

      // TODO: 차액 결제 또는 환불 처리 (TossPayments API)

      return NextResponse.json({
        success: true,
        message: '플랜이 즉시 변경되었습니다.',
        newPlan,
        difference, // 양수면 추가 결제, 음수면 환불
        daysRemaining
      })
    } else {
      // 다음 결제일에 변경 예약
      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          scheduledPlanChange: newPlan,
          planChangeDate: subscription.nextBillingDate
        }
      })

      return NextResponse.json({
        success: true,
        message: '플랜 변경이 예약되었습니다. 다음 결제일부터 새로운 플랜이 적용됩니다.',
        newPlan,
        changeDate: subscription.nextBillingDate
      })
    }

  } catch (error) {
    console.error('Plan change error:', error)
    return NextResponse.json(
      { error: 'Failed to change plan' },
      { status: 500 }
    )
  }
}
