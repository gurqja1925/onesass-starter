'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'
import { Button } from '@/onesaas-core/ui/Button'

interface SetupStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'complete' | 'current'
  instruction: string[]
  envVars?: { key: string; example: string; description: string }[]
}

export default function SetupPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps: SetupStep[] = [
    {
      id: 'intro',
      title: '1. 시작하기',
      description: '이미 다 설정되어 있어요! 확인만 하면 됩니다',
      status: currentStep > 0 ? 'complete' : currentStep === 0 ? 'current' : 'pending',
      instruction: [
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '🎉 축하합니다!',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        'OneSaaS 스타터는 이미 모든 설정이 완료되어 있어요!',
        '',
        '✅ Vercel 배포 - 완료됨',
        '✅ 데이터베이스 (Supabase) - 연결됨',
        '✅ 인증 시스템 - 작동 중',
        '✅ 관리자 페이지 - 활성화됨',
        '✅ 결제 시스템 - 데모 모드',
        '',
        '🌐 배포 주소: https://onesass-starter.vercel.app',
        '',
        '이 가이드는 "뭐가 어디 있는지" 알려주는 안내서예요.',
        '설치할 건 없어요! 😊',
        '',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '📁 프로젝트 구조',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '/src',
        '  /app          → 페이지들 (홈, 관리자 등)',
        '  /onesaas-core → 핵심 기능 (인증, 결제, UI)',
        '  /components   → 재사용 컴포넌트',
        '',
        '/.env           → 환경 설정 파일 (이미 설정됨!)',
      ],
    },
    {
      id: 'features',
      title: '2. 포함된 기능',
      description: '이미 만들어진 기능들을 확인하세요',
      status: currentStep > 1 ? 'complete' : currentStep === 1 ? 'current' : 'pending',
      instruction: [
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '🔐 인증 시스템',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '이미 만들어진 것:',
        '  ✓ 회원가입 페이지 (/signup)',
        '  ✓ 로그인 페이지 (/login)',
        '  ✓ 비밀번호 찾기',
        '  ✓ 소셜 로그인 (Google, Kakao, GitHub)',
        '',
        '어디서 수정하나요?',
        '  → /src/onesaas-core/auth/',
        '',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '💳 결제 시스템',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '이미 만들어진 것:',
        '  ✓ 결제 페이지',
        '  ✓ 구독 플랜 (Free, Pro, Enterprise)',
        '  ✓ 결제 확인 API',
        '',
        '현재 상태: 데모 모드 (가짜 결제)',
        '실제 결제를 받으려면 Toss Payments 가입 필요',
        '',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '👨‍💼 관리자 페이지',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '이미 만들어진 것:',
        '  ✓ 대시보드 (/admin)',
        '  ✓ 사용자 관리',
        '  ✓ 결제/구독 관리',
        '  ✓ 통계 및 분석',
        '',
        '현재 상태: 데모 모드 (누구나 접근 가능)',
      ],
    },
    {
      id: 'env',
      title: '3. 환경 설정',
      description: '.env 파일에 뭐가 있는지 확인',
      status: currentStep > 2 ? 'complete' : currentStep === 2 ? 'current' : 'pending',
      instruction: [
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '📄 .env 파일이란?',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '비밀번호나 API 키 같은 중요한 정보를 저장하는 파일이에요.',
        '프로젝트 루트에 .env 파일이 이미 있어요!',
        '',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '🔑 이미 설정된 값들',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '• DATABASE_URL - 데이터베이스 주소',
        '• NEXT_PUBLIC_SUPABASE_URL - Supabase 주소',
        '• NEXT_PUBLIC_SUPABASE_ANON_KEY - Supabase 키',
        '• NEXT_PUBLIC_ADMIN_ENABLED - 관리자 기능 켜짐',
        '',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '⚠️ 나중에 바꿔야 할 것들',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '실제 서비스를 운영할 때 바꿔야 해요:',
        '',
        '1. NEXT_PUBLIC_ADMIN_EMAILS',
        '   → 본인 이메일로 변경',
        '',
        '2. NEXT_PUBLIC_SITE_URL',
        '   → 실제 도메인으로 변경',
        '',
        '3. 결제 관련 키 (Toss Payments 가입 후)',
        '',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '🌐 도메인 설정이 필요한 서비스',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '아래 서비스들은 실제 도메인을 등록한 후에 설정하세요:',
        '',
        '1. Google Analytics',
        '   - 도메인: analytics.google.com',
        '   - 도메인 등록 후 추적 ID 발급',
        '   - NEXT_PUBLIC_GA_ID 환경변수에 추가',
        '',
        '2. Google Search Console',
        '   - 도메인: search.google.com/search-console',
        '   - 도메인 소유권 확인 후 등록',
        '   - 검색 노출 및 SEO 분석',
        '',
        '3. Toss Payments',
        '   - 도메인: toss.im/business',
        '   - 도메인 등록 후 클라이언트 키 발급',
        '   - TOSS_CLIENT_KEY, TOSS_SECRET_KEY 환경변수에 추가',
        '',
        '⚠️ 주의: localhost에서는 이 서비스들이 제대로 작동하지 않습니다!',
        '실제 도메인(예: yourdomain.com)을 등록한 후 설정하세요.',
      ],
      envVars: [
        { key: 'NEXT_PUBLIC_ADMIN_EMAILS', example: 'your-email@example.com', description: '관리자 이메일 (본인 이메일로 변경)' },
        { key: 'NEXT_PUBLIC_SITE_URL', example: 'https://your-domain.com', description: '실제 서비스 도메인' },
      ],
    },
    {
      id: 'demo',
      title: '4. 데모 모드',
      description: '지금은 데모 모드! 실제 운영 전 테스트용',
      status: currentStep > 3 ? 'complete' : currentStep === 3 ? 'current' : 'pending',
      instruction: [
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '🎮 데모 모드란?',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '지금 프로젝트는 "데모 모드"로 실행 중이에요.',
        '',
        '데모 모드에서는:',
        '  ✓ 로그인 없이 관리자 페이지 접근 가능',
        '  ✓ 가짜 결제로 테스트 가능',
        '  ✓ 샘플 데이터가 보임',
        '',
        '실제 서비스를 시작할 때 운영 모드로 바꾸면 돼요!',
        '',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '🚀 운영 모드로 바꾸려면?',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '나중에 실제 서비스를 시작할 때:',
        '',
        '1. .env 파일에서 설정 변경',
        '2. 실제 결제 연동 (Toss Payments 가입)',
        '3. 도메인 연결',
        '4. Vercel에 배포',
        '',
        '지금은 걱정하지 마세요!',
        '일단 기능을 먼저 익히고, 나중에 바꾸면 돼요.',
      ],
    },
    {
      id: 'mcp',
      title: '5. MCP 서버 (선택)',
      description: 'Claude Code 사용자만! AI 기능 확장 도구',
      status: currentStep > 4 ? 'complete' : currentStep === 4 ? 'current' : 'pending',
      instruction: [
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '🤔 MCP가 뭔가요?',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        'MCP는 Claude에게 "특별한 능력"을 주는 도구예요!',
        '',
        '예를 들면:',
        '  🌐 인터넷에서 최신 정보 찾기',
        '  🗄️ 데이터베이스 관리하기',
        '  🖥️ 브라우저 자동으로 조작하기',
        '  📦 GitHub에서 코드 관리하기',
        '',
        '마치 게임에서 아이템을 장착하면 캐릭터가',
        '더 강해지는 것처럼요!',
        '',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '📥 설치 방법 (터미널에서 한 줄씩 복사해서 붙여넣기)',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '1️⃣ Context7 설치 (가장 중요! 최신 문서를 알려줘요)',
        '',
        'claude mcp add context7 --transport http https://mcp.context7.com/mcp',
        '',
        '',
        '2️⃣ GitHub 설치 (코드 저장소 관리)',
        '',
        'claude mcp add github --transport http https://api.githubcopilot.com/mcp/',
        '',
        '',
        '3️⃣ Playwright 설치 (브라우저 자동화)',
        '',
        'claude mcp add playwright -- npx @playwright/mcp@latest',
        '',
        '',
        '4️⃣ Supabase 설치 (데이터베이스)',
        '',
        'claude mcp add supabase -- npx -y @supabase/mcp-server',
        '',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '✅ 설치 확인하기',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        'claude mcp list',
        '',
        '이 명령어를 입력하면 설치된 MCP 목록이 나와요!',
      ],
    },
    {
      id: 'agent',
      title: '6. AI 에이전트 (선택)',
      description: '개발자용! 여러 AI 비서를 동시에 사용하기',
      status: currentStep > 5 ? 'complete' : currentStep === 5 ? 'current' : 'pending',
      instruction: [
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '🤔 AI 에이전트가 뭔가요?',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '에이전트는 "전문가 비서"라고 생각하면 돼요!',
        '',
        '예를 들어:',
        '  👨‍💻 코드 검토 전문가 - 코드가 잘 짜여졌는지 확인',
        '  🔧 버그 수리 전문가 - 오류를 찾아서 고쳐줌',
        '  🧪 테스트 전문가 - 프로그램이 잘 작동하는지 확인',
        '  📝 문서 작성 전문가 - 설명서를 만들어줌',
        '',
        '한 명에게 모든 걸 시키는 것보다,',
        '여러 전문가에게 맡기면 더 빠르고 정확해요!',
        '',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '📥 설치 방법',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '터미널에서 아래 명령어를 입력하세요:',
        '',
        'npm install @anthropic-ai/claude-agent-sdk',
        '',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '🤖 OneSaaS에 들어있는 에이전트 10명',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '1. 코드 리뷰어 - 코드 품질 검사',
        '2. 버그 수리공 - 오류 자동 수정',
        '3. 테스트 담당 - 테스트 실행',
        '4. 문서 작성자 - 설명서 자동 생성',
        '5. 성능 전문가 - 속도 개선',
        '6. 보안 전문가 - 해킹 위험 검사',
        '7. 리팩토러 - 코드 정리정돈',
        '8. API 설계자 - 인터페이스 설계',
        '9. DB 설계자 - 데이터베이스 구조 설계',
        '10. 배포 전문가 - 서버에 올리는 작업',
        '',
        '',
        '📌 자세한 내용은 왼쪽 메뉴의 "AI 에이전트"를 클릭하세요!',
      ],
    },
    {
      id: 'skills',
      title: '7. 스킬 가이드',
      description: '이미 있어요! 왼쪽 메뉴에서 확인하세요',
      status: currentStep > 6 ? 'complete' : currentStep === 6 ? 'current' : 'pending',
      instruction: [
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '🤔 스킬이 뭔가요?',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '스킬은 "요리 레시피" 같은 거예요!',
        '',
        '요리사도 레시피가 있으면 더 맛있는 요리를 만들죠?',
        'Claude도 스킬(레시피)이 있으면 더 좋은 결과를 만들어요!',
        '',
        '✨ 좋은 소식: 설치할 필요 없어요!',
        '   OneSaaS에 이미 다 들어있어요!',
        '',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '📚 들어있는 스킬 6가지',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '1️⃣ 프론트엔드 디자인',
        '   → 예쁘고 독특한 화면 만드는 방법',
        '   → 다른 사이트랑 똑같이 생긴 거 피하기',
        '',
        '2️⃣ 테마 팩토리',
        '   → 색깔과 폰트를 한번에 바꾸기',
        '   → 10가지 테마 중에서 고르기',
        '',
        '3️⃣ 웹앱 테스팅',
        '   → 프로그램이 잘 작동하는지 자동으로 확인',
        '   → 버튼 클릭, 글자 입력 등 테스트',
        '',
        '4️⃣ SaaS 빌더',
        '   → 회원가입, 로그인 만들기',
        '   → 결제 기능 추가하기',
        '   → 관리자 페이지 만들기',
        '',
        '5️⃣ 한국어 현지화',
        '   → 카카오페이, 네이버페이 연결',
        '   → 한국 법에 맞는 약관 만들기',
        '',
        '6️⃣ Claude Agent SDK',
        '   → 여러 AI를 동시에 일 시키기',
        '   → 복잡한 작업 자동화하기',
        '',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '💡 사용 방법',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        '1. 왼쪽 메뉴에서 "스킬 가이드" 클릭',
        '2. 원하는 스킬 선택',
        '3. 설명을 읽고 따라하기!',
        '',
        '📌 자세한 내용은 왼쪽 메뉴의 "스킬 가이드"를 클릭하세요!',
      ],
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            초기 설정 가이드
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            서비스 운영에 필요한 설정을 단계별로 안내합니다
          </p>
        </div>

        {/* 진행 상태 */}
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all`}
                style={{
                  background: step.status === 'complete' ? '#10b981' : step.status === 'current' ? 'var(--color-accent)' : 'var(--color-border)',
                  color: step.status === 'pending' ? 'var(--color-text-secondary)' : 'white',
                  outline: currentStep === index ? '4px solid var(--color-accent)' : 'none',
                  outlineOffset: '2px',
                }}
              >
                {step.status === 'complete' ? '✓' : index + 1}
              </button>
              {index < steps.length - 1 && (
                <div
                  className="w-12 h-1 mx-2"
                  style={{ background: step.status === 'complete' ? '#10b981' : 'var(--color-border)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* 현재 단계 상세 */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {steps[currentStep].description}
            </p>

            {/* 설정 방법 */}
            <div
              className="p-4 rounded-lg"
              style={{ background: 'var(--color-bg)', fontFamily: 'monospace' }}
            >
              <h4 className="font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                설정 방법
              </h4>
              <div className="space-y-1 text-sm whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>
                {steps[currentStep].instruction.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            {/* 환경 변수 */}
            {steps[currentStep].envVars && (
              <div>
                <h4 className="font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                  필요한 환경변수 (.env)
                </h4>
                <div className="space-y-3">
                  {steps[currentStep].envVars.map((env) => (
                    <div
                      key={env.key}
                      className="p-4 rounded-lg"
                      style={{ background: 'var(--color-bg)' }}
                    >
                      <code
                        className="text-sm font-bold"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        {env.key}
                      </code>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                        {env.description}
                      </p>
                      <p className="text-xs mt-1 font-mono opacity-60" style={{ color: 'var(--color-text-secondary)' }}>
                        예: {env.example}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 네비게이션 */}
            <div className="flex justify-between pt-4">
              <Button
                variant="secondary"
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
              >
                ← 이전 단계
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                  다음 단계 →
                </Button>
              ) : (
                <Link href="/admin/settings">
                  <Button>설정 페이지로 이동</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 빠른 링크 */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          <a
            href="https://supabase.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-lg transition-all hover:scale-105"
            style={{ background: 'var(--color-bg-secondary)' }}
          >
            <span className="text-2xl">📚</span>
            <p className="font-medium mt-2" style={{ color: 'var(--color-text)' }}>Supabase</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>DB/인증</p>
          </a>
          <a
            href="https://toss.io/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-lg transition-all hover:scale-105"
            style={{ background: 'var(--color-bg-secondary)' }}
          >
            <span className="text-2xl">💳</span>
            <p className="font-medium mt-2" style={{ color: 'var(--color-text)' }}>Toss Payments</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>결제 연동</p>
          </a>
          <a
            href="https://vercel.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-lg transition-all hover:scale-105"
            style={{ background: 'var(--color-bg-secondary)' }}
          >
            <span className="text-2xl">🚀</span>
            <p className="font-medium mt-2" style={{ color: 'var(--color-text)' }}>Vercel</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>배포</p>
          </a>
          <a
            href="https://context7.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-lg transition-all hover:scale-105"
            style={{ background: 'var(--color-bg-secondary)' }}
          >
            <span className="text-2xl">🔌</span>
            <p className="font-medium mt-2" style={{ color: 'var(--color-text)' }}>Context7</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>MCP 문서</p>
          </a>
          <Link
            href="/admin/agents"
            className="p-4 rounded-lg transition-all hover:scale-105"
            style={{ background: 'var(--color-bg-secondary)' }}
          >
            <span className="text-2xl">🤖</span>
            <p className="font-medium mt-2" style={{ color: 'var(--color-text)' }}>AI 에이전트</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>10개 내장</p>
          </Link>
          <Link
            href="/admin/skills"
            className="p-4 rounded-lg transition-all hover:scale-105"
            style={{ background: 'var(--color-bg-secondary)' }}
          >
            <span className="text-2xl">📖</span>
            <p className="font-medium mt-2" style={{ color: 'var(--color-text)' }}>스킬 가이드</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>6개 내장</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
