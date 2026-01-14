'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/onesaas-core/auth/provider'
import { PROVIDER_META, type AuthProviderType } from '@/onesaas-core/auth/config'
import AuthModal from '@/components/AuthModal'

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [providers, setProviders] = useState<AuthProviderType[]>([])
  const [providersLoading, setProvidersLoading] = useState(true)
  const { signInWithProvider } = useAuth()

  useEffect(() => {
    // DB에서 활성화된 프로바이더 목록 가져오기
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

  const handleProviderLogin = async (provider: 'google' | 'kakao' | 'github') => {
    try {
      await signInWithProvider(provider)
      // OAuth는 자동으로 리다이렉트됨
    } catch (error) {
      console.error(`${provider} 로그인 실패:`, error)
    }
  }

  const features = [
    {
      icon: '🚀',
      title: '샘플 특징 1',
      description: '빠르고 효율적인 시스템으로 생산성을 높입니다'
    },
    {
      icon: '💡',
      title: '샘플 특징 2',
      description: '직관적인 인터페이스로 누구나 쉽게 사용할 수 있습니다'
    },
    {
      icon: '🔒',
      title: '샘플 특징 3',
      description: '안전하고 신뢰할 수 있는 보안 시스템을 제공합니다'
    }
  ]

  const hasEmail = providers.includes('email')
  const socialProviders = providers.filter((p) => p !== 'email') as ('google' | 'kakao' | 'github')[]

  return (
    <>
      <div style={{
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        minHeight: '100vh'
      }}>
        {/* Hero Section */}
        <section style={{
          padding: '8rem 2rem 6rem',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              lineHeight: '1.2',
              color: 'var(--color-text)'
            }}>
              당신의 비즈니스를 위한<br />
              <span style={{ color: 'var(--color-accent)' }}>완벽한 솔루션</span>
            </h1>
            <p style={{
              fontSize: '1.25rem',
              lineHeight: '1.75',
              color: 'var(--color-text-secondary)',
              marginBottom: '3rem'
            }}>
              혁신적인 기술과 뛰어난 사용자 경험으로<br />
              비즈니스 성장을 가속화하세요
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
                      onClick={() => handleProviderLogin(provider)}
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
                      <span>{meta.name}로 시작하기</span>
                    </button>
                  )
                })}

                {/* 이메일 시작하기 버튼 */}
                {hasEmail && (
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.location.href = '/auth/signup'
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
                    <span>이메일로 시작하기</span>
                  </button>
                )}

                {/* 이미 계정이 있는 경우 */}
                <p style={{
                  textAlign: 'center',
                  color: 'var(--color-text-secondary)',
                  marginTop: '1rem',
                  fontSize: '0.95rem'
                }}>
                  이미 계정이 있으신가요?{' '}
                  <a
                    href="/auth/login"
                    style={{
                      color: 'var(--color-accent)',
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}
                  >
                    로그인
                  </a>
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section style={{
          padding: '4rem 2rem',
          background: 'var(--color-bg-secondary)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '1rem',
              color: 'var(--color-text)'
            }}>
              주요 특징
            </h2>
            <p style={{
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
              marginBottom: '4rem',
              fontSize: '1.125rem'
            }}>
              우리 서비스만의 특별한 장점을 경험하세요
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {features.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    padding: '2rem',
                    borderRadius: '1rem',
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem'
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '0.75rem',
                    color: 'var(--color-text)'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.6'
                  }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: '6rem 2rem 8rem',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '4rem 2rem',
            borderRadius: '1.5rem',
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: 'var(--color-text)'
            }}>
              지금 바로 시작하세요
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '2rem'
            }}>
              몇 분 안에 설정을 완료하고 바로 사용을 시작할 수 있습니다
            </p>

            {!providersLoading && (
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
                      onClick={() => handleProviderLogin(provider)}
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
                      <span>{meta.name}로 시작하기</span>
                    </button>
                  )
                })}

                {/* 이메일 시작하기 버튼 */}
                {hasEmail && (
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.location.href = '/auth/signup'
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
                    <span>이메일로 시작하기</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}
