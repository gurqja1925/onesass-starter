'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'
import { Button } from '@/onesaas-core/ui/Button'

type AITool = 'writer' | 'image' | 'code' | 'translate'

export default function AIPage() {
  const [activeTool, setActiveTool] = useState<AITool>('writer')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const tools = [
    { id: 'writer' as AITool, name: 'AI 글쓰기', icon: '✍️', desc: '블로그, 마케팅 문구, 이메일 작성' },
    { id: 'image' as AITool, name: 'AI 이미지', icon: '🎨', desc: '텍스트로 이미지 생성' },
    { id: 'code' as AITool, name: 'AI 코드', icon: '💻', desc: '코드 생성 및 설명' },
    { id: 'translate' as AITool, name: 'AI 번역', icon: '🌐', desc: '다국어 번역' },
  ]

  const placeholders: Record<AITool, string> = {
    writer: '어떤 글을 작성해 드릴까요? (예: "스타트업 마케팅 이메일 작성해줘")',
    image: '어떤 이미지를 만들까요? (예: "미래 도시의 일몰 풍경")',
    code: '어떤 코드가 필요하세요? (예: "React로 로그인 폼 만들어줘")',
    translate: '번역할 텍스트를 입력하세요',
  }

  const handleGenerate = async () => {
    if (!input.trim()) return

    setLoading(true)
    setOutput('')

    // 데모용 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500))

    const demoOutputs: Record<AITool, string> = {
      writer: `# ${input}에 대한 글

안녕하세요! 오늘은 "${input}"에 대해 이야기해보려고 합니다.

## 핵심 포인트

1. **첫 번째 포인트**: 중요한 내용을 여기에 작성합니다.
2. **두 번째 포인트**: 추가적인 설명을 덧붙입니다.
3. **세 번째 포인트**: 결론을 향해 나아갑니다.

## 마무리

이 글이 도움이 되셨기를 바랍니다. 더 궁금한 점이 있으시면 언제든 문의해주세요!

---
*AI가 생성한 콘텐츠입니다*`,
      image: `🖼️ 이미지 생성 완료!

프롬프트: "${input}"

[여기에 생성된 이미지가 표시됩니다]

📐 해상도: 1024x1024
🎨 스타일: 포토리얼리스틱
⏱️ 생성 시간: 3.2초

💡 팁: 더 구체적인 설명을 추가하면 더 좋은 결과를 얻을 수 있어요!`,
      code: `// ${input}

\`\`\`typescript
import { useState } from 'react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // API 호출
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        // 로그인 성공
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('로그인 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}
\`\`\`

✅ 코드 설명:
- useState로 상태 관리
- 폼 제출 시 API 호출
- 로딩 상태 표시
- 에러 처리 포함`,
      translate: `🌐 번역 결과

**원문 (한국어):**
${input}

**영어 (English):**
${input.length > 0 ? 'This is a demo translation. In production, this would show the actual translated text using AI.' : ''}

**일본어 (日本語):**
${input.length > 0 ? 'これはデモ翻訳です。本番環境では、AIを使用した実際の翻訳テキストが表示されます。' : ''}

**중국어 (中文):**
${input.length > 0 ? '这是演示翻译。在生产环境中，将显示使用AI的实际翻译文本。' : ''}

---
*Claude AI 번역*`,
    }

    setOutput(demoOutputs[activeTool])
    setLoading(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            AI 도구
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            AI를 활용해 다양한 작업을 수행하세요
          </p>
        </div>

        {/* 도구 선택 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { setActiveTool(tool.id); setOutput(''); setInput(''); }}
              className="p-4 rounded-xl text-left transition-all hover:scale-105"
              style={{
                background: activeTool === tool.id ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                color: activeTool === tool.id ? 'var(--color-bg)' : 'var(--color-text)',
                border: '1px solid var(--color-border)',
              }}
            >
              <span className="text-2xl mb-2 block">{tool.icon}</span>
              <p className="font-bold">{tool.name}</p>
              <p className="text-xs mt-1 opacity-80">{tool.desc}</p>
            </button>
          ))}
        </div>

        {/* 입력 영역 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {tools.find(t => t.id === activeTool)?.icon}
              {tools.find(t => t.id === activeTool)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholders[activeTool]}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border resize-none"
              style={{
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {input.length}/2000자
              </p>
              <Button onClick={handleGenerate} disabled={loading || !input.trim()}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⚡</span>
                    생성 중...
                  </span>
                ) : (
                  '✨ AI 생성'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 출력 영역 */}
        {output && (
          <Card>
            <CardHeader>
              <CardTitle>결과</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="p-4 rounded-lg whitespace-pre-wrap font-mono text-sm"
                style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
              >
                {output}
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" onClick={() => navigator.clipboard.writeText(output)}>
                  📋 복사
                </Button>
                <Button variant="secondary" onClick={() => setOutput('')}>
                  🗑️ 삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 사용량 */}
        <Card>
          <CardHeader>
            <CardTitle>이번 달 사용량</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>127</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>글쓰기</p>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>45</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>이미지</p>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>89</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>코드</p>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>234</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>번역</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--color-text-secondary)' }}>495 / 1,000 크레딧 사용</span>
                <span style={{ color: 'var(--color-accent)' }}>49.5%</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: 'var(--color-border)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: '49.5%', background: 'var(--color-accent)' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
