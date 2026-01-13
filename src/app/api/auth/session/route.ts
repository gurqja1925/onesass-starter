import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

/**
 * 세션 확인 API
 * 관리자 권한 확인용
 */

function getAdminEmails() {
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || ''
  return adminEmails
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean)
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        user: null
      }, { status: 401 })
    }

    const normalizedEmail = session.user.email?.toLowerCase() || ''
    const adminEmails = getAdminEmails()
    const isConfiguredAdmin = adminEmails.length > 0 && adminEmails.includes(normalizedEmail)

    // DB에서 사용자 정보 가져오기
    let user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        status: true,
        createdAt: true,
      }
    })

    // 사용자가 없으면 생성 (가입 처리)
    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            image: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
            emailVerified: session.user.email_confirmed_at ? new Date(session.user.email_confirmed_at) : null,
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            plan: true,
            status: true,
            createdAt: true,
          }
        })
      } catch (createError) {
        console.error('User creation error:', createError)
        return NextResponse.json({ 
          error: 'User creation failed',
          user: null
        }, { status: 500 })
      }
    }

    // 첫 번째 가입자인지 확인
    const userCount = await prisma.user.count()
    const isFirstUser = userCount === 1

    const shouldBeAdmin = isFirstUser || user.role === 'admin' || isConfiguredAdmin

    // 관리자 권한 부여 필요 시 업데이트
    if (shouldBeAdmin && user.role !== 'admin') {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'admin' }
      })
      user.role = 'admin'
    }

    // 관리자 권한 확인
    const isAdmin = shouldBeAdmin

    return NextResponse.json({
      user: {
        ...user,
        isFirstUser,
        isAdmin,
        session: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || user.name
        }
      }
    })

  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      user: null
    }, { status: 500 })
  }
}
