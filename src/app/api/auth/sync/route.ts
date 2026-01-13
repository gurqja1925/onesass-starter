/**
 * 사용자 동기화 API
 *
 * Supabase Auth 사용자를 Prisma DB에 동기화
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser()

    if (authError || !supabaseUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Prisma에서 사용자 찾기 또는 생성
    try {
      // 첫 번째 사용자인지 확인
      const userCount = await prisma.user.count()
      const isFirstUser = userCount === 0

      const user = await prisma.user.upsert({
        where: { email: supabaseUser.email! },
        update: {
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
          image: supabaseUser.user_metadata?.avatar_url || null,
          emailVerified: supabaseUser.email_confirmed_at ? new Date(supabaseUser.email_confirmed_at) : null,
        },
        create: {
          id: supabaseUser.id, // Supabase ID를 Prisma ID로 사용
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
          image: supabaseUser.user_metadata?.avatar_url || null,
          emailVerified: supabaseUser.email_confirmed_at ? new Date(supabaseUser.email_confirmed_at) : null,
          role: isFirstUser ? 'admin' : 'user', // 첫 번째 사용자는 자동으로 관리자
        },
      })

      // 첫 번째 사용자이고 관리자가 아니면 관리자로 업데이트
      if (isFirstUser && user.role !== 'admin') {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'admin' }
        })
        user.role = 'admin'
      }

      return NextResponse.json({ user })
    } catch (dbError) {
      console.warn('User sync skipped (DB not configured):', dbError)
      // DB 없이도 작동하도록 Supabase 사용자 정보만 반환
      return NextResponse.json({
        user: {
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
          image: supabaseUser.user_metadata?.avatar_url || null,
        }
      })
    }
  } catch (error) {
    console.error('User sync failed:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
