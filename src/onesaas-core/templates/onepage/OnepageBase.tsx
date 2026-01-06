'use client'

/**
 * OnePage 베이스 프레임워크
 * 모든 원페이지 템플릿의 기반 컴포넌트
 * 이미지/영상 히어로, 섹션 시스템 지원
 */

import { ReactNode } from 'react'
import Link from 'next/link'
import {
  Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube,
  ChevronDown, Star, Quote, CheckCircle, ArrowRight
} from 'lucide-react'

// 히어로 타입
export interface HeroProps {
  type: 'image' | 'video' | 'gradient' | 'solid'
  backgroundUrl?: string  // 이미지 또는 비디오 URL
  overlayOpacity?: number // 0-100
  title: string
  subtitle?: string
  badge?: string
  primaryCTA?: { label: string; href: string }
  secondaryCTA?: { label: string; href: string }
  height?: 'full' | 'large' | 'medium' | 'small'
  textAlign?: 'left' | 'center' | 'right'
  showScrollIndicator?: boolean
}

// 비즈니스 정보
export interface BusinessInfo {
  name: string
  logo?: string
  tagline?: string
  phone?: string
  email?: string
  address?: string
  hours?: string
  social?: {
    instagram?: string
    facebook?: string
    youtube?: string
    kakao?: string
    blog?: string
  }
}

// 서비스/메뉴 아이템
export interface ServiceItem {
  icon?: ReactNode
  emoji?: string
  image?: string
  title: string
  description: string
  price?: string
  badge?: string
  features?: string[]
}

// 갤러리 아이템
export interface GalleryItem {
  image: string
  title?: string
  category?: string
}

// 후기
export interface TestimonialItem {
  content: string
  author: string
  role?: string
  avatar?: string
  rating?: number
}

// FAQ 아이템
export interface FAQItem {
  question: string
  answer: string
}

// 섹션 공통 Props
export interface SectionProps {
  id?: string
  title?: string
  subtitle?: string
  className?: string
  children?: ReactNode
}

