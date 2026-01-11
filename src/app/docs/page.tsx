'use client'

import Link from 'next/link'

export default function DocsPage() {
  return (
    <div
      className="min-h-screen pt-20 pb-16 px-6"
      style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">문서</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            서비스 사용 가이드
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
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
          <Link
            href="/dashboard"
            className="p-6 rounded-2xl transition-all hover:scale-105"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-2">대시보드</h3>
            <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
              사용자 대시보드
            </p>
          </Link>
          <Link
            href="/showcase"
            className="p-6 rounded-2xl transition-all hover:scale-105"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-bold text-lg mb-2">쇼케이스</h3>
            <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
              테마 및 기능 데모
            </p>
          </Link>
        </div>

        {/* Getting Started */}
        <section className="mb-16">
          <h2
            className="text-2xl font-bold mb-6 pb-2"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            🚀 시작하기
          </h2>

          <div className="space-y-6">
            <div
              className="p-6 rounded-xl"
              style={{ background: 'var(--color-bg-secondary)' }}
            >
              <h3 className="font-bold text-lg mb-4">주요 페이지</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    /
                  </span>
                  <div>
                    <div className="font-semibold">홈페이지</div>
                    <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
                      랜딩 페이지
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    📊
                  </span>
                  <div>
                    <div className="font-semibold">/dashboard</div>
                    <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
                      사용자 대시보드
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    ⚙️
                  </span>
                  <div>
                    <div className="font-semibold">/admin</div>
                    <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
                      관리자 페이지 (로그인 필요)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2
            className="text-2xl font-bold mb-6 pb-2"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            🛠️ 기술 스택
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div
              className="p-4 rounded-xl"
              style={{ background: 'var(--color-bg-secondary)' }}
            >
              <div className="font-semibold mb-2">프론트엔드</div>
              <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
                Next.js, React, Tailwind CSS
              </p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: 'var(--color-bg-secondary)' }}
            >
              <div className="font-semibold mb-2">백엔드</div>
              <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
                Next.js API Routes, Prisma
              </p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: 'var(--color-bg-secondary)' }}
            >
              <div className="font-semibold mb-2">데이터베이스</div>
              <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
                PostgreSQL (Supabase)
              </p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: 'var(--color-bg-secondary)' }}
            >
              <div className="font-semibold mb-2">배포</div>
              <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
                Vercel
              </p>
            </div>
          </div>
        </section>

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
