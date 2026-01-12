import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

/**
 * 구독 취소 API
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { subscriptionId, reason, immediate } = body

    // 구독 조회
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

    const now = new Date()

    if (immediate) {
      // 즉시 취소: 구독 종료 + 환불 처리
      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'canceled',
          canceledAt: now,
          cancelReason: reason,
          endDate: now
        }
      })

      // TODO: 남은 기간에 대한 환불 처리 (TossPayments API 호출)
      // TODO: 빌링키 해지

      return NextResponse.json({
        success: true,
        message: '구독이 즉시 취소되었습니다.',
        canceledAt: now
      })
    } else {
      // 기간 종료 시 취소: 기간 만료까지 서비스 이용 가능
      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          cancelAtPeriodEnd: true,
          canceledAt: now,
          cancelReason: reason
        }
      })

      // TODO: 다음 자동 결제 중단 (TossPayments 빌링 스케줄 취소)

      return NextResponse.json({
        success: true,
        message: '구독이 취소 예약되었습니다. 현재 구독 기간까지 서비스를 이용할 수 있습니다.',
        canceledAt: now,
        expiresAt: subscription.currentPeriodEnd
      })
    }

  } catch (error) {
    console.error('Subscription cancel error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}
