/**
 * 콘텐츠 API
 *
 * 보안: 인증 필수, 사용자별 데이터 격리
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, AuthResult } from '@/lib/api-auth'

// GET - 현재 사용자의 콘텐츠 조회
export async function GET(request: NextRequest) {
  // 인증 확인
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {
      userId: (auth as AuthResult).user?.id,
    }

    if (type && type !== '전체') {
      where.type = type
    }

    if (status && status !== '전체') {
      where.status = status
    }

    const contents = await prisma.content.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(contents)
  } catch (error) {
    console.error('콘텐츠 조회 실패:', error)
    return NextResponse.json({ error: '콘텐츠를 불러올 수 없습니다' }, { status: 500 })
  }
}

// POST - 새 콘텐츠 생성
export async function POST(request: NextRequest) {
  // 인증 확인
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { title, body, type = 'post', status = 'draft', metadata } = await request.json()

    if (!title) {
      return NextResponse.json({ error: '제목을 입력해주세요' }, { status: 400 })
    }

    const content = await prisma.content.create({
      data: {
        title,
        body,
        type,
        status,
        metadata,
        userId: (auth as AuthResult).user?.id || '',
      },
    })

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    console.error('콘텐츠 생성 실패:', error)
    return NextResponse.json({ error: '콘텐츠를 생성할 수 없습니다' }, { status: 500 })
  }
}
