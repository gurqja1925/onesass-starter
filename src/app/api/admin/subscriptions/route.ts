/**
 * 관리자 구독 API
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const plan = searchParams.get('plan')
    const year = searchParams.get('year')
    const month = searchParams.get('month')
    const skip = (page - 1) * limit

    // 날짜 필터링 조건 구성
    let dateFilter = {}
    if (year) {
      const yearNum = parseInt(year)
      const startDate = new Date(yearNum, month ? parseInt(month) - 1 : 0, 1)
      const endDate = month
        ? new Date(yearNum, parseInt(month), 0, 23, 59, 59)
        : new Date(yearNum, 11, 31, 23, 59, 59)

      dateFilter = {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    }

    // 필터 조건 구성
    const where = {
      ...dateFilter,
      ...(status && { status }),
      ...(plan && { plan })
    }

    const [subscriptions, total, statusStats, planStats] = await Promise.all([
      prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      }),
      prisma.subscription.count({ where }),
      prisma.subscription.groupBy({
        by: ['status'],
        where,
        _count: {
          id: true
        },
        _sum: {
          amount: true
        }
      }),
      prisma.subscription.groupBy({
        by: ['plan'],
        where,
        _count: {
          id: true
        },
        _sum: {
          amount: true
        }
      })
    ])

    // MRR (월간 반복 수익) 계산
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        status: { in: ['active', 'trial'] }
      },
      select: {
        amount: true,
        billingCycle: true
      }
    })

    const mrr = activeSubscriptions.reduce((sum, sub) => {
      const monthlyAmount = sub.billingCycle === 'yearly'
        ? Math.round(sub.amount / 12)
        : sub.amount
      return sum + monthlyAmount
    }, 0)

    return NextResponse.json({
      subscriptions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        byStatus: statusStats.reduce((acc, item) => {
          acc[item.status] = {
            count: item._count.id,
            revenue: item._sum.amount || 0
          }
          return acc
        }, {} as Record<string, { count: number; revenue: number }>),
        byPlan: planStats.reduce((acc, item) => {
          acc[item.plan] = {
            count: item._count.id,
            revenue: item._sum.amount || 0
          }
          return acc
        }, {} as Record<string, { count: number; revenue: number }>),
        mrr,
        activeCount: statusStats.find(s => s.status === 'active')?._count.id || 0,
        trialCount: statusStats.find(s => s.status === 'trial')?._count.id || 0,
        canceledCount: statusStats.find(s => s.status === 'canceled')?._count.id || 0
      }
    })
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}

// 구독 수정 (연장/취소/상태변경)
export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, action, days, plan, status } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다' }, { status: 400 })
    }

    const subscription = await prisma.subscription.findUnique({ where: { id } })
    if (!subscription) {
      return NextResponse.json({ error: '구독을 찾을 수 없습니다' }, { status: 404 })
    }

    let updateData: Record<string, unknown> = {}

    // 구독 연장
    if (action === 'extend' && days) {
      const currentEnd = new Date(subscription.currentPeriodEnd || new Date())
      const newEnd = new Date(currentEnd.getTime() + days * 24 * 60 * 60 * 1000)
      updateData = {
        currentPeriodEnd: newEnd,
        status: 'active', // 연장하면 활성화
        canceledAt: null,
      }
    }
    // 구독 취소
    else if (action === 'cancel') {
      updateData = {
        status: 'canceled',
        canceledAt: new Date(),
      }
    }
    // 구독 재활성화
    else if (action === 'reactivate') {
      updateData = {
        status: 'active',
        canceledAt: null,
      }
    }
    // 플랜 변경
    else if (plan) {
      updateData = { plan }
    }
    // 상태 변경
    else if (status) {
      updateData = { status }
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update subscription:', error)
    return NextResponse.json({ error: '구독 수정에 실패했습니다' }, { status: 500 })
  }
}
