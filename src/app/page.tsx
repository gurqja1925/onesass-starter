import Link from 'next/link'
import { getProjectName } from '@/lib/config'

export default function Home() {
  const projectName = getProjectName()

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            당신의 아이디어를
            <br />
            <span style={{ color: 'var(--color-accent)' }}>현실로</span> 만드세요
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            복잡한 개발 없이 바로 시작하세요.
            <br />
            모든 것이 준비되어 있습니다.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              무료로 시작하기
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 rounded-xl text-lg font-semibold transition-all border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              자세히 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              모든 것이 <span style={{ color: 'var(--color-accent)' }}>준비되어</span> 있습니다
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              SaaS에 필요한 핵심 기능을 바로 사용하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🔐', title: '인증 시스템', desc: '이메일, Google, 카카오 로그인을 바로 사용하세요' },
              { icon: '💳', title: '결제 연동', desc: 'PortOne으로 국내 모든 결제 수단을 지원합니다' },
              { icon: '📊', title: '관리자 대시보드', desc: '사용자, 결제, 통계를 한눈에 관리하세요' },
              { icon: '🤖', title: 'AI 연동', desc: 'OpenAI, Claude API를 바로 연동할 수 있습니다' },
              { icon: '📱', title: '반응형 디자인', desc: '모든 기기에서 완벽하게 동작합니다' },
              { icon: '🚀', title: '즉시 배포', desc: 'Vercel로 클릭 한 번에 전 세계에 배포하세요' },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl transition-all hover:scale-105"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">심플한 가격</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              필요한 만큼만 사용하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <h3 className="text-xl font-bold mb-2">무료</h3>
              <p className="text-4xl font-bold mb-6">₩0<span className="text-sm font-normal" style={{ color: 'var(--color-text-secondary)' }}>/월</span></p>
              <ul className="space-y-3 mb-8">
                {['기본 기능', '1,000 요청/월', '이메일 지원'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span style={{ color: 'var(--color-accent)' }}>✓</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-lg font-medium" style={{ border: '1px solid var(--color-border)' }}>
                시작하기
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl relative" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full" style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}>
                인기
              </span>
              <h3 className="text-xl font-bold mb-2">프로</h3>
              <p className="text-4xl font-bold mb-6">₩29,000<span className="text-sm font-normal opacity-70">/월</span></p>
              <ul className="space-y-3 mb-8">
                {['모든 기능', '무제한 요청', '우선 지원', 'API 접근'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span>✓</span>
                    <span className="opacity-90">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-lg font-medium" style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}>
                시작하기
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-2xl" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <h3 className="text-xl font-bold mb-2">엔터프라이즈</h3>
              <p className="text-4xl font-bold mb-6">문의<span className="text-sm font-normal" style={{ color: 'var(--color-text-secondary)' }}></span></p>
              <ul className="space-y-3 mb-8">
                {['맞춤 솔루션', 'SLA 보장', '전담 지원', '온프레미스 가능'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span style={{ color: 'var(--color-accent)' }}>✓</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-lg font-medium" style={{ border: '1px solid var(--color-border)' }}>
                문의하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">지금 바로 시작하세요</h2>
          <p className="text-xl mb-10" style={{ color: 'var(--color-text-secondary)' }}>
            5분만에 나만의 SaaS를 런칭하세요
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            무료로 시작하기
          </Link>
        </div>
      </section>
    </div>
  )
}
