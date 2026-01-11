'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/onesaas-core/admin'

export default function AIGuide() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: '개요' },
    { id: 'kcode', label: 'K-Code CLI' },
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
            K-Code CLI로 저렴한 AI 모델을 활용하여 코딩하는 방법을 알아보세요
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

            <Section title="K-Code CLI 지원 프로바이더">
              <p className="mb-4">K-Code CLI에서 사용 가능한 초저렴 AI 프로바이더들입니다.</p>
              <div className="space-y-4">
                <ProviderCard
                  name="Qwen (알리바바)"
                  icon="🌏"
                  models={['Qwen Turbo ($0.03)', 'Qwen3 235B ($0.20)']}
                  description="💰 가장 저렴! 한국어 성능 우수"
                  color="#00a1ff"
                />
                <ProviderCard
                  name="DeepSeek"
                  icon="🔧"
                  models={['DeepSeek V3.2 ($0.27)', 'DeepSeek Reasoner ($0.55)']}
                  description="코딩 특화 모델, 추론 능력 뛰어남"
                  color="#00d084"
                />
                <ProviderCard
                  name="MiniMax"
                  icon="⚡"
                  models={['MiniMax M2.1 ($0.07)']}
                  description="빠른 응답, 코딩 특화"
                  color="#ff6b6b"
                />
                <ProviderCard
                  name="Groq"
                  icon="🚀"
                  models={['Qwen3 32B ($0.24)', 'Llama 3.3 70B ($0.59)']}
                  description="⚡ 초고속 추론, 무료 티어 제공"
                  color="#f97316"
                />
                <ProviderCard
                  name="Google"
                  icon="🌟"
                  models={['Gemini 3 Flash ($0.50)']}
                  description="비전(이미지) 지원, 1M 컨텍스트"
                  color="#4285f4"
                />
              </div>
            </Section>
          </div>
        )}

        {/* K-Code CLI */}
        {activeTab === 'kcode' && (
          <div className="space-y-6">
            <Section title="K-Code CLI 소개">
              <p className="mb-4">
                K-Code는 <strong>한국어에 최적화된 AI 코딩 에이전트</strong>입니다.
                다양한 저렴한 AI 모델을 지원하여 비용 효율적으로 코딩 작업을 수행합니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FeatureCard
                  icon="💰"
                  title="초저렴 비용"
                  description="Qwen Turbo 기준 입력 $0.03, 출력 $0.06/1M 토큰"
                />
                <FeatureCard
                  icon="🌏"
                  title="한국어 최적화"
                  description="한국어 프롬프트와 응답에 최적화된 모델 선택"
                />
                <FeatureCard
                  icon="🔧"
                  title="자동 코드 수정"
                  description="코드 분석, 수정, 생성을 자동으로 수행"
                />
                <FeatureCard
                  icon="🔄"
                  title="다중 모델 지원"
                  description="Qwen, DeepSeek, MiniMax, Google, Groq 지원"
                />
              </div>
            </Section>

            <Section title="빠른 시작">
              <div className="space-y-4">
                <Step number={1} title="API 키 설정">
                  <p className="mb-2">원하는 프로바이더의 API 키를 설정합니다.</p>
                  <CodeBlock language="bash" code={`# Qwen API 키 설정 (가장 저렴, 추천)
pnpm kcode --key qwen YOUR_QWEN_API_KEY

# DeepSeek API 키 설정
pnpm kcode --key deepseek YOUR_DEEPSEEK_API_KEY

# MiniMax API 키 설정
pnpm kcode --key minimax YOUR_MINIMAX_API_KEY

# Google API 키 설정
pnpm kcode --key google YOUR_GOOGLE_API_KEY

# Groq API 키 설정 (무료 티어 있음)
pnpm kcode --key groq YOUR_GROQ_API_KEY`} />
                </Step>

                <Step number={2} title="기본 사용">
                  <CodeBlock language="bash" code={`# 기본 실행 (표준 파이프라인)
pnpm kcode "로그인 폼에 유효성 검사 추가해줘"

# 대화형 모드 (터미널에서 직접 대화)
pnpm kcode -i

# 특정 모델로 실행
pnpm kcode -m deepseek "버그 수정해줘"

# 개발 모드 (더 꼼꼼한 분석)
pnpm kcode --dev "결제 시스템 리팩토링"

# 빠른 실행 (단일 호출)
pnpm kcode --single "간단한 함수 하나 만들어줘"`} />
                </Step>

                <Step number={3} title="모델 선택">
                  <p className="mb-2">작업에 맞는 모델을 선택합니다.</p>
                  <CodeBlock language="bash" code={`# 모델 목록 보기
pnpm kcode --list

# 기본 모델 변경
pnpm kcode --set-model deepseek

# 일회성 모델 지정
pnpm kcode -m gemini-3-flash "이미지 분석해줘"`} />
                </Step>
              </div>
            </Section>

            <Section title="지원 모델 및 가격">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th className="text-left p-3">모델</th>
                      <th className="text-left p-3">프로바이더</th>
                      <th className="text-left p-3">입력 가격</th>
                      <th className="text-left p-3">출력 가격</th>
                      <th className="text-left p-3">특징</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { model: '큐웬 터보', id: 'qwen-turbo', provider: 'Qwen', input: '$0.03', output: '$0.06', feature: '💰 가장 저렴!' },
                      { model: '미니맥스 M2.1', id: 'minimax-m21', provider: 'MiniMax', input: '$0.07', output: '$0.28', feature: '💰 코딩 특화' },
                      { model: '큐웬3 235B', id: 'qwen3-235b', provider: 'Qwen', input: '$0.20', output: '$0.60', feature: '💎 다국어 최강' },
                      { model: '큐웬3 32B', id: 'groq-qwen3', provider: 'Groq', input: '$0.24', output: '$0.24', feature: '⚡ 초고속' },
                      { model: '딥시크 V3.2', id: 'deepseek', provider: 'DeepSeek', input: '$0.27', output: '$1.10', feature: '🔧 코딩 구현' },
                      { model: '제미나이 3 플래시', id: 'gemini-3-flash', provider: 'Google', input: '$0.50', output: '$3.00', feature: '🌟 비전 지원' },
                      { model: '딥시크 추론', id: 'deepseek-reasoner', provider: 'DeepSeek', input: '$0.55', output: '$2.19', feature: '🧠 추론 전용' },
                      { model: '라마 3.3 70B', id: 'groq-llama-70b', provider: 'Groq', input: '$0.59', output: '$0.79', feature: '⚡ 초고속' },
                    ].map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td className="p-3">
                          <div className="font-medium">{item.model}</div>
                          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{item.id}</div>
                        </td>
                        <td className="p-3">{item.provider}</td>
                        <td className="p-3 text-green-500">{item.input}</td>
                        <td className="p-3 text-orange-500">{item.output}</td>
                        <td className="p-3">{item.feature}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <InfoBox type="info" className="mt-4">
                가격은 1M(백만) 토큰 기준입니다. Groq은 무료 티어가 있어 테스트에 추천합니다.
              </InfoBox>
            </Section>

            <Section title="파이프라인 모드">
              <div className="space-y-4">
                <GuideCard
                  title="단일 모드 (--single)"
                  recommended="간단한 작업, 빠른 응답"
                  reason="AI를 한 번만 호출하여 바로 코드 수정. 가장 빠르고 저렴합니다."
                />
                <GuideCard
                  title="표준 모드 (기본)"
                  recommended="일반적인 코딩 작업"
                  reason="3단계: 분석 → 계획 → 구현. 대부분의 작업에 적합합니다."
                />
                <GuideCard
                  title="개발 모드 (--dev)"
                  recommended="복잡한 리팩토링, 버그 수정"
                  reason="5단계: 분석 → 계획 → 구현 → 검증 → 최적화. 가장 꼼꼼합니다."
                />
                <GuideCard
                  title="멀티태스크 모드"
                  recommended="여러 작업 동시 처리"
                  reason="쉼표로 구분된 여러 작업을 순차적으로 처리합니다."
                />
              </div>
              <CodeBlock language="bash" code={`# 파이프라인 모드 예시
pnpm kcode --single "console.log 추가해줘"           # 단일 모드
pnpm kcode "API 엔드포인트 만들어줘"                  # 표준 모드 (기본)
pnpm kcode --dev "인증 시스템 전체 리팩토링"          # 개발 모드
pnpm kcode "버그 수정, 테스트 추가, 문서화"           # 멀티태스크`} />
            </Section>

            <Section title="대화형 모드">
              <p className="mb-4">터미널에서 직접 AI와 대화하며 코딩할 수 있습니다.</p>
              <CodeBlock language="bash" code={`# 대화형 모드 시작
pnpm kcode -i

# 사용 가능한 명령어:
# /model <id>  - 모델 변경 (예: /model deepseek)
# /list        - 모델 목록 보기
# /clear       - 대화 기록 초기화
# /mode <m>    - 모드 변경 (single/standard/dev)
# /help        - 도움말 보기
# /exit        - 종료`} />
              <InfoBox type="info" className="mt-4">
                대화형 모드에서는 이전 대화 맥락을 유지하며 연속적인 작업이 가능합니다.
              </InfoBox>
            </Section>

            <Section title="API 키 발급 방법">
              <div className="space-y-6">
                <div className="p-4 rounded-xl" style={{ background: 'var(--color-bg)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🔑</span>
                    <strong>Qwen (알리바바)</strong>
                    <span className="px-2 py-0.5 rounded text-xs bg-green-500 text-white">추천</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li><a href="https://dashscope.console.aliyun.com" target="_blank" className="text-blue-500 hover:underline">dashscope.console.aliyun.com</a> 접속</li>
                    <li>알리바바 클라우드 계정 생성/로그인</li>
                    <li>API Keys 메뉴에서 키 생성</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl" style={{ background: 'var(--color-bg)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🔑</span>
                    <strong>DeepSeek</strong>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li><a href="https://platform.deepseek.com" target="_blank" className="text-blue-500 hover:underline">platform.deepseek.com</a> 접속</li>
                    <li>계정 생성 후 API Keys 메뉴</li>
                    <li>Create API Key 클릭</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl" style={{ background: 'var(--color-bg)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🔑</span>
                    <strong>Groq</strong>
                    <span className="px-2 py-0.5 rounded text-xs bg-blue-500 text-white">무료 티어</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li><a href="https://console.groq.com" target="_blank" className="text-blue-500 hover:underline">console.groq.com</a> 접속</li>
                    <li>Google/GitHub로 로그인</li>
                    <li>API Keys 메뉴에서 키 생성</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl" style={{ background: 'var(--color-bg)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🔑</span>
                    <strong>Google (Gemini)</strong>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li><a href="https://aistudio.google.com" target="_blank" className="text-blue-500 hover:underline">aistudio.google.com</a> 접속</li>
                    <li>Google 계정으로 로그인</li>
                    <li>Get API Key 클릭</li>
                  </ol>
                </div>
              </div>
            </Section>

            <Section title="실전 예제">
              <CodeBlock language="bash" code={`# 버그 수정
pnpm kcode "로그인 시 비밀번호 검증이 안 되는 버그 수정해줘"

# 새 기능 추가
pnpm kcode "사용자 프로필에 아바타 업로드 기능 추가"

# 코드 리팩토링
pnpm kcode --dev "API 라우트들을 RESTful하게 리팩토링"

# 테스트 작성
pnpm kcode "결제 모듈에 대한 단위 테스트 작성"

# 성능 최적화
pnpm kcode "홈페이지 로딩 속도 최적화해줘"

# 다국어 지원
pnpm kcode "다국어 지원 i18n 구조 만들어줘"`} />
            </Section>
          </div>
        )}

        {/* API 키 설정 */}
        {activeTab === 'setup' && (
          <div className="space-y-6">
            <Section title="K-Code CLI API 키 설정">
              <p className="mb-4">K-Code CLI를 사용하려면 AI 프로바이더의 API 키가 필요합니다.</p>

              <div className="space-y-6">
                <Step number={1} title="원하는 프로바이더 선택">
                  <p className="mb-3">아래 프로바이더 중 하나를 선택합니다. Qwen이 가장 저렴합니다.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                      <div className="font-medium text-blue-500">Qwen (추천)</div>
                      <div className="text-xs">$0.03/1M 입력 • 가장 저렴</div>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                      <div className="font-medium text-green-500">DeepSeek</div>
                      <div className="text-xs">$0.27/1M 입력 • 코딩 특화</div>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                      <div className="font-medium text-orange-500">Groq</div>
                      <div className="text-xs">무료 티어 • 초고속</div>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                      <div className="font-medium text-purple-500">Google</div>
                      <div className="text-xs">$0.50/1M 입력 • 비전 지원</div>
                    </div>
                  </div>
                </Step>

                <Step number={2} title="API 키 발급">
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                      <div className="font-medium mb-2">Qwen (알리바바 클라우드)</div>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li><a href="https://dashscope.console.aliyun.com" target="_blank" className="text-blue-500 hover:underline">dashscope.console.aliyun.com</a> 접속</li>
                        <li>알리바바 클라우드 계정 생성/로그인</li>
                        <li>API Keys 메뉴에서 키 생성</li>
                      </ol>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                      <div className="font-medium mb-2">DeepSeek</div>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li><a href="https://platform.deepseek.com" target="_blank" className="text-blue-500 hover:underline">platform.deepseek.com</a> 접속</li>
                        <li>계정 생성 후 API Keys 메뉴</li>
                        <li>Create API Key 클릭</li>
                      </ol>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                      <div className="font-medium mb-2">Groq (무료 티어)</div>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li><a href="https://console.groq.com" target="_blank" className="text-blue-500 hover:underline">console.groq.com</a> 접속</li>
                        <li>Google/GitHub로 로그인</li>
                        <li>API Keys 메뉴에서 키 생성</li>
                      </ol>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                      <div className="font-medium mb-2">Google (Gemini)</div>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li><a href="https://aistudio.google.com" target="_blank" className="text-blue-500 hover:underline">aistudio.google.com</a> 접속</li>
                        <li>Google 계정으로 로그인</li>
                        <li>Get API Key 클릭</li>
                      </ol>
                    </div>
                  </div>
                </Step>

                <Step number={3} title="K-Code에 API 키 등록">
                  <p className="mb-2">터미널에서 다음 명령어로 API 키를 등록합니다.</p>
                  <CodeBlock language="bash" code={`# Qwen API 키 등록 (추천)
pnpm kcode --key qwen YOUR_QWEN_API_KEY

# DeepSeek API 키 등록
pnpm kcode --key deepseek YOUR_DEEPSEEK_API_KEY

# Groq API 키 등록 (무료 티어)
pnpm kcode --key groq YOUR_GROQ_API_KEY

# Google API 키 등록
pnpm kcode --key google YOUR_GOOGLE_API_KEY

# MiniMax API 키 등록
pnpm kcode --key minimax YOUR_MINIMAX_API_KEY`} />
                  <InfoBox type="info" className="mt-4">
                    API 키는 프로젝트 내 .onesaas/config.json에 암호화되어 저장됩니다.
                  </InfoBox>
                </Step>

                <Step number={4} title="환경변수로 설정 (선택사항)">
                  <p className="mb-2">.env 파일로도 API 키를 설정할 수 있습니다.</p>
                  <CodeBlock language="bash" code={`# .env.local 파일

# K-Code CLI용 API 키
QWEN_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
GOOGLE_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxx
MINIMAX_API_KEY=xxxxxxxxxxxxxxxxxxxxx`} />
                  <InfoBox type="warning" className="mt-4">
                    API 키는 절대 공개 저장소에 커밋하지 마세요! .env.local은 .gitignore에 포함되어 있습니다.
                  </InfoBox>
                </Step>
              </div>
            </Section>

            <Section title="키 테스트">
              <p className="mb-4">API 키가 정상적으로 설정되었는지 확인합니다.</p>
              <CodeBlock language="bash" code={`# 모델 목록 및 API 키 상태 확인
pnpm kcode --list

# 간단한 테스트 실행
pnpm kcode --single "안녕하세요"

# 대화형 모드로 테스트
pnpm kcode -i`} />
            </Section>
          </div>
        )}

        {/* 모델 선택 */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <Section title="K-Code 지원 모델 목록">
              <p className="mb-4">K-Code CLI에서 사용 가능한 모델들입니다. 가격순으로 정렬되어 있습니다.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th className="text-left p-3">모델</th>
                      <th className="text-left p-3">프로바이더</th>
                      <th className="text-left p-3">입력/출력 가격</th>
                      <th className="text-left p-3">특징</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { model: 'Qwen Turbo', id: 'qwen-turbo', provider: 'Qwen', price: '$0.03 / $0.06', feature: '💰 가장 저렴, 추천' },
                      { model: 'MiniMax M2.1', id: 'minimax-m21', provider: 'MiniMax', price: '$0.07 / $0.28', feature: '코딩 특화' },
                      { model: 'Qwen3 235B', id: 'qwen3-235b', provider: 'Qwen', price: '$0.20 / $0.60', feature: '💎 다국어, 추론' },
                      { model: 'Qwen3 32B', id: 'groq-qwen3', provider: 'Groq', price: '$0.24 / $0.24', feature: '⚡ 초고속' },
                      { model: 'DeepSeek V3.2', id: 'deepseek', provider: 'DeepSeek', price: '$0.27 / $1.10', feature: '🔧 코딩 구현' },
                      { model: 'Gemini 3 Flash', id: 'gemini-3-flash', provider: 'Google', price: '$0.50 / $3.00', feature: '🌟 비전 지원' },
                      { model: 'DeepSeek Reasoner', id: 'deepseek-reasoner', provider: 'DeepSeek', price: '$0.55 / $2.19', feature: '🧠 추론 전용' },
                      { model: 'Llama 3.3 70B', id: 'groq-llama-70b', provider: 'Groq', price: '$0.59 / $0.79', feature: '⚡ 초고속' },
                    ].map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td className="p-3">
                          <div className="font-medium">{item.model}</div>
                          <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--color-bg)' }}>{item.id}</code>
                        </td>
                        <td className="p-3">{item.provider}</td>
                        <td className="p-3 font-mono text-xs">{item.price}</td>
                        <td className="p-3">{item.feature}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <InfoBox type="info" className="mt-4">
                가격은 1M(백만) 토큰 기준입니다. 한국어는 영어보다 토큰 수가 더 많이 소비됩니다.
              </InfoBox>
            </Section>

            <Section title="모델 선택 가이드">
              <div className="space-y-4">
                <GuideCard
                  title="일반 코딩 작업"
                  recommended="Qwen Turbo (qwen-turbo)"
                  reason="가장 저렴하면서 일반적인 코딩 작업에 충분한 성능"
                />
                <GuideCard
                  title="복잡한 리팩토링"
                  recommended="DeepSeek V3.2 (deepseek)"
                  reason="코딩에 특화된 모델로 복잡한 구조 변경에 적합"
                />
                <GuideCard
                  title="빠른 응답이 필요할 때"
                  recommended="Groq Qwen3 또는 Llama 70B"
                  reason="Groq 인프라로 초고속 응답 제공"
                />
                <GuideCard
                  title="이미지 분석이 필요할 때"
                  recommended="Gemini 3 Flash (gemini-3-flash)"
                  reason="비전 기능 지원으로 UI 스크린샷 분석 가능"
                />
                <GuideCard
                  title="복잡한 추론이 필요할 때"
                  recommended="DeepSeek Reasoner 또는 Qwen3 235B"
                  reason="체계적인 사고 과정으로 복잡한 문제 해결"
                />
                <GuideCard
                  title="비용 절감이 최우선"
                  recommended="Qwen Turbo → MiniMax M2.1"
                  reason="가장 저렴한 모델들, 순서대로 시도"
                />
              </div>
            </Section>

            <Section title="K-Code에서 모델 변경">
              <p className="mb-4">K-Code CLI에서 모델을 변경하는 방법입니다.</p>
              <CodeBlock language="bash" code={`# 일회성 모델 지정 (-m 옵션)
pnpm kcode -m deepseek "버그 수정해줘"
pnpm kcode -m gemini-3-flash "이 UI 스크린샷 분석해줘"

# 기본 모델 영구 변경
pnpm kcode --set-model deepseek

# 현재 모델 목록 및 상태 확인
pnpm kcode --list

# 대화형 모드에서 모델 변경
# /model deepseek`} />
            </Section>

            <Section title="프로바이더별 특징">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl" style={{ background: 'var(--color-bg)' }}>
                  <p className="font-bold text-blue-500">Qwen (알리바바)</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• 가장 저렴한 가격</li>
                    <li>• 한국어 성능 우수</li>
                    <li>• 128K~1M 컨텍스트</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'var(--color-bg)' }}>
                  <p className="font-bold text-green-500">DeepSeek</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• 코딩에 특화</li>
                    <li>• 추론 모델 제공</li>
                    <li>• 128K 컨텍스트</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'var(--color-bg)' }}>
                  <p className="font-bold text-orange-500">Groq</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• 초고속 응답</li>
                    <li>• 무료 티어 제공</li>
                    <li>• 다양한 오픈소스 모델</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'var(--color-bg)' }}>
                  <p className="font-bold text-purple-500">Google</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• 비전(이미지) 지원</li>
                    <li>• 1M 토큰 컨텍스트</li>
                    <li>• 최신 Gemini 모델</li>
                  </ul>
                </div>
              </div>
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
              href="https://dashscope.console.aliyun.com"
              target="_blank"
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            >
              Qwen (알리바바) →
            </Link>
            <Link
              href="https://platform.deepseek.com"
              target="_blank"
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            >
              DeepSeek →
            </Link>
            <Link
              href="https://console.groq.com"
              target="_blank"
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            >
              Groq →
            </Link>
            <Link
              href="https://aistudio.google.com"
              target="_blank"
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            >
              Google AI Studio →
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
