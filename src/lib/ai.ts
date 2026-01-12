/**
 * AI/LLM 유틸리티
 * 여러 LLM 제공자를 지원하며, 환경변수에 설정된 API 키를 자동으로 감지합니다.
 *
 * 지원 제공자:
 * - OpenAI (OPENAI_API_KEY)
 * - Anthropic Claude (ANTHROPIC_API_KEY)
 * - Google Gemini (GOOGLE_API_KEY)
 * - DeepSeek (DEEPSEEK_API_KEY)
 * - Groq (GROQ_API_KEY)
 * - Mistral (MISTRAL_API_KEY)
 */

// LLM 제공자 타입
export type LLMProvider = 'openai' | 'anthropic' | 'google' | 'deepseek' | 'groq' | 'mistral'

// LLM 설정
interface LLMConfig {
  provider: LLMProvider
  model: string
  apiKey: string
  baseUrl?: string
}

// 제공자별 기본 모델
const defaultModels: Record<LLMProvider, string> = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-haiku-20241022',
  google: 'gemini-2.0-flash',
  deepseek: 'deepseek-chat',
  groq: 'llama-3.3-70b-versatile',
  mistral: 'mistral-small-latest',
}

// 제공자별 API Base URL
const baseUrls: Record<LLMProvider, string> = {
  openai: 'https://api.openai.com/v1',
  anthropic: 'https://api.anthropic.com/v1',
  google: 'https://generativelanguage.googleapis.com/v1beta',
  deepseek: 'https://api.deepseek.com',
  groq: 'https://api.groq.com/openai/v1',
  mistral: 'https://api.mistral.ai/v1',
}

// 환경변수에서 사용 가능한 LLM 감지
export function getAvailableLLMs(): LLMProvider[] {
  const available: LLMProvider[] = []

  if (process.env.OPENAI_API_KEY) available.push('openai')
  if (process.env.ANTHROPIC_API_KEY) available.push('anthropic')
  if (process.env.GOOGLE_API_KEY) available.push('google')
  if (process.env.DEEPSEEK_API_KEY) available.push('deepseek')
  if (process.env.GROQ_API_KEY) available.push('groq')
  if (process.env.MISTRAL_API_KEY) available.push('mistral')

  return available
}

// 기본 LLM 가져오기 (첫 번째 사용 가능한 것)
export function getDefaultLLM(): LLMConfig | null {
  const available = getAvailableLLMs()
  if (available.length === 0) return null

  const provider = available[0]
  return getLLMConfig(provider)
}

// 특정 제공자의 LLM 설정 가져오기
export function getLLMConfig(provider: LLMProvider, model?: string): LLMConfig | null {
  const envKeys: Record<LLMProvider, string> = {
    openai: 'OPENAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    google: 'GOOGLE_API_KEY',
    deepseek: 'DEEPSEEK_API_KEY',
    groq: 'GROQ_API_KEY',
    mistral: 'MISTRAL_API_KEY',
  }

  const apiKey = process.env[envKeys[provider]]
  if (!apiKey) return null

  return {
    provider,
    model: model || defaultModels[provider],
    apiKey,
    baseUrl: baseUrls[provider],
  }
}

// OpenAI 호환 API 호출 (OpenAI, Groq, DeepSeek, Mistral)
export async function chatCompletion(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  options?: {
    provider?: LLMProvider
    model?: string
    temperature?: number
    maxTokens?: number
  }
): Promise<string> {
  const provider = options?.provider
  const config = provider ? getLLMConfig(provider, options?.model) : getDefaultLLM()

  if (!config) {
    throw new Error('사용 가능한 LLM이 없습니다. API 키를 설정해주세요.')
  }

  // Anthropic은 별도 처리
  if (config.provider === 'anthropic') {
    return anthropicChat(messages, config, options)
  }

  // Google Gemini는 별도 처리
  if (config.provider === 'google') {
    return googleChat(messages, config, options)
  }

  // OpenAI 호환 API (OpenAI, Groq, DeepSeek, Mistral)
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`LLM API 오류 (${config.provider}): ${error}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

// Anthropic Claude API
async function anthropicChat(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  config: LLMConfig,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  // 시스템 메시지 분리
  const systemMessage = messages.find((m) => m.role === 'system')?.content || ''
  const chatMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role, content: m.content }))

  const response = await fetch(`${config.baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model,
      system: systemMessage,
      messages: chatMessages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Anthropic API 오류: ${error}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text || ''
}

// Google Gemini API
async function googleChat(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  config: LLMConfig,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  // 메시지 변환 (Gemini 형식)
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

  const systemInstruction = messages.find((m) => m.role === 'system')?.content

  const response = await fetch(
    `${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? 1000,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Google Gemini API 오류: ${error}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// 편의 함수: 간단한 질문에 대한 답변
export async function ask(
  question: string,
  options?: {
    systemPrompt?: string
    provider?: LLMProvider
    model?: string
  }
): Promise<string> {
  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = []

  if (options?.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt })
  }

  messages.push({ role: 'user', content: question })

  return chatCompletion(messages, options)
}

// 편의 함수: 텍스트 요약
export async function summarize(
  text: string,
  options?: { maxLength?: number; provider?: LLMProvider }
): Promise<string> {
  return ask(text, {
    systemPrompt: `다음 텍스트를 ${options?.maxLength || 200}자 이내로 간결하게 요약해주세요. 한국어로 응답하세요.`,
    provider: options?.provider,
  })
}

// 편의 함수: 텍스트 번역
export async function translate(
  text: string,
  targetLang: string = '한국어',
  options?: { provider?: LLMProvider }
): Promise<string> {
  return ask(text, {
    systemPrompt: `다음 텍스트를 ${targetLang}로 자연스럽게 번역해주세요. 번역 결과만 출력하세요.`,
    provider: options?.provider,
  })
}

// 편의 함수: 텍스트 분류
export async function classify(
  text: string,
  categories: string[],
  options?: { provider?: LLMProvider }
): Promise<string> {
  return ask(text, {
    systemPrompt: `다음 텍스트를 아래 카테고리 중 하나로 분류해주세요. 카테고리 이름만 출력하세요.
카테고리: ${categories.join(', ')}`,
    provider: options?.provider,
  })
}

// 편의 함수: 감정 분석
export async function analyzeSentiment(
  text: string,
  options?: { provider?: LLMProvider }
): Promise<'positive' | 'negative' | 'neutral'> {
  const result = await ask(text, {
    systemPrompt: '다음 텍스트의 감정을 분석해주세요. "positive", "negative", "neutral" 중 하나만 출력하세요.',
    provider: options?.provider,
  })

  const lower = result.toLowerCase().trim()
  if (lower.includes('positive')) return 'positive'
  if (lower.includes('negative')) return 'negative'
  return 'neutral'
}

// AI SDK 호환 (기존 코드 지원)
export { openai } from '@ai-sdk/openai'
export { anthropic } from '@ai-sdk/anthropic'
export { google } from '@ai-sdk/google'

// 기본 모델 export (기존 코드 호환성)
import { openai } from '@ai-sdk/openai'
export const model = openai('gpt-4o-mini')
