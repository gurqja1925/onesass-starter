'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useAuth } from '@/onesaas-core/auth/provider'
import { PROVIDER_META, type AuthProviderType } from '@/onesaas-core/auth/config'
import { getAppName, getAppIcon } from '@/lib/branding'

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  redirectUrl?: string
}

export default function SignupModal({ isOpen, onClose, redirectUrl = '/service' }: SignupModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const [providers, setProviders] = useState<AuthProviderType[]>(['email'])
  const [providersLoading, setProvidersLoading] = useState(true)

  const { signUp, signInWithProvider } = useAuth()
  const hasEmail = providers.includes('email')
  const hasSocial = providers.some((p) => p !== 'email')
  const socialProviders = providers.filter((p) => p !== 'email')
  const appName = getAppName()
  const appIcon = getAppIcon()

  useEffect(() => {
    setMounted(true)

    // DB에서 활성화된 프로바이더 목록 가져오기
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/auth/providers')
        if (response.ok) {
          const data = await response.json()
          // data.providers가 객체면 키를 배열로 변환
          const providerList = Array.isArray(data.providers)
            ? data.providers
            : Object.keys(data.providers || {}).filter((key) => data.providers[key])
          setProviders(providerList.length > 0 ? providerList : ['email'])
        }
      } catch (error) {
        console.error('프로바이더 목록 로드 실패:', error)
      } finally {
        setProvidersLoading(false)
      }
    }

    fetchProviders()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    // 비밀번호 길이 검증
    if (password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.')
      setLoading(false)
      return
    }

    // 회원가입
    const { error: signUpError } = await signUp(email, password)

    if (signUpError) {
      setError('회원가입에 실패했습니다. 이메일을 확인해주세요.')
      setLoading(false)
      return
    }

    // 회원가입 성공 - 페이지 이동
    if (typeof window !== 'undefined') {
      window.location.href = redirectUrl
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'kakao' | 'github') => {
    setLoading(true)
    setError('')

    try {
      await signInWithProvider(provider)
      // OAuth는 자동으로 리다이렉트됨
    } catch (error) {
      setError(`${PROVIDER_META[provider].name} 로그인에 실패했습니다.`)
      setLoading(false)
    }
  }

  if (!mounted || !isOpen) return null

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl"
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg transition-all hover:scale-110"
          style={{
            color: 'var(--color-text-secondary)',
          }}
          aria-label="닫기"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">{appIcon}</div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              {appName} 회원가입
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              계정을 만들어 시작하세요
            </p>
          </div>

          {/* OAuth 로그인 버튼들 */}
          {providersLoading ? (
            <div className="flex justify-center py-4">
              <div
                className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                style={{
                  borderColor: 'var(--color-accent)',
                  borderTopColor: 'transparent',
                }}
              />
            </div>
          ) : hasSocial ? (
            <div className="space-y-3 mb-6">
              {socialProviders.map((provider) => {
                const meta = PROVIDER_META[provider]
                return (
                  <button
                    key={provider}
                    onClick={() => handleOAuthLogin(provider as 'google' | 'kakao' | 'github')}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    style={{
                      backgroundColor: meta.bgColor,
                      color: meta.color,
                    }}
                  >
                    <span className="text-xl">{meta.icon}</span>
                    <span>{meta.name}로 시작하기</span>
                  </button>
                )
              })}
            </div>
          ) : null}

          {/* 구분선 */}
          {hasEmail && hasSocial && (
            <div className="relative my-6">
              <div
                className="absolute inset-0 flex items-center"
                style={{ borderTop: '1px solid var(--color-border)' }}
              />
              <div className="relative flex justify-center">
                <span
                  className="px-4 text-sm"
                  style={{
                    background: 'var(--color-card)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  또는 이메일로 가입
                </span>
              </div>
            </div>
          )}

          {/* 이메일 회원가입 폼 */}
          {hasEmail && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                  }}
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                  }}
                  placeholder="최소 8자 이상"
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                  }}
                  placeholder="비밀번호를 다시 입력하세요"
                  disabled={loading}
                />
              </div>

              {error && (
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-accent-text)',
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                      style={{
                        borderColor: 'var(--color-accent-text)',
                        borderTopColor: 'transparent',
                      }}
                    />
                    <span>처리 중...</span>
                  </div>
                ) : (
                  '회원가입'
                )}
              </button>
            </form>
          )}

          {/* 이미 계정이 있는 경우 */}
          <div className="mt-6 text-center">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              이미 계정이 있으신가요?{' '}
              <a
                href="/auth/login"
                className="font-medium transition-colors"
                style={{ color: 'var(--color-accent)' }}
              >
                로그인
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
