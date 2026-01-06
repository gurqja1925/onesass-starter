'use client'

/**
 * AI 텍스트 생성 템플릿
 * 블로그 글, 마케팅 카피, 이메일 등 다양한 텍스트 생성
 */

import { useState, FormEvent } from 'react'
import {
  FileText,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Mail,
  Megaphone,
  PenTool,
  MessageSquare,
  FileEdit,
  Globe,
} from 'lucide-react'

// 텍스트 유형
interface TextType {
  id: string
  name: string
  icon: React.ElementType
  description: string
  placeholder: string
  systemPrompt: string
}

const TEXT_TYPES: TextType[] = [
  {
    id: 'blog',
    name: '블로그 글',
    icon: PenTool,
    description: 'SEO 최적화된 블로그 포스트',
    placeholder: '주제: 인공지능의 미래\n키워드: AI, 자동화, 일자리',
    systemPrompt: 'SEO에 최적화된 한국어 블로그 글을 작성해주세요. 제목, 서론, 본론, 결론 구조로 작성하고, 자연스러운 키워드 배치와 가독성 좋은 문단 구성을 해주세요.',
  },
  {
    id: 'marketing',
    name: '마케팅 카피',
    icon: Megaphone,
    description: '광고 및 프로모션 문구',
    placeholder: '제품: 스마트 워치\n타겟: 20-30대 직장인\n강조점: 건강 관리',
    systemPrompt: '설득력 있고 매력적인 마케팅 카피를 작성해주세요. 타겟 고객의 니즈와 감정에 호소하고, 행동을 유도하는 문구를 포함해주세요.',
  },
  {
    id: 'email',
    name: '이메일',
    icon: Mail,
    description: '비즈니스 이메일 작성',
    placeholder: '목적: 미팅 요청\n받는 사람: 거래처 담당자\n내용: 신제품 소개',
    systemPrompt: '프로페셔널하고 정중한 비즈니스 이메일을 작성해주세요. 명확한 목적, 적절한 인사말, 구체적인 행동 요청을 포함해주세요.',
  },
  {
    id: 'social',
    name: 'SNS 게시물',
    icon: MessageSquare,
    description: '인스타그램, 트위터 등',
    placeholder: '플랫폼: 인스타그램\n주제: 카페 오픈 이벤트\n톤: 친근하고 활기찬',
    systemPrompt: '해당 SNS 플랫폼에 적합한 게시물을 작성해주세요. 해시태그, 이모지를 적절히 사용하고, 참여를 유도하는 문구를 포함해주세요.',
  },
  {
    id: 'product',
    name: '상품 설명',
    icon: FileEdit,
    description: '쇼핑몰 상품 상세 설명',
    placeholder: '상품: 프리미엄 가죽 지갑\n특징: 이탈리아 송아지 가죽, 수작업\n가격대: 고가',
    systemPrompt: '구매를 유도하는 상품 설명을 작성해주세요. 제품의 특징, 장점, 사용 방법을 명확히 설명하고, 감성적인 표현도 포함해주세요.',
  },
  {
    id: 'translate',
    name: '번역/로컬라이징',
    icon: Globe,
    description: '다국어 번역 및 현지화',
    placeholder: '원문: Hello, welcome to our service!\n타겟 언어: 한국어\n문맥: 앱 온보딩 화면',
    systemPrompt: '문맥에 맞게 자연스러운 번역을 해주세요. 단순 직역이 아닌, 해당 문화권에서 자연스럽게 느껴지도록 로컬라이징해주세요.',
  },
]

// 톤 옵션
const TONE_OPTIONS = [
  { id: 'professional', name: '전문적' },
  { id: 'friendly', name: '친근한' },
  { id: 'casual', name: '캐주얼' },
  { id: 'formal', name: '격식체' },
  { id: 'humorous', name: '유머러스' },
  { id: 'persuasive', name: '설득적' },
]

// 길이 옵션
const LENGTH_OPTIONS = [
  { id: 'short', name: '짧게', tokens: 200 },
  { id: 'medium', name: '보통', tokens: 500 },
  { id: 'long', name: '길게', tokens: 1000 },
  { id: 'very-long', name: '매우 길게', tokens: 2000 },
]

