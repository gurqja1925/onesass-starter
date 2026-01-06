'use client'

/**
 * BlogGrid 템플릿
 * 블로그 그리드 레이아웃
 */

import { useState } from 'react'
import { Calendar, User, Clock, ArrowRight, Tag } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  image?: string
  author: { name: string; avatar?: string }
  category: string
  tags?: string[]
  publishedAt: string
  readTime: string
  slug: string
}

interface BlogGridProps {
  posts?: BlogPost[]
  categories?: string[]
  onPostClick?: (post: BlogPost) => void
  showFeatured?: boolean
  columns?: 2 | 3 | 4
  className?: string
}

export function BlogGrid({
  posts,
  categories,
  onPostClick,
  showFeatured = true,
  columns = 3,
  className = '',
}: BlogGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const defaultPosts: BlogPost[] = posts || [
    {
      id: '1',
      title: 'Next.js 15에서 새로워진 기능들',
      excerpt: 'Next.js 15 버전에서 추가된 새로운 기능들과 개선사항을 살펴봅니다.',
      category: '개발',
      tags: ['Next.js', 'React', 'Web'],
      author: { name: '김개발' },
      publishedAt: '2024-01-15',
      readTime: '5분',
      slug: 'nextjs-15-features',
    },
    {
      id: '2',
      title: 'SaaS 스타트업을 위한 마케팅 전략',
      excerpt: '초기 SaaS 스타트업이 알아야 할 효과적인 마케팅 전략을 소개합니다.',
      category: '마케팅',
      tags: ['SaaS', '마케팅', '스타트업'],
      author: { name: '이마케터' },
      publishedAt: '2024-01-14',
      readTime: '8분',
      slug: 'saas-marketing-strategy',
    },
    {
      id: '3',
      title: 'TypeScript 5.0 타입 시스템 완벽 가이드',
      excerpt: 'TypeScript 5.0의 새로운 타입 시스템 기능들을 깊이 있게 알아봅니다.',
      category: '개발',
      tags: ['TypeScript', '프로그래밍'],
      author: { name: '박타입' },
      publishedAt: '2024-01-13',
      readTime: '12분',
      slug: 'typescript-5-guide',
    },
    {
      id: '4',
      title: 'UI/UX 디자인 트렌드 2024',
      excerpt: '2024년 주목해야 할 UI/UX 디자인 트렌드를 정리했습니다.',
      category: '디자인',
      tags: ['UI', 'UX', '디자인'],
      author: { name: '최디자인' },
      publishedAt: '2024-01-12',
      readTime: '6분',
      slug: 'uiux-trends-2024',
    },
    {
      id: '5',
      title: '효율적인 팀 협업을 위한 도구들',
      excerpt: '원격 근무 시대, 팀 협업을 돕는 최고의 도구들을 소개합니다.',
      category: '생산성',
      tags: ['협업', '도구', '원격근무'],
      author: { name: '정협업' },
      publishedAt: '2024-01-11',
      readTime: '7분',
      slug: 'team-collaboration-tools',
    },
    {
      id: '6',
      title: 'Prisma ORM 실전 가이드',
      excerpt: 'Prisma를 사용한 데이터베이스 작업의 모든 것을 다룹니다.',
      category: '개발',
      tags: ['Prisma', 'Database', 'ORM'],
      author: { name: '강데이터' },
      publishedAt: '2024-01-10',
      readTime: '10분',
      slug: 'prisma-orm-guide',
    },
  ]

  const defaultCategories = categories || ['전체', '개발', '디자인', '마케팅', '생산성']

  const filteredPosts = selectedCategory === 'all' || selectedCategory === '전체'
    ? defaultPosts
    : defaultPosts.filter(post => post.category === selectedCategory)

  const featured = showFeatured ? filteredPosts[0] : null
  const gridPosts = showFeatured ? filteredPosts.slice(1) : filteredPosts

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={`py-12 ${className}`} style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            블로그
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            최신 소식과 인사이트를 확인하세요
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {defaultCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === '전체' ? 'all' : category)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: (selectedCategory === category || (selectedCategory === 'all' && category === '전체'))
                  ? 'var(--color-accent)'
                  : 'var(--color-bg-secondary)',
                color: (selectedCategory === category || (selectedCategory === 'all' && category === '전체'))
                  ? 'var(--color-bg)'
                  : 'var(--color-text)',
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 피처드 포스트 */}
        {featured && (
          <div
            onClick={() => onPostClick?.(featured)}
            className="mb-12 rounded-2xl overflow-hidden cursor-pointer group"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div
                className="aspect-video md:aspect-auto md:h-80 flex items-center justify-center"
                style={{ background: 'var(--color-border)' }}
              >
                {featured.image ? (
                  <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">📝</span>
                )}
              </div>
              <div className="p-6 flex flex-col justify-center">
                <span
                  className="text-sm font-medium mb-2"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {featured.category}
                </span>
                <h2
                  className="text-2xl font-bold mb-3 group-hover:underline"
                  style={{ color: 'var(--color-text)' }}
                >
                  {featured.title}
                </h2>
                <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" /> {featured.author.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {featured.publishedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {featured.readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 포스트 그리드 */}
        <div className={`grid ${gridCols[columns]} gap-6`}>
          {gridPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => onPostClick?.(post)}
              className="rounded-xl overflow-hidden cursor-pointer group transition-transform hover:-translate-y-1"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            >
              <div
                className="aspect-video flex items-center justify-center"
                style={{ background: 'var(--color-border)' }}
              >
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">📝</span>
                )}
              </div>

              <div className="p-5">
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  {post.category}
                </span>

                <h3
                  className="text-lg font-semibold mt-3 mb-2 group-hover:underline line-clamp-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  {post.title}
                </h3>

                <p
                  className="text-sm mb-4 line-clamp-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      {post.author.name.charAt(0)}
                    </div>
                    <span>{post.author.name}</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 더보기 */}
        <div className="text-center mt-12">
          <button
            className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
          >
            더 많은 글 보기 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
