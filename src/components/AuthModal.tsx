'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useAuth } from '@/onesaas-core/auth/provider'
import { PROVIDER_META, type AuthProviderType } from '@/onesaas-core/auth/config'
import { getAppName, getAppIcon } from '@/lib/branding'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  redirectUrl?: string
}

const SAVED_EMAIL_KEY = 'onesaas_saved_email'
const REMEMBER_EMAIL_KEY = 'onesaas_remember_email'

export default function AuthModal({ isOpen, onClose, redirectUrl = '/service' }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberEmail, setRememberEmail] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const [providers, setProviders] = useState<AuthProviderType[]>(['email'])
  const [providersLoading, setProvidersLoading] = useState(true)

  const { signIn, signInWithProvider } = useAuth()
  const hasEmail = providers.includes('email')
  const hasSocial = providers.some((p) => p !== 'email')
  const socialProviders = providers.filter((p) => p !== 'email') as ('google' | 'kakao' | 'github')[]
  const appName = getAppName()
  const appIcon = getAppIcon()

  useEffect(() => {
    setMounted(true)
    // 저장된 이메일 불러오기
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY)
      const shouldRemember = localStorage.getItem(REMEMBER_EMAIL_KEY) === 'true'
      if (savedEmail && shouldRemember) {
        setEmail(savedEmail)
        setRememberEmail(true)
      }
    }

    // DB에서 활성화된 프로바이더 목록 가져오기
    const fetchProviders = async () => {
      try {
        const res = await fetch('/api/auth/providers')
        const data = await res.json()
        if (data.providers && Array.isArray(data.providers)) {
          setProviders(data.providers as AuthProviderType[])
        }
      } catch (error) {
        console.error('Failed to fetch auth providers:', error)
        // 에러 시 기본값(이메일만) 유지
      } finally {
        setProvidersLoading(false)
      }
    }
    fetchProviders()
  }, [])

  if (!isOpen || !mounted || providersLoading) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 로그인 시도
    const { error: signInError } = await signIn(email, password)

    if (signInError) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
      setLoading(false)
      return
    }

    // 이메일 저장 처리
    if (typeof window !== 'undefined') {
      if (rememberEmail) {
        localStorage.setItem(SAVED_EMAIL_KEY, email)
        localStorage.setItem(REMEMBER_EMAIL_KEY, 'true')
      } else {
        localStorage.removeItem(SAVED_EMAIL_KEY)
        localStorage.removeItem(REMEMBER_EMAIL_KEY)
      }
    }

    // 세션이 완전히 저장될 때까지 약간 기다림
    await new Promise(resolve => setTimeout(resolve, 500))
    window.location.href = redirectUrl
  }

  const handleSocialLogin = async (provider: 'google' | 'kakao' | 'github') => {
    try {
      await signInWithProvider(provider)
    } catch (error) {
      console.error(`${provider} 로그인 실패:`, error)
    }
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl px-8 pt-12 pb-8 my-auto"
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg transition-all hover:bg-opacity-80"
          style={{
            color: 'var(--color-text-secondary)',
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">{appIcon}</div>
          <h2
            className="text-2xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            {appName} 로그인
          </h2>
        </div>

        {/* Email Form */}
        {hasEmail && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="p-3 rounded-lg text-sm text-center"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                {error}
              </div>
            )}

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
                placeholder="아이디"
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
                placeholder="비밀번호"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold transition-all disabled:opacity-50 hover:opacity-90"
              style={{
                background: '#dc2626',
                color: '#ffffff',
              }}
            >
              {loading ? '처리 중...' : '로그인'}
            </button>

            {/* 아이디 찾기 | 비밀번호 찾기 */}
            <div className="text-center">
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('아이디 찾기 기능은 준비 중입니다.')
                  }}
                  className="hover:underline"
                  style={{ color: '#dc2626' }}
                >
                  아이디 찾기
                </a>
                {' | '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('비밀번호 찾기 기능은 준비 중입니다.')
                  }}
                  className="hover:underline"
                  style={{ color: '#dc2626' }}
                >
                  비밀번호 찾기
                </a>
              </span>
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="button"
              onClick={() => {
                window.location.href = '/auth/signup'
              }}
              className="w-full py-3 rounded-lg font-bold transition-all hover:bg-opacity-10"
              style={{
                background: 'transparent',
                border: '2px solid #dc2626',
                color: '#dc2626',
              }}
            >
              회원가입
            </button>
          </form>
        )}

        {/* 구분선과 다른 방법으로 로그인 */}
        {hasSocial && (
          <>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                다른 방법으로 로그인
              </span>
              <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            </div>

            <div className="space-y-3">
              {socialProviders.map((provider) => {
                const meta = PROVIDER_META[provider]
                return (
                  <button
                    key={provider}
                    onClick={() => handleSocialLogin(provider)}
                    className="w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-3 transition-all hover:opacity-90"
                    style={{
                      background: meta.bgColor,
                      color: meta.color,
                    }}
                  >
                    <span className="text-xl">{meta.icon}</span>
                    <span>{meta.name}로 로그인</span>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
