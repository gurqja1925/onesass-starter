'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/onesaas-core/admin/AdminLayout'

export default function AIGuide() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: '개요' },
    { id: 'setup', label: 'API 키 설정' },
    { id: 'models', label: '모델 선택' },
    { id: 'usage', label: '사용 방법' },
    { id: 'advanced', label: '고급 설정' },
  ]

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            <Link href="/admin/guides" className="hover:underline">가이드</Link>
            <span>/</span>
            <span>AI 설정</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">AI 설정 가이드</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            AI 기능을 설정하고 사용하는 방법을 알아보세요
          </p>
        </div>

        {/* 탭 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                color: activeTab === tab.id ? 'var(--color-bg)' : 'var(--color-text)',
                border: '1px solid var(--color-border)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 개요 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Section title="AI 기능 소개">
              <p>이 SaaS는 다양한 AI 모델을 통합하여 사용자에게 강력한 AI 기능을 제공합니다.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FeatureCard
                  icon="💬"
                  title="AI 채팅"
                  description="GPT, Claude 등 다양한 모델로 대화형 AI를 제공합니다"
                />
                <FeatureCard
                  icon="🎨"
                  title="이미지 생성"
                  description="DALL-E, Stable Diffusion으로 이미지를 생성합니다"
                />
                <FeatureCard
                  icon="🎬"
                  title="영상 생성"
                  description="텍스트를 영상으로 변환합니다"
                />
                <FeatureCard
                  icon="📝"
                  title="텍스트 처리"
                  description="요약, 번역, 작문 등 텍스트 작업을 수행합니다"
                />
              </div>
            </Section>

            <Section title="지원 프로바이더">
              <div className="space-y-4">
                <ProviderCard
                  name="OpenAI"
                  icon="🤖"
                  models={['GPT-4o', 'GPT-4o Mini', 'GPT-3.5 Turbo', 'DALL-E 3']}
                  description="가장 널리 사용되는 AI 프로바이더"
                  color="#10a37f"
                />
                <ProviderCard
                  name="Anthropic"
                  icon="🧠"
                  models={['Claude 3.5 Sonnet', 'Claude 3 Opus', 'Claude 3 Haiku']}
                  description="안전하고 유용한 AI를 추구하는 프로바이더"
                  color="#8b5cf6"
                />
                <ProviderCard
                  name="Vercel AI Gateway"
                  icon="▲"
                  models={['100+ 모델 지원']}
                  description="단일 API로 모든 프로바이더 접근 (선택사항)"
                  color="#000000"
                />
              </div>
            </Section>
          </div>
        )}

        {/* API 키 설정 */}
        {activeTab === 'setup' && (
          <div className="space-y-6">
            <Section title="환경변수 설정">
              <p className="mb-4">AI 기능을 사용하려면 API 키를 환경변수로 설정해야 합니다.</p>

              <div className="space-y-6">
                <Step number={1} title="OpenAI API 키 발급">
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li><a href="https://platform.openai.com" target="_blank" className="text-blue-500 hover:underline">platform.openai.com</a> 접속</li>
                    <li>로그인 후 우측 상단 프로필 → "View API Keys" 클릭</li>
                    <li>"Create new secret key" 버튼 클릭</li>
                    <li>생성된 키를 안전한 곳에 복사 (다시 볼 수 없음)</li>
                  </ol>
                </Step>

                <Step number={2} title="Anthropic API 키 발급">
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li><a href="https://console.anthropic.com" target="_blank" className="text-blue-500 hover:underline">console.anthropic.com</a> 접속</li>
                    <li>로그인 후 "API Keys" 메뉴 클릭</li>
                    <li>"Create Key" 버튼 클릭</li>
                    <li>생성된 키를 안전한 곳에 복사</li>
                  </ol>
                </Step>

                <Step number={3} title=".env 파일에 키 추가">
                  <CodeBlock language="bash" code={`# .env.local 파일

# OpenAI API 키
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx

# Anthropic API 키
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx

# Vercel AI Gateway (선택사항)
AI_GATEWAY_API_KEY=your-ai-gateway-key`} />
                </Step>

                <Step number={4} title="Vercel에 환경변수 추가">
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Vercel 대시보드에서 프로젝트 선택</li>
                    <li>Settings → Environment Variables 이동</li>
                    <li>각 키를 추가 (Name: OPENAI_API_KEY, Value: sk-xxx...)</li>
                    <li>환경(Production, Preview, Development) 선택</li>
                    <li>Save 후 Redeploy</li>
                  </ol>
                  <InfoBox type="warning" className="mt-4">
                    API 키는 절대 공개 저장소에 커밋하지 마세요!
                  </InfoBox>
                </Step>
              </div>
            </Section>

            <Section title="키 테스트">
              <p className="mb-4">API 키가 정상적으로 설정되었는지 확인합니다.</p>
              <CodeBlock language="bash" code={`# 로컬에서 테스트
pnpm dev

# /dashboard/ai-chat 페이지에서 테스트
# 또는 API 직접 호출:
curl -X POST http://localhost:3000/api/ai/chat \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"Hello"}]}'`} />
            </Section>
          </div>
        )}

        {/* 모델 선택 */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <Section title="지원 모델 목록">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th className="text-left p-3">모델</th>
                      <th className="text-left p-3">프로바이더</th>
                      <th className="text-left p-3">특징</th>
                      <th className="text-left p-3">가격대</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { model: 'GPT-4o', provider: 'OpenAI', feature: '가장 뛰어난 성능', price: '$$$$' },
                      { model: 'GPT-4o Mini', provider: 'OpenAI', feature: '빠르고 저렴', price: '$' },
                      { model: 'GPT-3.5 Turbo', provider: 'OpenAI', feature: '기본 성능', price: '$' },
                      { model: 'Claude 3.5 Sonnet', provider: 'Anthropic', feature: '최신, 균형잡힌 성능', price: '$$' },
                      { model: 'Claude 3 Opus', provider: 'Anthropic', feature: '가장 강력', price: '$$$$' },
                      { model: 'Claude 3 Haiku', provider: 'Anthropic', feature: '가장 빠름', price: '$' },
                    ].map((item) => (
                      <tr key={item.model} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td className="p-3 font-medium">{item.model}</td>
                        <td className="p-3">{item.provider}</td>
                        <td className="p-3">{item.feature}</td>
                        <td className="p-3">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="모델 선택 가이드">
              <div className="space-y-4">
                <GuideCard
                  title="일반 대화 / 질문 답변"
                  recommended="GPT-4o Mini 또는 Claude 3 Haiku"
                  reason="빠른 응답 속도와 낮은 비용으로 일상적인 대화에 적합"
                />
                <GuideCard
                  title="복잡한 분석 / 코드 작성"
                  recommended="GPT-4o 또는 Claude 3.5 Sonnet"
                  reason="높은 정확도와 복잡한 추론 능력 필요"
                />
                <GuideCard
                  title="긴 문서 처리"
                  recommended="Claude 3 (모든 버전)"
                  reason="200K 토큰의 긴 컨텍스트 지원"
                />
                <GuideCard
                  title="비용 절감이 중요"
                  recommended="GPT-4o Mini 또는 Claude 3 Haiku"
                  reason="토큰당 가격이 가장 저렴"
                />
              </div>
            </Section>

            <Section title="기본 모델 변경">
              <p className="mb-4">코드에서 기본 모델을 변경할 수 있습니다.</p>
              <CodeBlock language="typescript" code={`// src/app/api/ai/chat/route.ts

// 기본 모델 설정
const DEFAULT_MODEL = 'gpt-4o-mini'  // 원하는 모델로 변경

// 또는 환경변수로 설정
const DEFAULT_MODEL = process.env.DEFAULT_AI_MODEL || 'gpt-4o-mini'`} />
            </Section>
          </div>
        )}

        {/* 사용 방법 */}
        {activeTab === 'usage' && (
          <div className="space-y-6">
            <Section title="사용자 대시보드에서 사용">
              <p className="mb-4">사용자는 대시보드에서 AI 기능을 바로 사용할 수 있습니다.</p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">1</span>
                  <div>
                    <p className="font-medium">AI 채팅 페이지 접속</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      /dashboard/ai-chat 페이지에서 AI와 대화
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">2</span>
                  <div>
                    <p className="font-medium">모델 선택</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      드롭다운에서 원하는 AI 모델 선택
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">3</span>
                  <div>
                    <p className="font-medium">메시지 전송</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      질문을 입력하고 전송 버튼 클릭
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="API 직접 호출">
              <p className="mb-4">개발자는 API를 직접 호출하여 AI 기능을 사용할 수 있습니다.</p>

              <CodeBlock language="typescript" code={`// 기본 API 호출
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: '안녕하세요!' }
    ],
    model: 'gpt-4o-mini',  // 선택사항
    stream: true,          // 스트리밍 응답
  }),
})

// 스트리밍 응답 처리
const reader = response.body.getReader()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  console.log(new TextDecoder().decode(value))
}`} />

              <p className="mt-6 mb-4">Vercel AI SDK의 useChat 훅을 사용하면 더 쉽습니다:</p>
              <CodeBlock language="typescript" code={`import { useChat } from 'ai/react'

function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
    body: { model: 'gpt-4o-mini' },
  })

  return (
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={handleInputChange} />
      <button type="submit" disabled={isLoading}>전송</button>
    </form>
  )
}`} />
            </Section>
          </div>
        )}

        {/* 고급 설정 */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <Section title="시스템 프롬프트 커스터마이징">
              <p className="mb-4">AI의 기본 동작을 정의하는 시스템 프롬프트를 변경할 수 있습니다.</p>
              <CodeBlock language="typescript" code={`// src/app/api/ai/chat/route.ts

const result = streamText({
  model,
  messages,
  system: \`당신은 친절하고 도움이 되는 AI 어시스턴트입니다.
다음 규칙을 따라주세요:
- 한국어로 응답해주세요
- 간결하고 명확하게 답변해주세요
- 불확실한 정보는 솔직하게 모른다고 해주세요
- 코드 예시는 주석을 포함해주세요\`,
})`} />
            </Section>

            <Section title="사용량 제한 설정">
              <p className="mb-4">플랜별로 API 사용량을 제한할 수 있습니다.</p>
              <CodeBlock language="typescript" code={`// src/app/api/ai/chat/route.ts

// 플랜별 제한
const PLAN_LIMITS = {
  free: { messagesPerMonth: 50, tokensPerMessage: 1000 },
  pro: { messagesPerMonth: 500, tokensPerMessage: 4000 },
  team: { messagesPerMonth: 2000, tokensPerMessage: 8000 },
}

// 사용량 체크 미들웨어
async function checkUsageLimit(userId: string, plan: string) {
  const usage = await getUserUsage(userId)
  const limit = PLAN_LIMITS[plan]

  if (usage.messagesThisMonth >= limit.messagesPerMonth) {
    throw new Error('이번 달 사용량을 초과했습니다')
  }
}`} />
            </Section>

            <Section title="Vercel AI Gateway 사용">
              <p className="mb-4">Vercel AI Gateway를 사용하면 단일 API로 여러 프로바이더에 접근할 수 있습니다.</p>
              <CodeBlock language="bash" code={`# 패키지 업그레이드 (AI SDK 5.x 필요)
pnpm add ai@beta

# 환경변수 설정
AI_GATEWAY_API_KEY=your-gateway-key`} />
              <CodeBlock language="typescript" code={`// AI Gateway 사용 예시
import { streamText } from 'ai'

const result = streamText({
  model: 'openai/gpt-4o',  // provider/model 형식
  prompt: '안녕하세요!',
})

// 모델을 쉽게 변경 가능
// 'anthropic/claude-3.5-sonnet'
// 'google/gemini-pro'
// 'meta/llama-3.1-70b'`} />
              <InfoBox type="info" className="mt-4">
                AI Gateway는 현재 알파 버전입니다. 프로덕션 사용 전에 안정성을 확인하세요.
              </InfoBox>
            </Section>

            <Section title="에러 처리">
              <CodeBlock language="typescript" code={`// 견고한 에러 처리
try {
  const result = await generateText({ model, messages })
  return Response.json({ text: result.text })
} catch (error) {
  if (error.message.includes('rate limit')) {
    return Response.json(
      { error: 'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 429 }
    )
  }
  if (error.message.includes('invalid_api_key')) {
    return Response.json(
      { error: 'API 키가 유효하지 않습니다. 설정을 확인해주세요.' },
      { status: 401 }
    )
  }
  return Response.json(
    { error: '알 수 없는 오류가 발생했습니다.' },
    { status: 500 }
  )
}`} />
            </Section>
          </div>
        )}

        {/* 관련 문서 */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--color-border)' }}>
          <h3 className="font-bold mb-4">관련 문서</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="https://ai-sdk.dev/docs/introduction"
              target="_blank"
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            >
              Vercel AI SDK 문서 →
            </Link>
            <Link
              href="https://platform.openai.com/docs"
              target="_blank"
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            >
              OpenAI API 문서 →
            </Link>
            <Link
              href="https://docs.anthropic.com"
              target="_blank"
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            >
              Anthropic API 문서 →
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

