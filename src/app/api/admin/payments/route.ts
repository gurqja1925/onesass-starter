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
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const skip = (page - 1) * limit

    const where = status ? { status } : {}

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

    // 통계 계산
    const stats = await prisma.payment.groupBy({
      by: ['status'],
      _count: true,
      _sum: { amount: true },
    })

    const statusStats = stats.reduce((acc, item) => {
      acc[item.status] = {
        count: item._count,
        total: item._sum.amount || 0,
      }
      return acc
    }, {} as Record<string, { count: number; total: number }>)

    return NextResponse.json({
      payments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats: statusStats,
    })
  } catch (error) {
    console.error('Failed to fetch payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}
