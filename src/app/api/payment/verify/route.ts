/**
 * 결제 검증 API
 *
 * Toss Payments 결제 완료 후 서버에서 결제 정보를 검증하고 DB에 기록
 *
 * 보안:
 * - 인증 필수 (데모 모드 제외)
 * - 금액 검증 (서버에서 재확인)
 * - 중복 결제 방지 (idempotency)
 * - Rate Limiting
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  requireAuth,
  AuthResult,
  checkRateLimit,
  rateLimitResponse,
  getClientIP,
  isDemoMode,
} from '@/lib/api-auth'

// Toss Payments API로 결제 정보 조회
// TODO: Toss Payments API로 교체 필요 (현재는 임시로 PortOne API 사용)
async function getTossPayment(impUid: string) {
  const apiKey = process.env.TOSS_CLIENT_KEY || process.env.PORTONE_API_KEY
  const apiSecret = process.env.TOSS_SECRET_KEY || process.env.PORTONE_API_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error('Toss Payments API credentials not configured')
  }

  // 토큰 발급 (임시: PortOne API 사용)
  const tokenRes = await fetch('https://api.iamport.kr/users/getToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imp_key: apiKey, imp_secret: apiSecret }),
  })
  const tokenData = await tokenRes.json()

  if (tokenData.code !== 0) {
    throw new Error('Failed to get payment access token')
  }

  const accessToken = tokenData.response.access_token

  // 결제 정보 조회
  const paymentRes = await fetch(`https://api.iamport.kr/payments/${impUid}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const paymentData = await paymentRes.json()

  if (paymentData.code !== 0) {
    throw new Error('Failed to get payment info')
  }

  return paymentData.response
}

// 서버에서 관리하는 플랜별 가격 (클라이언트 조작 방지)
const PLAN_PRICES: Record<string, number> = {
  pro: 9900,
  premium: 29900,
  enterprise: 99900,
}

export async function POST(request: NextRequest) {
  // Rate Limiting (결제 요청은 분당 5회로 제한)
  const clientIP = getClientIP(request)
  const rateCheck = checkRateLimit(`payment:${clientIP}`, 5, 60000)
  if (!rateCheck.allowed) {
    return rateLimitResponse(rateCheck.resetIn)
  }

  // 데모 모드가 아닐 때만 인증 필수
  let userId: string | undefined

  if (!isDemoMode()) {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth
    userId = (auth as AuthResult).user?.id
  }

  try {
    const body = await request.json()
    const { impUid, merchantUid, amount, description, plan } = body

    // 필수 필드 검증
    if (!impUid || !merchantUid || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 금액은 숫자여야 함
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // 플랜 가격 검증 (클라이언트에서 보낸 금액이 서버 가격과 일치하는지)
    if (plan && PLAN_PRICES[plan]) {
      if (amount !== PLAN_PRICES[plan]) {
        console.error(`Price mismatch for plan ${plan}: expected ${PLAN_PRICES[plan]}, got ${amount}`)
        return NextResponse.json(
          { error: 'Price mismatch', verified: false },
          { status: 400 }
        )
      }
    }

    // 중복 결제 방지 (이미 처리된 결제인지 확인)
    const existingPayment = await prisma.payment.findFirst({
      where: { paymentKey: impUid },
    })

    if (existingPayment) {
      // 이미 처리된 결제 - idempotent하게 성공 응답 반환
      return NextResponse.json({
        success: true,
        verified: true,
        paymentId: existingPayment.id,
        message: '이미 처리된 결제입니다',
        duplicate: true,
      })
    }

    let paymentInfo

    if (isDemoMode()) {
      // 데모 모드: 가상 결제 정보
      paymentInfo = {
        imp_uid: impUid,
        merchant_uid: merchantUid,
        amount: amount,
        status: 'paid',
        pay_method: 'card',
      }
      userId = body.userId || 'demo-user-12345'
    } else {
      // 운영 모드: Toss Payments API로 실제 결제 검증
      paymentInfo = await getTossPayment(impUid)

      // 금액 검증 (PG에서 받은 금액과 요청 금액 비교)
      if (paymentInfo.amount !== amount) {
        console.error(`Amount mismatch: PG=${paymentInfo.amount}, request=${amount}`)
        return NextResponse.json(
          { error: 'Payment amount mismatch', verified: false },
          { status: 400 }
        )
      }

      // 결제 상태 확인
      if (paymentInfo.status !== 'paid') {
        return NextResponse.json(
          { error: 'Payment not completed', status: paymentInfo.status },
          { status: 400 }
        )
      }
    }

    // DB에 결제 기록 저장
    const payment = await prisma.payment.create({
      data: {
        userId: userId!,
        amount: amount,
        currency: 'KRW',
        status: 'completed',
        type: plan ? 'subscription' : 'onetime',
        method: paymentInfo.pay_method || 'card',
        provider: 'toss',
        paymentKey: impUid,
        orderId: merchantUid,
        orderName: description || plan || '결제',
        description: description || plan || '결제',
        metadata: {
          merchantUid,
          impUid,
          plan,
          verifiedAt: new Date().toISOString(),
          clientIP,
        },
      },
    })

    // 구독 플랜 결제인 경우 구독 업데이트
    if (plan && userId) {
      // 기존 구독 확인
      const existingSubscription = await prisma.subscription.findFirst({
        where: { userId },
      })

      if (existingSubscription) {
        // 기존 구독 업데이트
        await prisma.subscription.update({
          where: { id: existingSubscription.id },
          data: {
            plan,
            planName: plan === 'pro' ? 'Pro 월간' : plan === 'premium' ? 'Premium 월간' : 'Enterprise 월간',
            amount: PLAN_PRICES[plan] || amount,
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
          },
        })
      } else {
        // 새 구독 생성
        await prisma.subscription.create({
          data: {
            userId,
            plan,
            planName: plan === 'pro' ? 'Pro 월간' : plan === 'premium' ? 'Premium 월간' : 'Enterprise 월간',
            amount: PLAN_PRICES[plan] || amount,
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        })
      }

      // 사용자 플랜 업데이트
      await prisma.user.update({
        where: { id: userId },
        data: { plan },
      })
    }

    // 결제 이벤트 기록
    await prisma.analytics.create({
      data: {
        type: 'payment',
        value: amount,
        metadata: {
          paymentId: payment.id,
          userId,
          plan,
          method: paymentInfo.pay_method,
        },
      },
    })

    return NextResponse.json({
      success: true,
      verified: true,
      paymentId: payment.id,
      message: '결제가 완료되었습니다',
    })
  } catch (error) {
    console.error('Payment verification failed:', error)
    return NextResponse.json(
      { 
        error: 'Payment verification failed', 
        verified: false,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
