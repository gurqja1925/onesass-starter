/**
 * 파일 스토리지 설정 조회 API
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'file_storage' }
    })

    if (!setting) {
      return NextResponse.json({
        enabled: false,
        provider: null,
        message: '파일 스토리지 설정이 없습니다.'
      })
    }

    const config = JSON.parse(setting.value)

    return NextResponse.json({
      ...config,
      message: '파일 스토리지 설정을 불러왔습니다.'
    })
  } catch (error) {
    console.error('파일 스토리지 설정 조회 오류:', error)
    return NextResponse.json(
      { error: '파일 스토리지 설정 조회 실패' },
      { status: 500 }
    )
  }
}
