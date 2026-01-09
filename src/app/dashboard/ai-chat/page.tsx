'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

interface ModelInfo {
  id: string
  provider: string
  name: string
  label: string
  description: string
  price: string
  recommended?: boolean
}

const MODELS: ModelInfo[] = [
  // Google - 가성비 최고
  { id: 'gemini-2.0-flash', provider: 'google', name: 'gemini-2.0-flash-001', label: 'Gemini 2.0 Flash', description: '가성비 최고!', price: '$0.50/1M', recommended: true },
  { id: 'gemini-1.5-flash', provider: 'google', name: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', description: '빠르고 저렴', price: '$0.075/1M' },
  { id: 'gemini-1.5-pro', provider: 'google', name: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', description: '고성능', price: '$1.25/1M' },
  // OpenAI
  { id: 'gpt-4o-mini', provider: 'openai', name: 'gpt-4o-mini', label: 'GPT-4o Mini', description: '빠르고 저렴', price: '$0.15/1M' },
  { id: 'gpt-4o', provider: 'openai', name: 'gpt-4o', label: 'GPT-4o', description: '가장 뛰어난 성능', price: '$5.00/1M' },
  // Anthropic
  { id: 'claude-3-5-sonnet', provider: 'anthropic', name: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', description: '최신 Claude', price: '$3.00/1M' },
  { id: 'claude-3-5-haiku', provider: 'anthropic', name: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku', description: '빠른 응답', price: '$0.25/1M' },
]

export default function AIChatPage() {
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash')
  const [showModelSelector, setShowModelSelector] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: '/api/ai/chat',
    body: {
      model: selectedModel,
    },
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: '안녕하세요! AI 어시스턴트입니다. 무엇을 도와드릴까요?',
      },
    ],
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const handleQuickQuestion = (question: string) => {
    const fakeEvent = {
      target: { value: question + '에 대해 알려주세요' },
    } as React.ChangeEvent<HTMLTextAreaElement>
    handleInputChange(fakeEvent)
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: '안녕하세요! AI 어시스턴트입니다. 무엇을 도와드릴까요?',
      },
    ])
  }

  const currentModel = MODELS.find((m) => m.id === selectedModel)

  return (
    <DashboardLayout title="AI 채팅">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">AI 채팅</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              AI와 대화하며 아이디어를 얻거나 질문에 답변을 받으세요
            </p>
          </div>
          <button
            onClick={handleClearChat}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            새 대화
          </button>
        </div>

        {/* 모델 선택 & 사용량 */}
        <div
          className="mb-6 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          {/* 모델 선택 */}
          <div className="relative">
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              <span className="text-lg">
                {currentModel?.provider === 'google' ? '💎' : currentModel?.provider === 'openai' ? '🤖' : '🧠'}
              </span>
              <div className="text-left">
                <p className="font-medium text-sm">{currentModel?.label}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {currentModel?.description}
                </p>
              </div>
              <span style={{ color: 'var(--color-text-secondary)' }}>▼</span>
            </button>

            {showModelSelector && (
              <div
                className="absolute top-full left-0 mt-2 w-72 rounded-xl overflow-hidden z-50 shadow-lg max-h-[400px] overflow-y-auto"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div className="p-2">
                  {/* Google - 추천 */}
                  <p className="text-xs px-2 py-1 flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="text-green-500">★</span> Google (추천)
                  </p>
                  {MODELS.filter((m) => m.provider === 'google').map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id)
                        setShowModelSelector(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:opacity-80"
                      style={{
                        background: selectedModel === model.id ? 'var(--color-accent)' : 'transparent',
                        color: selectedModel === model.id ? 'var(--color-bg)' : 'var(--color-text)',
                      }}
                    >
                      <span>💎</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm flex items-center gap-2">
                          {model.label}
                          {model.recommended && <span className="px-1 py-0.5 text-[10px] rounded bg-green-500 text-white">추천</span>}
                        </p>
                        <p className="text-xs opacity-70">{model.description}</p>
                      </div>
                      <span className="text-xs opacity-50">{model.price}</span>
                    </button>
                  ))}

                  {/* OpenAI */}
                  <p className="text-xs px-2 py-1 mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                    OpenAI
                  </p>
                  {MODELS.filter((m) => m.provider === 'openai').map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id)
                        setShowModelSelector(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:opacity-80"
                      style={{
                        background: selectedModel === model.id ? 'var(--color-accent)' : 'transparent',
                        color: selectedModel === model.id ? 'var(--color-bg)' : 'var(--color-text)',
                      }}
                    >
                      <span>🤖</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{model.label}</p>
                        <p className="text-xs opacity-70">{model.description}</p>
                      </div>
                      <span className="text-xs opacity-50">{model.price}</span>
                    </button>
                  ))}

                  {/* Anthropic */}
                  <p className="text-xs px-2 py-1 mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                    Anthropic
                  </p>
                  {MODELS.filter((m) => m.provider === 'anthropic').map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id)
                        setShowModelSelector(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:opacity-80"
                      style={{
                        background: selectedModel === model.id ? 'var(--color-accent)' : 'transparent',
                        color: selectedModel === model.id ? 'var(--color-bg)' : 'var(--color-text)',
                      }}
                    >
                      <span>🧠</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{model.label}</p>
                        <p className="text-xs opacity-70">{model.description}</p>
                      </div>
                      <span className="text-xs opacity-50">{model.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 사용량 */}
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>이번 달 사용량</p>
              <p className="text-lg font-bold">47 / 100 메시지</p>
            </div>
            <div className="text-right">
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>플랜</p>
              <p className="font-bold" style={{ color: 'var(--color-accent)' }}>Pro</p>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div
            className="mb-4 p-4 rounded-xl"
            style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}
          >
            <p className="font-medium">오류가 발생했습니다</p>
            <p className="text-sm">{error.message}</p>
            <p className="text-xs mt-2">
              💡 API 키가 설정되어 있는지 확인해주세요. 설정 → AI 설정에서 확인할 수 있습니다.
            </p>
          </div>
        )}

        {/* 채팅 영역 */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          {/* 메시지 목록 */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
                  }`}
                  style={{
                    background: message.role === 'user' ? 'var(--color-accent)' : 'var(--color-bg)',
                    color: message.role === 'user' ? 'var(--color-bg)' : 'var(--color-text)',
                  }}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="p-4 rounded-2xl rounded-bl-sm"
                  style={{ background: 'var(--color-bg)' }}
                >
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--color-accent)', animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--color-accent)', animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--color-accent)', animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <form onSubmit={handleSubmit} className="p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                rows={1}
                className="flex-1 px-4 py-3 rounded-xl resize-none"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                전송
              </button>
            </div>
          </form>
        </div>

        {/* 빠른 질문 */}
        <div className="mt-6">
          <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>빠른 질문</p>
          <div className="flex flex-wrap gap-2">
            {['블로그 글 아이디어', '마케팅 전략', '코드 작성 도움', '번역 요청'].map((q) => (
              <button
                key={q}
                onClick={() => handleQuickQuestion(q)}
                className="px-4 py-2 rounded-lg text-sm transition-all hover:opacity-80"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* API 키 안내 */}
        <div
          className="mt-6 p-4 rounded-xl"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <p className="font-medium mb-1">💡 AI 설정 안내</p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            AI 기능을 사용하려면 API 키가 필요합니다.
            <a href="/admin/guides/ai" className="ml-1" style={{ color: 'var(--color-accent)' }}>
              AI 설정 가이드 보기 →
            </a>
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
