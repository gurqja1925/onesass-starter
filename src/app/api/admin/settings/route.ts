/**
 * 관리자 설정 API
 *
 * 보안: 관리자 인증 필수
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const settings = await prisma.setting.findMany()

    // 설정을 키-값 객체로 변환
    const settingsMap = settings.reduce((acc, s) => {
      acc[s.key] = s.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({ settings: settingsMap })
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      )
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value, type: 'string', category: 'general' },
    })

    return NextResponse.json({ setting })
  } catch (error) {
    console.error('Failed to update setting:', error)
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // 관리자 인증 확인
  const auth = await requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const updates = body.settings as Record<string, string>

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Settings object is required' },
        { status: 400 }
      )
    }

    // 여러 설정 일괄 업데이트
    const results = await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value, type: 'string', category: 'general' },
        })
      )
    )

    return NextResponse.json({ success: true, count: results.length })
  } catch (error) {
    console.error('Failed to update settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
