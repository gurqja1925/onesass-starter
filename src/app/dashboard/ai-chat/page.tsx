'use client'

import { useState, useRef, useEffect } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! AI 어시스턴트입니다. 무엇을 도와드릴까요?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // 데모: 가짜 AI 응답 (실제로는 API 호출)
    setTimeout(() => {
      const responses = [
        '좋은 질문이네요! 그 부분에 대해 자세히 설명해 드리겠습니다.',
        '네, 도와드릴 수 있습니다. 어떤 부분이 궁금하신가요?',
        '흥미로운 주제군요! 제가 알기로는...',
        '그건 정말 중요한 포인트입니다. 제 생각에는...',
        '물론이죠! 단계별로 설명해 드리겠습니다.',
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse + '\n\n(이것은 데모 응답입니다. 실제 AI API를 연동하면 진짜 응답을 받을 수 있습니다.)',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <DashboardLayout title="AI 채팅">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">AI 채팅</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            AI와 대화하며 아이디어를 얻거나 질문에 답변을 받으세요
          </p>
        </div>

        {/* 사용량 표시 */}
        <div
          className="mb-6 p-4 rounded-xl flex items-center justify-between"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>이번 달 사용량</p>
            <p className="text-lg font-bold">47 / 100 메시지</p>
          </div>
          <div className="text-right">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>플랜</p>
            <p className="font-bold" style={{ color: 'var(--color-accent)' }}>Pro</p>
          </div>
        </div>

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
                  <p
                    className="text-xs mt-2 opacity-60"
                  >
                    {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
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
          <div className="p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
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
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                전송
              </button>
            </div>
          </div>
        </div>

        {/* 빠른 질문 */}
        <div className="mt-6">
          <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>빠른 질문</p>
          <div className="flex flex-wrap gap-2">
            {['블로그 글 아이디어', '마케팅 전략', '코드 작성 도움', '번역 요청'].map((q) => (
              <button
                key={q}
                onClick={() => setInput(q + '에 대해 알려주세요')}
                className="px-4 py-2 rounded-lg text-sm transition-all hover:opacity-80"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
