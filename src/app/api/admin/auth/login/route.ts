import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

/**
 * 관리자 로그인 API
 * 이메일/비밀번호만 지원
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({
        error: '이메일과 비밀번호를 입력해주세요.'
      }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Supabase 인증
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      return NextResponse.json({
        error: '이메일 또는 비밀번호가 올바르지 않습니다.'
      }, { status: 401 })
    }

    // DB에서 사용자 정보 확인
    const user = await prisma.user.findUnique({
      where: { email: authData.user.email! },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        status: true,
      }
    })

    if (!user) {
      return NextResponse.json({
        error: '사용자를 찾을 수 없습니다.'
      }, { status: 404 })
    }

    // 첫 번째 가입자인지 확인 (가장 먼저 생성된 사용자)
    const firstUser = await prisma.user.findFirst({
      orderBy: { createdAt: 'asc' },
      select: { id: true }
    })
    const isFirstUser = firstUser?.id === user.id

    // 관리자 권한 확인
    const isAdmin = user.role === 'admin' || isFirstUser

    // 첫 번째 사용자이고 관리자가 아니면 관리자로 업데이트
    if (isFirstUser && user.role !== 'admin') {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'admin' }
      })
    }

    if (!isAdmin) {
      return NextResponse.json({
        error: '관리자 권한이 없습니다.'
      }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        isFirstUser,
        isAdmin
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({
      error: '서버 오류가 발생했습니다.'
    }, { status: 500 })
  }
}