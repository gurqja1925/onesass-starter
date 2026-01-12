/**
 * 관리자 사용자 구독 정보 API
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'

// 사용자 구독 정보 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params

    // 활성 구독 찾기
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: id,
        status: { in: ['active', 'trial'] }
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!subscription) {
      return NextResponse.json({ subscription: null })
    }

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        planName: subscription.planName,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
      }
    })
  } catch (error) {
    console.error('Failed to fetch subscription:', error)
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 })
  }
}
