'use client'

/**
 * 의료/병원 랜딩 페이지 템플릿
 * Healthcare Landing Page
 */

import { useState } from 'react'
import { Play, Stethoscope, Heart, Clock, Phone, Shield, Award, Users, Calendar, MapPin, ChevronRight, Star } from 'lucide-react'

interface Doctor {
  name: string
  specialty: string
  image: string
  education: string
  experience: string
}

interface Service {
  id: string
  title: string
  description: string
  icon: any
}

interface LandingHealthcareProps {
  brandName?: string
  tagline?: string
  heroVideo?: string
  heroImage?: string
  doctors?: Doctor[]
  services?: Service[]
  testimonials?: { name: string; treatment: string; content: string; avatar: string }[]
}

const defaultDoctors: Doctor[] = [
  {
    name: '김영수',
    specialty: '내과 전문의',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop',
    education: '서울대학교 의과대학',
    experience: '25년 경력'
  },
  {
    name: '이정민',
    specialty: '외과 전문의',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop',
    education: '연세대학교 의과대학',
    experience: '20년 경력'
  },
  {
    name: '박지현',
    specialty: '소아과 전문의',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=500&fit=crop',
    education: '고려대학교 의과대학',
    experience: '18년 경력'
  },
  {
    name: '최성호',
    specialty: '정형외과 전문의',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=500&fit=crop',
    education: '서울대학교 의과대학',
    experience: '22년 경력'
  }
]

const defaultServices = [
  {
    id: '1',
    title: '내과 진료',
    description: '당뇨, 고혈압, 갑상선 등 만성질환 전문 진료',
    icon: Stethoscope
  },
  {
    id: '2',
    title: '건강검진',
    description: '종합건강검진, 암검진, 기업검진 프로그램',
    icon: Shield
  },
  {
    id: '3',
    title: '소아청소년과',
    description: '영유아 건강검진, 예방접종, 성장클리닉',
    icon: Heart
  },
  {
    id: '4',
    title: '정형외과',
    description: '관절, 척추 질환 및 스포츠 손상 치료',
    icon: Award
  }
]

const defaultTestimonials = [
  {
    name: '김미영',
    treatment: '건강검진',
    content: '꼼꼼한 검진과 친절한 설명 덕분에 건강 관리에 큰 도움이 되었습니다. 대기 시간도 짧고 시설도 깨끗해요.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  },
  {
    name: '이준혁',
    treatment: '정형외과',
    content: '무릎 수술 후 재활까지 체계적으로 관리해주셔서 빠르게 회복할 수 있었습니다. 정말 감사합니다.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
  },
  {
    name: '박선희',
    treatment: '소아과',
    content: '아이가 아플 때마다 방문하는데, 항상 자세히 설명해주시고 부모 마음을 이해해주셔서 믿고 갑니다.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
  }
]

export function LandingHealthcare({
  brandName = '서울중앙병원',
  tagline = '건강한 삶의 시작',
  heroVideo,
  heroImage = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=1080&fit=crop',
  doctors = defaultDoctors,
  services = defaultServices,
  testimonials = defaultTestimonials
}: LandingHealthcareProps) {
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
            style={{ background: 'linear-gradient(135deg, rgba(var(--color-bg-rgb), 0.95) 0%, rgba(var(--color-bg-rgb), 0.7) 100%)' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
                <span className="font-bold text-xl">{brandName}</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                {tagline}
              </h1>

              <p className="text-xl mb-8 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                30년 전통의 {brandName}이 최신 의료 기술과 따뜻한 마음으로
                여러분의 건강을 지켜드립니다.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <button
                  className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-2"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  <Calendar className="w-5 h-5" />
                  진료 예약
                </button>
                <button
                  className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-2"
                  style={{ background: 'transparent', border: '2px solid var(--color-border)', color: 'var(--color-text)' }}
                >
                  <Phone className="w-5 h-5" />
                  02-1234-5678
                </button>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-6 text-sm">
                <span className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <Clock className="w-4 h-4" /> 평일 08:00-18:00
                </span>
                <span className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <MapPin className="w-4 h-4" /> 서울시 강남구
                </span>
              </div>
            </div>

            {/* Quick Appointment Form */}
            <div
              className="p-8 rounded-2xl"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            >
              <h3 className="text-2xl font-bold mb-6">빠른 예약</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="이름"
                  className="w-full px-4 py-3 rounded-xl"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                />
                <input
                  type="tel"
                  placeholder="연락처"
                  className="w-full px-4 py-3 rounded-xl"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                />
                <select
                  className="w-full px-4 py-3 rounded-xl"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                >
                  <option>진료과 선택</option>
                  <option>내과</option>
                  <option>외과</option>
                  <option>소아과</option>
                  <option>정형외과</option>
                </select>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                />
                <button
                  className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  예약 신청
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-8" style={{ background: 'var(--color-accent)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '30년', label: '전통' },
              { value: '50만+', label: '진료 환자' },
              { value: '100+', label: '전문 의료진' },
              { value: '98%', label: '환자 만족도' }
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl font-bold mb-2" style={{ color: 'var(--color-bg)' }}>{stat.value}</p>
                <p className="opacity-80" style={{ color: 'var(--color-bg)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              진료과목
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              전문 진료 서비스
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-8 rounded-2xl text-center transition-all hover:scale-105 cursor-pointer"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'var(--color-accent)' }}
                >
                  <service.icon className="w-8 h-8" style={{ color: 'var(--color-bg)' }} />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="py-24 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              의료진 소개
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              최고의 전문 의료진
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {doctors.map((doctor, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-1">{doctor.name}</h3>
                  <p className="mb-3" style={{ color: 'var(--color-accent)' }}>{doctor.specialty}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {doctor.education}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {doctor.experience}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              환자 후기
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              환자분들의 이야기
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-current" style={{ color: 'var(--color-accent)' }} />
                  ))}
                </div>
                <p
                  className="text-sm font-medium mb-4 px-3 py-1 rounded-full inline-block"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  {t.treatment}
                </p>
                <p className="text-lg mb-6 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  "{t.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <p className="font-bold">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & CTA */}
      <section className="py-24 px-8" style={{ background: 'var(--color-accent)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: 'var(--color-bg)', fontFamily: 'var(--font-display)' }}
          >
            건강한 삶, 지금 시작하세요
          </h2>
          <p className="text-xl mb-8 opacity-90" style={{ color: 'var(--color-bg)' }}>
            서울시 강남구 테헤란로 123 | 주차 가능
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
              style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
            >
              진료 예약하기
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
