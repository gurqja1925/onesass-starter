'use client'

/**
 * LandingStartup 템플릿
 * 스타트업 랜딩 페이지
 */

import { ArrowRight, Github, Twitter, Linkedin, Mail, ChevronRight } from 'lucide-react'

interface TeamMember {
  name: string
  role: string
  image?: string
  twitter?: string
  linkedin?: string
}

interface Investor {
  name: string
  logo?: string
}

interface LandingStartupProps {
  companyName?: string
  tagline?: string
  description?: string
  teamMembers?: TeamMember[]
  investors?: Investor[]
  pressLogos?: string[]
  className?: string
}

export function LandingStartup({
  companyName,
  tagline,
  description,
  teamMembers,
  investors,
  pressLogos,
  className = '',
}: LandingStartupProps) {
  const defaultTeam: TeamMember[] = teamMembers || [
    { name: '김창업', role: 'CEO & Co-founder', twitter: '@kimceo' },
    { name: '이기술', role: 'CTO & Co-founder', linkedin: 'leetech' },
    { name: '박디자인', role: 'Head of Design', twitter: '@parkdesign' },
    { name: '정마케팅', role: 'Head of Marketing', linkedin: 'jungmarketing' },
  ]

  const defaultInvestors = investors || [
    { name: 'Y Combinator' },
    { name: 'Sequoia' },
    { name: 'a16z' },
    { name: 'Softbank' },
  ]

  const defaultPress = pressLogos || ['TechCrunch', 'Forbes', 'Bloomberg', 'Wired']

  return (
    <div className={`${className}`} style={{ background: 'var(--color-bg)' }}>
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span style={{ color: 'var(--color-text)' }}>Series A 펀딩 완료</span>
                <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
              </div>

              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                style={{ color: 'var(--color-text)' }}
              >
                {tagline || (
                  <>
                    미래를
                    <br />
                    <span style={{ color: 'var(--color-accent)' }}>만들어갑니다</span>
                  </>
                )}
              </h1>

              <p
                className="text-xl mb-8 leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {description || '우리는 기술을 통해 사람들의 일상을 더 나은 방향으로 변화시키고 있습니다. 혁신적인 솔루션으로 새로운 가능성을 열어갑니다.'}
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  채용 공고 보기 <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                  style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                >
                  <Github className="w-5 h-5" /> GitHub
                </button>
              </div>
            </div>

            <div
              className="aspect-square rounded-3xl flex items-center justify-center"
              style={{ background: 'var(--color-bg-secondary)' }}
            >
              <span className="text-8xl">🚀</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
            우리의 미션
          </h2>
          <p
            className="text-2xl md:text-3xl leading-relaxed"
            style={{ color: 'var(--color-text)' }}
          >
            "모든 사람이 기술의 힘을 빌려{' '}
            <span style={{ color: 'var(--color-accent)' }}>무한한 가능성</span>을
            실현할 수 있는 세상을 만듭니다."
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '$50M+', label: '누적 투자금' },
              { value: '100+', label: '팀원 수' },
              { value: '50K+', label: '활성 사용자' },
              { value: '15+', label: '글로벌 지역' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--color-accent)' }}>
                  {stat.value}
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              팀 소개
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              세계 최고의 기업 출신 인재들이 모였습니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {defaultTeam.map((member, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl text-center"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                  {member.name}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {member.role}
                </p>
                <div className="flex justify-center gap-2">
                  {member.twitter && (
                    <a href={`https://twitter.com/${member.twitter}`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Twitter className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={`https://linkedin.com/in/${member.linkedin}`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Linkedin className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              className="px-6 py-3 rounded-xl font-medium"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              전체 팀 보기
            </button>
          </div>
        </div>
      </section>

      {/* Investors */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              투자사
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              세계적인 투자사들이 우리와 함께합니다
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-12">
            {defaultInvestors.map((investor, i) => (
              <div
                key={i}
                className="text-2xl font-bold opacity-50"
                style={{ color: 'var(--color-text)' }}
              >
                {investor.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="py-20" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              언론 보도
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-12">
            {defaultPress.map((press, i) => (
              <div
                key={i}
                className="text-xl font-bold opacity-50"
                style={{ color: 'var(--color-text)' }}
              >
                {press}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            함께 미래를 만들어가요
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            우리는 항상 열정적인 인재를 찾고 있습니다
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              <Mail className="w-5 h-5" /> 연락하기
            </button>
            <button
              className="px-6 py-3 rounded-xl font-semibold"
              style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
            >
              채용 공고 보기
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
