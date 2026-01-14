/**
 * 첫 번째 관리자 계정 자동 생성 API
 *
 * 배포 직후 첫 관리자 계정을 생성합니다.
 * 이 엔드포인트는 DB에 사용자가 없을 때만 작동합니다.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // 입력 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: '비밀번호는 최소 8자 이상이어야 합니다.' },
        { status: 400 }
      )
    }

    // 이미 사용자가 존재하는지 확인
    const userCount = await prisma.user.count()
    if (userCount > 0) {
      return NextResponse.json(
        { error: '이미 사용자가 존재합니다. 첫 번째 관리자만 자동 생성할 수 있습니다.' },
        { status: 403 }
      )
    }

    // Supabase 클라이언트 생성 (일반 키 사용)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createSupabaseClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Supabase Auth에 사용자 생성 (일반 signUp 사용)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: 'Admin',
          created_by: 'setup-first-admin'
        }
      }
    })

    if (authError) {
      console.error('Supabase Auth 사용자 생성 실패:', authError)
      return NextResponse.json(
        { error: `사용자 생성 실패: ${authError.message}` },
        { status: 500 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: '사용자 생성 실패: 사용자 데이터가 없습니다.' },
        { status: 500 }
      )
    }

    // Prisma DB에 관리자 사용자 생성
    // 첫 번째 사용자이므로 자동으로 admin 역할 부여
    const dbUser = await prisma.user.create({
      data: {
        id: authData.user.id,
        email: authData.user.email!,
        name: 'Admin',
        role: 'admin', // 관리자 역할 할당
        emailVerified: new Date(), // 이메일 확인됨
      }
    })

    console.log('✅ 첫 번째 관리자 계정 생성 완료:', dbUser.email)

    // OAuth 프로바이더 자동 활성화 (빌더 배포 시 기본값)
    try {
      const authProvidersConfig = {
        email: true,
        google: true,
        kakao: true,
        github: true,
      }

      await prisma.setting.upsert({
        where: { key: 'auth_providers' },
        update: { value: JSON.stringify(authProvidersConfig) },
        create: {
          key: 'auth_providers',
          value: JSON.stringify(authProvidersConfig),
        },
      })

      console.log('✅ OAuth 프로바이더 자동 활성화 완료')
    } catch (error) {
      console.error('⚠️ OAuth 프로바이더 설정 실패:', error)
      // OAuth 설정 실패해도 관리자 계정은 생성됨
    }

    return NextResponse.json({
      success: true,
      message: '관리자 계정이 생성되었습니다.',
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
      }
    })

  } catch (error) {
    console.error('관리자 계정 생성 오류:', error)
    return NextResponse.json(
      { error: '관리자 계정 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// GET 요청은 현재 상태 확인용
export async function GET() {
  try {
    const userCount = await prisma.user.count()

    return NextResponse.json({
      canCreate: userCount === 0,
      userCount,
      message: userCount === 0
        ? '첫 번째 관리자를 생성할 수 있습니다.'
        : '이미 사용자가 존재합니다.'
    })
  } catch (error) {
    console.error('상태 확인 오류:', error)
    return NextResponse.json(
      { error: '상태 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
