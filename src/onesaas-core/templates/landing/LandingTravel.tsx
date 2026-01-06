'use client'

/**
 * 여행 랜딩 페이지 템플릿
 * Travel Landing Page
 */

import { useState } from 'react'
import { Play, Plane, MapPin, Calendar, Users, Star, Sun, Compass, Camera, Heart, ArrowRight } from 'lucide-react'

interface Destination {
  id: string
  name: string
  country: string
  image: string
  price: string
  duration: string
  rating: number
  popular?: boolean
}

interface LandingTravelProps {
  brandName?: string
  tagline?: string
  heroVideo?: string
  heroImage?: string
  destinations?: Destination[]
  features?: { icon: any; title: string; desc: string }[]
}

const defaultDestinations: Destination[] = [
  {
    id: '1',
    name: '발리 힐링 투어',
    country: '인도네시아',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop',
    price: '189만원~',
    duration: '5박 6일',
    rating: 4.9,
    popular: true
  },
  {
    id: '2',
    name: '파리 로맨틱 여행',
    country: '프랑스',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
    price: '289만원~',
    duration: '6박 7일',
    rating: 4.8,
    popular: true
  },
  {
    id: '3',
    name: '도쿄 미식 투어',
    country: '일본',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
    price: '89만원~',
    duration: '3박 4일',
    rating: 4.7
  },
  {
    id: '4',
    name: '스위스 알프스',
    country: '스위스',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop',
    price: '389만원~',
    duration: '7박 8일',
    rating: 4.9
  },
  {
    id: '5',
    name: '하와이 휴양',
    country: '미국',
    image: 'https://images.unsplash.com/photo-1507876466758-bc54f384809c?w=600&h=400&fit=crop',
    price: '249만원~',
    duration: '5박 6일',
    rating: 4.8
  },
  {
    id: '6',
    name: '몰디브 리조트',
    country: '몰디브',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop',
    price: '459만원~',
    duration: '4박 5일',
    rating: 5.0,
    popular: true
  }
]

export function LandingTravel({
  brandName = '트래블메이트',
  tagline = '꿈꾸던 여행을 현실로',
  heroVideo,
  heroImage = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&h=1080&fit=crop',
  destinations = defaultDestinations
}: LandingTravelProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [searchData, setSearchData] = useState({ destination: '', date: '', travelers: '' })

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

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-32 w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Plane className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
              <span className="font-bold text-xl">{brandName}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              {tagline}
            </h1>

            <p className="text-xl mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              전 세계 100개국 이상의 여행지. 최저가 보장과 24시간 고객 지원으로
              안심하고 떠나세요.
            </p>
          </div>

          {/* Search Box */}
          <div
            className="max-w-4xl mx-auto p-6 rounded-2xl"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
          >
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                <input
                  type="text"
                  placeholder="어디로 떠나시나요?"
                  className="w-full pl-12 pr-4 py-4 rounded-xl"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                <input
                  type="text"
                  placeholder="언제 떠나시나요?"
                  className="w-full pl-12 pr-4 py-4 rounded-xl"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                />
              </div>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                <input
                  type="text"
                  placeholder="인원수"
                  className="w-full pl-12 pr-4 py-4 rounded-xl"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                />
              </div>
              <button
                className="py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                검색하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Sun, title: '최저가 보장', desc: '동일 상품 최저가 발견 시 차액 환불' },
              { icon: Compass, title: '맞춤 여행', desc: '취향에 맞는 맞춤 코스 제안' },
              { icon: Camera, title: '현지 가이드', desc: '현지 전문 가이드와 함께하는 투어' },
              { icon: Heart, title: '안심 여행', desc: '24시간 긴급 지원 서비스' }
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

      {/* Popular Destinations */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
                인기 여행지
              </p>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                지금 가장 핫한 여행지
              </h2>
            </div>
            <button
              className="mt-6 md:mt-0 flex items-center gap-2 font-bold transition-all hover:gap-4"
              style={{ color: 'var(--color-accent)' }}
            >
              전체 보기 <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="rounded-2xl overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  {dest.popular && (
                    <span
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      인기
                    </span>
                  )}
                  <button
                    className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.9)' }}
                  >
                    <Heart className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{dest.country}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{dest.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" style={{ color: 'var(--color-accent)' }} />
                      <span className="font-medium">{dest.rating}</span>
                    </div>
                    <span style={{ color: 'var(--color-text-secondary)' }}>·</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{dest.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>
                      {dest.price}
                    </p>
                    <button
                      className="px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      자세히
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 px-8" style={{ background: 'var(--color-accent)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: 'var(--color-bg)', fontFamily: 'var(--font-display)' }}
          >
            특가 알림 받기
          </h2>
          <p className="text-xl mb-8 opacity-90" style={{ color: 'var(--color-bg)' }}>
            놓치면 후회할 특가 정보를 가장 먼저 받아보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="이메일 주소"
              className="flex-1 px-6 py-4 rounded-xl font-medium"
              style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
            />
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
              style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
            >
              구독하기
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
