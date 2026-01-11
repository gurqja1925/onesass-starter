'use client'

import Link from 'next/link'

const guides = [
  {
    id: 'deployment',
    title: '배포 가이드',
    description: 'Vercel로 서비스를 배포하고 관리하는 방법',
    icon: '🚀',
    color: '#3b82f6',
  },
  {
    id: 'database',
    title: '데이터베이스 가이드',
    description: 'Supabase와 Prisma로 데이터를 관리하는 방법',
    icon: '🗄️',
    color: '#10b981',
  },
  {
    id: 'environment',
    title: '환경변수 가이드',
    description: '환경변수 설정과 보안 관리 방법',
    icon: '⚙️',
    color: '#f59e0b',
  },
  {
    id: 'security',
    title: '보안 가이드',
    description: '서비스 보안을 강화하는 방법',
    icon: '🔒',
    color: '#ef4444',
  },
  {
    id: 'troubleshooting',
    title: '문제 해결 가이드',
    description: '자주 발생하는 문제와 해결 방법',
    icon: '🔧',
    color: '#8b5cf6',
  },
  {
    id: 'commands',
    title: '명령어 모음',
    description: '자주 사용하는 명령어 총정리',
    icon: '💻',
    color: '#06b6d4',
  },
  {
    id: 'ai',
    title: 'AI 설정 가이드',
    description: 'K-Code CLI로 저렴한 AI 코딩',
    icon: '🤖',
    color: '#ec4899',
  },
  {
    id: 'business',
    title: '비즈니스 가이드',
    description: 'SaaS 비즈니스 운영 전략',
    icon: '💼',
    color: '#14b8a6',
  },
]

export default function DocsPage() {
  return (
    <div
      className="min-h-screen pt-20 pb-16 px-6"
      style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">📚 문서</h1>
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-lg">
            초보자도 쉽게 따라할 수 있는 운영 가이드
          </p>
        </div>

        {/* 안내 박스 */}
        <div
          className="p-6 rounded-2xl mb-12"
          style={{ background: '#fef3c720', border: '2px solid #f59e0b40' }}
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl">💡</span>
            <div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#fbbf24' }}>
                처음이신가요?
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                걱정하지 마세요! 이 가이드는 <strong style={{ color: 'var(--color-text)' }}>컴퓨터를 잘 모르는 분들도</strong> 쉽게 따라할 수 있도록 만들었습니다.
                <br />
                각 가이드에는 <strong style={{ color: 'var(--color-text)' }}>하나하나 자세한 설명</strong>이 있어요.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Link
            href="/admin/guides"
            className="p-6 rounded-2xl transition-all hover:scale-105"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div className="text-3xl mb-3">📖</div>
            <h3 className="font-bold text-lg mb-2">전체 가이드</h3>
            <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
              관리자 페이지에서 모든 가이드 보기
            </p>
          </Link>
          <Link
            href="/admin/setup"
            className="p-6 rounded-2xl transition-all hover:scale-105"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div className="text-3xl mb-3">🛠️</div>
            <h3 className="font-bold text-lg mb-2">초기 설정</h3>
            <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
              서비스 초기 설정 및 환경변수
            </p>
          </Link>
          <Link
            href="/admin"
            className="p-6 rounded-2xl transition-all hover:scale-105"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="font-bold text-lg mb-2">관리자</h3>
            <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
              관리자 대시보드 접속
            </p>
          </Link>
        </div>

        {/* 가이드 목록 */}
        <h2
          className="text-2xl font-bold mb-6 pb-2"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          📋 운영 가이드
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              href={`/admin/guides/${guide.id}`}
              className="p-5 rounded-xl transition-all hover:scale-105"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                style={{ background: `${guide.color}20` }}
              >
                {guide.icon}
              </div>
              <h3 className="font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                {guide.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {guide.description}
              </p>
            </Link>
          ))}
        </div>

        {/* 주요 페이지 */}
        <h2
          className="text-2xl font-bold mb-6 pb-2"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          🗺️ 주요 페이지
        </h2>

        <div
          className="p-6 rounded-xl mb-12"
          style={{ background: 'var(--color-bg-secondary)' }}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <PageLink href="/" icon="🏠" title="홈페이지" desc="랜딩 페이지" />
              <PageLink href="/dashboard" icon="📊" title="/dashboard" desc="사용자 대시보드" />
              <PageLink href="/admin" icon="⚙️" title="/admin" desc="관리자 페이지" />
              <PageLink href="/showcase" icon="🎨" title="/showcase" desc="테마 데모" />
            </div>
            <div className="space-y-3">
              <PageLink href="/login" icon="🔐" title="/login" desc="로그인" />
              <PageLink href="/signup" icon="📝" title="/signup" desc="회원가입" />
              <PageLink href="/pricing" icon="💰" title="/pricing" desc="요금제" />
              <PageLink href="/admin/guides" icon="📚" title="/admin/guides" desc="운영 가이드" />
            </div>
          </div>
        </div>

        {/* 기술 스택 */}
        <h2
          className="text-2xl font-bold mb-6 pb-2"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          🛠️ 기술 스택
        </h2>

        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <TechCard title="프론트엔드" items={['Next.js 16', 'React 19', 'Tailwind CSS']} />
          <TechCard title="백엔드" items={['Next.js API', 'Prisma ORM']} />
          <TechCard title="데이터베이스" items={['PostgreSQL', 'Supabase']} />
          <TechCard title="배포" items={['Vercel', 'GitHub']} />
        </div>

        {/* 외부 문서 */}
        <h2
          className="text-2xl font-bold mb-6 pb-2"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          🔗 참고 문서
        </h2>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <ExternalLink href="https://vercel.com/docs" title="Vercel 문서" desc="배포 관련" />
          <ExternalLink href="https://supabase.com/docs" title="Supabase 문서" desc="데이터베이스 관련" />
          <ExternalLink href="https://nextjs.org/docs" title="Next.js 문서" desc="프레임워크 관련" />
        </div>

        {/* CTA */}
        <div
          className="text-center p-8 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)',
            color: 'var(--color-bg)',
          }}
        >
          <h3 className="text-2xl font-bold mb-4">더 알아보기</h3>
          <p className="mb-6 opacity-80">OneSaaS로 만들어진 서비스입니다</p>
          <a
            href="https://onesaas.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
            style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
          >
            OneSaaS 방문하기 →
          </a>
        </div>
      </div>
    </div>
  )
}

function PageLink({ href, icon, title, desc }: { href: string; icon: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg transition-all hover:opacity-80"
      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
    >
      <span className="text-xl">{icon}</span>
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{desc}</div>
      </div>
    </Link>
  )
}

function TechCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: 'var(--color-bg-secondary)' }}
    >
      <div className="font-semibold mb-2">{title}</div>
      <ul className="text-sm space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  )
}

function ExternalLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 rounded-xl block transition-all hover:scale-105"
      style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
    >
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{desc}</div>
      <div className="text-xs mt-2" style={{ color: 'var(--color-accent)' }}>↗ 외부 링크</div>
    </a>
  )
}
