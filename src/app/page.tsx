import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* 샘플 안내 배너 */}
      <div
        className="py-3 px-4 text-center text-sm"
        style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
      >
        이 페이지는 <strong>샘플 템플릿</strong>입니다. AI와 함께 로컬에서 커스터마이징하여 나만의 서비스를 만드세요.
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
          >
            샘플 랜딩 페이지
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            당신의 아이디어를
            <br />
            <span style={{ color: 'var(--color-accent)' }}>현실로</span> 만드세요
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            이 템플릿을 기반으로 AI와 함께 개발하세요.
            <br />
            모든 기본 기능이 준비되어 있습니다.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              샘플 회원가입
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-xl text-lg font-semibold transition-all border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              샘플 대시보드
            </Link>
            <Link
              href="/admin"
              className="px-8 py-4 rounded-xl text-lg font-semibold transition-all border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              샘플 관리자
            </Link>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-24 px-4" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}
            >
              사용 방법
            </span>
            <h2 className="text-4xl font-bold mb-4">
              AI와 함께 <span style={{ color: 'var(--color-accent)' }}>개발</span>하세요
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              이 템플릿을 로컬에 다운로드하고, AI 코딩 도구로 커스터마이징하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: '템플릿 다운로드',
                desc: 'OneSaaS에서 이 템플릿을 다운로드하거나 GitHub에서 clone하세요'
              },
              {
                step: '2',
                title: 'AI와 대화하며 개발',
                desc: 'Claude, Cursor 등 AI 코딩 도구로 원하는 기능을 추가하세요'
              },
              {
                step: '3',
                title: '배포 및 런칭',
                desc: 'Vercel에 배포하고 나만의 서비스를 세상에 공개하세요'
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl transition-all hover:scale-105"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <span
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  {item.step}
                </span>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
            >
              포함된 샘플 기능
            </span>
            <h2 className="text-4xl font-bold mb-4">
              이 템플릿에 <span style={{ color: 'var(--color-accent)' }}>포함된</span> 기능들
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              모두 샘플 코드입니다. AI와 함께 자유롭게 수정하세요.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🔐', title: '샘플 인증', desc: '로그인/회원가입 UI와 기본 로직이 포함되어 있습니다', link: '/login' },
              { icon: '💳', title: '샘플 결제', desc: '결제 페이지와 관리 화면 샘플이 준비되어 있습니다', link: '/admin/payments' },
              { icon: '📊', title: '샘플 관리자', desc: '대시보드, 사용자 관리, 통계 페이지가 포함되어 있습니다', link: '/admin' },
              { icon: '🤖', title: '샘플 AI 기능', desc: 'AI 글쓰기, 이미지 생성 등 샘플 AI 도구가 있습니다', link: '/dashboard/ai' },
              { icon: '📱', title: '반응형 디자인', desc: '모바일, 태블릿, 데스크톱 모두 지원합니다', link: '/' },
              { icon: '🎨', title: '20가지 테마', desc: '상단 메뉴에서 다양한 테마를 미리보기할 수 있습니다', link: '/' },
            ].map((feature, i) => (
              <Link
                key={i}
                href={feature.link}
                className="p-6 rounded-2xl transition-all hover:scale-105 block"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>{feature.desc}</p>
                <span className="text-sm mt-3 inline-block" style={{ color: 'var(--color-accent)' }}>
                  샘플 보기 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Pages Section */}
      <section className="py-24 px-4" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}
            >
              샘플 페이지 목록
            </span>
            <h2 className="text-4xl font-bold mb-4">
              모든 <span style={{ color: 'var(--color-accent)' }}>샘플 페이지</span> 둘러보기
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: '랜딩 페이지', href: '/', desc: '현재 페이지' },
              { name: '로그인', href: '/login', desc: '샘플 로그인' },
              { name: '회원가입', href: '/signup', desc: '샘플 회원가입' },
              { name: '대시보드', href: '/dashboard', desc: '사용자 대시보드' },
              { name: 'AI 도구', href: '/dashboard/ai', desc: 'AI 기능 샘플' },
              { name: '관리자', href: '/admin', desc: '관리자 대시보드' },
              { name: '사용자 관리', href: '/admin/users', desc: '사용자 CRUD' },
              { name: '결제 관리', href: '/admin/payments', desc: '결제 내역' },
              { name: '통계', href: '/admin/analytics', desc: '통계 차트' },
              { name: '설정', href: '/admin/settings', desc: '서비스 설정' },
              { name: '쇼케이스', href: '/showcase', desc: 'UI 컴포넌트' },
              { name: '문서', href: '/docs', desc: '사용 가이드' },
            ].map((page, i) => (
              <Link
                key={i}
                href={page.href}
                className="p-4 rounded-xl transition-all hover:scale-105 flex items-center justify-between"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div>
                  <p className="font-bold" style={{ color: 'var(--color-text)' }}>{page.name}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{page.desc}</p>
                </div>
                <span style={{ color: 'var(--color-accent)' }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - 샘플 */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
            >
              샘플 가격표
            </span>
            <h2 className="text-4xl font-bold mb-4">가격 페이지 샘플</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              실제 서비스에 맞게 수정하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <h3 className="text-xl font-bold mb-2">무료</h3>
              <p className="text-4xl font-bold mb-6">₩0<span className="text-sm font-normal" style={{ color: 'var(--color-text-secondary)' }}>/월</span></p>
              <ul className="space-y-3 mb-8">
                {['기본 기능', '제한된 사용량', '커뮤니티 지원'].map((item, i) => (
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
                샘플
              </span>
              <h3 className="text-xl font-bold mb-2">프로</h3>
              <p className="text-4xl font-bold mb-6">₩29,000<span className="text-sm font-normal opacity-70">/월</span></p>
              <ul className="space-y-3 mb-8">
                {['모든 기능', '무제한 사용', '우선 지원'].map((item, i) => (
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
              <h3 className="text-xl font-bold mb-2">기업</h3>
              <p className="text-4xl font-bold mb-6">문의</p>
              <ul className="space-y-3 mb-8">
                {['맞춤 솔루션', '전담 지원', 'SLA 보장'].map((item, i) => (
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
          <h2 className="text-4xl font-bold mb-6">AI와 함께 개발을 시작하세요</h2>
          <p className="text-xl mb-10" style={{ color: 'var(--color-text-secondary)' }}>
            이 템플릿을 다운로드하고, Claude나 Cursor와 함께 커스터마이징하세요
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://github.com/onesaas/starter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              GitHub에서 받기
            </a>
            <Link
              href="/docs"
              className="inline-block px-10 py-4 rounded-xl text-lg font-semibold transition-all border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              문서 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
