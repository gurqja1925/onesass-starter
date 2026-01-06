/**
 * OAuth 콜백 처리
 *
 * 소셜 로그인 후 리다이렉트되는 엔드포인트
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // 에러 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin))
}
