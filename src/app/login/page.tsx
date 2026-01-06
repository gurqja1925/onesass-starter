'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EmailLoginForm, SocialLoginButtons } from '@/onesaas-core/auth/components'
import { getEnabledProviders } from '@/onesaas-core/auth/config'

export default function LoginPage() {
  const router = useRouter()
  const providers = getEnabledProviders()
  const hasEmail = providers.includes('email')
  const hasSocial = providers.some((p) => p !== 'email')

  const handleSuccess = () => {
    router.push('/dashboard')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🚀</span>
            <span
              className="font-bold text-2xl"
              style={{ color: 'var(--color-accent)' }}
            >
              OneSaaS
            </span>
          </Link>
          <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            계정에 로그인하세요
          </p>
        </div>

        {/* Login Form */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          {hasEmail && <EmailLoginForm onSuccess={handleSuccess} />}

          {hasEmail && hasSocial && (
            <div className="my-6 flex items-center">
              <div
                className="flex-1"
                style={{ borderTop: '1px solid var(--color-border)' }}
              />
              <span
                className="px-4 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                또는
              </span>
              <div
                className="flex-1"
                style={{ borderTop: '1px solid var(--color-border)' }}
              />
            </div>
          )}

          {hasSocial && <SocialLoginButtons />}
        </div>

        {/* Sign up link */}
        <p
          className="text-center mt-6"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          계정이 없으신가요?{' '}
          <Link
            href="/signup"
            className="font-medium hover:opacity-80"
            style={{ color: 'var(--color-accent)' }}
          >
            무료로 시작하기
          </Link>
        </p>
      </div>
    </div>
  )
}
