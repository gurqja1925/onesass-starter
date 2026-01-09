/**
 * 관리자 콘텐츠 API
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
    const type = searchParams.get('type')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (type) where.type = type

    const [contents, total, statsData] = await Promise.all([
      prisma.content.findMany({
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
      prisma.content.count({ where }),
      prisma.content.groupBy({
        by: ['status'],
        _count: true,
      }),
    ])

    const stats = statsData.reduce((acc, item) => {
      acc[item.status] = item._count
      return acc
    }, { published: 0, draft: 0, archived: 0 } as Record<string, number>)

    return NextResponse.json({
      contents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats,
    })
  } catch (error) {
    console.error('Failed to fetch contents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contents' },
      { status: 500 }
    )
  }
}
