/**
 * 관리자 사용자 상세 API
 *
 * 개별 사용자 조회, 수정, 삭제
 * 보안: 관리자 인증 필수
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'

// 사용자 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        payments: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        subscriptions: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        aiUsages: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// 사용자 정보 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { name, role, plan, status } = await request.json()

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(role && { role }),
        ...(plan && { plan }),
        ...(status && { status }),
      },
    })

    // 역할/플랜 변경 시 이벤트 기록
    if (role || plan) {
      await prisma.analytics.create({
        data: {
          type: 'user_update',
          value: 1,
          metadata: {
            userId: id,
            changes: { role, plan, status },
          },
        },
      })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Failed to update user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// 사용자 삭제 (비활성화)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { permanent } = await request.json().catch(() => ({ permanent: false }))

    if (permanent) {
      // 영구 삭제 (CASCADE로 관련 데이터도 삭제됨)
      await prisma.user.delete({
        where: { id },
      })

      return NextResponse.json({
        success: true,
        message: '사용자가 영구 삭제되었습니다',
      })
    } else {
      // 소프트 삭제 (비활성화)
      await prisma.user.update({
        where: { id },
        data: { status: 'inactive' },
      })

      // 구독도 취소
      await prisma.subscription.updateMany({
        where: { userId: id },
        data: { status: 'canceled', canceledAt: new Date() },
      })

      return NextResponse.json({
        success: true,
        message: '사용자가 비활성화되었습니다',
      })
    }
  } catch (error) {
    console.error('Failed to delete user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
