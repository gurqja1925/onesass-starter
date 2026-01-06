'use client'

/**
 * 이벤트/웨딩 랜딩 페이지 템플릿
 * Event Landing Page
 */

import { useState } from 'react'
import { Play, Calendar, MapPin, Clock, Users, Heart, Sparkles, Camera, Music, Star, Phone, Mail } from 'lucide-react'

interface Package {
  id: string
  name: string
  price: string
  features: string[]
  popular?: boolean
}

interface Gallery {
  image: string
  category: string
}

interface LandingEventProps {
  brandName?: string
  tagline?: string
  heroVideo?: string
  heroImage?: string
  packages?: Package[]
  gallery?: Gallery[]
  testimonials?: { name: string; event: string; content: string; avatar: string }[]
}

const defaultPackages: Package[] = [
  {
    id: '1',
    name: '심플 웨딩',
    price: '300만원~',
    features: [
      '기본 홀 대관 (4시간)',
      '기본 플로리스트',
      '사진 촬영 (300컷)',
      '신부대기실',
      '주차 50대'
    ]
  },
  {
    id: '2',
    name: '프리미엄 웨딩',
    price: '600만원~',
    popular: true,
    features: [
      '프리미엄 홀 대관 (6시간)',
      '시그니처 플로리스트',
      '사진 + 영상 촬영',
      'VIP 대기실',
      '헤어/메이크업',
      '주차 100대',
      '리허설 1회'
    ]
  },
  {
    id: '3',
    name: '럭셔리 웨딩',
    price: '1,200만원~',
    features: [
      '전관 대관 (8시간)',
      '해외 유명 플로리스트',
      '시네마틱 영상 제작',
      '전담 웨딩 플래너',
      '케이터링 풀 서비스',
      '라이브 밴드',
      '숙박 제공'
    ]
  }
]

const defaultGallery: Gallery[] = [
  { image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop', category: '웨딩' },
  { image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop', category: '웨딩' },
  { image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop', category: '파티' },
  { image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop', category: '컨퍼런스' },
  { image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop', category: '컨퍼런스' },
  { image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop', category: '파티' }
]

const defaultTestimonials = [
  {
    name: '김민지 & 이준호',
    event: '2024년 봄 웨딩',
    content: '평생 잊지 못할 완벽한 결혼식이었어요. 세심한 부분까지 신경 써주신 플래너님께 정말 감사드립니다.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
  },
  {
    name: '테크스타트업',
    event: '연말 파티',
    content: '300명 규모의 회사 파티를 완벽하게 진행해주셨어요. 직원들 모두 만족했습니다!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    name: '박서연 & 최현우',
    event: '2023년 가을 웨딩',
    content: '꿈에 그리던 야외 웨딩을 현실로 만들어주셨어요. 모든 순간이 마법 같았습니다.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
  }
]

export function LandingEvent({
  brandName = '블리스 웨딩',
  tagline = '특별한 순간을 영원히',
  heroVideo,
  heroImage = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop',
  packages = defaultPackages,
  gallery = defaultGallery,
  testimonials = defaultTestimonials
}: LandingEventProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const categories = ['전체', ...new Set(gallery.map(g => g.category))]
  const filteredGallery = selectedCategory === '전체'
    ? gallery
    : gallery.filter(g => g.category === selectedCategory)

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
            style={{ background: 'linear-gradient(to bottom, rgba(var(--color-bg-rgb), 0.3), rgba(var(--color-bg-rgb), 0.9))' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-32 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            {tagline}
          </h1>

          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            {brandName}에서 인생에서 가장 빛나는 순간을 만들어 드립니다.
            웨딩, 기업 행사, 프라이빗 파티까지.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              상담 예약하기
            </button>
            {heroVideo && (
              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-3"
                style={{ background: 'transparent', border: '2px solid var(--color-text)', color: 'var(--color-text)' }}
              >
                <Play className="w-5 h-5" />
                영상 보기
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Sparkles, title: '맞춤 디자인', desc: '당신만의 유니크한 컨셉' },
              { icon: Camera, title: '프리미엄 촬영', desc: '최고의 포토그래퍼 팀' },
              { icon: Music, title: '라이브 공연', desc: '감동의 라이브 무대' },
              { icon: Users, title: '전담 플래너', desc: 'A to Z 케어 서비스' }
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--color-accent)' }}
                >
                  <feature.icon className="w-8 h-8" style={{ color: 'var(--color-bg)' }} />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
                About Us
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
                10년의 노하우로<br />특별함을 더합니다
              </h2>
              <p className="text-lg mb-6 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                2014년부터 시작된 {brandName}은 1,500건 이상의 행사를 성공적으로 진행했습니다.
                웨딩, 기업 행사, 프라이빗 파티까지 모든 순간을 완벽하게 만들어 드립니다.
              </p>
              <div className="grid grid-cols-3 gap-8">
                {[
                  { value: '1,500+', label: '성공 행사' },
                  { value: '98%', label: '만족도' },
                  { value: '10년', label: '경력' }
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>{stat.value}</p>
                    <p style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=500&fit=crop"
                alt="Event"
                className="rounded-2xl w-full h-full object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=500&fit=crop"
                alt="Event"
                className="rounded-2xl w-full h-full object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              Packages
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              웨딩 패키지
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-2xl p-8 ${pkg.popular ? 'scale-105' : ''}`}
                style={{
                  background: pkg.popular ? 'var(--color-accent)' : 'var(--color-bg)',
                  border: pkg.popular ? 'none' : '1px solid var(--color-border)'
                }}
              >
                {pkg.popular && (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
                    style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
                  >
                    인기
                  </span>
                )}
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: pkg.popular ? 'var(--color-bg)' : 'var(--color-text)' }}
                >
                  {pkg.name}
                </h3>
                <p
                  className="text-3xl font-bold mb-6"
                  style={{ color: pkg.popular ? 'var(--color-bg)' : 'var(--color-accent)' }}
                >
                  {pkg.price}
                </p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2"
                      style={{ color: pkg.popular ? 'var(--color-bg)' : 'var(--color-text-secondary)' }}
                    >
                      <Heart className="w-4 h-4 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 rounded-xl font-bold transition-all hover:scale-105"
                  style={{
                    background: pkg.popular ? 'var(--color-bg)' : 'var(--color-accent)',
                    color: pkg.popular ? 'var(--color-accent)' : 'var(--color-bg)'
                  }}
                >
                  상담 신청
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
                Gallery
              </p>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                포트폴리오
              </h2>
            </div>
            <div className="flex gap-2 mt-6 md:mt-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: selectedCategory === cat ? 'var(--color-accent)' : 'transparent',
                    color: selectedCategory === cat ? 'var(--color-bg)' : 'var(--color-text)',
                    border: `1px solid ${selectedCategory === cat ? 'var(--color-accent)' : 'var(--color-border)'}`
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {filteredGallery.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={item.image}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-64 object-cover transition-transform group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              Reviews
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              고객 후기
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-current" style={{ color: 'var(--color-accent)' }} />
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  "{t.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-sm" style={{ color: 'var(--color-accent)' }}>{t.event}</p>
                  </div>
                </div>
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
            당신의 특별한 날을 함께하겠습니다
          </h2>
          <p className="text-xl mb-8 opacity-90" style={{ color: 'var(--color-bg)' }}>
            무료 상담으로 시작하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
            >
              <Calendar className="w-5 h-5" />
              상담 예약
            </button>
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{ background: 'transparent', border: '2px solid var(--color-bg)', color: 'var(--color-bg)' }}
            >
              <Phone className="w-5 h-5" />
              02-1234-5678
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
