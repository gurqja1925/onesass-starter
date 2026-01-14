/**
 * 로그인 프로바이더 설정 API
 * 
 * DB에 저장된 로그인 설정을 반환합니다.
 * 인증 없이 접근 가능 (로그인 페이지에서 사용)
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { type AuthProviderType } from '@/onesaas-core/auth/config'

const DEFAULT_AUTH_PROVIDERS: Record<AuthProviderType, boolean> = {
  email: true,
  google: false,
  kakao: false,
  github: false,
}

export async function GET() {
  try {
    // 1. 먼저 환경변수 확인 (빌더에서 설정한 값)
    const envProviders = process.env.NEXT_PUBLIC_AUTH_PROVIDERS
    if (envProviders) {
      const enabledProviders = envProviders.split(',').map(p => p.trim())
      return NextResponse.json({
        providers: enabledProviders,
        all: enabledProviders.reduce((acc, p) => ({ ...acc, [p]: true }), {} as Record<string, boolean>)
      })
    }

    // 2. 환경변수가 없으면 데이터베이스 확인
    const setting = await prisma.setting.findUnique({
      where: { key: 'auth_providers' }
    })

    let providers = { ...DEFAULT_AUTH_PROVIDERS }

    if (setting?.value) {
      try {
        providers = JSON.parse(setting.value)
      } catch {
        // 파싱 실패 시 기본값 유지
      }
    }

    // 활성화된 프로바이더 목록 반환
    const enabledProviders = Object.entries(providers)
      .filter(([_, enabled]) => enabled)
      .map(([provider]) => provider)

    return NextResponse.json({
      providers: enabledProviders,
      all: providers
    })
  } catch (error) {
    console.error('Failed to fetch auth providers:', error)
    // 에러 시 기본값 반환
    return NextResponse.json({
      providers: ['email'],
      all: DEFAULT_AUTH_PROVIDERS
    })
  }
}
