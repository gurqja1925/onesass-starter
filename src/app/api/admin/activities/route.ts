/**
 * 관리자 최근 활동 API
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
    const limit = parseInt(searchParams.get('limit') || '10')

    // 최근 가입한 사용자 (signup)
    const recentSignups = await prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    })

    // 최근 결제 (payment)
    const recentPayments = await prisma.payment.findMany({
      take: limit,
      where: { status: 'completed' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    })

    // 최근 AI 사용 (ai_usage)
    const recentAIUsage = await prisma.aIUsage.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    })

    // 활동 데이터 통합 및 정렬
    const activities = [
      ...recentSignups.map((u) => ({
        id: `signup-${u.id}`,
        type: 'signup' as const,
        user: u.email,
        timestamp: u.createdAt.toISOString(),
      })),
      ...recentPayments.map((p) => ({
        id: `payment-${p.id}`,
        type: 'payment' as const,
        user: p.user.email,
        timestamp: p.createdAt.toISOString(),
        detail: `₩${p.amount.toLocaleString()}`,
      })),
      ...recentAIUsage.map((a) => ({
        id: `ai-${a.id}`,
        type: 'ai_usage' as const,
        user: a.user.email,
        timestamp: a.createdAt.toISOString(),
        detail: a.type,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)

    return NextResponse.json({ activities })
  } catch (error) {
    console.error('Failed to fetch activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}
