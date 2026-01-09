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
