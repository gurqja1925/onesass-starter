'use client'

/**
 * 부동산 랜딩 페이지 템플릿
 * Real Estate Landing Page
 */

import { useState } from 'react'
import { Play, MapPin, Home, Key, TrendingUp, Phone, Mail, ChevronRight, Star, Check } from 'lucide-react'

interface Property {
  id: string
  title: string
  location: string
  price: string
  image: string
  beds: number
  baths: number
  sqft: string
  tag?: string
}

interface LandingRealEstateProps {
  brandName?: string
  tagline?: string
  heroVideo?: string
  heroImage?: string
  properties?: Property[]
  stats?: { value: string; label: string }[]
  testimonials?: { name: string; role: string; content: string; avatar: string; rating: number }[]
}

const defaultProperties: Property[] = [
  {
    id: '1',
    title: '한강뷰 프리미엄 아파트',
    location: '서울 용산구 이촌동',
    price: '15억 5,000만',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
    beds: 3,
    baths: 2,
    sqft: '112㎡',
    tag: '추천'
  },
  {
    id: '2',
    title: '강남 신축 오피스텔',
    location: '서울 강남구 역삼동',
    price: '8억 2,000만',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
    beds: 2,
    baths: 1,
    sqft: '68㎡',
    tag: '신규'
  },
  {
    id: '3',
    title: '판교 테크노밸리 타운하우스',
    location: '경기 성남시 분당구',
    price: '12억 8,000만',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
    beds: 4,
    baths: 3,
    sqft: '185㎡'
  },
  {
    id: '4',
    title: '해운대 오션뷰 펜트하우스',
    location: '부산 해운대구 우동',
    price: '22억',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop',
    beds: 5,
    baths: 4,
    sqft: '245㎡',
    tag: '프리미엄'
  }
]

const defaultTestimonials = [
  {
    name: '김성민',
    role: '신혼부부',
    content: '전문적인 상담과 함께 저희 예산에 딱 맞는 신혼집을 찾았어요. 계약부터 입주까지 모든 과정을 도와주셔서 정말 편했습니다.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5
  },
  {
    name: '박지영',
    role: '투자자',
    content: '수익률 좋은 물건을 추천받아 성공적인 투자를 했습니다. 시장 분석 데이터가 정말 유용했어요.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    rating: 5
  },
  {
    name: '이준혁',
    role: '사업가',
    content: '사무실 이전을 위해 상담받았는데, 회사 특성에 맞는 완벽한 공간을 찾아주셨습니다. 감사합니다!',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5
  }
]

export function LandingRealEstate({
  brandName = '프라임부동산',
  tagline = '당신의 완벽한 공간을 찾아드립니다',
  heroVideo,
  heroImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop',
  properties = defaultProperties,
  stats = [
    { value: '1,200+', label: '거래 완료' },
    { value: '98%', label: '고객 만족도' },
    { value: '15년', label: '업력' },
    { value: '50+', label: '전문 상담사' }
  ],
  testimonials = defaultTestimonials
}: LandingRealEstateProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'sale' | 'rent'>('all')

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Hero Section with Video/Image */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
          {heroVideo && isVideoPlaying ? (
            <video
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              src={heroVideo}
            />
          ) : (
            <img
              src={heroImage}
              alt="Hero"
              className="w-full h-full object-cover"
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(var(--color-bg-rgb), 0.95), rgba(var(--color-bg-rgb), 0.7))'
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-32">
          <div className="max-w-2xl">
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              대한민국 1위 부동산 플랫폼
            </span>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {tagline}
            </h1>

            <p
              className="text-xl mb-8 leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              15년의 경험과 1,200건 이상의 성공적인 거래.
              {brandName}과 함께라면 완벽한 부동산을 찾을 수 있습니다.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                무료 상담 신청
              </button>

              {heroVideo && (
                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-3"
                  style={{
                    background: 'transparent',
                    border: '2px solid var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                >
                  <Play className="w-5 h-5" />
                  영상 보기
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {stat.value}
                  </p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-8 h-8 rotate-90" style={{ color: 'var(--color-text-secondary)' }} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              왜 우리를 선택해야 할까요?
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {brandName}만의 차별화된 서비스
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: MapPin, title: '지역 전문가', desc: '각 지역의 특성을 완벽히 파악한 전문 상담사가 배치되어 있습니다.' },
              { icon: Home, title: '엄선된 매물', desc: '철저한 검증을 거친 프리미엄 매물만 소개해 드립니다.' },
              { icon: Key, title: '원스톱 서비스', desc: '계약부터 입주까지 모든 과정을 한 번에 해결합니다.' },
              { icon: TrendingUp, title: '투자 분석', desc: '빅데이터 기반 시세 분석과 투자 수익률을 제공합니다.' }
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl transition-all hover:scale-105"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)'
                }}
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

      {/* Properties Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
                추천 매물
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                엄선된 프리미엄 매물
              </h2>
            </div>

            <div className="flex gap-2 mt-6 md:mt-0">
              {(['all', 'sale', 'rent'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-6 py-3 rounded-xl font-medium transition-all"
                  style={{
                    background: activeTab === tab ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                    color: activeTab === tab ? 'var(--color-bg)' : 'var(--color-text)'
                  }}
                >
                  {tab === 'all' ? '전체' : tab === 'sale' ? '매매' : '임대'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="rounded-2xl overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  {property.tag && (
                    <span
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      {property.tag}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <p
                    className="text-sm flex items-center gap-1 mb-2"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </p>
                  <h3 className="font-bold text-lg mb-3">{property.title}</h3>
                  <p
                    className="text-2xl font-bold mb-4"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {property.price}
                  </p>
                  <div
                    className="flex gap-4 text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <span>{property.beds}베드</span>
                    <span>{property.baths}배스</span>
                    <span>{property.sqft}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              className="px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
              style={{
                background: 'transparent',
                border: '2px solid var(--color-accent)',
                color: 'var(--color-accent)'
              }}
            >
              모든 매물 보기 →
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              고객 후기
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              고객님들의 생생한 후기
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-5 h-5 fill-current"
                      style={{ color: 'var(--color-accent)' }}
                    />
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  "{t.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8">
        <div
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl"
          style={{
            background: 'var(--color-accent)',
          }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: 'var(--color-bg)', fontFamily: 'var(--font-display)' }}
          >
            지금 바로 상담받으세요
          </h2>
          <p
            className="text-xl mb-8 opacity-90"
            style={{ color: 'var(--color-bg)' }}
          >
            전문 상담사가 당신의 완벽한 공간을 찾아드립니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{
                background: 'var(--color-bg)',
                color: 'var(--color-accent)'
              }}
            >
              <Phone className="w-5 h-5" />
              1588-0000
            </button>
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{
                background: 'transparent',
                border: '2px solid var(--color-bg)',
                color: 'var(--color-bg)'
              }}
            >
              <Mail className="w-5 h-5" />
              온라인 문의
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
