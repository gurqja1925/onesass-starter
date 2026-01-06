'use client'

/**
 * 이커머스 랜딩 페이지 템플릿
 * Ecommerce Landing Page
 */

import { useState } from 'react'
import { ShoppingBag, Truck, Shield, RefreshCw, Star, Heart, ShoppingCart, ArrowRight, Minus, Plus } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  tag?: string
}

interface LandingEcommerceProps {
  brandName?: string
  tagline?: string
  heroImage?: string
  products?: Product[]
  categories?: string[]
}

const defaultProducts: Product[] = [
  {
    id: '1',
    name: '프리미엄 가죽 토트백',
    price: 189000,
    originalPrice: 289000,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
    category: '가방',
    rating: 4.9,
    reviews: 324,
    tag: 'BEST'
  },
  {
    id: '2',
    name: '캐시미어 니트 스웨터',
    price: 159000,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
    category: '의류',
    rating: 4.8,
    reviews: 156
  },
  {
    id: '3',
    name: '미니멀 워치 골드',
    price: 249000,
    originalPrice: 349000,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop',
    category: '액세서리',
    rating: 4.9,
    reviews: 89,
    tag: 'NEW'
  },
  {
    id: '4',
    name: '클래식 선글라스',
    price: 89000,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop',
    category: '액세서리',
    rating: 4.7,
    reviews: 201
  },
  {
    id: '5',
    name: '핸드메이드 스니커즈',
    price: 219000,
    originalPrice: 299000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
    category: '신발',
    rating: 4.8,
    reviews: 412,
    tag: 'SALE'
  },
  {
    id: '6',
    name: '실크 스카프',
    price: 79000,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop',
    category: '액세서리',
    rating: 4.6,
    reviews: 98
  },
  {
    id: '7',
    name: '울 코트',
    price: 459000,
    originalPrice: 599000,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=600&fit=crop',
    category: '의류',
    rating: 4.9,
    reviews: 67,
    tag: 'BEST'
  },
  {
    id: '8',
    name: '가죽 벨트',
    price: 69000,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
    category: '액세서리',
    rating: 4.5,
    reviews: 143
  }
]

export function LandingEcommerce({
  brandName = '루미에르',
  tagline = '당신만의 스타일을 완성하세요',
  heroImage = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=1080&fit=crop',
  products = defaultProducts,
  categories = ['전체', '의류', '가방', '신발', '액세서리']
}: LandingEcommerceProps) {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [cart, setCart] = useState<string[]>([])

  const filteredProducts = selectedCategory === '전체'
    ? products
    : products.filter(p => p.category === selectedCategory)

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(var(--color-bg-rgb), 0.9), rgba(var(--color-bg-rgb), 0.3))' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-32">
          <div className="max-w-xl">
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              2024 NEW COLLECTION
            </span>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              {tagline}
            </h1>

            <p className="text-xl mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              {brandName}에서 엄선한 프리미엄 컬렉션을 만나보세요.
              무료 배송, 30일 무료 반품.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                쇼핑하기
              </button>
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                style={{ background: 'transparent', border: '2px solid var(--color-text)', color: 'var(--color-text)' }}
              >
                컬렉션 보기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: '무료 배송', desc: '5만원 이상 구매시' },
              { icon: RefreshCw, title: '30일 반품', desc: '무료 반품 서비스' },
              { icon: Shield, title: '정품 보장', desc: '100% 정품만 취급' },
              { icon: ShoppingBag, title: '선물 포장', desc: '무료 선물 포장' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4">
                <feature.icon className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
                <div>
                  <p className="font-bold">{feature.title}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
                Products
              </p>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                베스트 셀러
              </h2>
            </div>
            <div className="flex gap-2 mt-6 md:mt-0 flex-wrap">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-110"
                  />
                  {product.tag && (
                    <span
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: product.tag === 'SALE' ? '#ef4444' : 'var(--color-accent)',
                        color: 'white'
                      }}
                    >
                      {product.tag}
                    </span>
                  )}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: 'var(--color-bg)' }}
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <button
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" style={{ color: 'var(--color-accent)' }} />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      ({product.reviews})
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xl" style={{ color: 'var(--color-accent)' }}>
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm line-through" style={{ color: 'var(--color-text-secondary)' }}>
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              더 많은 상품 보기 <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-24 px-8" style={{ background: 'var(--color-accent)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-6"
                style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
              >
                LIMITED OFFER
              </span>
              <h2
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ color: 'var(--color-bg)', fontFamily: 'var(--font-display)' }}
              >
                첫 구매 20% 할인
              </h2>
              <p className="text-xl mb-8 opacity-90" style={{ color: 'var(--color-bg)' }}>
                회원 가입하고 첫 주문에서 20% 할인 받으세요.
                뉴스레터 구독자에게는 추가 5% 할인!
              </p>
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="이메일 주소"
                  className="flex-1 px-6 py-4 rounded-xl"
                  style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
                />
                <button
                  className="px-6 py-4 rounded-xl font-bold transition-all hover:scale-105"
                  style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
                >
                  구독하기
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=600&fit=crop"
                alt="Promo"
                className="rounded-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              @{brandName.toLowerCase()}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              인스타그램
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=400&fit=crop'
            ].map((img, i) => (
              <div key={i} className="rounded-2xl overflow-hidden cursor-pointer group">
                <img
                  src={img}
                  alt={`Instagram ${i + 1}`}
                  className="w-full aspect-square object-cover transition-transform group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
