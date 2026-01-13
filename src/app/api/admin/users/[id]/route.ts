/**
 * 관리자 사용자 상세 API
 *
 * 개별 사용자 조회, 수정, 삭제
 * 보안: 관리자 인증 필수
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'

// 사용자 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        payments: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        subscriptions: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        aiUsages: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// 사용자 정보 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { name, role, plan, status, subscriptionEndDate } = await request.json()

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(role && { role }),
        ...(plan && { plan }),
        ...(status && { status }),
      },
    })

    // 플랜 변경 시 구독 정보도 업데이트
    if (plan && plan !== 'free') {
      const now = new Date()
      // 만료일이 지정되었으면 사용, 아니면 30일 후
      const endDate = subscriptionEndDate 
        ? new Date(subscriptionEndDate) 
        : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

      // 기존 활성 구독이 있는지 확인
      const existingSubscription = await prisma.subscription.findFirst({
        where: {
          userId: id,
          status: { in: ['active', 'trial'] },
        },
      })

      if (existingSubscription) {
        // 기존 구독 업데이트
        await prisma.subscription.update({
          where: { id: existingSubscription.id },
          data: {
            plan,
            planName: getPlanName(plan),
            status: 'active',
            currentPeriodStart: now,
            currentPeriodEnd: endDate,
            nextBillingDate: endDate,
          },
        })
      } else {
        // 새 구독 생성
        await prisma.subscription.create({
          data: {
            userId: id,
            plan,
            planName: getPlanName(plan),
            amount: getPlanAmount(plan),
            status: 'active',
            currentPeriodStart: now,
            currentPeriodEnd: endDate,
            nextBillingDate: endDate,
          },
        })
      }
    } else if (plan === 'free') {
      // 무료 플랜으로 변경 시 기존 구독 취소
      await prisma.subscription.updateMany({
        where: {
          userId: id,
          status: { in: ['active', 'trial'] },
        },
        data: {
          status: 'canceled',
          canceledAt: new Date(),
          cancelReason: '관리자에 의해 무료 플랜으로 변경',
        },
      })
    }

    // 역할/플랜 변경 시 이벤트 기록
    if (role || plan) {
      await prisma.analytics.create({
        data: {
          type: 'user_update',
          value: 1,
          metadata: {
            userId: id,
            changes: { role, plan, status, subscriptionEndDate },
          },
        },
      })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Failed to update user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// 플랜 이름 헬퍼
function getPlanName(plan: string): string {
  const names: Record<string, string> = {
    free: 'Free',
    starter: 'Starter',
    pro: 'Pro',
    enterprise: 'Enterprise',
  }
  return names[plan] || plan
}

// 플랜 가격 헬퍼
function getPlanAmount(plan: string): number {
  const amounts: Record<string, number> = {
    free: 0,
    starter: 9900,
    pro: 29000,
    enterprise: 99000,
  }
  return amounts[plan] || 0
}

// 사용자 삭제 (비활성화)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { permanent } = await request.json().catch(() => ({ permanent: false }))

    if (permanent) {
      // 영구 삭제 (CASCADE로 관련 데이터도 삭제됨)
      await prisma.user.delete({
        where: { id },
      })

      return NextResponse.json({
        success: true,
        message: '사용자가 영구 삭제되었습니다',
      })
    } else {
      // 소프트 삭제 (비활성화)
      await prisma.user.update({
        where: { id },
        data: { status: 'inactive' },
      })

      // 구독도 취소
      await prisma.subscription.updateMany({
        where: { userId: id },
        data: { status: 'canceled', canceledAt: new Date() },
      })

      return NextResponse.json({
        success: true,
        message: '사용자가 비활성화되었습니다',
      })
    }
  } catch (error) {
    console.error('Failed to delete user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
