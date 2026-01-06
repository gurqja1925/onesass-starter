'use client'

/**
 * LandingSaaS 템플릿
 * SaaS 랜딩 페이지 - 프리미엄 버전
 */

import { useState } from 'react'
import {
  Check, ArrowRight, Star, ChevronDown, Zap, Shield, Users,
  BarChart3, Globe, Clock, Play, Sparkles, TrendingUp, MessageSquare
} from 'lucide-react'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface PricingPlan {
  name: string
  price: number
  interval: string
  description: string
  features: string[]
  popular?: boolean
  cta: string
}

interface Testimonial {
  content: string
  author: string
  role: string
  company: string
  avatar?: string
}

interface LandingSaaSProps {
  heroTitle?: string
  heroSubtitle?: string
  features?: Feature[]
  pricing?: PricingPlan[]
  testimonials?: Testimonial[]
  className?: string
}

export function LandingSaaS({
  heroTitle,
  heroSubtitle,
  features,
  pricing,
  testimonials,
  className = '',
}: LandingSaaSProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const formatKRW = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount)
  }

  const defaultFeatures: Feature[] = features || [
    { icon: <Zap className="w-6 h-6" />, title: '빠른 시작', description: '5분 만에 시작할 수 있는 간편한 설정. 복잡한 설치 과정 없이 바로 사용하세요.' },
    { icon: <Shield className="w-6 h-6" />, title: '안전한 보안', description: '엔터프라이즈급 보안으로 데이터 보호. SOC2 인증 완료.' },
    { icon: <Users className="w-6 h-6" />, title: '팀 협업', description: '실시간 협업으로 생산성 향상. 팀원들과 함께 작업하세요.' },
    { icon: <BarChart3 className="w-6 h-6" />, title: '상세 분석', description: '데이터 기반 인사이트 제공. 비즈니스 성과를 한눈에 파악하세요.' },
    { icon: <Globe className="w-6 h-6" />, title: '글로벌 CDN', description: '전 세계 어디서나 빠른 속도. 99.99% 업타임 보장.' },
    { icon: <Clock className="w-6 h-6" />, title: '24/7 지원', description: '언제든 도움을 받을 수 있는 전담 지원팀. 평균 응답 시간 30분.' },
  ]

  const defaultPricing: PricingPlan[] = pricing || [
    {
      name: 'Starter',
      price: billingCycle === 'monthly' ? 29000 : 290000,
      interval: billingCycle === 'monthly' ? '/월' : '/년',
      description: '개인 또는 소규모 팀',
      features: ['사용자 3명', '10GB 저장공간', '기본 분석', '이메일 지원', 'API 접근'],
      cta: '무료로 시작',
    },
    {
      name: 'Pro',
      price: billingCycle === 'monthly' ? 79000 : 790000,
      interval: billingCycle === 'monthly' ? '/월' : '/년',
      description: '성장하는 비즈니스',
      features: ['사용자 무제한', '100GB 저장공간', '고급 분석', '우선 지원', 'API 접근', '커스텀 도메인', 'SSO 지원'],
      popular: true,
      cta: '시작하기',
    },
    {
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 199000 : 1990000,
      interval: billingCycle === 'monthly' ? '/월' : '/년',
      description: '대규모 조직',
      features: ['무제한 모든 기능', '전용 서버', '맞춤 분석', '전담 매니저', 'SLA 보장', '온프레미스 옵션', '감사 로그'],
      cta: '문의하기',
    },
  ]

  const defaultTestimonials: Testimonial[] = testimonials || [
    { content: '도입 후 업무 효율이 40% 이상 향상되었습니다. 정말 추천합니다. 특히 협업 기능이 탁월합니다.', author: '김철수', role: 'CTO', company: '테크스타트업' },
    { content: '사용하기 쉽고 고객 지원도 훌륭합니다. 최고의 선택이었습니다. 3년째 사용 중입니다.', author: '이영희', role: '대표', company: '디자인에이전시' },
    { content: '우리 팀의 협업 방식을 완전히 바꿔놓았습니다. 생산성이 눈에 띄게 향상되었어요.', author: '박민수', role: 'PM', company: '소프트웨어컴퍼니' },
  ]

  const stats = [
    { value: '10,000+', label: '활성 사용자' },
    { value: '50M+', label: '처리된 작업' },
    { value: '99.9%', label: '업타임' },
    { value: '4.9', label: '평점' },
  ]

  return (
    <div className={`${className}`} style={{ background: 'var(--color-bg)' }}>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* 배경 그라데이션 */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 255, 136, 0.3), transparent)',
          }}
        />
        <div
          className="absolute top-1/2 left-0 w-96 h-96 opacity-20 blur-3xl"
          style={{ background: 'var(--color-accent)' }}
        />
        <div
          className="absolute top-1/3 right-0 w-96 h-96 opacity-10 blur-3xl"
          style={{ background: '#8b5cf6' }}
        />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-pulse"
              style={{ background: 'rgba(0, 255, 136, 0.1)', color: 'var(--color-accent)', border: '1px solid rgba(0, 255, 136, 0.2)' }}
            >
              <Sparkles className="w-4 h-4" />
              신규 가입 시 첫 달 50% 할인
            </div>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
              style={{ color: 'var(--color-text)' }}
            >
              {heroTitle || (
                <>
                  비즈니스 성장을
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #8b5cf6 100%)',
                    }}
                  >
                    가속화
                  </span>하세요
                </>
              )}
            </h1>

            <p
              className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {heroSubtitle || '팀 협업, 프로젝트 관리, 데이터 분석까지. 하나의 플랫폼에서 모든 것을 해결하세요.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                className="group px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
                  color: '#000',
                  boxShadow: '0 0 40px rgba(0, 255, 136, 0.3)',
                }}
              >
                무료로 시작하기
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                className="px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--color-text)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Play className="w-5 h-5" /> 데모 영상 보기
              </button>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold mb-1" style={{ color: 'var(--color-accent)' }}>
                    {stat.value}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 목업 스크린샷 영역 */}
          <div
            className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,136,0.1), rgba(139,92,246,0.1))',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="p-4">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div
                className="aspect-video rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-bg-secondary)' }}
              >
                <div className="text-center p-8">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-accent)' }} />
                  <p className="text-lg font-medium" style={{ color: 'var(--color-text)' }}>
                    대시보드 미리보기
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                    실시간 데이터 분석 및 시각화
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span
              className="text-sm font-medium px-4 py-2 rounded-full mb-4 inline-block"
              style={{ background: 'rgba(0,255,136,0.1)', color: 'var(--color-accent)' }}
            >
              기능
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
              성공을 위한 모든 도구
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              비즈니스 성장에 필요한 모든 기능을 하나의 플랫폼에서 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {defaultFeatures.map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl transition-all hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,212,255,0.2))',
                    color: 'var(--color-accent)',
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                  {feature.title}
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span
              className="text-sm font-medium px-4 py-2 rounded-full mb-4 inline-block"
              style={{ background: 'rgba(0,255,136,0.1)', color: 'var(--color-accent)' }}
            >
              가격
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
              심플하고 투명한 가격
            </h2>
            <p className="text-lg mb-10" style={{ color: 'var(--color-text-secondary)' }}>
              숨겨진 비용 없이, 필요한 만큼만 지불하세요
            </p>

            <div
              className="inline-flex items-center gap-4 p-2 rounded-2xl"
              style={{ background: 'var(--color-bg)' }}
            >
              <button
                onClick={() => setBillingCycle('monthly')}
                className="px-6 py-3 rounded-xl font-medium transition-all"
                style={{
                  background: billingCycle === 'monthly' ? 'var(--color-accent)' : 'transparent',
                  color: billingCycle === 'monthly' ? 'var(--color-bg)' : 'var(--color-text)',
                }}
              >
                월간 결제
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
                style={{
                  background: billingCycle === 'yearly' ? 'var(--color-accent)' : 'transparent',
                  color: billingCycle === 'yearly' ? 'var(--color-bg)' : 'var(--color-text)',
                }}
              >
                연간 결제
                <span className="text-xs px-2 py-1 rounded-full bg-green-500 text-white">-17%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {defaultPricing.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-3xl transition-all hover:-translate-y-2 ${plan.popular ? 'ring-2' : ''}`}
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  ...(plan.popular && {
                    borderColor: 'var(--color-accent)',
                    boxShadow: '0 0 60px rgba(0, 255, 136, 0.2)',
                  }),
                }}
              >
                {plan.popular && (
                  <span
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 text-sm font-bold rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
                      color: '#000',
                    }}
                  >
                    가장 인기
                  </span>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    {plan.name}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <span className="text-5xl font-bold" style={{ color: 'var(--color-text)' }}>
                    ₩{formatKRW(plan.price)}
                  </span>
                  <span className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>{plan.interval}</span>
                </div>

                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3" style={{ color: 'var(--color-text)' }}>
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(0,255,136,0.2)' }}
                      >
                        <Check className="w-3 h-3" style={{ color: 'var(--color-accent)' }} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105"
                  style={{
                    background: plan.popular ? 'linear-gradient(135deg, #00ff88, #00d4ff)' : 'var(--color-bg-secondary)',
                    color: plan.popular ? '#000' : 'var(--color-text)',
                    border: plan.popular ? 'none' : '1px solid var(--color-border)',
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span
              className="text-sm font-medium px-4 py-2 rounded-full mb-4 inline-block"
              style={{ background: 'rgba(0,255,136,0.1)', color: 'var(--color-accent)' }}
            >
              고객 후기
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
              고객들이 말합니다
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {defaultTestimonials.map((testimonial, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl transition-all hover:-translate-y-2"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--color-text)' }}>
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,255,136,0.3), rgba(139,92,246,0.3))',
                      color: 'var(--color-text)',
                    }}
                  >
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--color-text)' }}>
                      {testimonial.author}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0, 255, 136, 0.3), transparent)',
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2
            className="text-3xl md:text-5xl font-bold mb-6"
            style={{ color: 'var(--color-text)' }}
          >
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-10" style={{ color: 'var(--color-text-secondary)' }}>
            14일 무료 체험. 신용카드 필요 없음. 언제든 취소 가능.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="group px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
                color: '#000',
                boxShadow: '0 0 40px rgba(0, 255, 136, 0.3)',
              }}
            >
              무료로 시작하기
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              className="px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
              style={{
                background: 'transparent',
                color: 'var(--color-text)',
                border: '2px solid var(--color-border)',
              }}
            >
              <MessageSquare className="w-5 h-5" />
              영업팀 문의
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
