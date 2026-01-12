/**
 * 콘텐츠 상세 API
 *
 * 보안: 인증 필수, 소유권 검증
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, AuthResult } from '@/lib/api-auth'

type RouteParams = { params: Promise<{ id: string }> }

/**
 * 콘텐츠 소유권 검증
 */
async function verifyOwnership(contentId: string, userId: string | undefined) {
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    select: { id: true, userId: true },
  })

  if (!content) {
    return { error: '콘텐츠를 찾을 수 없습니다', status: 404 }
  }

  // 소유권 확인
  if (content.userId !== userId) {
    return { error: '접근 권한이 없습니다', status: 403 }
  }

  return { content }
}

// GET - 특정 콘텐츠 조회
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  // 인증 확인
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const userId = (auth as AuthResult).user?.id

    // 소유권 검증
    const ownership = await verifyOwnership(id, userId)
    if ('error' in ownership) {
      return NextResponse.json({ error: ownership.error }, { status: ownership.status })
    }

    const content = await prisma.content.findUnique({
      where: { id },
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('콘텐츠 조회 실패:', error)
    return NextResponse.json({ error: '콘텐츠를 불러올 수 없습니다' }, { status: 500 })
  }
}

// PUT - 콘텐츠 수정
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  // 인증 확인
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const userId = (auth as AuthResult).user?.id

    // 소유권 검증
    const ownership = await verifyOwnership(id, userId)
    if ('error' in ownership) {
      return NextResponse.json({ error: ownership.error }, { status: ownership.status })
    }

    const { title, body, type, status, metadata } = await request.json()

    const content = await prisma.content.update({
      where: { id },
      data: { title, body, type, status, metadata },
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('콘텐츠 수정 실패:', error)
    return NextResponse.json({ error: '콘텐츠를 수정할 수 없습니다' }, { status: 500 })
  }
}

// DELETE - 콘텐츠 삭제
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  // 인증 확인
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const userId = (auth as AuthResult).user?.id

    // 소유권 검증
    const ownership = await verifyOwnership(id, userId)
    if ('error' in ownership) {
      return NextResponse.json({ error: ownership.error }, { status: ownership.status })
    }

    await prisma.content.delete({
      where: { id },
    })

    return NextResponse.json({ message: '콘텐츠가 삭제되었습니다' })
  } catch (error) {
    console.error('콘텐츠 삭제 실패:', error)
    return NextResponse.json({ error: '콘텐츠를 삭제할 수 없습니다' }, { status: 500 })
  }
}
