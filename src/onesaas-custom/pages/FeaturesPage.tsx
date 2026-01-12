'use client'

/**
 * 커스텀 기능 소개 페이지
 *
 * onesaas-core의 컴포넌트를 가져다 쓰고,
 * onesaas-custom의 컴포넌트도 함께 사용합니다.
 */

import { FeatureCard } from '@/onesaas-custom/components'

export function FeaturesPage() {
  const features = [
    {
      icon: '🚀',
      title: '빠른 시작',
      description: '복잡한 설정 없이 바로 시작할 수 있습니다. 모든 것이 준비되어 있습니다.',
      link: '/docs/quick-start',
    },
    {
      icon: '🎨',
      title: '70개 테마',
      description: '다양한 테마로 브랜드에 맞는 디자인을 선택하세요.',
      link: '/docs/themes',
    },
    {
      icon: '💳',
      title: '한국형 결제',
      description: 'PortOne, TossPayments를 지원합니다.',
      link: '/docs/payment',
    },
    {
      icon: '🔐',
      title: '간편 인증',
      description: '이메일, Google, 카카오, GitHub 로그인을 지원합니다.',
      link: '/docs/auth',
    },
    {
      icon: '📊',
      title: '관리자 대시보드',
      description: '통계, 사용자 관리, 분석 기능이 내장되어 있습니다.',
      link: '/docs/admin',
    },
    {
      icon: '🧩',
      title: '400+ 컴포넌트',
      description: '버튼, 카드, 모달, 폼 등 모든 UI 컴포넌트가 준비되어 있습니다.',
      link: '/docs/components',
    },
  ]

  return (
    <div
      className="min-h-screen py-20"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* 헤더 */}
        <div className="text-center mb-16">
          <h1
            className="text-5xl font-bold mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            🎯 주요 기능
          </h1>
          <p
            className="text-xl max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            OneSaaS Starter는 한국 초보자를 위한 All-in-One SaaS 템플릿입니다
          </p>
        </div>

        {/* 기능 카드 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/signup"
            className="inline-block px-8 py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90"
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-bg)',
            }}
          >
            무료로 시작하기 →
          </a>
        </div>
      </div>
    </div>
  )
}
