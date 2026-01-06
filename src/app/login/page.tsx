'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/onesaas-core/auth/provider'
import { getEnabledProviders, PROVIDER_META } from '@/onesaas-core/auth/config'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signInWithProvider } = useAuth()
  const providers = getEnabledProviders()
  const hasEmail = providers.includes('email')
  const hasSocial = providers.some((p) => p !== 'email')
  const socialProviders = providers.filter((p) => p !== 'email')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Left side - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'var(--color-accent)' }}
      >
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-4xl">🚀</span>
            <span
              className="font-bold text-2xl"
              style={{ color: 'var(--color-bg)', fontFamily: 'var(--font-display)' }}
            >
              OneSaaS
            </span>
          </Link>
        </div>

        <div className="relative z-10">
          <h1
            className="text-5xl font-bold leading-tight mb-6"
            style={{ color: 'var(--color-bg)', fontFamily: 'var(--font-display)' }}
          >
            아이디어를
            <br />
            현실로 만드세요
          </h1>
          <p className="text-xl opacity-80" style={{ color: 'var(--color-bg)' }}>
            복잡한 개발 없이 바로 시작하세요.
            <br />
            모든 것이 준비되어 있습니다.
          </p>
        </div>

        <div className="relative z-10" style={{ color: 'var(--color-bg)' }}>
          <p className="text-sm opacity-70">© 2024 OneSaaS. All rights reserved.</p>
        </div>

        {/* Decorative circles */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'var(--color-bg)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'var(--color-bg)' }}
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="text-4xl">🚀</span>
              <span
                className="font-bold text-2xl"
                style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
              >
                OneSaaS
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}
            >
              로그인
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              계정에 로그인하여 계속하세요
            </p>
          </div>

          {/* Social Login */}
          {hasSocial && (
            <div className="space-y-3 mb-6">
              {socialProviders.map((provider) => {
                const meta = PROVIDER_META[provider]
                return (
                  <button
                    key={provider}
                    onClick={() => signInWithProvider(provider as 'google' | 'kakao' | 'github')}
                    className="w-full py-3.5 px-4 rounded-xl font-medium flex items-center justify-center gap-3 transition-all hover:opacity-90"
                    style={{
                      background: meta.bgColor,
                      color: meta.color,
                    }}
                  >
                    {provider === 'google' && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    {provider === 'kakao' && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 3C6.48 3 2 6.48 2 11c0 2.69 1.5 5.05 3.78 6.47l-.97 3.58 4.15-2.73c.95.18 1.94.28 2.96.28 5.52 0 10-3.13 10-7.6S17.52 3 12 3z"/>
                      </svg>
                    )}
                    {provider === 'github' && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    )}
                    {meta.name}로 계속하기
                  </button>
                )
              })}
            </div>
          )}

          {hasEmail && hasSocial && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>또는</span>
              <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            </div>
          )}

          {/* Email Login Form */}
          {hasEmail && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div
                  className="p-4 rounded-xl text-sm font-medium"
                  style={{ background: 'var(--color-error)', color: 'white' }}
                >
                  {error}
                </div>
              )}

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: 'var(--color-text)' }}
                  >
                    비밀번호
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm hover:opacity-80"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    비밀번호 찾기
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 hover:opacity-90"
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-bg)',
                }}
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </form>
          )}

          {/* Sign up link */}
          <p className="text-center mt-8" style={{ color: 'var(--color-text-secondary)' }}>
            계정이 없으신가요?{' '}
            <Link
              href="/signup"
              className="font-semibold hover:opacity-80"
              style={{ color: 'var(--color-accent)' }}
            >
              무료로 시작하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
