/**
 * 관리자 분석/통계 API
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
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    // 일별 분석 데이터
    const analytics = await prisma.analytics.findMany({
      where: {
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    })

    // 타입별로 그룹화
    const groupedData: Record<string, Array<{ date: string; value: number }>> = {
      pageview: [],
      signup: [],
      payment: [],
      ai_usage: [],
    }

    analytics.forEach((item) => {
      const dateStr = item.date.toISOString().split('T')[0]
      if (groupedData[item.type]) {
        groupedData[item.type].push({
          date: dateStr,
          value: item.value,
        })
      }
    })

    // 요약 통계
    const summary = {
      totalPageviews: analytics.filter(a => a.type === 'pageview').reduce((sum, a) => sum + a.value, 0),
      totalSignups: analytics.filter(a => a.type === 'signup').reduce((sum, a) => sum + a.value, 0),
      totalPayments: analytics.filter(a => a.type === 'payment').reduce((sum, a) => sum + a.value, 0),
      totalAIUsage: analytics.filter(a => a.type === 'ai_usage').reduce((sum, a) => sum + a.value, 0),
    }

    // 사용자 플랜별 분포
    const planDistribution = await prisma.user.groupBy({
      by: ['plan'],
      _count: true,
    })

    // AI 사용량 타입별 분포
    const aiUsageByType = await prisma.aIUsage.groupBy({
      by: ['type'],
      _count: true,
      _sum: { tokens: true },
    })

    return NextResponse.json({
      chartData: groupedData,
      summary,
      planDistribution: planDistribution.map(p => ({
        plan: p.plan,
        count: p._count,
      })),
      aiUsageByType: aiUsageByType.map(a => ({
        type: a.type,
        count: a._count,
        tokens: a._sum.tokens || 0,
      })),
    })
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
