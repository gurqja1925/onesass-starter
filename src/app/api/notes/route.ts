/**
 * 노트 API
 *
 * 보안: 인증 필수, 사용자별 데이터 격리
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, AuthResult } from '@/lib/api-auth'

// GET - 현재 사용자의 노트 조회
export async function GET(request: NextRequest) {
  // 인증 확인
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const notes = await prisma.note.findMany({
      where: { userId: (auth as AuthResult).user?.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(notes)
  } catch (error) {
    console.error('노트 조회 실패:', error)
    return NextResponse.json({ error: '노트를 불러올 수 없습니다' }, { status: 500 })
  }
}

// POST - 새 노트 생성
export async function POST(request: NextRequest) {
  // 인증 확인
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { title, content } = await request.json()

    if (!title) {
      return NextResponse.json({ error: '제목을 입력해주세요' }, { status: 400 })
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId: (auth as AuthResult).user?.id,
      },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('노트 생성 실패:', error)
    return NextResponse.json({ error: '노트를 생성할 수 없습니다' }, { status: 500 })
  }
}
