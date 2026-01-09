'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

interface Template {
  id: string
  title: string
  description: string
  category: string
  icon: string
  color: string
  prompt?: string
}

export default function TemplatesPage() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'marketing', label: '마케팅' },
    { id: 'writing', label: '글쓰기' },
    { id: 'business', label: '비즈니스' },
    { id: 'creative', label: '크리에이티브' },
    { id: 'social', label: '소셜 미디어' },
  ]

  const templates: Template[] = [
    // 마케팅
    {
      id: '1',
      title: '광고 카피 생성',
      description: '제품이나 서비스를 위한 매력적인 광고 문구를 만들어 드립니다.',
      category: 'marketing',
      icon: '📢',
      color: '#fef3c7',
      prompt: '다음 제품에 대한 광고 카피를 작성해주세요:',
    },
    {
      id: '2',
      title: '이메일 마케팅',
      description: '전환율 높은 마케팅 이메일을 작성합니다.',
      category: 'marketing',
      icon: '📧',
      color: '#dbeafe',
      prompt: '다음 내용으로 마케팅 이메일을 작성해주세요:',
    },
    {
      id: '3',
      title: 'SEO 최적화 제목',
      description: '검색엔진에 최적화된 제목과 메타 설명을 생성합니다.',
      category: 'marketing',
      icon: '🔍',
      color: '#dcfce7',
    },
    // 글쓰기
    {
      id: '4',
      title: '블로그 글 작성',
      description: '주제에 맞는 흥미로운 블로그 글을 작성해 드립니다.',
      category: 'writing',
      icon: '✍️',
      color: '#fce7f3',
    },
    {
      id: '5',
      title: '스토리 작성',
      description: '창의적인 이야기와 시나리오를 만들어 드립니다.',
      category: 'writing',
      icon: '📖',
      color: '#e9d5ff',
    },
    {
      id: '6',
      title: '요약 생성',
      description: '긴 글을 핵심만 간추려 요약해 드립니다.',
      category: 'writing',
      icon: '📋',
      color: '#fef2f2',
    },
    // 비즈니스
    {
      id: '7',
      title: '사업 계획서',
      description: '체계적인 사업 계획서 초안을 작성해 드립니다.',
      category: 'business',
      icon: '💼',
      color: '#dbeafe',
    },
    {
      id: '8',
      title: '프레젠테이션 구조',
      description: '효과적인 발표 자료의 구조와 내용을 제안합니다.',
      category: 'business',
      icon: '📊',
      color: '#dcfce7',
    },
    {
      id: '9',
      title: '회의록 정리',
      description: '회의 내용을 체계적으로 정리해 드립니다.',
      category: 'business',
      icon: '📝',
      color: '#fef3c7',
    },
    // 크리에이티브
    {
      id: '10',
      title: '이미지 프롬프트',
      description: 'AI 이미지 생성을 위한 상세한 프롬프트를 만들어 드립니다.',
      category: 'creative',
      icon: '🎨',
      color: '#e9d5ff',
    },
    {
      id: '11',
      title: '영상 스크립트',
      description: '유튜브, 릴스 등을 위한 영상 대본을 작성합니다.',
      category: 'creative',
      icon: '🎬',
      color: '#fce7f3',
    },
    {
      id: '12',
      title: '브랜드 네이밍',
      description: '브랜드나 제품을 위한 창의적인 이름을 제안합니다.',
      category: 'creative',
      icon: '💡',
      color: '#fef2f2',
    },
    // 소셜 미디어
    {
      id: '13',
      title: '인스타그램 캡션',
      description: '참여를 유도하는 인스타그램 게시물 문구를 작성합니다.',
      category: 'social',
      icon: '📱',
      color: '#fce7f3',
    },
    {
      id: '14',
      title: '트위터/X 스레드',
      description: '바이럴 될 수 있는 트위터 스레드를 작성합니다.',
      category: 'social',
      icon: '🐦',
      color: '#dbeafe',
    },
    {
      id: '15',
      title: '링크드인 포스트',
      description: '전문적인 링크드인 게시물을 작성합니다.',
      category: 'social',
      icon: '💼',
      color: '#dcfce7',
    },
  ]

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = category === 'all' || t.category === category
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleUseTemplate = (template: Template) => {
    // 데모: AI 채팅 페이지로 이동하면서 프롬프트 전달
    alert(`"${template.title}" 템플릿을 사용합니다.\n\n실제로는 AI 채팅 페이지로 이동하여 해당 프롬프트가 자동으로 입력됩니다.`)
  }

  return (
    <DashboardLayout title="템플릿">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">템플릿</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            다양한 용도에 맞는 AI 프롬프트 템플릿을 사용해보세요
          </p>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="템플릿 검색..."
            className="w-full px-4 py-3 rounded-xl"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        {/* 카테고리 탭 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="px-4 py-2 rounded-lg text-sm transition-all"
              style={{
                background: category === cat.id ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                color: category === cat.id ? 'var(--color-bg)' : 'var(--color-text)',
                border: '1px solid var(--color-border)',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 템플릿 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-2xl p-6 transition-all hover:scale-[1.02] cursor-pointer group"
              style={{
                background: template.color,
                border: '1px solid transparent',
              }}
              onClick={() => handleUseTemplate(template)}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{template.icon}</span>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.6)' }}
                >
                  {categories.find((c) => c.id === template.category)?.label}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{template.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              <button
                className="w-full py-2 rounded-lg text-sm font-medium transition-all opacity-0 group-hover:opacity-100"
                style={{ background: 'rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.8)' }}
              >
                사용하기 →
              </button>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="text-4xl mb-4 block">🔍</span>
            <p>검색 결과가 없습니다</p>
          </div>
        )}

        {/* 추천 섹션 */}
        <div
          className="mt-12 rounded-2xl p-8 text-center"
          style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, #10b981 100%)' }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            원하는 템플릿이 없나요?
          </h2>
          <p className="text-white/80 mb-6">
            AI 채팅에서 직접 원하는 작업을 요청해보세요.<br />
            어떤 질문이든 도와드립니다!
          </p>
          <a
            href="/dashboard/ai-chat"
            className="inline-block px-8 py-3 rounded-xl font-medium"
            style={{ background: 'white', color: 'var(--color-accent)' }}
          >
            AI 채팅 시작하기 →
          </a>
        </div>
      </div>
    </DashboardLayout>
  )
}
