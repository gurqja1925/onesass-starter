/**
 * 관리자 결제 상세 API
 *
 * 개별 결제 조회, 수정, 환불 처리
 * 보안: 관리자 인증 필수
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'

// 결제 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    return NextResponse.json({ payment })
  } catch (error) {
    console.error('Failed to fetch payment:', error)
    return NextResponse.json({ error: 'Failed to fetch payment' }, { status: 500 })
  }
}

// 결제 상태 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { status, description, metadata } = await request.json()

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(description && { description }),
        ...(metadata && { metadata }),
      },
    })

    // 상태 변경 이벤트 기록
    await prisma.analytics.create({
      data: {
        type: 'payment_status_change',
        value: 1,
        metadata: {
          paymentId: id,
          newStatus: status,
          previousStatus: payment.status,
        },
      },
    })

    return NextResponse.json({ success: true, payment })
  } catch (error) {
    console.error('Failed to update payment:', error)
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 })
  }
}

// 환불 처리
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { action, reason } = await request.json()

    if (action !== 'refund') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const payment = await prisma.payment.findUnique({
      where: { id },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    if (payment.status !== 'completed') {
      return NextResponse.json({ error: 'Only completed payments can be refunded' }, { status: 400 })
    }

    // 데모 모드에서는 실제 PG 환불 없이 상태만 변경
    // 운영 모드에서는 PortOne API로 환불 요청 필요

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status: 'refunded',
        metadata: {
          ...(payment.metadata as object),
          refundedAt: new Date().toISOString(),
          refundReason: reason,
        },
      },
    })

    // 환불 이벤트 기록
    await prisma.analytics.create({
      data: {
        type: 'refund',
        value: payment.amount,
        metadata: {
          paymentId: id,
          userId: payment.userId,
          reason,
        },
      },
    })

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      message: '환불이 처리되었습니다',
    })
  } catch (error) {
    console.error('Failed to process refund:', error)
    return NextResponse.json({ error: 'Failed to process refund' }, { status: 500 })
  }
}
