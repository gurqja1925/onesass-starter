'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useAuth } from '@/onesaas-core/auth/provider'
import { getEnabledProviders, PROVIDER_META } from '@/onesaas-core/auth/config'
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

  const { signIn, signUp, signInWithProvider } = useAuth()
  const providers = getEnabledProviders()
  const hasEmail = providers.includes('email')
  const hasSocial = providers.some((p) => p !== 'email')
  const socialProviders = providers.filter((p) => p !== 'email')
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
  }, [])

  if (!isOpen || !mounted) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 먼저 로그인 시도
    const { error: signInError } = await signIn(email, password)

    if (signInError) {
      // 로그인 실패하면 자동으로 회원가입 시도
      const { error: signUpError } = await signUp(email, password)
      if (signUpError) {
        setError('로그인/회원가입에 실패했습니다. 다시 시도해주세요.')
        setLoading(false)
      } else {
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
        window.location.href = redirectUrl
      }
    } else {
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
      window.location.href = redirectUrl
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'kakao' | 'github') => {
    await signInWithProvider(provider, { redirectTo: redirectUrl })
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl px-8 pt-16 pb-8 my-auto"
        style={{
          background: '#18181b',
          border: '1px solid #27272a',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:opacity-70 transition-all z-10"
          style={{
            color: '#fafafa',
            background: '#27272a',
            border: '1px solid #3f3f46'
          }}
        >
          <X className="w-5 h-5" />
        </button>


        {/* Social Login */}
        {hasSocial && (
          <div className="space-y-2 mb-6">
            {socialProviders.map((provider) => {
              const meta = PROVIDER_META[provider]
              return (
                <button
                  key={provider}
                  onClick={() => handleSocialLogin(provider as 'google' | 'kakao' | 'github')}
                  className="w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90"
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
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>또는</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>
        )}

        {/* Email Form */}
        {hasEmail && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{ background: 'var(--color-error)', color: 'white' }}
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
                  background: '#09090b',
                  border: '1px solid #27272a',
                  color: '#fafafa',
                }}
                placeholder="이메일"
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
                  background: '#09090b',
                  border: '1px solid #27272a',
                  color: '#fafafa',
                }}
                placeholder="비밀번호"
                required
                minLength={6}
              />
            </div>

            {/* 이메일 기억하기 */}
            <div className="flex items-center">
              <input
                id="remember-email"
                type="checkbox"
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
                className="w-4 h-4 rounded transition-all cursor-pointer"
                style={{
                  accentColor: 'var(--color-accent)',
                }}
              />
              <label
                htmlFor="remember-email"
                className="ml-2 text-sm cursor-pointer select-none"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                이메일 기억하기
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold transition-all disabled:opacity-50 hover:opacity-90"
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-bg)',
              }}
            >
              {loading ? '처리 중...' : '시작하기'}
            </button>
          </form>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
