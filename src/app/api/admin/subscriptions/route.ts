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
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const skip = (page - 1) * limit

    const where = status ? { status } : {}

    const [subscriptions, total, statsData] = await Promise.all([
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
        _count: true,
      }),
    ])

    const stats = statsData.reduce((acc, item) => {
      acc[item.status] = item._count
      return acc
    }, { active: 0, canceled: 0, expired: 0, trial: 0 } as Record<string, number>)

    return NextResponse.json({
      subscriptions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats,
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
