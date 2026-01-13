import { streamText, generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, AuthResult } from '@/lib/api-auth'
import { useQuota, getUserPlan } from '@/lib/usage'

// 지원하는 모델 목록 (2025년 1월 최신)
export const SUPPORTED_MODELS = {
  // Google - 가성비 최고
  'gemini-2.0-flash': { provider: 'google', name: 'gemini-2.0-flash-001', label: 'Gemini 2.0 Flash', description: '가성비 최고, 추천!', price: '$0.50/1M' },
  'gemini-1.5-flash': { provider: 'google', name: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', description: '빠르고 저렴', price: '$0.075/1M' },
  'gemini-1.5-pro': { provider: 'google', name: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', description: '고성능', price: '$1.25/1M' },
  // OpenAI
  'gpt-4o': { provider: 'openai', name: 'gpt-4o', label: 'GPT-4o', description: '가장 뛰어난 성능', price: '$5.00/1M' },
  'gpt-4o-mini': { provider: 'openai', name: 'gpt-4o-mini', label: 'GPT-4o Mini', description: '빠르고 저렴', price: '$0.15/1M' },
  'gpt-4-turbo': { provider: 'openai', name: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: '균형잡힌 성능', price: '$10.00/1M' },
  // Anthropic
  'claude-3-5-sonnet': { provider: 'anthropic', name: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', description: '최신 Claude', price: '$3.00/1M' },
  'claude-3-5-haiku': { provider: 'anthropic', name: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku', description: '빠른 응답', price: '$0.25/1M' },
  'claude-3-opus': { provider: 'anthropic', name: 'claude-3-opus-20240229', label: 'Claude 3 Opus', description: '가장 강력', price: '$15.00/1M' },
} as const

type ModelId = keyof typeof SUPPORTED_MODELS

function getModel(modelId: ModelId) {
  const modelInfo = SUPPORTED_MODELS[modelId]
  if (!modelInfo) {
    throw new Error(`지원하지 않는 모델: ${modelId}`)
  }

  const provider = modelInfo.provider
  switch (provider) {
    case 'openai':
      return openai(modelInfo.name)
    case 'anthropic':
      return anthropic(modelInfo.name)
    case 'google':
      return google(modelInfo.name)
    default:
      // Exhaustive check - 모든 케이스 처리됨
      const _exhaustiveCheck: never = provider
      throw new Error(`지원하지 않는 프로바이더: ${_exhaustiveCheck}`)
  }
}

export async function POST(request: NextRequest) {
  // 인증 확인
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const authResult = auth as AuthResult
  const userId = authResult.user?.id

  if (!userId) {
    return Response.json({ error: '사용자 정보를 찾을 수 없습니다' }, { status: 401 })
  }

  try {
    // DB에서 사용자 플랜 조회
    const userPlan = await getUserPlan(userId)

    // 사용량 체크 및 증가 (AI 호출)
    const quotaResult = await useQuota(userId, userPlan, 'aiCalls', 1)
    
    if (!quotaResult.success) {
      return Response.json({ 
        error: quotaResult.error,
        limitReached: true,
        current: quotaResult.current,
        limit: quotaResult.limit,
      }, { status: 403 })
    }

    const body = await request.json()
    const { messages, model: modelId = 'gpt-4o-mini', stream = true } = body

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: '메시지가 필요합니다' },
        { status: 400 }
      )
    }

    // API 키 확인
    const modelInfo = SUPPORTED_MODELS[modelId as ModelId]
    if (modelInfo?.provider === 'openai' && !process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.' },
        { status: 500 }
      )
    }
    if (modelInfo?.provider === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: 'Anthropic API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.' },
        { status: 500 }
      )
    }
    if (modelInfo?.provider === 'google' && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json(
        { error: 'Google AI API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.' },
        { status: 500 }
      )
    }

    const model = getModel(modelId as ModelId)

    if (stream) {
      // 스트리밍 응답
      const result = await streamText({
        model: model as any,
        messages,
        system: '당신은 친절하고 도움이 되는 AI 어시스턴트입니다. 한국어로 응답해주세요.',
      })

      return result.toDataStreamResponse()
    } else {
      // 일반 응답
      const result = await generateText({
        model: model as any,
        messages,
        system: '당신은 친절하고 도움이 되는 AI 어시스턴트입니다. 한국어로 응답해주세요.',
      })

      return Response.json({ 
        text: result.text,
        usage: {
          current: quotaResult.current,
          limit: quotaResult.limit,
          remaining: quotaResult.remaining,
        }
      })
    }
  } catch (error) {
    console.error('AI Chat Error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'AI 응답 생성 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// 지원 모델 목록 반환
export async function GET() {
  return Response.json({
    models: Object.entries(SUPPORTED_MODELS).map(([id, info]) => ({
      id,
      ...info,
    })),
  })
}
