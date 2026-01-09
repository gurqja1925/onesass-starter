'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)

  const plans = [
    {
      name: 'Free',
      description: '개인 사용자를 위한 무료 플랜',
      price: { monthly: 0, annual: 0 },
      features: [
        'AI 채팅 10회/일',
        '이미지 생성 5회/월',
        '영상 생성 2회/월',
        '노트 20개',
        '기본 템플릿',
      ],
      limitations: [
        '고급 기능 제한',
        '커뮤니티 지원만',
      ],
      cta: '무료로 시작',
      href: '/auth/signup',
      popular: false,
    },
    {
      name: 'Pro',
      description: '전문가와 크리에이터를 위한 플랜',
      price: { monthly: 29000, annual: 290000 },
      features: [
        'AI 채팅 무제한',
        '이미지 생성 100회/월',
        '영상 생성 30회/월',
        '노트 무제한',
        '모든 템플릿',
        '우선 처리',
        '고화질 출력',
        '이메일 지원',
      ],
      limitations: [],
      cta: 'Pro 시작하기',
      href: '/auth/signup?plan=pro',
      popular: true,
    },
    {
      name: 'Team',
      description: '팀 협업을 위한 플랜',
      price: { monthly: 79000, annual: 790000 },
      features: [
        'Pro의 모든 기능',
        '팀원 5명 포함',
        '팀 협업 기능',
        '공유 워크스페이스',
        'API 액세스',
        '전용 지원',
        '관리자 대시보드',
        'SSO 지원',
      ],
      limitations: [],
      cta: 'Team 시작하기',
      href: '/auth/signup?plan=team',
      popular: false,
    },
  ]

  const faqs = [
    {
      q: '무료 플랜에서 Pro로 언제든 업그레이드할 수 있나요?',
      a: '네, 언제든지 업그레이드할 수 있습니다. 업그레이드 즉시 Pro 기능을 사용할 수 있으며, 사용량은 월 단위로 초기화됩니다.',
    },
    {
      q: '결제는 어떻게 하나요?',
      a: '신용카드, 체크카드, 계좌이체를 지원합니다. 연간 결제 시 2개월 무료 혜택이 제공됩니다.',
    },
    {
      q: '환불 정책은 어떻게 되나요?',
      a: '결제 후 7일 이내에 환불을 요청하실 수 있습니다. 사용량이 플랜의 50% 미만인 경우 전액 환불됩니다.',
    },
    {
      q: 'Team 플랜에서 팀원을 추가할 수 있나요?',
      a: '네, 기본 5명 외에 추가 팀원당 월 15,000원으로 팀원을 추가할 수 있습니다.',
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* 헤더 */}
      <header
        className="border-b sticky top-0 z-50 backdrop-blur-xl"
        style={{
          background: 'var(--color-bg)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>
            OneSaaS
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg"
              style={{ color: 'var(--color-text)' }}
            >
              로그인
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 rounded-lg font-medium"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              무료로 시작
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* 타이틀 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            당신에게 맞는 플랜을 선택하세요
          </h1>
          <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            모든 플랜에서 14일 무료 체험을 제공합니다
          </p>

          {/* 결제 주기 토글 */}
          <div className="inline-flex items-center gap-4 p-1 rounded-xl" style={{ background: 'var(--color-bg-secondary)' }}>
            <button
              onClick={() => setAnnual(false)}
              className="px-6 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: !annual ? 'var(--color-accent)' : 'transparent',
                color: !annual ? 'var(--color-bg)' : 'var(--color-text)',
              }}
            >
              월간
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              style={{
                background: annual ? 'var(--color-accent)' : 'transparent',
                color: annual ? 'var(--color-bg)' : 'var(--color-text)',
              }}
            >
              연간
              <span
                className="px-2 py-0.5 rounded-full text-xs"
                style={{ background: '#10b981', color: 'white' }}
              >
                2개월 무료
              </span>
            </button>
          </div>
        </div>

        {/* 플랜 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 relative ${plan.popular ? 'ring-2' : ''}`}
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                ...(plan.popular && { ringColor: 'var(--color-accent)' }),
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  가장 인기
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    {annual ? plan.price.annual.toLocaleString() : plan.price.monthly.toLocaleString()}
                  </span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>원</span>
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    /{annual ? '년' : '월'}
                  </span>
                </div>
                {annual && plan.price.monthly > 0 && (
                  <p className="text-sm mt-1" style={{ color: '#10b981' }}>
                    월 {Math.round(plan.price.annual / 12).toLocaleString()}원 (17% 절약)
                  </p>
                )}
              </div>

              <Link
                href={plan.href}
                className="block w-full py-3 rounded-xl text-center font-medium mb-6 transition-all hover:opacity-90"
                style={{
                  background: plan.popular ? 'var(--color-accent)' : 'var(--color-bg)',
                  color: plan.popular ? 'var(--color-bg)' : 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {plan.cta}
              </Link>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <span style={{ color: '#10b981' }}>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limit) => (
                  <div key={limit} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>✕</span>
                    <span>{limit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 기능 비교표 */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">상세 기능 비교</h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th className="text-left p-4">기능</th>
                  <th className="text-center p-4">Free</th>
                  <th className="text-center p-4">Pro</th>
                  <th className="text-center p-4">Team</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['AI 채팅', '10회/일', '무제한', '무제한'],
                  ['이미지 생성', '5회/월', '100회/월', '무제한'],
                  ['영상 생성', '2회/월', '30회/월', '100회/월'],
                  ['노트', '20개', '무제한', '무제한'],
                  ['템플릿', '기본', '모두', '모두'],
                  ['출력 품질', '기본', '고화질', '고화질'],
                  ['우선 처리', '✕', '✓', '✓'],
                  ['API 액세스', '✕', '✕', '✓'],
                  ['팀 협업', '✕', '✕', '✓'],
                  ['전용 지원', '✕', '이메일', '24/7'],
                ].map(([feature, free, pro, team]) => (
                  <tr key={feature} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="p-4">{feature}</td>
                    <td className="text-center p-4" style={{ color: 'var(--color-text-secondary)' }}>{free}</td>
                    <td className="text-center p-4">{pro}</td>
                    <td className="text-center p-4">{team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">자주 묻는 질문</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl p-6"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="mt-20 rounded-2xl p-12 text-center"
          style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, #10b981 100%)' }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            14일 무료 체험으로 모든 기능을 사용해보세요.<br />
            신용카드 없이 시작할 수 있습니다.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 rounded-xl font-bold text-lg"
            style={{ background: 'white', color: 'var(--color-accent)' }}
          >
            무료로 시작하기
          </Link>
        </div>
      </main>

      {/* 푸터 */}
      <footer
        className="border-t mt-20"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              © 2024 OneSaaS. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/terms" style={{ color: 'var(--color-text-secondary)' }}>이용약관</Link>
              <Link href="/privacy" style={{ color: 'var(--color-text-secondary)' }}>개인정보처리방침</Link>
              <Link href="/contact" style={{ color: 'var(--color-text-secondary)' }}>문의하기</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
