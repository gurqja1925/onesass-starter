import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/payment/history
 * 사용자의 결제 내역 조회
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    // 일반 결제 내역 조회
    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    // 구독 내역 조회
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    // 통합 결제 내역 생성
    const history = [
      ...payments.map(p => ({
        id: p.id,
        type: 'onetime' as const,
        orderName: p.orderName,
        amount: p.amount,
        status: p.status as 'completed' | 'pending' | 'failed',
        date: p.createdAt.toISOString().split('T')[0],
        orderId: p.orderId
      })),
      ...subscriptions.map(s => ({
        id: s.id,
        type: 'subscription' as const,
        orderName: s.planName,
        amount: s.amount,
        status: s.status as 'active' | 'canceled' | 'expired',
        date: s.createdAt.toISOString().split('T')[0],
        orderId: s.id,
        billingCycle: s.billingCycle,
        currentPeriodEnd: s.currentPeriodEnd?.toISOString().split('T')[0],
        cancelAtPeriodEnd: s.cancelAtPeriodEnd
      }))
    ]

    // 날짜순 정렬
    history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({
      success: true,
      history
    })
  } catch (error) {
    console.error('결제 내역 조회 오류:', error)
    return NextResponse.json(
      { error: '결제 내역을 불러올 수 없습니다' },
      { status: 500 }
    )
  }
}
