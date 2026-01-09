/**
 * 관리자 구독 상세 API
 *
 * 개별 구독 조회, 수정, 취소
 * 보안: 관리자 인증 필수
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'

// 구독 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    })

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error('Failed to fetch subscription:', error)
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 })
  }
}

// 구독 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { plan, status, currentPeriodEnd } = await request.json()

    const oldSubscription = await prisma.subscription.findUnique({
      where: { id },
    })

    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        ...(plan && { plan }),
        ...(status && { status }),
        ...(currentPeriodEnd && { currentPeriodEnd: new Date(currentPeriodEnd) }),
      },
    })

    // 플랜 변경 시 사용자 플랜도 업데이트
    if (plan && subscription.userId) {
      await prisma.user.update({
        where: { id: subscription.userId },
        data: { plan },
      })
    }

    // 이벤트 기록
    await prisma.analytics.create({
      data: {
        type: 'subscription_update',
        value: 1,
        metadata: {
          subscriptionId: id,
          userId: subscription.userId,
          oldPlan: oldSubscription?.plan,
          newPlan: plan,
          oldStatus: oldSubscription?.status,
          newStatus: status,
        },
      },
    })

    return NextResponse.json({ success: true, subscription })
  } catch (error) {
    console.error('Failed to update subscription:', error)
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
  }
}

// 구독 취소
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { immediate } = await request.json().catch(() => ({ immediate: false }))

    const subscription = await prisma.subscription.findUnique({
      where: { id },
    })

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    if (immediate) {
      // 즉시 취소
      await prisma.subscription.update({
        where: { id },
        data: {
          status: 'canceled',
          canceledAt: new Date(),
          currentPeriodEnd: new Date(),
        },
      })

      // 사용자 플랜을 무료로 변경
      await prisma.user.update({
        where: { id: subscription.userId },
        data: { plan: 'free' },
      })
    } else {
      // 기간 만료 시 취소 (현재 기간 끝까지 유지)
      await prisma.subscription.update({
        where: { id },
        data: {
          status: 'canceled',
          canceledAt: new Date(),
        },
      })
    }

    // 취소 이벤트 기록
    await prisma.analytics.create({
      data: {
        type: 'subscription_cancel',
        value: 1,
        metadata: {
          subscriptionId: id,
          userId: subscription.userId,
          plan: subscription.plan,
          immediate,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: immediate ? '구독이 즉시 취소되었습니다' : '구독이 기간 만료 시 취소됩니다',
    })
  } catch (error) {
    console.error('Failed to cancel subscription:', error)
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}
