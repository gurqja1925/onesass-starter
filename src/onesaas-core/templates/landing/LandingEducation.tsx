'use client'

/**
 * 교육/학원 랜딩 페이지 템플릿
 * Education Landing Page
 */

import { useState } from 'react'
import { Play, BookOpen, Users, Award, Clock, GraduationCap, Star, CheckCircle, ArrowRight } from 'lucide-react'

interface Course {
  id: string
  title: string
  instructor: string
  instructorImage: string
  duration: string
  students: number
  price: string
  image: string
  tag?: string
}

interface LandingEducationProps {
  brandName?: string
  tagline?: string
  heroVideo?: string
  heroImage?: string
  courses?: Course[]
  instructors?: { name: string; role: string; image: string; students: number }[]
  testimonials?: { name: string; course: string; content: string; avatar: string; rating: number }[]
}

const defaultCourses: Course[] = [
  {
    id: '1',
    title: '수능 수학 만점 비법',
    instructor: '김수학 강사',
    instructorImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop&crop=face',
    duration: '3개월 과정',
    students: 1240,
    price: '월 29만원',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=400&fit=crop',
    tag: '베스트'
  },
  {
    id: '2',
    title: '영어 스피킹 마스터',
    instructor: '제니퍼 Park',
    instructorImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    duration: '6개월 과정',
    students: 890,
    price: '월 35만원',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop',
    tag: '인기'
  },
  {
    id: '3',
    title: '코딩 기초부터 취업까지',
    instructor: '이개발 강사',
    instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    duration: '6개월 과정',
    students: 2100,
    price: '월 45만원',
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop',
    tag: '취업연계'
  }
]

const defaultInstructors = [
  {
    name: '김수학',
    role: '수학 전문',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&h=400&fit=crop&crop=face',
    students: 5200
  },
  {
    name: '제니퍼 Park',
    role: '영어 원어민 강사',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=400&fit=crop&crop=face',
    students: 3800
  },
  {
    name: '이개발',
    role: 'IT/코딩 전문',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face',
    students: 4500
  },
  {
    name: '박논술',
    role: '논술/면접 전문',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face',
    students: 2900
  }
]

const defaultTestimonials = [
  {
    name: '이수빈',
    course: '수능 수학 만점 비법',
    content: '3등급에서 1등급으로! 김수학 선생님의 체계적인 커리큘럼 덕분에 수능 수학 만점 받았어요.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5
  },
  {
    name: '최준영',
    course: '영어 스피킹 마스터',
    content: '6개월 만에 토익 스피킹 레벨 8 달성! 매일 원어민과 대화하니 자연스럽게 실력이 늘었어요.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rating: 5
  },
  {
    name: '김하늘',
    course: '코딩 기초부터 취업까지',
    content: '비전공자였는데 6개월 과정 수료 후 네카라쿠배 취업 성공! 현업 프로젝트 경험이 도움됐어요.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    rating: 5
  }
]

export function LandingEducation({
  brandName = '드림학원',
  tagline = '꿈을 현실로 만드는 교육',
  heroVideo,
  heroImage = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=1080&fit=crop',
  courses = defaultCourses,
  instructors = defaultInstructors,
  testimonials = defaultTestimonials
}: LandingEducationProps) {
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
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
              <span className="font-bold text-xl" style={{ color: 'var(--color-accent)' }}>{brandName}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              {tagline}
            </h1>

            <p className="text-xl mb-8 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              15,000명 이상의 학생들이 {brandName}에서 꿈을 이뤘습니다.
              검증된 커리큘럼과 최고의 강사진이 여러분을 기다립니다.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                무료 체험 수업 신청
              </button>
              {heroVideo && (
                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-3"
                  style={{ background: 'transparent', border: '2px solid var(--color-border)', color: 'var(--color-text)' }}
                >
                  <Play className="w-5 h-5" />
                  학원 소개 영상
                </button>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: '15,000+', label: '수강생' },
                { value: '98%', label: '합격률' },
                { value: '50+', label: '전문 강사' },
                { value: '4.9', label: '평균 평점' }
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>{stat.value}</p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              왜 {brandName}인가요?
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              차별화된 교육 시스템
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, title: '맞춤 커리큘럼', desc: '개인별 수준 진단 후 1:1 맞춤 학습 플랜을 제공합니다.' },
              { icon: Users, title: '소수정예 수업', desc: '최대 10명 소규모 클래스로 집중 관리합니다.' },
              { icon: Award, title: '검증된 강사진', desc: '각 분야 최고의 전문가들이 직접 가르칩니다.' },
              { icon: Clock, title: '24시간 질문방', desc: '언제든 질문하면 강사가 직접 답변합니다.' }
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl text-center transition-all hover:scale-105"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'var(--color-accent)' }}
                >
                  <feature.icon className="w-8 h-8" style={{ color: 'var(--color-bg)' }} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
                인기 강좌
              </p>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                베스트 커리큘럼
              </h2>
            </div>
            <button
              className="mt-6 md:mt-0 flex items-center gap-2 font-bold transition-all hover:gap-4"
              style={{ color: 'var(--color-accent)' }}
            >
              전체 강좌 보기 <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  {course.tag && (
                    <span
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      {course.tag}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3">{course.title}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={course.instructorImage}
                      alt={course.instructor}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{course.instructor}</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {course.duration} · 수강생 {course.students.toLocaleString()}명
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>
                      {course.price}
                    </p>
                    <button
                      className="px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-24 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              스타 강사진
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              최고의 전문가들
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {instructors.map((instructor, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative h-80 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end"
                    style={{ background: 'linear-gradient(to top, rgba(var(--color-bg-rgb), 0.9), transparent)' }}
                  >
                    <div className="p-6">
                      <p className="font-bold">{instructor.students.toLocaleString()}명의 수강생</p>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-xl">{instructor.name}</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>{instructor.role}</p>
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
              합격 후기
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              꿈을 이룬 수강생들
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
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-current" style={{ color: 'var(--color-accent)' }} />
                  ))}
                </div>
                <p className="text-sm font-medium mb-4 px-3 py-1 rounded-full inline-block" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
                  {t.course}
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

      {/* CTA */}
      <section className="py-24 px-8" style={{ background: 'var(--color-accent)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-bg)', fontFamily: 'var(--font-display)' }}>
            지금 무료 체험 수업을 신청하세요
          </h2>
          <p className="text-xl mb-8 opacity-90" style={{ color: 'var(--color-bg)' }}>
            첫 수업은 무료! 직접 경험하고 결정하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
              style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
            >
              무료 체험 신청하기
            </button>
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
              style={{ background: 'transparent', border: '2px solid var(--color-bg)', color: 'var(--color-bg)' }}
            >
              상담 전화하기
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
