'use client'

/**
 * 인증 관련 컴포넌트
 */

import { useState } from 'react'
import { useAuth } from './provider'
import { getEnabledProviders, PROVIDER_META, type AuthProvider } from './config'

/**
 * 소셜 로그인 버튼
 */
export function SocialLoginButton({ provider }: { provider: AuthProvider }) {
  const { signInWithProvider } = useAuth()
  const meta = PROVIDER_META[provider]
  const [loading, setLoading] = useState(false)

  if (provider === 'email') return null

  const handleClick = async () => {
    setLoading(true)
    await signInWithProvider(provider as 'google' | 'kakao' | 'github')
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
      style={{ backgroundColor: meta.bgColor, color: meta.color }}
    >
      {loading ? (
        <span className="animate-spin">⏳</span>
      ) : (
        <>
          {provider === 'google' && (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          {provider === 'kakao' && (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 3C6.48 3 2 6.48 2 11c0 2.69 1.5 5.05 3.78 6.47l-.97 3.58 4.15-2.73c.95.18 1.94.28 2.96.28 5.52 0 10-3.13 10-7.6S17.52 3 12 3z"
              />
            </svg>
          )}
          {provider === 'github' && (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
              />
            </svg>
          )}
          {meta.name}로 계속하기
        </>
      )}
    </button>
  )
}

/**
 * 소셜 로그인 버튼 그룹
 */
export function SocialLoginButtons() {
  const providers = getEnabledProviders().filter((p) => p !== 'email')

  if (providers.length === 0) return null

  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <SocialLoginButton key={provider} provider={provider} />
      ))}
    </div>
  )
}

/**
 * 이메일 로그인 폼
 */
export function EmailLoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const { signIn } = useAuth()
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
      onSuccess?.()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg text-sm" style={{ background: '#fee2e2', color: '#dc2626' }}>
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          이메일
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg transition-colors"
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
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          비밀번호
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg transition-colors"
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
        className="w-full py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
        style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}

/**
 * 회원가입 폼
 */
export function SignUpForm({ onSuccess }: { onSuccess?: () => void }) {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await signUp(email, password)
    if (error) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.')
    } else {
      onSuccess?.()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg text-sm" style={{ background: '#fee2e2', color: '#dc2626' }}>
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          이메일
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg transition-colors"
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
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          비밀번호
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg transition-colors"
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
          placeholder="8자 이상"
          minLength={8}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          비밀번호 확인
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg transition-colors"
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
        className="w-full py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
        style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
      >
        {loading ? '가입 중...' : '회원가입'}
      </button>
    </form>
  )
}

/**
 * 사용자 메뉴 (로그인 상태)
 */
export function UserMenu() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
        style={{ background: 'var(--color-bg-secondary)' }}
      >
        <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
          {user.email?.[0].toUpperCase()}
        </span>
        <span style={{ color: 'var(--color-text)' }}>{user.email}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-lg"
          style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
        >
          <a
            href="/dashboard"
            className="block px-4 py-2 hover:opacity-80"
            style={{ color: 'var(--color-text)' }}
          >
            대시보드
          </a>
          <a
            href="/settings"
            className="block px-4 py-2 hover:opacity-80"
            style={{ color: 'var(--color-text)' }}
          >
            설정
          </a>
          <hr style={{ borderColor: 'var(--color-border)' }} className="my-2" />
          <button
            onClick={signOut}
            className="block w-full text-left px-4 py-2 hover:opacity-80"
            style={{ color: '#ef4444' }}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}
