/**
 * 관리자 통계 API
 *
 * 보안: 관리자 인증 필수
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      totalUsers,
      newUsersToday,
      activeSubscriptions,
      monthlyRevenue,
      totalPayments,
      totalAIUsage,
    ] = await Promise.all([
      // 전체 사용자 수
      prisma.user.count(),

      // 오늘 가입한 사용자 수
      prisma.user.count({
        where: {
          createdAt: { gte: today },
        },
      }),

      // 활성 구독 수
      prisma.subscription.count({
        where: {
          status: 'active',
        },
      }),

      // 이번 달 매출 (완료된 결제 합계)
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'completed',
          createdAt: {
            gte: new Date(today.getFullYear(), today.getMonth(), 1),
          },
        },
      }),

      // 전체 결제 건수
      prisma.payment.count({
        where: { status: 'completed' },
      }),

      // 전체 AI 사용량
      prisma.aIUsage.count(),
    ])

    return NextResponse.json({
      totalUsers,
      newUsersToday,
      activeSubscriptions,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      totalPayments,
      totalAIUsage,
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
