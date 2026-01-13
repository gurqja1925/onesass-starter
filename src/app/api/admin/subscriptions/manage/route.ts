import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * 구독 관리 API
 * - 구독 상태 확인
 * - 구독 생성/갱신/취소
 * - 만료된 구독 처리
 */

// 구독 상태 조회
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const status = searchParams.get('status')

  try {
    const where: any = {}
    if (userId) where.userId = userId
    if (status) where.status = status

    const subscriptions = await prisma.subscription.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // 만료된 구독 상태 업데이트
    const now = new Date()
    for (const subscription of subscriptions) {
      if (subscription.status === 'active' && subscription.currentPeriodEnd < now) {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { 
            status: 'expired',
            endDate: now
          }
        })
      }
    }

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error('Subscription fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 })
  }
}

// 구독 생성/업데이트
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { userId, plan, planName, amount, billingCycle, currentPeriodEnd } = data

    // 기존 활성 구독 확인
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trial'] }
      }
    })

    if (existingSubscription) {
      // 기존 구독 업데이트
      const updatedSubscription = await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          plan,
          planName,
          amount,
          billingCycle,
          currentPeriodEnd: new Date(currentPeriodEnd),
          nextBillingDate: new Date(currentPeriodEnd),
          status: 'active',
          updatedAt: new Date()
        }
      })

      return NextResponse.json({ subscription: updatedSubscription })
    } else {
      // 새 구독 생성
      const newSubscription = await prisma.subscription.create({
        data: {
          userId,
          plan,
          planName,
          amount,
          billingCycle,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(currentPeriodEnd),
          nextBillingDate: new Date(currentPeriodEnd),
          status: 'active'
        }
      })

      return NextResponse.json({ subscription: newSubscription })
    }
  } catch (error) {
    console.error('Subscription creation error:', error)
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}

// 구독 취소
export async function PUT(request: NextRequest) {
  try {
    const { subscriptionId, cancelReason } = await request.json()

    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'canceled',
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
        cancelReason
      }
    })

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error('Subscription cancellation error:', error)
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}