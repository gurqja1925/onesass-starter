/**
 * 데이터베이스 연결 상태 확인 API
 * OneSaaS 헬스체크에서 사용
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const startTime = Date.now()

  try {
    // 데모 모드 확인
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

    if (isDemoMode) {
      return NextResponse.json({
        connected: true,
        mode: 'demo',
        message: '데모 모드에서 실행 중입니다',
        duration: Date.now() - startTime,
      })
    }

    // DATABASE_URL 환경변수 확인
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        connected: false,
        error: 'DATABASE_URL 환경변수가 설정되지 않았습니다',
        duration: Date.now() - startTime,
      }, { status: 503 })
    }

    // 실제 데이터베이스 연결 테스트
    await prisma.$queryRaw`SELECT 1`

    // 간단한 테이블 존재 확인
    const userCount = await prisma.user.count()

    return NextResponse.json({
      connected: true,
      mode: 'production',
      message: '데이터베이스가 정상 연결되었습니다',
      stats: {
        users: userCount,
      },
      duration: Date.now() - startTime,
    })

  } catch (error) {
    console.error('DB status check error:', error)

    const errorMessage = error instanceof Error ? error.message : String(error)

    // 연결 오류 유형 분류
    let errorType = 'unknown'
    if (errorMessage.includes('connect')) {
      errorType = 'connection_failed'
    } else if (errorMessage.includes('timeout')) {
      errorType = 'timeout'
    } else if (errorMessage.includes('authentication')) {
      errorType = 'auth_failed'
    } else if (errorMessage.includes('does not exist')) {
      errorType = 'table_not_found'
    }

    return NextResponse.json({
      connected: false,
      error: errorMessage,
      errorType,
      duration: Date.now() - startTime,
      hint: getErrorHint(errorType),
    }, { status: 503 })
  }
}

function getErrorHint(errorType: string): string {
  switch (errorType) {
    case 'connection_failed':
      return 'DATABASE_URL이 올바른지 확인하세요. Supabase가 활성화되었는지도 확인해주세요.'
    case 'timeout':
      return '데이터베이스 서버에 연결할 수 없습니다. 네트워크 설정을 확인하세요.'
    case 'auth_failed':
      return '데이터베이스 비밀번호가 올바른지 확인하세요.'
    case 'table_not_found':
      return 'prisma db push를 실행하여 테이블을 생성해주세요.'
    default:
      return '데이터베이스 설정을 확인해주세요.'
  }
}
