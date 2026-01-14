/**
 * 모든 설정 조회 API (테스트용)
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.setting.findMany()

    const parsedSettings: Record<string, any> = {}

    for (const setting of settings) {
      try {
        parsedSettings[setting.key] = JSON.parse(setting.value)
      } catch (e) {
        parsedSettings[setting.key] = setting.value
      }
    }

    return NextResponse.json({
      count: settings.length,
      settings: parsedSettings
    })
  } catch (error) {
    console.error('설정 조회 오류:', error)
    return NextResponse.json(
      { error: '설정 조회 실패' },
      { status: 500 }
    )
  }
}
