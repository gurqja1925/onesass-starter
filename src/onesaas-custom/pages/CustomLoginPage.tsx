'use client'

/**
 * 커스텀 로그인 페이지
 *
 * ✅ 이 파일은 onesaas-custom에 있으므로 안전합니다!
 * ✅ 템플릿 업데이트 시에도 이 파일은 그대로 유지됩니다
 *
 * 사용법:
 * app/login/page.tsx에서 이 컴포넌트를 import해서 사용하세요
 */

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/onesaas-core/auth/provider'
import { getEnabledProviders, PROVIDER_META } from '@/onesaas-core/auth/config'

function CustomLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'

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
      router.push(redirectTo)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            🔐 로그인
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            계정에 로그인하여 계속하세요
          </p>
        </div>

        {/* 소셜 로그인 */}
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

        {/* 이메일 로그인 */}
        {hasEmail && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl text-sm font-medium" style={{ background: 'var(--color-error)', color: 'white' }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl"
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
                <label className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  비밀번호
                </label>
                <Link href="/forgot-password" className="text-sm hover:opacity-80" style={{ color: 'var(--color-accent)' }}>
                  비밀번호 찾기
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl"
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

        <p className="text-center mt-8" style={{ color: 'var(--color-text-secondary)' }}>
          계정이 없으신가요?{' '}
          <Link href="/signup" className="font-semibold hover:opacity-80" style={{ color: 'var(--color-accent)' }}>
            무료로 시작하기
          </Link>
        </p>
      </div>
    </div>
  )
}

export function CustomLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--color-accent)' }}></div>
          <p style={{ color: 'var(--color-text-secondary)' }}>로딩중...</p>
        </div>
      </div>
    }>
      <CustomLoginForm />
    </Suspense>
  )
}