// 컴포넌트들
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div style={{ color: 'var(--color-text-secondary)' }}>{children}</div>
    </div>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold"
        style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
      >
        {number}
      </div>
      <div className="flex-1">
        <h3 className="font-bold mb-2">{title}</h3>
        {children}
      </div>
    </div>
  )
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <pre
      className="p-4 rounded-xl overflow-x-auto text-sm"
      style={{ background: '#1e1e1e', color: '#d4d4d4' }}
    >
      <code>{code}</code>
    </pre>
  )
}

function InfoBox({ type, children, className = '' }: { type: 'info' | 'warning'; children: React.ReactNode; className?: string }) {
  const styles = {
    info: { bg: '#dbeafe', border: '#93c5fd', color: '#1e40af' },
    warning: { bg: '#fef3c7', border: '#fcd34d', color: '#92400e' },
  }
  const s = styles[type]
  return (
    <div
      className={`p-4 rounded-xl text-sm ${className}`}
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
    >
      {type === 'warning' && '⚠️ '}{children}
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-4 rounded-xl" style={{ background: 'var(--color-bg)' }}>
      <span className="text-2xl">{icon}</span>
      <p className="font-bold mt-2">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  )
}

function ProviderCard({ name, icon, models, description, color }: { name: string; icon: string; models: string[]; description: string; color: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'var(--color-bg)' }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${color}20` }}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-bold">{name}</p>
        <p className="text-sm">{description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {models.map((m) => (
            <span key={m} className="px-2 py-1 rounded text-xs" style={{ background: 'var(--color-bg-secondary)' }}>
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function GuideCard({ title, recommended, reason }: { title: string; recommended: string; reason: string }) {
  return (
    <div className="p-4 rounded-xl" style={{ background: 'var(--color-bg)' }}>
      <p className="font-bold">{title}</p>
      <p className="text-sm mt-1">
        <span style={{ color: 'var(--color-accent)' }}>추천:</span> {recommended}
      </p>
      <p className="text-xs mt-1">{reason}</p>
    </div>
  )
}
