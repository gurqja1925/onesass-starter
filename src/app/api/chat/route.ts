/**
 * AI 채팅 API
 *
 * 보안: 인증 필수, Rate Limiting 적용
 */

import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import {
  requireAuth,
  AuthResult,
  checkRateLimit,
  rateLimitResponse,
  getClientIP,
  isDemoMode,
} from '@/lib/api-auth'

export const maxDuration = 30

// Rate Limit 설정 (분당 요청 수)
const RATE_LIMIT = {
  free: 10,      // 무료 사용자: 분당 10회
  pro: 50,       // Pro 사용자: 분당 50회
  premium: 100,  // Premium 사용자: 분당 100회
  admin: 1000,   // 관리자: 분당 1000회
}

export async function POST(req: NextRequest) {
  // 데모 모드에서는 인증 우회
  if (!isDemoMode()) {
    // 인증 확인
    const auth = await requireAuth(req)
    if (auth instanceof NextResponse) return auth

    const authResult = auth as AuthResult
    const userId = authResult.user?.id || getClientIP(req)
    const userPlan = (authResult.user?.role === 'admin' ? 'admin' : 'free') as keyof typeof RATE_LIMIT

    // Rate Limiting 확인
    const limit = RATE_LIMIT[userPlan] || RATE_LIMIT.free
    const rateCheck = checkRateLimit(`chat:${userId}`, limit, 60000)

    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetIn)
    }
  }

  try {
    const { messages } = await req.json()

    // 메시지 검증
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: '메시지가 필요합니다' },
        { status: 400 }
      )
    }

    // 메시지 길이 제한 (최대 50개 메시지)
    if (messages.length > 50) {
      return NextResponse.json(
        { error: '대화 길이가 너무 깁니다' },
        { status: 400 }
      )
    }

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'AI 응답 생성에 실패했습니다' },
      { status: 500 }
    )
  }
}
