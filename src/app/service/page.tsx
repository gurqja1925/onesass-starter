'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

export default function ServicePage() {
  const [copied, setCopied] = useState(false)

  const examplePrompt = `안녕하세요! 이 프로젝트에 새로운 기능을 추가하고 싶습니다.

먼저, 서비스 홈페이지(/service/page.tsx)의 현재 샘플 내용은 모두 지워주세요.

그리고 기존 디자인 시스템과 아키텍처는 그대로 유지하면서,
src/onesaas-custom/ 폴더에 다음과 같은 기능을 만들어주세요:

[여기에 원하는 기능을 자세히 적어주세요. 예시:]

1. 할일 관리(Todo) 기능
   - 할일 추가/삭제/완료 처리
   - 카테고리별 분류 (업무/개인/쇼핑 등)
   - 마감일 설정 및 알림
   - 완료율 통계 차트

2. 노트 기능
   - 마크다운 에디터
   - 폴더/태그로 정리
   - 검색 기능
   - 이미지 첨부

3. 캘린더 기능
   - 월간/주간 뷰
   - 이벤트 추가/수정/삭제
   - 구글 캘린더 연동
   - 반복 이벤트 설정

데이터베이스 스키마를 함께 설계해주시고,
기존 테마(var(--color-accent) 등)를 활용하여
통일감 있는 UI로 만들어주세요.

API 라우트와 클라이언트 컴포넌트를 적절히 분리하고,
에러 처리와 로딩 상태를 잘 구현해주세요.`

  const handleCopy = () => {
    navigator.clipboard.writeText(examplePrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DashboardLayout title="서비스">
      <div className="max-w-4xl mx-auto">
        {/* 메인 메시지 */}
        <div
          className="p-12 rounded-2xl text-center mb-8"
          style={{ background: 'var(--color-bg-secondary)', border: '2px solid var(--color-border)' }}
        >
          <span className="text-7xl block mb-6">😅</span>
          <h1 className="text-4xl font-bold mb-4">당황하셨나요?</h1>
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            아무것도 없어요?
          </h2>

          <div className="mb-8">
            <p className="text-2xl font-bold mb-4" style={{ color: 'var(--color-accent)' }}>
              걱정마세요! 👍
            </p>
            <p className="text-xl mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              이것은 <strong className="text-white">샘플 페이지</strong>입니다
            </p>
          </div>

          <div
            className="p-6 rounded-xl mb-6"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-accent)' }}
          >
            <p className="text-lg leading-relaxed">
              여기서부터는 여러분이 <strong style={{ color: 'var(--color-accent)' }}>AI 코딩</strong>으로<br />
              원하는 서비스를 만들면 됩니다! 🚀
            </p>
          </div>
        </div>

        {/* Claude Code 사용법 */}
        <div
          className="p-8 rounded-2xl mb-8"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🤖</span>
            <h2 className="text-2xl font-bold">Claude Code 사용법</h2>
          </div>

          <div className="space-y-4">
            <div
              className="p-4 rounded-lg"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">1️⃣</span>
                <h3 className="font-bold text-lg">터미널 열기</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                VS Code나 원하는 터미널에서 프로젝트 폴더를 엽니다
              </p>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">2️⃣</span>
                <h3 className="font-bold text-lg">Claude Code 실행</h3>
              </div>
              <pre
                className="p-3 rounded mt-2 overflow-x-auto"
                style={{ background: '#000', color: '#0f0', fontFamily: 'monospace' }}
              >
                <code>npx @anthropic-ai/claude-code</code>
              </pre>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                또는 설치해서 사용: npm install -g @anthropic-ai/claude-code
              </p>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">3️⃣</span>
                <h3 className="font-bold text-lg">프롬프트 입력</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                아래 예제 프롬프트를 복사해서 붙여넣고 원하는 기능을 설명하세요!
              </p>
            </div>
          </div>
        </div>

        {/* 예제 프롬프트 */}
        <div
          className="p-8 rounded-2xl mb-8"
          style={{ background: 'var(--color-bg-secondary)', border: '2px solid var(--color-accent)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📋</span>
              <h2 className="text-2xl font-bold">예제 프롬프트</h2>
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80"
              style={{
                background: copied ? 'var(--color-success)' : 'var(--color-accent)',
                color: 'var(--color-bg)'
              }}
            >
              {copied ? '✓ 복사됨!' : '📋 복사하기'}
            </button>
          </div>

          <div
            className="p-6 rounded-xl overflow-x-auto"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
          >
            <pre
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: 'var(--color-text)', fontFamily: 'monospace' }}
            >
              {examplePrompt}
            </pre>
          </div>

          <div className="mt-6 p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              <strong style={{ color: 'var(--color-accent)' }}>💡 팁:</strong> 이 프롬프트를 복사해서 Claude Code에 붙여넣고,
              [여기에 원하는 기능을 자세히 적어주세요] 부분을 여러분의 아이디어로 바꾸세요!
              <br /><br />
              <strong>예시:</strong> "사용자 프로필 관리 기능", "이미지 업로드 갤러리", "실시간 채팅", "결제 연동" 등
              무엇이든 만들 수 있습니다! 🎨
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
