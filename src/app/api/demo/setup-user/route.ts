/**
 * 데모 사용자 생성 API
 * 데모 모드에서 테스트를 위한 사용자 생성
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // 데모 사용자 확인 또는 생성
    let user = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: 'demo-user-12345',
          email: 'demo@example.com',
          name: 'Demo User',
          role: 'user',
          plan: 'free'
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan
      }
    })
  } catch (error) {
    console.error('Demo user creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create demo user' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return POST()
}