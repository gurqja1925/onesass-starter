'use client'

/**
 * 레스토랑/카페 랜딩 페이지 템플릿
 * Restaurant Landing Page
 */

import { useState } from 'react'
import { Play, MapPin, Clock, Phone, Star, ChefHat, Wine, UtensilsCrossed, Calendar, ArrowRight } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  image: string
  category: string
  popular?: boolean
}

interface LandingRestaurantProps {
  brandName?: string
  tagline?: string
  heroVideo?: string
  heroImage?: string
  menuItems?: MenuItem[]
  chefs?: { name: string; role: string; image: string }[]
  gallery?: string[]
}

const defaultMenuItems: MenuItem[] = [
  {
    id: '1',
    name: '한우 등심 스테이크',
    description: '최상급 한우 등심을 특제 소스와 함께. 부드러운 식감이 일품',
    price: '89,000원',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&h=400&fit=crop',
    category: '스테이크',
    popular: true
  },
  {
    id: '2',
    name: '트러플 리조또',
    description: '이탈리아산 트러플과 아르보리오 쌀로 만든 크리미한 리조또',
    price: '42,000원',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=400&fit=crop',
    category: '파스타'
  },
  {
    id: '3',
    name: '랍스터 테르미도르',
    description: '통 랍스터에 치즈와 와인 소스를 더한 프렌치 클래식',
    price: '125,000원',
    image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&h=400&fit=crop',
    category: '시푸드',
    popular: true
  },
  {
    id: '4',
    name: '시그니처 디저트 플래터',
    description: '셰프 특선 디저트 3종 모음. 초콜릿 무스, 크렘 브륄레, 마카롱',
    price: '28,000원',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop',
    category: '디저트'
  }
]

const defaultChefs = [
  {
    name: '김정우',
    role: 'Executive Chef',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=500&fit=crop'
  },
  {
    name: '이미경',
    role: 'Pastry Chef',
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&h=500&fit=crop'
  }
]

const defaultGallery = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=600&h=400&fit=crop'
]

export function LandingRestaurant({
  brandName = '라 메종',
  tagline = '특별한 순간을 위한 미식 경험',
  heroVideo,
  heroImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop',
  menuItems = defaultMenuItems,
  chefs = defaultChefs,
  gallery = defaultGallery
}: LandingRestaurantProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const categories = ['전체', ...new Set(menuItems.map(item => item.category))]
  const filteredItems = selectedCategory === '전체'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory)

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
            style={{ background: 'linear-gradient(to top, rgba(var(--color-bg-rgb), 0.95), rgba(var(--color-bg-rgb), 0.3))' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-32 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <UtensilsCrossed className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            {brandName}
          </h1>

          <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            {tagline}
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              예약하기
            </button>
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
              style={{ background: 'transparent', border: '2px solid var(--color-text)', color: 'var(--color-text)' }}
            >
              메뉴 보기
            </button>
          </div>

          {/* Info Bar */}
          <div className="flex flex-wrap justify-center gap-8 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> 서울 강남구 청담동 123-45
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> 11:30 - 22:00 (월요일 휴무)
            </span>
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> 02-1234-5678
            </span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
                Our Story
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
                20년 전통의 미식 철학
              </h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                2004년 청담동에서 시작된 {brandName}은 프렌치 파인 다이닝의 정수를 보여드립니다.
                최상급 식재료와 셰프의 장인정신이 만나 매일 새로운 미식 경험을 선사합니다.
              </p>
              <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                미쉐린 2스타, 아시아 베스트 레스토랑 50 선정.
                특별한 날을 더욱 특별하게 만들어 드립니다.
              </p>
              <div className="flex gap-8">
                {[
                  { icon: Star, value: '미쉐린 2스타', label: '6년 연속' },
                  { icon: Wine, value: '500+', label: '와인 셀렉션' },
                  { icon: ChefHat, value: '20년', label: '전통' }
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <item.icon className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--color-accent)' }} />
                    <p className="font-bold">{item.value}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=500&fit=crop"
                alt="Restaurant"
                className="rounded-2xl w-full h-64 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=500&fit=crop"
                alt="Food"
                className="rounded-2xl w-full h-64 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-24 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              Menu
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              시그니처 메뉴
            </h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-6 py-2 rounded-full font-medium transition-all"
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

          <div className="grid md:grid-cols-2 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 p-6 rounded-2xl transition-all hover:scale-[1.02]"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div className="relative w-32 h-32 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {item.popular && (
                    <span
                      className="absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      인기
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl">{item.name}</h3>
                    <p className="font-bold" style={{ color: 'var(--color-accent)' }}>{item.price}</p>
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.description}
                  </p>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
                  >
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              className="inline-flex items-center gap-2 font-bold transition-all hover:gap-4"
              style={{ color: 'var(--color-accent)' }}
            >
              전체 메뉴 보기 <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Chefs Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              Our Chefs
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              장인의 손맛
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
            {chefs.map((chef, i) => (
              <div key={i} className="text-center">
                <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-2xl mb-1">{chef.name}</h3>
                <p style={{ color: 'var(--color-accent)' }}>{chef.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              Gallery
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              공간과 요리
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((img, i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <img
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className={`w-full object-cover hover:scale-110 transition-transform ${i === 0 ? 'h-full' : 'h-48'}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="py-24 px-8">
        <div
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl"
          style={{ background: 'var(--color-accent)' }}
        >
          <Calendar className="w-12 h-12 mx-auto mb-6" style={{ color: 'var(--color-bg)' }} />
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: 'var(--color-bg)', fontFamily: 'var(--font-display)' }}
          >
            예약하기
          </h2>
          <p className="text-xl mb-8 opacity-90" style={{ color: 'var(--color-bg)' }}>
            특별한 날, 특별한 경험을 예약하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
              style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
            >
              온라인 예약
            </button>
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{ background: 'transparent', border: '2px solid var(--color-bg)', color: 'var(--color-bg)' }}
            >
              <Phone className="w-5 h-5" /> 02-1234-5678
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
