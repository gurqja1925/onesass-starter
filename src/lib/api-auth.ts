/**
 * API 라우트용 인증 미들웨어
 *
 * 서버 사이드에서 인증을 검증하고 관리자 권한을 확인합니다.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 (서버 사이드용)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * 인증 결과 타입
 */
export interface AuthResult {
  authenticated: boolean
  user: {
    id: string
    email: string
    role?: string
  } | null
  isAdmin: boolean
  error?: string
}

/**
 * 데모 모드 확인
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

/**
 * 관리자 이메일 목록 가져오기
 */
function getAdminEmails(): string[] {
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS
  if (!adminEmails) return []
  return adminEmails.split(',').map(email => email.trim().toLowerCase())
}

/**
 * 요청에서 인증 정보 추출 및 검증
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  // 데모 모드에서는 인증 우회 (개발/테스트용)
  if (isDemoMode()) {
    return {
      authenticated: true,
      user: {
        id: 'demo-user',
        email: 'demo@example.com',
        role: 'admin',
      },
      isAdmin: true,
    }
  }

  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    // 쿠키에서 Supabase 세션 토큰 추출
    const supabaseToken = request.cookies.get('sb-access-token')?.value || token

    if (!supabaseToken) {
      return {
        authenticated: false,
        user: null,
        isAdmin: false,
        error: '인증 토큰이 없습니다',
      }
    }

    // Supabase로 토큰 검증
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data: { user }, error } = await supabase.auth.getUser(supabaseToken)

    if (error || !user) {
      return {
        authenticated: false,
        user: null,
        isAdmin: false,
        error: '유효하지 않은 토큰입니다',
      }
    }

    // 관리자 여부 확인
    const adminEmails = getAdminEmails()
    const userEmail = user.email?.toLowerCase() || ''
    const isAdmin = adminEmails.length === 0
      ? false  // 관리자 이메일이 설정되지 않으면 관리자 없음
      : adminEmails.includes(userEmail)

    return {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email || '',
        role: isAdmin ? 'admin' : 'user',
      },
      isAdmin,
    }
  } catch (error) {
    console.error('Auth verification failed:', error)
    return {
      authenticated: false,
      user: null,
      isAdmin: false,
      error: '인증 검증 실패',
    }
  }
}

/**
 * 인증 필수 미들웨어
 * 인증되지 않은 요청은 401 반환
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult | NextResponse> {
  const auth = await verifyAuth(request)

  if (!auth.authenticated) {
    return NextResponse.json(
      { error: auth.error || '인증이 필요합니다' },
      { status: 401 }
    )
  }

  return auth
}

/**
 * 관리자 권한 필수 미들웨어
 * 관리자가 아닌 요청은 403 반환
 */
export async function requireAdmin(request: NextRequest): Promise<AuthResult | NextResponse> {
  const auth = await verifyAuth(request)

  if (!auth.authenticated) {
    return NextResponse.json(
      { error: auth.error || '인증이 필요합니다' },
      { status: 401 }
    )
  }

  if (!auth.isAdmin) {
    return NextResponse.json(
      { error: '관리자 권한이 필요합니다' },
      { status: 403 }
    )
  }

  return auth
}

/**
 * Rate Limiting을 위한 간단한 메모리 저장소
 * 프로덕션에서는 Redis 사용 권장
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Rate Limiting 체크
 * @param identifier - 식별자 (IP 또는 사용자 ID)
 * @param limit - 제한 횟수
 * @param windowMs - 시간 윈도우 (밀리초)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  // 기존 기록이 없거나 윈도우가 지났으면 초기화
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return { allowed: true, remaining: limit - 1, resetIn: windowMs }
  }

  // 제한 초과 확인
  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: record.resetTime - now,
    }
  }

  // 카운트 증가
  record.count++
  return {
    allowed: true,
    remaining: limit - record.count,
    resetIn: record.resetTime - now,
  }
}

/**
 * Rate Limit 응답 생성
 */
export function rateLimitResponse(resetIn: number): NextResponse {
  return NextResponse.json(
    { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil(resetIn / 1000)),
      },
    }
  )
}

/**
 * 클라이언트 IP 추출
 */
export function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
}
