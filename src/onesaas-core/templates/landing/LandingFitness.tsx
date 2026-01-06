'use client'

/**
 * 피트니스/헬스 랜딩 페이지 템플릿
 * Fitness Landing Page
 */

import { useState } from 'react'
import { Play, Dumbbell, Users, Clock, Flame, Heart, Trophy, ArrowRight, Check } from 'lucide-react'

interface Program {
  id: string
  title: string
  description: string
  duration: string
  calories: string
  level: string
  image: string
}

interface Trainer {
  name: string
  specialty: string
  image: string
  experience: string
}

interface LandingFitnessProps {
  brandName?: string
  tagline?: string
  heroVideo?: string
  heroImage?: string
  programs?: Program[]
  trainers?: Trainer[]
  transformations?: { before: string; after: string; name: string; result: string }[]
}

const defaultPrograms: Program[] = [
  {
    id: '1',
    title: 'HIIT 인터벌',
    description: '20분 만에 최대 칼로리 소모! 짧고 강렬한 고강도 인터벌 트레이닝',
    duration: '20분',
    calories: '400kcal',
    level: '상급',
    image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&h=400&fit=crop'
  },
  {
    id: '2',
    title: '근력 강화',
    description: '체계적인 웨이트 트레이닝으로 탄탄한 몸 만들기',
    duration: '60분',
    calories: '300kcal',
    level: '중급',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=600&h=400&fit=crop'
  },
  {
    id: '3',
    title: '요가 & 필라테스',
    description: '유연성과 코어 강화를 동시에! 마음까지 건강해지는 시간',
    duration: '50분',
    calories: '200kcal',
    level: '초급',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e067?w=600&h=400&fit=crop'
  },
  {
    id: '4',
    title: '복싱 피트니스',
    description: '스트레스 해소와 전신 운동을 한번에! 펀치로 날려버리세요',
    duration: '45분',
    calories: '500kcal',
    level: '중급',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=400&fit=crop'
  }
]

const defaultTrainers: Trainer[] = [
  {
    name: '김태현',
    specialty: '웨이트 트레이닝 / 보디빌딩',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=500&fit=crop',
    experience: '10년 경력'
  },
  {
    name: '이수진',
    specialty: '요가 / 필라테스',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop',
    experience: '8년 경력'
  },
  {
    name: '박준영',
    specialty: 'HIIT / 기능성 트레이닝',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=500&fit=crop',
    experience: '7년 경력'
  },
  {
    name: '최민아',
    specialty: '복싱 / 킥복싱',
    image: 'https://images.unsplash.com/photo-1609899464726-209befcc5a36?w=400&h=500&fit=crop',
    experience: '6년 경력'
  }
]

const defaultTransformations = [
  {
    before: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=300&h=400&fit=crop',
    name: '김민수',
    result: '-15kg / 12주'
  },
  {
    before: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=300&h=400&fit=crop',
    name: '이지현',
    result: '-10kg / 8주'
  },
  {
    before: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=300&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop',
    name: '박성호',
    result: '근육량 +8kg / 16주'
  }
]

