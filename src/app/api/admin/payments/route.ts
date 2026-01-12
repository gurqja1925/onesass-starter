/**
 * 관리자 결제 목록 API
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
    const type = searchParams.get('type')
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
      ...(type && { type })
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
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
      prisma.payment.count({ where }),
    ])

    // 전체 통계 계산
    const aggregateStats = await prisma.payment.aggregate({
      where,
      _sum: {
        amount: true,
        refundedAmount: true
      },
      _count: {
        id: true
      }
    })

    // 상태별 통계
    const statusStats = await prisma.payment.groupBy({
      by: ['status'],
      where,
      _count: {
        id: true
      },
      _sum: {
        amount: true
      },
    })

    // 유형별 통계
    const typeStats = await prisma.payment.groupBy({
      by: ['type'],
      where,
      _count: {
        id: true
      },
      _sum: {
        amount: true
      },
    })

    return NextResponse.json({
      payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        totalAmount: aggregateStats._sum.amount || 0,
        totalRefunded: aggregateStats._sum.refundedAmount || 0,
        totalCount: aggregateStats._count.id || 0,
        byStatus: statusStats.reduce((acc, item) => {
          acc[item.status] = {
            count: item._count.id,
            amount: item._sum.amount || 0,
          }
          return acc
        }, {} as Record<string, { count: number; amount: number }>),
        byType: typeStats.reduce((acc, item) => {
          acc[item.type] = {
            count: item._count.id,
            amount: item._sum.amount || 0,
          }
          return acc
        }, {} as Record<string, { count: number; amount: number }>)
      }
    })
  } catch (error) {
    console.error('Failed to fetch payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}
