'use client'

/**
 * 금융/핀테크 랜딩 페이지 템플릿
 * Finance Landing Page
 */

import { useState } from 'react'
import { Play, TrendingUp, Shield, Wallet, PieChart, Lock, Smartphone, CreditCard, BarChart3, ArrowRight, Check } from 'lucide-react'

interface LandingFinanceProps {
  brandName?: string
  tagline?: string
  heroVideo?: string
  heroImage?: string
}

export function LandingFinance({
  brandName = '스마트뱅크',
  tagline = '금융의 새로운 기준',
  heroVideo,
  heroImage = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop'
}: LandingFinanceProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          {heroVideo && isVideoPlaying ? (
            <video autoPlay muted loop className="w-full h-full object-cover" src={heroVideo} />
          ) : (
            <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
          )}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(var(--color-bg-rgb), 0.98) 0%, rgba(var(--color-bg-rgb), 0.85) 100%)' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
                <span className="font-bold text-xl">{brandName}</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                {tagline}
              </h1>

              <p className="text-xl mb-8 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                연 5% 이자, 수수료 무료, 실시간 자산 관리.
                100만 명이 선택한 스마트한 금융 서비스를 경험하세요.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <button
                  className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  무료로 시작하기
                </button>
                {heroVideo && (
                  <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-3"
                    style={{ background: 'transparent', border: '2px solid var(--color-border)', color: 'var(--color-text)' }}
                  >
                    <Play className="w-5 h-5" />
                    서비스 소개
                  </button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Shield, text: '금융위원회 인가' },
                  { icon: Lock, text: '256bit 암호화' },
                  { icon: Smartphone, text: 'ISO 27001 인증' }
                ].map((badge, i) => (
                  <span key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <badge.icon className="w-4 h-4" /> {badge.text}
                  </span>
                ))}
              </div>
            </div>

            {/* App Preview */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
                style={{ background: 'var(--color-accent)' }}
              />
              <img
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=800&fit=crop"
                alt="App"
                className="relative rounded-3xl w-full max-w-sm mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-8" style={{ background: 'var(--color-accent)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '100만+', label: '가입자' },
              { value: '5조원+', label: '누적 거래액' },
              { value: '연 5%', label: '예금 이자' },
              { value: '0원', label: '수수료' }
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl font-bold mb-2" style={{ color: 'var(--color-bg)' }}>{stat.value}</p>
                <p className="opacity-80" style={{ color: 'var(--color-bg)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              주요 기능
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              왜 {brandName}인가요?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Wallet,
                title: '고금리 예금',
                desc: '연 5% 파격 이자율. 매일 이자가 쌓이는 것을 확인하세요.'
              },
              {
                icon: CreditCard,
                title: '수수료 무료',
                desc: '이체, ATM 출금, 해외 결제 모든 수수료가 무료입니다.'
              },
              {
                icon: PieChart,
                title: '자산 분석',
                desc: 'AI가 분석하는 내 소비 패턴과 맞춤 절약 제안.'
              },
              {
                icon: BarChart3,
                title: '투자 연계',
                desc: '주식, ETF, 펀드까지 한 앱에서 간편하게.'
              },
              {
                icon: Shield,
                title: '철저한 보안',
                desc: '생체 인증, 이상 거래 탐지, 24시간 모니터링.'
              },
              {
                icon: Smartphone,
                title: '간편한 UX',
                desc: '3초 만에 이체 완료. 누구나 쉽게 사용할 수 있습니다.'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl transition-all hover:scale-105"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'var(--color-accent)' }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: 'var(--color-bg)' }} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              시작 방법
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              3분이면 충분합니다
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: '앱 다운로드', desc: 'App Store 또는 Play Store에서 무료 다운로드' },
              { step: '02', title: '본인 인증', desc: '신분증 촬영으로 간편하게 본인 인증 완료' },
              { step: '03', title: '바로 사용', desc: '계좌 개설 즉시 모든 서비스 이용 가능' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              요금제
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              투명한 가격 정책
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: '베이직',
                price: '무료',
                features: ['기본 예금 (연 3%)', '무제한 이체', 'ATM 월 5회 무료', '기본 자산 분석']
              },
              {
                name: '프리미엄',
                price: '월 9,900원',
                popular: true,
                features: ['고금리 예금 (연 5%)', '무제한 이체', 'ATM 무제한 무료', 'AI 자산 분석', '해외 결제 무료', '전담 상담사']
              },
              {
                name: '비즈니스',
                price: '월 29,900원',
                features: ['프리미엄 전체', '법인 계좌', '급여 자동 이체', '세무 리포트', 'API 연동', '우선 고객 지원']
              }
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 ${plan.popular ? 'scale-105' : ''}`}
                style={{
                  background: plan.popular ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                  border: plan.popular ? 'none' : '1px solid var(--color-border)'
                }}
              >
                {plan.popular && (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
                    style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
                  >
                    인기
                  </span>
                )}
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: plan.popular ? 'var(--color-bg)' : 'var(--color-text)' }}
                >
                  {plan.name}
                </h3>
                <p
                  className="text-3xl font-bold mb-6"
                  style={{ color: plan.popular ? 'var(--color-bg)' : 'var(--color-accent)' }}
                >
                  {plan.price}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2"
                      style={{ color: plan.popular ? 'var(--color-bg)' : 'var(--color-text-secondary)' }}
                    >
                      <Check className="w-5 h-5" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 rounded-xl font-bold transition-all hover:scale-105"
                  style={{
                    background: plan.popular ? 'var(--color-bg)' : 'var(--color-accent)',
                    color: plan.popular ? 'var(--color-accent)' : 'var(--color-bg)'
                  }}
                >
                  시작하기
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8" style={{ background: 'var(--color-accent)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: 'var(--color-bg)', fontFamily: 'var(--font-display)' }}
          >
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 opacity-90" style={{ color: 'var(--color-bg)' }}>
            가입만 해도 5,000원 즉시 지급
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
              style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
            >
              앱 다운로드
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
