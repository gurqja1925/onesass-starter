'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/onesaas-core/auth/provider'
import { PROVIDER_META, type AuthProviderType } from '@/onesaas-core/auth/config'
import { getAppName, getAppIcon } from '@/lib/branding'

function SignupPageContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [providers, setProviders] = useState<AuthProviderType[]>([])
  const [providersLoading, setProvidersLoading] = useState(true)

  const searchParams = useSearchParams()
  const router = useRouter()
  const plan = searchParams.get('plan') || ''
  const redirectUrl = plan ? `/service?plan=${plan}` : '/service'
  const { signUp, signInWithProvider } = useAuth()

  const hasEmail = providers.includes('email')
  const socialProviders = providers.filter((p) => p !== 'email') as ('google' | 'kakao' | 'github')[]
  const appName = getAppName()
  const appIcon = getAppIcon()

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/auth/providers')
        if (response.ok) {
          const data = await response.json()
          const providerList = Array.isArray(data.providers)
            ? data.providers
            : Object.keys(data.providers || {}).filter((key) => data.providers[key])
          setProviders(providerList.length > 0 ? providerList : [])
        } else {
          // API 응답이 올바르지 않으면 빈 배열 유지
          setProviders([])
        }
      } catch (error) {
        console.error('프로바이더 목록 로드 실패:', error)
        // 에러 시에도 빈 배열 유지
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

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.')
      setLoading(false)
      return
    }

    const { error: signUpError } = await signUp(email, password)

    if (signUpError) {
      setError('회원가입에 실패했습니다. 이메일을 확인해주세요.')
      setLoading(false)
      return
    }

    if (typeof window !== 'undefined') {
      window.location.href = redirectUrl
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'kakao' | 'github') => {
    setLoading(true)
    setError('')

    try {
      await signInWithProvider(provider)
    } catch (error) {
      setError(`${PROVIDER_META[provider].name} 로그인에 실패했습니다.`)
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'var(--color-bg)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto'
      }}>
        {/* 헤더 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{appIcon}</div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'var(--color-text)',
            marginBottom: '0.5rem'
          }}>
            {appName}에 <span style={{ color: 'var(--color-accent)' }}>가입</span>하기
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)'
          }}>
            새로운 계정을 만들어 시작하세요
          </p>
        </div>

        {/* 회원가입 카드 */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          {providersLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  border: '4px solid var(--color-border)',
                  borderTop: '4px solid var(--color-accent)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }}
              />
            </div>
          ) : (
            <>
              {/* 소셜 회원가입 */}
              {socialProviders.length > 0 && (
                <div style={{ marginBottom: hasEmail ? '2rem' : '0' }}>
                  {socialProviders.map((provider) => {
                    const meta = PROVIDER_META[provider]
                    return (
                      <button
                        key={provider}
                        onClick={() => handleOAuthLogin(provider)}
                        disabled={loading}
                        style={{
                          width: '100%',
                          backgroundColor: meta.bgColor,
                          color: meta.color,
                          padding: '1rem 2rem',
                          fontSize: '1.125rem',
                          fontWeight: 'bold',
                          borderRadius: '0.75rem',
                          border: 'none',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.75rem',
                          marginBottom: '0.75rem',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          opacity: loading ? 0.6 : 1
                        }}
                        onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <span style={{ fontSize: '1.5rem' }}>{meta.icon}</span>
                        <span>{meta.name}로 시작하기</span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* 구분선 */}
              {hasEmail && socialProviders.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  margin: '2rem 0'
                }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                  <span style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)'
                  }}>
                    또는 이메일로 가입
                  </span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                </div>
              )}

              {/* 이메일 회원가입 폼 */}
              {hasEmail && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--color-text)',
                      marginBottom: '0.5rem'
                    }}>
                      이메일
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        borderRadius: '0.75rem',
                        border: '2px solid var(--color-border)',
                        background: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                      }}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--color-text)',
                      marginBottom: '0.5rem'
                    }}>
                      비밀번호
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        borderRadius: '0.75rem',
                        border: '2px solid var(--color-border)',
                        background: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                      }}
                      placeholder="최소 8자 이상"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--color-text)',
                      marginBottom: '0.5rem'
                    }}>
                      비밀번호 확인
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        borderRadius: '0.75rem',
                        border: '2px solid var(--color-border)',
                        background: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                      }}
                      placeholder="비밀번호를 다시 입력하세요"
                    />
                  </div>

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
                      transition: 'all 0.2s',
                      opacity: loading ? 0.6 : 1,
                      marginTop: '0.5rem',
                      boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)'
                    }}
                    onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {loading ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}>
                        <div
                          style={{
                            width: '1.25rem',
                            height: '1.25rem',
                            border: '2px solid var(--color-bg)',
                            borderTop: '2px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}
                        />
                        <span>처리 중...</span>
                      </div>
                    ) : (
                      '회원가입'
                    )}
                  </button>

                  {/* 로그인 링크 */}
                  <div style={{
                    textAlign: 'center',
                    marginTop: '1rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--color-border)'
                  }}>
                    <p style={{
                      color: 'var(--color-text-secondary)',
                      marginBottom: '1rem'
                    }}>
                      이미 계정이 있으신가요?
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push('/auth/login')}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'transparent',
                        color: 'var(--color-accent)',
                        fontSize: '1.125rem',
                        fontWeight: 'bold',
                        borderRadius: '0.75rem',
                        border: '2px solid var(--color-accent)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'var(--color-accent)'
                        e.currentTarget.style.color = 'var(--color-bg)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--color-accent)'
                      }}
                    >
                      로그인
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {/* 홈으로 돌아가기 */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-secondary)',
              fontSize: '0.95rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '0.5rem 1rem'
            }}
          >
            ← 홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
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
              width: '3rem',
              height: '3rem',
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
      <SignupPageContent />
    </Suspense>
  )
}
