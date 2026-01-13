/**
 * 구독 관리 API
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserSubscription, getAuthUser } from '@/lib/auth-middleware'
import { createClient } from '@supabase/supabase-js'

/**
 * 사용자 구독 정보 조회
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user?.email) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: {
        subscriptions: {
          where: { status: { in: ['active', 'trial', 'past_due'] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const subscription = dbUser.subscriptions[0] || null
    const subscriptionInfo = subscription ? await getUserSubscription(dbUser.id) : null

    return NextResponse.json({
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        plan: dbUser.plan,
        status: dbUser.status,
        role: dbUser.role,
      },
      subscription: subscriptionInfo,
    })
  } catch (error) {
    console.error('구독 정보 조회 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

/**
 * 구독 플랜 변경
 */
export async function PUT(req: NextRequest) {
  try {
    const { plan, billingCycle } = await req.json()

    if (!plan || !['free', 'pro', 'enterprise'].includes(plan)) {
      return NextResponse.json(
        { error: '유효하지 않은 플랜입니다.' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user?.email) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 무료 플랜으로 변경 시 기존 구독 취소
    if (plan === 'free') {
      await prisma.subscription.updateMany({
        where: {
          userId: dbUser.id,
          status: { in: ['active', 'trial'] },
        },
        data: {
          status: 'canceled',
          cancelAtPeriodEnd: true,
          canceledAt: new Date(),
          cancelReason: '무료 플랜으로 변경',
        },
      })
    }

    // 사용자 플랜 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: { plan },
    })

    return NextResponse.json({
      user: updatedUser,
      message: '플랜이 성공적으로 변경되었습니다.',
    })
  } catch (error) {
    console.error('플랜 변경 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

/**
 * 구독 취소
 */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user?.email) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 활성 구독 취소
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: dbUser.id,
        status: { in: ['active', 'trial'] },
      },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: '활성 구독을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'canceled',
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
        cancelReason: '사용자 요청',
      },
    })

    // 사용자 플랜을 무료로 변경
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { plan: 'free' },
    })

    return NextResponse.json({
      subscription: updatedSubscription,
      message: '구독이 성공적으로 취소되었습니다.',
    })
  } catch (error) {
    console.error('구독 취소 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}