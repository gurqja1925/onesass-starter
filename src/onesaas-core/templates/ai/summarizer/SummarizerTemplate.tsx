'use client'

/**
 * AI 요약 템플릿
 * 긴 텍스트, 문서, URL을 요약하는 인터페이스
 */

import { useState, FormEvent } from 'react'
import {
  FileText,
  Loader2,
  Copy,
  Check,
  Link,
  Upload,
  Sparkles,
  AlignLeft,
  List,
  Hash,
} from 'lucide-react'

// 입력 타입
type InputType = 'text' | 'url' | 'file'

// 요약 스타일
const SUMMARY_STYLES = [
  { id: 'concise', name: '간결하게', icon: AlignLeft, description: '핵심만 2-3문장' },
  { id: 'bullet', name: '불릿 포인트', icon: List, description: '핵심을 목록으로' },
  { id: 'detailed', name: '상세하게', icon: FileText, description: '주요 내용 포함' },
  { id: 'key-points', name: '핵심 포인트', icon: Hash, description: '숫자로 정리' },
]

// 요약 길이
const LENGTH_OPTIONS = [
  { id: 'short', name: '짧게', description: '50-100자' },
  { id: 'medium', name: '보통', description: '150-300자' },
  { id: 'long', name: '길게', description: '400-600자' },
]

// 언어 옵션
const LANGUAGE_OPTIONS = [
  { id: 'same', name: '원문 언어 유지' },
  { id: 'ko', name: '한국어' },
  { id: 'en', name: 'English' },
  { id: 'ja', name: '日本語' },
  { id: 'zh', name: '中文' },
]

export function SummarizerTemplate() {
  const [inputType, setInputType] = useState<InputType>('text')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [style, setStyle] = useState('concise')
  const [length, setLength] = useState('medium')
  const [language, setLanguage] = useState('same')
  const [isProcessing, setIsProcessing] = useState(false)
  const [summary, setSummary] = useState('')
  const [copied, setCopied] = useState(false)

  // 요약 실행
  const handleSummarize = async (e: FormEvent) => {
    e.preventDefault()

    const content = inputType === 'text' ? text : url
    if (!content.trim() || isProcessing) return

    setIsProcessing(true)
    setSummary('')

    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: inputType,
          content: content,
          style,
          length,
          language,
        }),
      })

      if (!response.ok) throw new Error('요약 실패')

      const data = await response.json()
      setSummary(data.summary || data.content)
    } catch (error) {
      console.error('Summarize error:', error)
      setSummary('요약 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  // 파일 업로드
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 텍스트 파일인 경우 직접 읽기
    if (file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = (e) => {
        setText(e.target?.result as string)
        setInputType('text')
      }
      reader.readAsText(file)
    } else {
      // PDF 등은 서버에서 처리
      alert('PDF 파일은 서버에서 처리됩니다.')
    }
  }

  // 복사
  const copySummary = async () => {
    await navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* 헤더 */}
      <header
        className="border-b px-6 py-4"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-4xl mx-auto flex items-center gap-3">
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
              AI 요약
            </h1>
            <p
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              긴 문서를 핵심만 추출하세요
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 입력 영역 */}
          <div className="space-y-6">
            {/* 입력 타입 선택 */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInputType('text')}
                className="flex-1 py-3 rounded-xl border font-medium transition-all flex items-center justify-center gap-2"
                style={{
                  background: inputType === 'text' ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                  color: inputType === 'text' ? 'var(--color-bg)' : 'var(--color-text)',
                  borderColor: inputType === 'text' ? 'var(--color-accent)' : 'var(--color-border)',
                }}
              >
                <FileText className="w-4 h-4" />
                텍스트
              </button>
              <button
                type="button"
                onClick={() => setInputType('url')}
                className="flex-1 py-3 rounded-xl border font-medium transition-all flex items-center justify-center gap-2"
                style={{
                  background: inputType === 'url' ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                  color: inputType === 'url' ? 'var(--color-bg)' : 'var(--color-text)',
                  borderColor: inputType === 'url' ? 'var(--color-accent)' : 'var(--color-border)',
                }}
              >
                <Link className="w-4 h-4" />
                URL
              </button>
              <label
                className="flex-1 py-3 rounded-xl border font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <Upload className="w-4 h-4" />
                파일
                <input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <form onSubmit={handleSummarize} className="space-y-4">
              {/* 텍스트 입력 */}
              {inputType === 'text' && (
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--color-text)' }}
                  >
                    요약할 텍스트
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="요약할 텍스트를 붙여넣으세요..."
                    rows={10}
                    className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 resize-none"
                    style={{
                      background: 'var(--color-bg-secondary)',
                      color: 'var(--color-text)',
                      borderColor: 'var(--color-border)',
                    }}
                  />
                  <p
                    className="text-xs mt-1 text-right"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {text.length.toLocaleString()} 자
                  </p>
                </div>
              )}

              {/* URL 입력 */}
              {inputType === 'url' && (
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--color-text)' }}
                  >
                    웹페이지 URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2"
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
                    뉴스 기사, 블로그, 문서 URL을 입력하세요
                  </p>
                </div>
              )}

              {/* 요약 스타일 */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  요약 스타일
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SUMMARY_STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStyle(s.id)}
                      className="p-3 rounded-xl border text-left transition-all"
                      style={{
                        background: style === s.id ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                        color: style === s.id ? 'var(--color-bg)' : 'var(--color-text)',
                        borderColor: style === s.id ? 'var(--color-accent)' : 'var(--color-border)',
                      }}
                    >
                      <s.icon className="w-4 h-4 mb-1" />
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs opacity-70">{s.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 길이 & 언어 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--color-text)' }}
                  >
                    요약 길이
                  </label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{
                      background: 'var(--color-bg-secondary)',
                      color: 'var(--color-text)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    {LENGTH_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name} ({opt.description})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--color-text)' }}
                  >
                    출력 언어
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{
                      background: 'var(--color-bg-secondary)',
                      color: 'var(--color-text)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 요약 버튼 */}
              <button
                type="submit"
                disabled={(inputType === 'text' ? !text.trim() : !url.trim()) || isProcessing}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-bg)',
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    요약 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    요약하기
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 결과 영역 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2
                className="font-bold"
                style={{ color: 'var(--color-text)' }}
              >
                요약 결과
              </h2>
              {summary && (
                <button
                  onClick={copySummary}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    color: 'var(--color-text)',
                  }}
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? '복사됨' : '복사'}
                </button>
              )}
            </div>

            <div
              className="min-h-[400px] p-6 rounded-xl border"
              style={{
                background: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)',
              }}
            >
              {summary ? (
                <div
                  className="whitespace-pre-wrap leading-relaxed"
                  style={{ color: 'var(--color-text)' }}
                >
                  {summary}
                </div>
              ) : (
                <div
                  className="h-full flex items-center justify-center"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <p className="text-center">
                    {isProcessing
                      ? 'AI가 요약하고 있습니다...'
                      : '텍스트나 URL을 입력하고\n요약을 실행해보세요'}
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
