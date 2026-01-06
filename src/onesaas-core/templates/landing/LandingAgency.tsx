'use client'

/**
 * 에이전시/스튜디오 랜딩 페이지 템플릿
 * Agency Landing Page
 */

import { useState } from 'react'
import { Play, Palette, Layers, Zap, Star, ArrowRight, ExternalLink } from 'lucide-react'

interface Project {
  id: string
  title: string
  category: string
  image: string
  client: string
}

interface TeamMember {
  name: string
  role: string
  image: string
}

interface LandingAgencyProps {
  brandName?: string
  tagline?: string
  heroVideo?: string
  heroImage?: string
  projects?: Project[]
  team?: TeamMember[]
  clients?: string[]
}

const defaultProjects: Project[] = [
  {
    id: '1',
    title: '글로벌 이커머스 리브랜딩',
    category: '브랜딩',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    client: '네이버쇼핑'
  },
  {
    id: '2',
    title: '핀테크 앱 UI/UX',
    category: 'UI/UX',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
    client: '토스'
  },
  {
    id: '3',
    title: '스타트업 브랜드 아이덴티티',
    category: '브랜딩',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop',
    client: '당근마켓'
  },
  {
    id: '4',
    title: '럭셔리 호텔 웹사이트',
    category: '웹 개발',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    client: '신라호텔'
  },
  {
    id: '5',
    title: '헬스케어 플랫폼',
    category: 'UI/UX',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    client: '닥터나우'
  },
  {
    id: '6',
    title: '음악 스트리밍 앱',
    category: '앱 개발',
    image: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=800&h=600&fit=crop',
    client: '멜론'
  }
]

const defaultTeam: TeamMember[] = [
  {
    name: '김창조',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: '이디자인',
    role: 'Lead Designer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: '박개발',
    role: 'Tech Lead',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: '최전략',
    role: 'Strategy Director',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face'
  }
]

export function LandingAgency({
  brandName = '크리에이티브랩',
  tagline = '아이디어를 현실로',
  heroVideo,
  heroImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop',
  projects = defaultProjects,
  team = defaultTeam,
  clients = ['삼성', 'LG', '현대', '네이버', '카카오', '쿠팡', 'SK', '롯데']
}: LandingAgencyProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const categories = ['전체', ...new Set(projects.map(p => p.category))]
  const filteredProjects = selectedCategory === '전체'
    ? projects
    : projects.filter(p => p.category === selectedCategory)

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
            style={{ background: 'linear-gradient(to right, rgba(var(--color-bg-rgb), 0.95), rgba(var(--color-bg-rgb), 0.7))' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
              <span className="font-bold text-xl">{brandName}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              {tagline}
            </h1>

            <p className="text-xl mb-8 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              브랜딩, UI/UX, 웹/앱 개발까지.
              10년간 500개 이상의 프로젝트를 성공시킨 크리에이티브 에이전시.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                프로젝트 문의
              </button>
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-2"
                style={{ background: 'transparent', border: '2px solid var(--color-border)', color: 'var(--color-text)' }}
              >
                포트폴리오 보기 <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="py-16 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm uppercase tracking-wider mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Trusted by leading brands
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {clients.map((client, i) => (
              <span key={i} className="text-2xl font-bold opacity-50 hover:opacity-100 transition-opacity">
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              What We Do
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              우리가 하는 일
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Palette,
                title: '브랜딩',
                desc: '브랜드 전략부터 로고, 가이드라인, 마케팅 에셋까지 총체적인 브랜드 경험을 디자인합니다.',
                services: ['브랜드 전략', '로고 디자인', '브랜드 가이드라인', '패키지 디자인']
              },
              {
                icon: Layers,
                title: 'UI/UX 디자인',
                desc: '사용자 리서치부터 프로토타이핑까지, 사용자 중심의 디지털 경험을 설계합니다.',
                services: ['UX 리서치', 'UI 디자인', '프로토타이핑', '사용성 테스트']
              },
              {
                icon: Zap,
                title: '개발',
                desc: '최신 기술 스택으로 빠르고 안정적인 웹사이트와 앱을 개발합니다.',
                services: ['웹 개발', '앱 개발', 'CMS 구축', 'API 개발']
              }
            ].map((service, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl transition-all hover:scale-105"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'var(--color-accent)' }}
                >
                  <service.icon className="w-7 h-7" style={{ color: 'var(--color-bg)' }} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>{service.desc}</p>
                <ul className="space-y-2">
                  {service.services.map((s, j) => (
                    <li key={j} className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                      <span style={{ color: 'var(--color-accent)' }}>→</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-24 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
                Selected Works
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden mb-4">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover transition-transform group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(var(--color-bg-rgb), 0.8)' }}
                  >
                    <ExternalLink className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
                  </div>
                </div>
                <span
                  className="text-sm font-medium px-3 py-1 rounded-full"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  {project.category}
                </span>
                <h3 className="font-bold text-xl mt-3 mb-1">{project.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>{project.client}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              Our Team
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              크리에이티브 팀
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="font-bold text-xl">{member.name}</h3>
                <p style={{ color: 'var(--color-accent)' }}>{member.role}</p>
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
            프로젝트를 시작해볼까요?
          </h2>
          <p className="text-xl mb-8 opacity-90" style={{ color: 'var(--color-bg)' }}>
            당신의 아이디어를 현실로 만들어 드립니다
          </p>
          <button
            className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
          >
            프로젝트 문의하기
          </button>
        </div>
      </section>
    </div>
  )
}
