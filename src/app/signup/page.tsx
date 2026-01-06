'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SignUpForm, SocialLoginButtons } from '@/onesaas-core/auth/components'
import { getEnabledProviders } from '@/onesaas-core/auth/config'

export default function SignupPage() {
  const router = useRouter()
  const providers = getEnabledProviders()
  const hasEmail = providers.includes('email')
  const hasSocial = providers.some((p) => p !== 'email')

  const handleSuccess = () => {
    router.push('/dashboard')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'var(--color-accent)' }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-3 transition-transform hover:scale-105"
          >
            <span className="text-4xl">🚀</span>
            <span
              className="font-bold text-3xl"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-accent)',
              }}
            >
              OneSaaS
            </span>
          </Link>
          <h1
            className="mt-4 text-2xl font-bold"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            무료로 시작하세요
          </h1>
          <p
            className="mt-2 text-base"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            1분 안에 가입 완료
          </p>
        </div>

        {/* Signup Form Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {hasSocial && (
            <>
              <SocialLoginButtons />
              {hasEmail && (
                <div className="my-8 flex items-center">
                  <div
                    className="flex-1 h-px"
                    style={{ background: 'var(--color-border)' }}
                  />
                  <span
                    className="px-4 text-sm font-medium"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    또는 이메일로 가입
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: 'var(--color-border)' }}
                  />
                </div>
              )}
            </>
          )}

          {hasEmail && <SignUpForm onSuccess={handleSuccess} />}
        </div>

        {/* Login link */}
        <p
          className="text-center mt-8 text-base"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          이미 계정이 있으신가요?{' '}
          <Link
            href="/login"
            className="font-semibold transition-all hover:brightness-110"
            style={{ color: 'var(--color-accent)' }}
          >
            로그인 →
          </Link>
        </p>
      </div>
    </div>
  )
}
