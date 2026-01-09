/**
 * OAuth 콜백 처리
 *
 * 소셜 로그인 후 리다이렉트되는 엔드포인트
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 사용자 정보 가져오기
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()

      if (supabaseUser?.email) {
        try {
          // 기존 사용자 확인
          const existingUser = await prisma.user.findUnique({
            where: { email: supabaseUser.email },
          })

          const eventType = existingUser ? 'login' : 'signup'

          // Prisma에 사용자 동기화
          await prisma.user.upsert({
            where: { email: supabaseUser.email },
            update: {
              name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
              image: supabaseUser.user_metadata?.avatar_url || null,
              emailVerified: supabaseUser.email_confirmed_at ? new Date(supabaseUser.email_confirmed_at) : null,
            },
            create: {
              id: supabaseUser.id,
              email: supabaseUser.email,
              name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
              image: supabaseUser.user_metadata?.avatar_url || null,
              emailVerified: supabaseUser.email_confirmed_at ? new Date(supabaseUser.email_confirmed_at) : null,
            },
          })

          // 이벤트 기록
          await prisma.analytics.create({
            data: {
              type: eventType,
              value: 1,
              metadata: {
                userId: supabaseUser.id,
                email: supabaseUser.email,
                provider: supabaseUser.app_metadata?.provider || 'oauth',
              },
            },
          })

          // 신규 가입 시 무료 구독 생성
          if (!existingUser) {
            await prisma.subscription.create({
              data: {
                userId: supabaseUser.id,
                plan: 'free',
                status: 'active',
              },
            })
          }
        } catch (e) {
          console.error('User sync failed:', e)
        }
      }

      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // 에러 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin))
}
