import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

/**
 * 프라이싱 플랜 수정 API (관리자 전용)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 관리자 권한 확인
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, price, yearlyPrice, features, popular } = body

    const plan = await prisma.pricingPlan.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(price !== undefined && { price }),
        ...(yearlyPrice !== undefined && { yearlyPrice }),
        ...(features && { features }),
        ...(popular !== undefined && { popular })
      }
    })

    return NextResponse.json({
      success: true,
      plan
    })
  } catch (error) {
    console.error('Failed to update pricing plan:', error)
    return NextResponse.json(
      { error: 'Failed to update pricing plan' },
      { status: 500 }
    )
  }
}

/**
 * 프라이싱 플랜 삭제 API (관리자 전용)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 관리자 권한 확인
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    // 플랜을 사용 중인 구독이 있는지 확인
    const activeSubscriptions = await prisma.subscription.count({
      where: {
        plan: id,
        status: { in: ['active', 'trial'] }
      }
    })

    if (activeSubscriptions > 0) {
      return NextResponse.json(
        { error: 'Cannot delete plan with active subscriptions' },
        { status: 400 }
      )
    }

    await prisma.pricingPlan.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Plan deleted successfully'
    })
  } catch (error) {
    console.error('Failed to delete pricing plan:', error)
    return NextResponse.json(
      { error: 'Failed to delete pricing plan' },
      { status: 500 }
    )
  }
}
