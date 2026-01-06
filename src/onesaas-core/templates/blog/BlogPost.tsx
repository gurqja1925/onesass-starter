'use client'

/**
 * BlogPost 템플릿
 * 블로그 포스트 상세
 */

import { Calendar, User, Clock, Share2, Bookmark, Heart, ArrowLeft, Tag } from 'lucide-react'

interface Author {
  name: string
  avatar?: string
  bio?: string
  twitter?: string
}

interface BlogPostData {
  title: string
  content: string
  excerpt?: string
  image?: string
  author: Author
  category: string
  tags?: string[]
  publishedAt: string
  readTime: string
}

interface RelatedPost {
  id: string
  title: string
  excerpt: string
  image?: string
  slug: string
}

interface BlogPostProps {
  post?: BlogPostData
  relatedPosts?: RelatedPost[]
  onBack?: () => void
  onRelatedClick?: (post: RelatedPost) => void
  className?: string
}

export function BlogPost({
  post,
  relatedPosts,
  onBack,
  onRelatedClick,
  className = '',
}: BlogPostProps) {
  const defaultPost: BlogPostData = post || {
    title: 'Next.js 15에서 새로워진 기능들',
    content: `
      <p>Next.js 15 버전이 출시되면서 많은 새로운 기능들이 추가되었습니다. 이번 포스트에서는 주요 변경사항들을 살펴보겠습니다.</p>

      <h2>1. 서버 컴포넌트 개선</h2>
      <p>React 서버 컴포넌트가 더욱 안정화되었습니다. 이제 서버에서 데이터를 가져와 클라이언트로 전달하는 과정이 더욱 효율적으로 처리됩니다.</p>

      <h2>2. 라우팅 시스템</h2>
      <p>App Router의 성능이 크게 개선되었습니다. 페이지 전환 시 부드러운 애니메이션과 함께 더 빠른 로딩 속도를 경험할 수 있습니다.</p>

      <h2>3. 이미지 최적화</h2>
      <p>next/image 컴포넌트가 업그레이드되어 더 나은 이미지 최적화를 제공합니다. AVIF 포맷 지원과 함께 자동 lazy loading이 개선되었습니다.</p>

      <h2>4. 개발자 경험</h2>
      <p>Hot Module Replacement가 개선되어 개발 중 변경사항이 더 빠르게 반영됩니다. 또한 에러 메시지가 더욱 명확해졌습니다.</p>

      <h2>결론</h2>
      <p>Next.js 15는 성능과 개발자 경험 모두를 개선한 훌륭한 업데이트입니다. 새 프로젝트를 시작하거나 기존 프로젝트를 마이그레이션하는 것을 권장합니다.</p>
    `,
    excerpt: 'Next.js 15 버전에서 추가된 새로운 기능들과 개선사항을 살펴봅니다.',
    author: {
      name: '김개발',
      bio: 'Frontend Developer, React & Next.js 전문가',
      twitter: '@kimdev',
    },
    category: '개발',
    tags: ['Next.js', 'React', 'Web Development'],
    publishedAt: '2024년 1월 15일',
    readTime: '5분',
  }

  const defaultRelated: RelatedPost[] = relatedPosts || [
    { id: '1', title: 'React 19 새로운 기능 미리보기', excerpt: 'React 19에서 예정된 새로운 기능들을 알아봅니다.', slug: 'react-19-preview' },
    { id: '2', title: 'TypeScript 5.0 완벽 가이드', excerpt: 'TypeScript 5.0의 새로운 타입 시스템을 깊이 있게 살펴봅니다.', slug: 'typescript-5-guide' },
    { id: '3', title: 'Tailwind CSS 팁과 트릭', excerpt: '실무에서 유용한 Tailwind CSS 활용법을 공유합니다.', slug: 'tailwind-tips' },
  ]

  return (
    <div className={`py-12 ${className}`} style={{ background: 'var(--color-bg)' }}>
      <article className="max-w-3xl mx-auto px-6">
        {/* 뒤로가기 */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-sm hover:underline"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기
        </button>

        {/* 카테고리 & 메타 */}
        <div className="mb-6">
          <span
            className="text-sm font-medium px-3 py-1 rounded-full"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            {defaultPost.category}
          </span>
        </div>

        {/* 제목 */}
        <h1
          className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
          style={{ color: 'var(--color-text)' }}
        >
          {defaultPost.title}
        </h1>

        {/* 메타 정보 */}
        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              {defaultPost.author.name.charAt(0)}
            </div>
            <span className="font-medium" style={{ color: 'var(--color-text)' }}>
              {defaultPost.author.name}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {defaultPost.publishedAt}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {defaultPost.readTime} 읽기
          </span>
        </div>

        {/* 대표 이미지 */}
        <div
          className="aspect-video rounded-2xl mb-10 flex items-center justify-center"
          style={{ background: 'var(--color-bg-secondary)' }}
        >
          {defaultPost.image ? (
            <img src={defaultPost.image} alt={defaultPost.title} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <span className="text-6xl">📝</span>
          )}
        </div>

        {/* 본문 */}
        <div
          className="prose prose-lg max-w-none mb-10"
          style={{ color: 'var(--color-text)' }}
          dangerouslySetInnerHTML={{ __html: defaultPost.content }}
        />

        {/* 태그 */}
        {defaultPost.tags && defaultPost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <Tag className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
            {defaultPost.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm px-3 py-1 rounded-full"
                style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex items-center justify-between py-6 border-t border-b mb-10" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
              <Heart className="w-5 h-5" /> 좋아요
            </button>
            <button className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
              <Bookmark className="w-5 h-5" /> 저장
            </button>
          </div>
          <button className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
            <Share2 className="w-5 h-5" /> 공유
          </button>
        </div>

        {/* 저자 정보 */}
        <div
          className="p-6 rounded-2xl mb-12"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              {defaultPost.author.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                {defaultPost.author.name}
              </h3>
              {defaultPost.author.bio && (
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  {defaultPost.author.bio}
                </p>
              )}
              {defaultPost.author.twitter && (
                <a
                  href={`https://twitter.com/${defaultPost.author.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {defaultPost.author.twitter}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 관련 글 */}
        {defaultRelated.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
              관련 글
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {defaultRelated.map((related) => (
                <article
                  key={related.id}
                  onClick={() => onRelatedClick?.(related)}
                  className="p-4 rounded-xl cursor-pointer hover:-translate-y-1 transition-transform"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                >
                  <h3
                    className="font-semibold mb-2 line-clamp-2"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {related.title}
                  </h3>
                  <p
                    className="text-sm line-clamp-2"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {related.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