// ======================
// 히어로 컴포넌트
// ======================
export function Hero({
  type,
  backgroundUrl,
  overlayOpacity = 50,
  title,
  subtitle,
  badge,
  primaryCTA,
  secondaryCTA,
  height = 'large',
  textAlign = 'center',
  showScrollIndicator = true,
}: HeroProps) {
  const heightClass = {
    full: 'min-h-screen',
    large: 'min-h-[80vh]',
    medium: 'min-h-[60vh]',
    small: 'min-h-[40vh]',
  }[height]

  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[textAlign]

  return (
    <section className={`relative ${heightClass} flex items-center justify-center overflow-hidden`}>
      {/* 배경 */}
      {type === 'video' && backgroundUrl && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundUrl} type="video/mp4" />
        </video>
      )}
      {type === 'image' && backgroundUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}
      {type === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-bg)]" />
      )}
      {type === 'solid' && (
        <div className="absolute inset-0" style={{ background: 'var(--color-bg)' }} />
      )}

      {/* 오버레이 */}
      <div
        className="absolute inset-0"
        style={{ background: `rgba(0,0,0,${overlayOpacity / 100})` }}
      />

      {/* 컨텐츠 */}
      <div className={`relative z-10 max-w-4xl mx-auto px-6 flex flex-col ${alignClass}`}>
        {badge && (
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            {badge}
          </span>
        )}

        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          style={{ color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="text-xl md:text-2xl mb-10 max-w-2xl"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {subtitle}
          </p>
        )}

        {(primaryCTA || secondaryCTA) && (
          <div className="flex flex-wrap gap-4">
            {primaryCTA && (
              <Link
                href={primaryCTA.href}
                className="px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 flex items-center gap-2"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                {primaryCTA.label}
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
            {secondaryCTA && (
              <Link
                href={secondaryCTA.href}
                className="px-8 py-4 rounded-xl text-lg font-semibold transition-all border-2 hover:scale-105"
                style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}
              >
                {secondaryCTA.label}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* 스크롤 인디케이터 */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8" style={{ color: 'rgba(255,255,255,0.7)' }} />
        </div>
      )}
    </section>
  )
}

// ======================
// 섹션 래퍼
// ======================
export function Section({ id, title, subtitle, className = '', children }: SectionProps) {
  return (
    <section
      id={id}
      className={`py-20 px-6 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: 'var(--color-text)' }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

// ======================
// 서비스 그리드
// ======================
export function ServicesGrid({ services, columns = 3 }: { services: ServiceItem[]; columns?: 2 | 3 | 4 }) {
  const colClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns]

  return (
    <div className={`grid ${colClass} gap-6`}>
      {services.map((service, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl transition-all hover:-translate-y-1"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          {service.image && (
            <div
              className="h-48 rounded-xl mb-4 bg-cover bg-center"
              style={{ backgroundImage: `url(${service.image})` }}
            />
          )}
          {(service.emoji || service.icon) && (
            <div className="text-4xl mb-4">
              {service.emoji || service.icon}
            </div>
          )}
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>
              {service.title}
            </h3>
            {service.badge && (
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                {service.badge}
              </span>
            )}
          </div>
          <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            {service.description}
          </p>
          {service.price && (
            <p className="font-bold text-xl" style={{ color: 'var(--color-accent)' }}>
              {service.price}
            </p>
          )}
          {service.features && (
            <ul className="mt-4 space-y-2">
              {service.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <CheckCircle className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}

// ======================
// 갤러리
// ======================
export function Gallery({ items, columns = 3 }: { items: GalleryItem[]; columns?: 2 | 3 | 4 }) {
  const colClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns]

  return (
    <div className={`grid ${colClass} gap-4`}>
      {items.map((item, i) => (
        <div
          key={i}
          className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110"
            style={{ backgroundImage: `url(${item.image})` }}
          />
          {(item.title || item.category) && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col">
              {item.title && (
                <p className="text-white font-bold text-lg">{item.title}</p>
              )}
              {item.category && (
                <p className="text-white/70 text-sm">{item.category}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ======================
// 후기 슬라이더
// ======================
export function Testimonials({ items }: { items: TestimonialItem[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <Quote className="w-8 h-8 mb-4" style={{ color: 'var(--color-accent)' }} />
          <p className="mb-6" style={{ color: 'var(--color-text)' }}>
            "{item.content}"
          </p>
          {item.rating && (
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star
                  key={j}
                  className="w-4 h-4"
                  fill={j < item.rating! ? 'var(--color-accent)' : 'none'}
                  style={{ color: 'var(--color-accent)' }}
                />
              ))}
            </div>
          )}
          <div className="flex items-center gap-3">
            {item.avatar ? (
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${item.avatar})` }}
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                {item.author[0]}
              </div>
            )}
            <div>
              <p className="font-medium" style={{ color: 'var(--color-text)' }}>{item.author}</p>
              {item.role && (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item.role}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ======================
// 연락처 섹션
// ======================
export function Contact({ business, mapUrl }: { business: BusinessInfo; mapUrl?: string }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* 정보 */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          {business.name}
        </h3>
        {business.tagline && (
          <p style={{ color: 'var(--color-text-secondary)' }}>{business.tagline}</p>
        )}

        <div className="space-y-4">
          {business.phone && (
            <a href={`tel:${business.phone}`} className="flex items-center gap-3 hover:opacity-80">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                <Phone className="w-5 h-5" />
              </div>
              <span style={{ color: 'var(--color-text)' }}>{business.phone}</span>
            </a>
          )}
          {business.email && (
            <a href={`mailto:${business.email}`} className="flex items-center gap-3 hover:opacity-80">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                <Mail className="w-5 h-5" />
              </div>
              <span style={{ color: 'var(--color-text)' }}>{business.email}</span>
            </a>
          )}
          {business.address && (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                <MapPin className="w-5 h-5" />
              </div>
              <span style={{ color: 'var(--color-text)' }}>{business.address}</span>
            </div>
          )}
          {business.hours && (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                <Clock className="w-5 h-5" />
              </div>
              <span style={{ color: 'var(--color-text)' }}>{business.hours}</span>
            </div>
          )}
        </div>

        {/* 소셜 */}
        {business.social && (
          <div className="flex gap-4 pt-4">
            {business.social.instagram && (
              <a href={business.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <Instagram className="w-6 h-6" style={{ color: 'var(--color-text-secondary)' }} />
              </a>
            )}
            {business.social.facebook && (
              <a href={business.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <Facebook className="w-6 h-6" style={{ color: 'var(--color-text-secondary)' }} />
              </a>
            )}
            {business.social.youtube && (
              <a href={business.social.youtube} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <Youtube className="w-6 h-6" style={{ color: 'var(--color-text-secondary)' }} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* 지도 */}
      {mapUrl && (
        <div
          className="h-80 rounded-2xl overflow-hidden"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}
    </div>
  )
}

// ======================
// 심플 푸터
// ======================
export function SimpleFooter({ business }: { business: BusinessInfo }) {
  return (
    <footer
      className="py-8 px-6"
      style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)' }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>{business.name}</p>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  )
}
