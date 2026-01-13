/**
 * 사용량 API
 * 
 * 사용자의 현재 사용량 조회 및 사용량 증가
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { 
  getUserUsageWithLimits, 
  useQuota, 
  UsageType,
  getCurrentPeriod,
  getPlanLimits
} from '@/lib/usage'

/**
 * 사용자 사용량 조회
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
      select: { id: true, plan: true },
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const usageData = await getUserUsageWithLimits(dbUser.id, dbUser.plan)

    return NextResponse.json({
      success: true,
      plan: dbUser.plan,
      ...usageData,
    })
  } catch (error) {
    console.error('사용량 조회 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

/**
 * 사용량 증가 (사용 시 호출)
 */
export async function POST(req: NextRequest) {
  try {
    const { type, amount = 1 } = await req.json()

    // 유효한 사용량 타입인지 확인
    const validTypes: UsageType[] = ['creates', 'aiCalls', 'exports', 'apiCalls', 'storage']
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json(
        { error: '유효하지 않은 사용량 타입입니다.' },
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
      select: { id: true, plan: true },
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 사용량 체크 및 증가
    const result = await useQuota(dbUser.id, dbUser.plan, type, amount)

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: result.error,
          current: result.current,
          limit: result.limit,
          remaining: result.remaining,
        },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      type,
      current: result.current,
      limit: result.limit,
      remaining: result.remaining,
    })
  } catch (error) {
    console.error('사용량 증가 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
