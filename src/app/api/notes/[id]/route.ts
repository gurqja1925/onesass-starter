/**
 * 노트 상세 API
 *
 * 보안: 인증 필수, 소유권 검증
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, AuthResult } from '@/lib/api-auth'

type RouteParams = { params: Promise<{ id: string }> }

/**
 * 노트 소유권 검증
 */
async function verifyOwnership(noteId: string, userId: string | undefined) {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    select: { id: true, userId: true },
  })

  if (!note) {
    return { error: '노트를 찾을 수 없습니다', status: 404 }
  }

  // 소유권 확인 (userId가 있는 경우에만)
  if (note.userId && note.userId !== userId) {
    return { error: '접근 권한이 없습니다', status: 403 }
  }

  return { note }
}

// GET - 특정 노트 조회
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

    const note = await prisma.note.findUnique({
      where: { id },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('노트 조회 실패:', error)
    return NextResponse.json({ error: '노트를 불러올 수 없습니다' }, { status: 500 })
  }
}

// PUT - 노트 수정
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

    const { title, content, published } = await request.json()

    const note = await prisma.note.update({
      where: { id },
      data: { title, content, published },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('노트 수정 실패:', error)
    return NextResponse.json({ error: '노트를 수정할 수 없습니다' }, { status: 500 })
  }
}

// DELETE - 노트 삭제
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

    await prisma.note.delete({
      where: { id },
    })

    return NextResponse.json({ message: '노트가 삭제되었습니다' })
  } catch (error) {
    console.error('노트 삭제 실패:', error)
    return NextResponse.json({ error: '노트를 삭제할 수 없습니다' }, { status: 500 })
  }
}