export function TextGenTemplate() {
  const [selectedType, setSelectedType] = useState<string>('blog')
  const [input, setInput] = useState('')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  const currentType = TEXT_TYPES.find((t) => t.id === selectedType)!

  // 텍스트 생성
  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    setIsGenerating(true)
    setResult('')

    try {
      const selectedLength = LENGTH_OPTIONS.find((l) => l.id === length)
      const selectedTone = TONE_OPTIONS.find((t) => t.id === tone)

      const response = await fetch('/api/ai/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          systemPrompt: `${currentType.systemPrompt} 톤은 ${selectedTone?.name}하게, 길이는 약 ${selectedLength?.tokens}자 내외로 작성해주세요.`,
          type: selectedType,
          maxTokens: selectedLength?.tokens,
        }),
      })

      if (!response.ok) throw new Error('생성 실패')

      const data = await response.json()
      setResult(data.content || data.text)
    } catch (error) {
      console.error('Text generation error:', error)
      setResult('텍스트 생성 중 오류가 발생했습니다.')
    } finally {
      setIsGenerating(false)
    }
  }

  // 복사
  const copyResult = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 초기화
  const reset = () => {
    setInput('')
    setResult('')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* 헤더 */}
      <header
        className="border-b px-6 py-4"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--color-accent)' }}
          >
            <FileText className="w-6 h-6" style={{ color: 'var(--color-bg)' }} />
          </div>
          <div>
            <h1
              className="font-bold text-lg"
              style={{ color: 'var(--color-text)' }}
            >
              AI 텍스트 생성
            </h1>
            <p
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              다양한 형식의 텍스트를 AI로 생성하세요
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* 텍스트 유형 선택 */}
        <div className="mb-8">
          <h2
            className="font-medium mb-3"
            style={{ color: 'var(--color-text)' }}
          >
            텍스트 유형 선택
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {TEXT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setSelectedType(type.id)
                  setInput(type.placeholder)
                }}
                className="p-4 rounded-xl border text-left transition-all"
                style={{
                  background:
                    selectedType === type.id
                      ? 'var(--color-accent)'
                      : 'var(--color-bg-secondary)',
                  color:
                    selectedType === type.id
                      ? 'var(--color-bg)'
                      : 'var(--color-text)',
                  borderColor:
                    selectedType === type.id
                      ? 'var(--color-accent)'
                      : 'var(--color-border)',
                }}
              >
                <type.icon className="w-6 h-6 mb-2" />
                <p className="font-medium text-sm">{type.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 입력 패널 */}
          <div className="space-y-6">
            <form onSubmit={handleGenerate} className="space-y-4">
              {/* 입력 */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  {currentType.name} 정보 입력
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={currentType.placeholder}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 resize-none"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                  }}
                />
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {currentType.description}
                </p>
              </div>

              {/* 톤 선택 */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  톤 & 스타일
                </label>
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setTone(option.id)}
                      className="px-3 py-1.5 rounded-lg text-sm border transition-all"
                      style={{
                        background:
                          tone === option.id
                            ? 'var(--color-accent)'
                            : 'var(--color-bg-secondary)',
                        color:
                          tone === option.id
                            ? 'var(--color-bg)'
                            : 'var(--color-text)',
                        borderColor:
                          tone === option.id
                            ? 'var(--color-accent)'
                            : 'var(--color-border)',
                      }}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 길이 선택 */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  길이
                </label>
                <div className="flex gap-2">
                  {LENGTH_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setLength(option.id)}
                      className="flex-1 py-2 rounded-lg text-sm border transition-all"
                      style={{
                        background:
                          length === option.id
                            ? 'var(--color-accent)'
                            : 'var(--color-bg-secondary)',
                        color:
                          length === option.id
                            ? 'var(--color-bg)'
                            : 'var(--color-text)',
                        borderColor:
                          length === option.id
                            ? 'var(--color-accent)'
                            : 'var(--color-border)',
                      }}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 생성 버튼 */}
              <button
                type="submit"
                disabled={!input.trim() || isGenerating}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-bg)',
                }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    텍스트 생성
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 결과 패널 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2
                className="font-bold"
                style={{ color: 'var(--color-text)' }}
              >
                생성 결과
              </h2>
              {result && (
                <div className="flex gap-2">
                  <button
                    onClick={copyResult}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border"
                    style={{
                      background: 'var(--color-bg-secondary)',
                      color: 'var(--color-text)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? '복사됨' : '복사'}
                  </button>
                  <button
                    onClick={reset}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border"
                    style={{
                      background: 'var(--color-bg-secondary)',
                      color: 'var(--color-text)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    초기화
                  </button>
                </div>
              )}
            </div>

            <div
              className="min-h-[400px] p-4 rounded-xl border"
              style={{
                background: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)',
              }}
            >
              {result ? (
                <div
                  className="whitespace-pre-wrap"
                  style={{ color: 'var(--color-text)' }}
                >
                  {result}
                </div>
              ) : (
                <div
                  className="h-full flex items-center justify-center"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <p className="text-center">
                    {isGenerating
                      ? 'AI가 텍스트를 생성하고 있습니다...'
                      : '정보를 입력하고 텍스트를 생성해보세요'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
