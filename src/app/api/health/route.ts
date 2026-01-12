/**
 * 서비스 헬스체크 API
 * OneSaaS 배포 후 상태 확인에 사용
 */

import { NextResponse } from 'next/server'

export async function GET() {
  const startTime = Date.now()

  try {
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    const hasDatabase = !!process.env.DATABASE_URL
    const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL

    // 기본 상태 정보
    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      mode: isDemoMode ? 'demo' : 'production',
      services: {
        database: hasDatabase ? 'configured' : 'not_configured',
        supabase: hasSupabase ? 'configured' : 'not_configured',
      },
      uptime: process.uptime ? Math.floor(process.uptime()) : 0,
      duration: Date.now() - startTime,
    }

    return NextResponse.json(status)

  } catch (error) {
    console.error('Health check error:', error)

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - startTime,
    }, { status: 503 })
  }
}
