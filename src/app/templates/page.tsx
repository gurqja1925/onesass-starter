'use client'

/**
 * 템플릿 쇼케이스 페이지
 * 모든 랜딩 페이지 템플릿을 미리볼 수 있습니다
 */

import Link from 'next/link'
import { Building2, GraduationCap, Dumbbell, UtensilsCrossed, Heart, Plane, TrendingUp, Palette, ShoppingBag, PartyPopper, Rocket, Zap } from 'lucide-react'

const templates = [
  {
    id: 'saas',
    name: 'SaaS',
    description: '소프트웨어 서비스 비즈니스용',
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
  },
  {
    id: 'startup',
    name: 'Startup',
    description: '스타트업 및 테크 기업용',
    icon: Rocket,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop'
  },
  {
    id: 'real-estate',
    name: '부동산',
    description: '부동산 중개, 분양, 임대용',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop'
  },
  {
    id: 'education',
    name: '교육/학원',
    description: '학원, 온라인 강의, 교육 서비스용',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop'
  },
  {
    id: 'fitness',
    name: '피트니스',
    description: '헬스장, PT, 요가 스튜디오용',
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop'
  },
  {
    id: 'restaurant',
    name: '레스토랑',
    description: '레스토랑, 카페, 다이닝용',
    icon: UtensilsCrossed,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop'
  },
  {
    id: 'healthcare',
    name: '의료/병원',
    description: '병원, 클리닉, 헬스케어 서비스용',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop'
  },
  {
    id: 'travel',
    name: '여행',
    description: '여행사, 투어, 숙박 서비스용',
    icon: Plane,
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop'
  },
  {
    id: 'finance',
    name: '금융/핀테크',
    description: '은행, 투자, 핀테크 서비스용',
    icon: TrendingUp,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'
  },
  {
    id: 'agency',
    name: '에이전시',
    description: '디자인 스튜디오, 마케팅 에이전시용',
    icon: Palette,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop'
  },
  {
    id: 'ecommerce',
    name: '이커머스',
    description: '온라인 쇼핑몰, 브랜드 스토어용',
    icon: ShoppingBag,
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop'
  },
  {
    id: 'event',
    name: '이벤트/웨딩',
    description: '웨딩홀, 이벤트 플래닝용',
    icon: PartyPopper,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop'
  }
]

export default function TemplatesPage() {
  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh' }}>
      {/* Header */}
      <header className="py-8 px-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            <span className="font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>OneSaaS</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/login" className="hover:opacity-80" style={{ color: 'var(--color-text-secondary)' }}>로그인</Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg font-medium"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              시작하기
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            12개 업종별 템플릿
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            원하는 템플릿을 선택하세요
          </h1>
          <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>
            다양한 업종에 최적화된 프리미엄 랜딩 페이지 템플릿.
            영상, 이미지, 고객 후기 섹션이 모두 포함되어 있습니다.
          </p>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <Link
                key={template.id}
                href={`/templates/${template.id}`}
                className="group rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(var(--color-bg-rgb), 0.8)' }}
                  >
                    <span
                      className="px-6 py-3 rounded-xl font-bold"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      미리보기
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'var(--color-accent)' }}
                    >
                      <template.icon className="w-5 h-5" style={{ color: 'var(--color-bg)' }} />
                    </div>
                    <h3 className="font-bold text-xl">{template.name}</h3>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{template.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8">
        <div
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl"
          style={{ background: 'var(--color-accent)' }}
        >
          <h2
            className="text-4xl font-bold mb-6"
            style={{ color: 'var(--color-bg)', fontFamily: 'var(--font-display)' }}
          >
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 opacity-90" style={{ color: 'var(--color-bg)' }}>
            5분 만에 나만의 SaaS를 만들 수 있습니다
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
          >
            무료로 시작하기
          </Link>
        </div>
      </section>
    </div>
  )
}
