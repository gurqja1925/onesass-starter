/**
 * 관리자 사용자 목록 API
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  // TODO: 실제 데이터베이스에서 사용자 조회
  // 현재는 샘플 데이터 반환

  const users = [
    {
      id: '1',
      email: 'user1@example.com',
      createdAt: '2024-01-15T09:00:00Z',
      lastSignIn: '2024-01-20T14:30:00Z',
      plan: 'free',
    },
    {
      id: '2',
      email: 'pro@example.com',
      createdAt: '2024-01-10T10:00:00Z',
      lastSignIn: '2024-01-21T09:15:00Z',
      plan: 'pro',
    },
    {
      id: '3',
      email: 'test@example.com',
      createdAt: '2024-01-18T11:30:00Z',
      lastSignIn: null,
      plan: 'free',
    },
  ]

  return NextResponse.json({
    users,
    total: users.length,
    page,
    limit,
  })
}
