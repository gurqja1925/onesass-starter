'use client'

import { useState } from 'react'
import AuthModal from '@/components/AuthModal'

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false)

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
            <button
              onClick={() => setShowAuthModal(true)}
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-bg)',
                padding: '1rem 3rem',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              무료로 시작하기
            </button>
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
            <button
              onClick={() => setShowAuthModal(true)}
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-bg)',
                padding: '1rem 2.5rem',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              시작하기
            </button>
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
