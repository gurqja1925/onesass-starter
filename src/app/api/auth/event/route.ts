/**
 * 인증 이벤트 기록 API
 *
 * 로그인, 회원가입, 로그아웃 등의 이벤트를 기록
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { event, metadata } = await request.json()

    if (!event || !['login', 'signup', 'logout'].includes(event)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()

    // Analytics에 이벤트 기록
    await prisma.analytics.create({
      data: {
        type: event,
        value: 1,
        metadata: {
          userId: supabaseUser?.id || null,
          email: supabaseUser?.email || null,
          provider: supabaseUser?.app_metadata?.provider || 'email',
          ...metadata,
        },
      },
    })

    // 회원가입 이벤트일 경우 사용자 생성/동기화
    if (event === 'signup' && supabaseUser) {
      await prisma.user.upsert({
        where: { email: supabaseUser.email! },
        update: {
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
          image: supabaseUser.user_metadata?.avatar_url || null,
        },
        create: {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
          image: supabaseUser.user_metadata?.avatar_url || null,
        },
      })

      // 무료 구독 생성
      await prisma.subscription.create({
        data: {
          userId: supabaseUser.id,
          plan: 'free',
          status: 'active',
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Event recording failed:', error)
    return NextResponse.json({ error: 'Recording failed' }, { status: 500 })
  }
}