export function LandingFitness({
  brandName = '파워짐',
  tagline = '당신의 한계를 넘어서',
  heroVideo,
  heroImage = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop',
  programs = defaultPrograms,
  trainers = defaultTrainers,
  transformations = defaultTransformations
}: LandingFitnessProps) {
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
            style={{ background: 'linear-gradient(to right, rgba(var(--color-bg-rgb), 0.95), rgba(var(--color-bg-rgb), 0.5))' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-32">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Dumbbell className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
              <span className="font-bold text-xl" style={{ color: 'var(--color-accent)' }}>{brandName}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              {tagline}
            </h1>

            <p className="text-xl mb-8 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              10,000명 이상의 회원이 {brandName}에서 목표를 달성했습니다.
              전문 트레이너와 함께 당신의 한계를 돌파하세요.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                7일 무료 체험
              </button>
              {heroVideo && (
                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-3"
                  style={{ background: 'transparent', border: '2px solid var(--color-border)', color: 'var(--color-text)' }}
                >
                  <Play className="w-5 h-5" />
                  시설 투어 영상
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: '10,000+', label: '활성 회원' },
                { value: '50+', label: '전문 트레이너' },
                { value: '24/7', label: '운영 시간' },
                { value: '100+', label: '주간 클래스' }
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

      {/* Programs */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              프로그램
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              당신에게 맞는 운동을 찾으세요
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className="rounded-2xl overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    {program.level}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{program.title}</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                    {program.description}
                  </p>
                  <div className="flex gap-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {program.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-4 h-4" /> {program.calories}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
                왜 {brandName}인가요?
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
                최고의 시설, 최고의 결과
              </h2>
              <div className="space-y-6">
                {[
                  '최신 프리미엄 장비 완비',
                  '1:1 맞춤 PT 프로그램',
                  '영양 상담 및 식단 관리',
                  '인바디 무료 측정',
                  '락커룸 & 샤워시설',
                  '무료 주차'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--color-accent)' }}
                    >
                      <Check className="w-5 h-5" style={{ color: 'var(--color-bg)' }} />
                    </div>
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop"
                alt="Gym"
                className="rounded-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trainers */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              전문 트레이너
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              당신의 목표를 함께할 파트너
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {trainers.map((trainer, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative h-80 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end"
                    style={{ background: 'linear-gradient(to top, rgba(var(--color-bg-rgb), 0.9), transparent)' }}
                  >
                    <div className="p-6">
                      <p className="font-bold" style={{ color: 'var(--color-accent)' }}>{trainer.experience}</p>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-xl">{trainer.name}</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>{trainer.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformations */}
      <section className="py-24 px-8" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              변화 갤러리
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              놀라운 변화의 증거
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {transformations.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img src={t.before} alt="Before" className="w-full h-64 object-cover" />
                    <span
                      className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-bold"
                      style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}
                    >
                      BEFORE
                    </span>
                  </div>
                  <div className="relative">
                    <img src={t.after} alt="After" className="w-full h-64 object-cover" />
                    <span
                      className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-bold"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      AFTER
                    </span>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-xl mb-1">{t.name}</h3>
                  <p style={{ color: 'var(--color-accent)' }}>{t.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              멤버십
            </p>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              합리적인 가격
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: '베이직',
                price: '월 5만원',
                features: ['시설 이용', '그룹 클래스', '락커 이용']
              },
              {
                name: '프리미엄',
                price: '월 12만원',
                popular: true,
                features: ['시설 이용', '그룹 클래스', '락커 이용', 'PT 월 4회', '인바디 측정', '영양 상담']
              },
              {
                name: 'VIP',
                price: '월 25만원',
                features: ['시설 이용', '그룹 클래스', '락커 이용', 'PT 무제한', '인바디 측정', '영양 상담', '1:1 전담 관리']
              }
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 ${plan.popular ? 'scale-105' : ''}`}
                style={{
                  background: plan.popular ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                  border: plan.popular ? 'none' : '1px solid var(--color-border)'
                }}
              >
                {plan.popular && (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
                    style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
                  >
                    인기
                  </span>
                )}
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: plan.popular ? 'var(--color-bg)' : 'var(--color-text)' }}
                >
                  {plan.name}
                </h3>
                <p
                  className="text-3xl font-bold mb-6"
                  style={{ color: plan.popular ? 'var(--color-bg)' : 'var(--color-accent)' }}
                >
                  {plan.price}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2"
                      style={{ color: plan.popular ? 'var(--color-bg)' : 'var(--color-text-secondary)' }}
                    >
                      <Check className="w-5 h-5" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 rounded-xl font-bold transition-all hover:scale-105"
                  style={{
                    background: plan.popular ? 'var(--color-bg)' : 'var(--color-accent)',
                    color: plan.popular ? 'var(--color-accent)' : 'var(--color-bg)'
                  }}
                >
                  시작하기
                </button>
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
            7일 무료 체험을 시작하세요
          </h2>
          <p className="text-xl mb-8 opacity-90" style={{ color: 'var(--color-bg)' }}>
            카드 등록 없이 지금 바로 시작
          </p>
          <button
            className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
          >
            무료 체험 시작하기
          </button>
        </div>
      </section>
    </div>
  )
}
