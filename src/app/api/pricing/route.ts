import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

/**
 * 프라이싱 플랜 목록 조회 API
 */
export async function GET(request: NextRequest) {
  try {
    const plans = await prisma.pricingPlan.findMany({
      orderBy: { price: 'asc' }
    })

    return NextResponse.json({
      success: true,
      plans
    })
  } catch (error) {
    console.error('Failed to fetch pricing plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing plans' },
      { status: 500 }
    )
  }
}

/**
 * 새 프라이싱 플랜 생성 API (관리자 전용)
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { name, price, yearlyPrice, features, popular } = body

    // 유효성 검사
    if (!name || !price || !yearlyPrice || !features || !Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Invalid plan data' },
        { status: 400 }
      )
    }

    const plan = await prisma.pricingPlan.create({
      data: {
        name,
        price,
        yearlyPrice,
        features,
        popular: popular || false
      }
    })

    return NextResponse.json({
      success: true,
      plan
    })
  } catch (error) {
    console.error('Failed to create pricing plan:', error)
    return NextResponse.json(
      { error: 'Failed to create pricing plan' },
      { status: 500 }
    )
  }
}
