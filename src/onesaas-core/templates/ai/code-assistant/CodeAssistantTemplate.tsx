'use client'

/**
 * AI 코드 어시스턴트 템플릿
 * 코드 생성, 설명, 리팩토링, 디버깅 지원
 */

import { useState, FormEvent } from 'react'
import {
  Code,
  Loader2,
  Copy,
  Check,
  Play,
  Bug,
  RefreshCw,
  FileCode,
  Lightbulb,
  Zap,
} from 'lucide-react'

// 코드 작업 유형
const CODE_TASKS = [
  { id: 'generate', name: '코드 생성', icon: Code, description: '요구사항으로 코드 생성' },
  { id: 'explain', name: '코드 설명', icon: Lightbulb, description: '코드 동작 설명' },
  { id: 'refactor', name: '리팩토링', icon: RefreshCw, description: '코드 개선 및 최적화' },
  { id: 'debug', name: '디버깅', icon: Bug, description: '버그 찾기 및 수정' },
  { id: 'convert', name: '언어 변환', icon: FileCode, description: '다른 언어로 변환' },
  { id: 'optimize', name: '최적화', icon: Zap, description: '성능 최적화' },
]

// 프로그래밍 언어
const LANGUAGES = [
  { id: 'typescript', name: 'TypeScript' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'cpp', name: 'C++' },
  { id: 'csharp', name: 'C#' },
  { id: 'swift', name: 'Swift' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'sql', name: 'SQL' },
  { id: 'html', name: 'HTML/CSS' },
]

export function CodeAssistantTemplate() {
  const [task, setTask] = useState('generate')
  const [language, setLanguage] = useState('typescript')
  const [targetLanguage, setTargetLanguage] = useState('python')
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentTask = CODE_TASKS.find((t) => t.id === task)!

  // 코드 처리
  const handleProcess = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    setIsProcessing(true)
    setResult('')

    try {
      const systemPrompts: Record<string, string> = {
        generate: `당신은 전문 프로그래머입니다. ${LANGUAGES.find((l) => l.id === language)?.name}로 요청된 기능을 구현하는 깔끔하고 효율적인 코드를 작성해주세요. 주석을 포함하고, 모범 사례를 따라주세요.`,
        explain: '코드를 상세히 분석하고 설명해주세요. 각 부분의 역할, 알고리즘, 시간/공간 복잡도를 설명해주세요.',
        refactor: '코드를 더 깔끔하고, 가독성 좋고, 유지보수하기 쉽게 리팩토링해주세요. 변경 이유도 설명해주세요.',
        debug: '코드의 버그나 문제점을 찾아 수정해주세요. 무엇이 문제였는지, 어떻게 해결했는지 설명해주세요.',
        convert: `코드를 ${LANGUAGES.find((l) => l.id === targetLanguage)?.name}로 변환해주세요. 해당 언어의 관용적 표현을 사용해주세요.`,
        optimize: '코드의 성능을 최적화해주세요. 시간/공간 복잡도를 개선하고, 변경 사항을 설명해주세요.',
      }

      const response = await fetch('/api/ai/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: input,
          task,
          language,
          targetLanguage: task === 'convert' ? targetLanguage : undefined,
          systemPrompt: systemPrompts[task],
        }),
      })

      if (!response.ok) throw new Error('처리 실패')

      const data = await response.json()
      setResult(data.content || data.code)
    } catch (error) {
      console.error('Code processing error:', error)
      setResult('코드 처리 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  // 복사
  const copyResult = async () => {
    await navigator.clipboard.writeText(result)
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
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--color-accent)' }}
          >
            <Code className="w-6 h-6" style={{ color: 'var(--color-bg)' }} />
          </div>
          <div>
            <h1
              className="font-bold text-lg"
              style={{ color: 'var(--color-text)' }}
            >
              AI 코드 어시스턴트
            </h1>
            <p
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              코드 생성, 설명, 리팩토링, 디버깅
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* 작업 선택 */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {CODE_TASKS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTask(t.id)}
                className="p-4 rounded-xl border text-left transition-all"
                style={{
                  background:
                    task === t.id
                      ? 'var(--color-accent)'
                      : 'var(--color-bg-secondary)',
                  color:
                    task === t.id ? 'var(--color-bg)' : 'var(--color-text)',
                  borderColor:
                    task === t.id
                      ? 'var(--color-accent)'
                      : 'var(--color-border)',
                }}
              >
                <t.icon className="w-5 h-5 mb-2" />
                <p className="font-medium text-sm">{t.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 언어 선택 */}
        <div className="mb-6 flex gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              {task === 'generate' ? '생성할 언어' : '코드 언어'}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 rounded-lg border outline-none"
              style={{
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {task === 'convert' && (
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text)' }}
              >
                변환할 언어
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg border outline-none"
                style={{
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                }}
              >
                {LANGUAGES.filter((l) => l.id !== language).map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <form onSubmit={handleProcess}>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* 입력 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {task === 'generate' ? '요구사항' : '코드 입력'}
                </label>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  task === 'generate'
                    ? '예: 배열에서 중복을 제거하는 함수를 만들어줘'
                    : '코드를 붙여넣으세요...'
                }
                className="w-full h-[400px] px-4 py-3 rounded-xl border outline-none focus:ring-2 resize-none font-mono text-sm"
                style={{
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                }}
              />
            </div>

            {/* 결과 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  결과
                </label>
                {result && (
                  <button
                    type="button"
                    onClick={copyResult}
                    className="flex items-center gap-1 px-2 py-1 rounded text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
              <div
                className="w-full h-[400px] px-4 py-3 rounded-xl border overflow-auto font-mono text-sm"
                style={{
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                }}
              >
                {result ? (
                  <pre className="whitespace-pre-wrap">{result}</pre>
                ) : (
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    {isProcessing
                      ? 'AI가 처리하고 있습니다...'
                      : '결과가 여기에 표시됩니다'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 실행 버튼 */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 flex items-center gap-2"
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-bg)',
              }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  {currentTask.name} 실행
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
