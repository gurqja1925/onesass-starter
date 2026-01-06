/**
 * 관리자 통계 API
 */

import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: 실제 데이터베이스에서 통계 조회
  // 현재는 샘플 데이터 반환

  const stats = {
    totalUsers: 1234,
    newUsersToday: 42,
    activeSubscriptions: 567,
    monthlyRevenue: 8900000, // 890만원
  }

  return NextResponse.json(stats)
}
