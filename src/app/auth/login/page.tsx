'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/onesaas-core/auth/provider'
import { PROVIDER_META, type AuthProviderType } from '@/onesaas-core/auth/config'
import { getAppName, getAppIcon } from '@/lib/branding'

function LoginPageContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [providers, setProviders] = useState<AuthProviderType[]>([])
  const [providersLoading, setProvidersLoading] = useState(true)

  const searchParams = useSearchParams()
  const router = useRouter()
  const redirect = searchParams.get('redirect') || '/service'
  const { signIn, signInWithProvider } = useAuth()

  const hasEmail = providers.includes('email')
  const socialProviders = providers.filter((p) => p !== 'email') as ('google' | 'kakao' | 'github')[]
  const appName = getAppName()
  const appIcon = getAppIcon()

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch('/api/auth/providers')
        const data = await res.json()
        if (data.providers && Array.isArray(data.providers)) {
          setProviders(data.providers as AuthProviderType[])
        } else {
          setProviders([])
        }
      } catch (error) {
        console.error('Failed to fetch auth providers:', error)
        setProviders([])
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

    const { error: signInError } = await signIn(email, password)

    if (signInError) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
      setLoading(false)
      return
    }

    await new Promise(resolve => setTimeout(resolve, 500))
    window.location.href = redirect
  }

  const handleSocialLogin = async (provider: 'google' | 'kakao' | 'github') => {
    try {
      await signInWithProvider(provider)
    } catch (error) {
      console.error(`${provider} 로그인 실패:`, error)
    }
  }

  return (
    <div style={{
      background: 'var(--color-bg)',
      color: 'var(--color-text)',
      minHeight: '100vh'
    }}>
      <section style={{
        padding: '8rem 2rem 6rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{appIcon}</div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            lineHeight: '1.2',
            color: 'var(--color-text)'
          }}>
            {appName}에 <span style={{ color: 'var(--color-accent)' }}>로그인</span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            lineHeight: '1.75',
            color: 'var(--color-text-secondary)',
            marginBottom: '3rem'
          }}>
            계속하려면 로그인하세요
          </p>

          {/* 로딩 중 */}
          {providersLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  border: '4px solid var(--color-border)',
                  borderTop: '4px solid var(--color-accent)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}
              />
              <p style={{ color: 'var(--color-text-secondary)' }}>로딩 중...</p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              {/* OAuth 프로바이더 버튼들 */}
              {socialProviders.map((provider) => {
                const meta = PROVIDER_META[provider]
                return (
                  <button
                    key={provider}
                    onClick={() => handleSocialLogin(provider)}
                    style={{
                      backgroundColor: meta.bgColor,
                      color: meta.color,
                      padding: '1rem 2rem',
                      fontSize: '1.125rem',
                      fontWeight: 'bold',
                      borderRadius: '0.75rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{meta.icon}</span>
                    <span>{meta.name}로 로그인</span>
                  </button>
                )
              })}

              {/* 이메일 로그인 버튼 */}
              {hasEmail && (
                <>
                  <button
                    onClick={() => {
                      const emailForm = document.getElementById('email-form')
                      if (emailForm) {
                        emailForm.style.display = emailForm.style.display === 'none' ? 'flex' : 'none'
                      }
                    }}
                    style={{
                      background: 'var(--color-accent)',
                      color: 'var(--color-bg)',
                      padding: '1rem 2rem',
                      fontSize: '1.125rem',
                      fontWeight: 'bold',
                      borderRadius: '0.75rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <span style={{ fontSize: '1.5rem' }}>✉️</span>
                    <span>이메일로 로그인</span>
                  </button>

                  {/* 이메일 폼 (숨김) */}
                  <form
                    id="email-form"
                    onSubmit={handleSubmit}
                    style={{
                      display: 'none',
                      flexDirection: 'column',
                      gap: '1rem',
                      marginTop: '1rem'
                    }}
                  >
                    {error && (
                      <div style={{
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        fontSize: '0.875rem',
                        textAlign: 'center',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                      }}>
                        {error}
                      </div>
                    )}

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        borderRadius: '0.75rem',
                        border: '2px solid var(--color-border)',
                        background: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        fontSize: '1rem'
                      }}
                      placeholder="이메일"
                      required
                    />

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        borderRadius: '0.75rem',
                        border: '2px solid var(--color-border)',
                        background: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        fontSize: '1rem'
                      }}
                      placeholder="비밀번호"
                      required
                      minLength={6}
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'var(--color-accent)',
                        color: 'var(--color-bg)',
                        fontSize: '1.125rem',
                        fontWeight: 'bold',
                        borderRadius: '0.75rem',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                        boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)'
                      }}
                    >
                      {loading ? '로그인 중...' : '로그인'}
                    </button>
                  </form>
                </>
              )}

              {/* 회원가입 링크 */}
              <p style={{
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                marginTop: '1rem',
                fontSize: '0.95rem'
              }}>
                계정이 없으신가요?{' '}
                <a
                  href="/auth/signup"
                  style={{
                    color: 'var(--color-accent)',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  회원가입
                </a>
              </p>

              {/* 홈으로 돌아가기 */}
              <button
                onClick={() => router.push('/')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginTop: '1rem'
                }}
              >
                ← 홈으로 돌아가기
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{
        background: 'var(--color-bg)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '2rem',
              height: '2rem',
              border: '4px solid var(--color-border)',
              borderTop: '4px solid var(--color-accent)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}
          />
          <p style={{ color: 'var(--color-text-secondary)' }}>로딩 중...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
