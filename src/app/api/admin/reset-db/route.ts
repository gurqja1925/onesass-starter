/**
 * 임시 DB 초기화 API (테스트용)
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST() {
  try {
    // 모든 User 삭제
    await prisma.user.deleteMany({})
    console.log('✅ 모든 사용자 삭제 완료')

    // 모든 Setting 삭제
    await prisma.setting.deleteMany({})
    console.log('✅ 모든 설정 삭제 완료')

    return NextResponse.json({
      success: true,
      message: 'DB 초기화 완료'
    })
  } catch (error) {
    console.error('DB 초기화 오류:', error)
    return NextResponse.json(
      { error: 'DB 초기화 실패' },
      { status: 500 }
    )
  }
}
