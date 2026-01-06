'use client'

/**
 * AI 챗봇 템플릿
 * 다양한 AI 모델과 대화할 수 있는 챗봇 인터페이스
 */

import { useState, useRef, useEffect, FormEvent } from 'react'
import { Send, Bot, User, Loader2, Settings, Trash2, Copy, Check } from 'lucide-react'

// 메시지 타입
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  model?: string
}

// AI 모델 타입
interface AIModel {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'google' | 'local'
  description: string
  maxTokens: number
}

// 사용 가능한 AI 모델
const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: '가장 강력한 OpenAI 모델',
    maxTokens: 128000,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    description: '빠르고 경제적인 모델',
    maxTokens: 128000,
  },
  {
    id: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    provider: 'anthropic',
    description: 'Anthropic의 균형 잡힌 모델',
    maxTokens: 200000,
  },
  {
    id: 'claude-opus-4-20250514',
    name: 'Claude Opus 4',
    provider: 'anthropic',
    description: '가장 강력한 Anthropic 모델',
    maxTokens: 200000,
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'google',
    description: 'Google의 빠른 모델',
    maxTokens: 1000000,
  },
]

// Props
interface ChatbotTemplateProps {
  title?: string
  subtitle?: string
  systemPrompt?: string
  defaultModel?: string
  showModelSelector?: boolean
  showHistory?: boolean
  placeholder?: string
  welcomeMessage?: string
}

export function ChatbotTemplate({
  title = 'AI 어시스턴트',
  subtitle = '무엇이든 물어보세요',
  systemPrompt = '당신은 친절하고 도움이 되는 AI 어시스턴트입니다. 한국어로 답변해주세요.',
  defaultModel = 'gpt-4o-mini',
  showModelSelector = true,
  showHistory = true,
  placeholder = '메시지를 입력하세요...',
  welcomeMessage = '안녕하세요! 무엇을 도와드릴까요?',
}: ChatbotTemplateProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(defaultModel)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 메시지 전송
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content },
          ],
          model: selectedModel,
        }),
      })

      if (!response.ok) throw new Error('API 요청 실패')

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || data.message,
        timestamp: new Date(),
        model: selectedModel,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // 메시지 복사
  const copyMessage = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // 대화 초기화
  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date(),
      },
    ])
  }

  // 키보드 단축키 (Shift+Enter로 줄바꿈, Enter로 전송)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* 헤더 */}
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{
          background: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--color-accent)' }}
          >
            <Bot className="w-6 h-6" style={{ color: 'var(--color-bg)' }} />
          </div>
          <div>
            <h1
              className="font-bold text-lg"
              style={{ color: 'var(--color-text)' }}
            >
              {title}
            </h1>
            <p
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 모델 선택 */}
          {showModelSelector && (
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm border outline-none"
              style={{
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
            >
              {AI_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          )}

          {/* 설정 버튼 */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* 초기화 버튼 */}
          <button
            onClick={clearChat}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 메시지 영역 */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--color-accent)' }}
                >
                  <Bot
                    className="w-5 h-5"
                    style={{ color: 'var(--color-bg)' }}
                  />
                </div>
              )}

              <div
                className={`group relative max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'rounded-br-md'
                    : 'rounded-bl-md'
                }`}
                style={{
                  background:
                    message.role === 'user'
                      ? 'var(--color-accent)'
                      : 'var(--color-bg-secondary)',
                  color:
                    message.role === 'user'
                      ? 'var(--color-bg)'
                      : 'var(--color-text)',
                }}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>

                {/* 복사 버튼 */}
                <button
                  onClick={() => copyMessage(message.content, message.id)}
                  className="absolute -bottom-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {copiedId === message.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {message.role === 'user' && (
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--color-border)' }}
                >
                  <User
                    className="w-5 h-5"
                    style={{ color: 'var(--color-text)' }}
                  />
                </div>
              )}
            </div>
          ))}

          {/* 로딩 표시 */}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--color-accent)' }}
              >
                <Bot
                  className="w-5 h-5"
                  style={{ color: 'var(--color-bg)' }}
                />
              </div>
              <div
                className="rounded-2xl rounded-bl-md px-4 py-3"
                style={{ background: 'var(--color-bg-secondary)' }}
              >
                <Loader2
                  className="w-5 h-5 animate-spin"
                  style={{ color: 'var(--color-text-secondary)' }}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* 입력 영역 */}
      <footer
        className="border-t p-4"
        style={{
          background: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)',
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex gap-3"
        >
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              className="w-full px-4 py-3 rounded-xl border resize-none outline-none focus:ring-2"
              style={{
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
                minHeight: '48px',
                maxHeight: '200px',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-bg)',
            }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>

        <p
          className="text-center text-xs mt-3"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          AI가 생성한 답변은 부정확할 수 있습니다. 중요한 정보는 확인해주세요.
        </p>
      </footer>
    </div>
  )
}
