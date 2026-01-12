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

// 콘텐츠 추가
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { title, body, type = 'post', status = 'draft', userId } = await request.json()

    if (!title) {
      return NextResponse.json({ error: '제목을 입력해주세요' }, { status: 400 })
    }

    const content = await prisma.content.create({
      data: {
        title,
        body,
        type,
        status,
        userId,
      },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    })

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    console.error('Failed to create content:', error)
    return NextResponse.json({ error: '콘텐츠 생성에 실패했습니다' }, { status: 500 })
  }
}

// 콘텐츠 수정
export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id, title, body, type, status } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다' }, { status: 400 })
    }

    const content = await prisma.content.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(body !== undefined && { body }),
        ...(type && { type }),
        ...(status && { status }),
      },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Failed to update content:', error)
    return NextResponse.json({ error: '콘텐츠 수정에 실패했습니다' }, { status: 500 })
  }
}

// 콘텐츠 삭제
export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다' }, { status: 400 })
    }

    await prisma.content.delete({
      where: { id },
    })

    return NextResponse.json({ message: '콘텐츠가 삭제되었습니다' })
  } catch (error) {
    console.error('Failed to delete content:', error)
    return NextResponse.json({ error: '콘텐츠 삭제에 실패했습니다' }, { status: 500 })
  }
}
