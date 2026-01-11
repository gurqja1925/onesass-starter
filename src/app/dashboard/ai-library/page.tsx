'use client'

import Link from 'next/link'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

// AI 생성물 타입
type AIContentType = 'prompt' | 'image' | 'chat' | 'document'

interface AIContent {
  id: string
  type: AIContentType
  title: string
  content: string
  preview?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  isFavorite: boolean
}

// 더미 데이터
const dummyData: AIContent[] = [
  {
    id: '1',
    type: 'prompt',
    title: '마케팅 카피 프롬프트',
    content: '다음 제품에 대한 매력적인 마케팅 카피를 작성해주세요...',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    tags: ['마케팅', '카피라이팅'],
    isFavorite: true,
  },
  {
    id: '2',
    type: 'image',
    title: '미래 도시 일러스트',
    content: 'A futuristic cityscape with flying cars and neon lights...',
    preview: 'https://picsum.photos/seed/city/400/300',
    createdAt: '2024-01-14T15:20:00Z',
    updatedAt: '2024-01-14T15:20:00Z',
    tags: ['일러스트', '미래'],
    isFavorite: false,
  },
  {
    id: '3',
    type: 'chat',
    title: 'GPT와 코딩 대화',
    content: 'React에서 상태 관리에 대해 질문했던 대화입니다...',
    createdAt: '2024-01-13T09:00:00Z',
    updatedAt: '2024-01-13T09:00:00Z',
    tags: ['코딩', 'React'],
    isFavorite: true,
  },
  {
    id: '4',
    type: 'document',
    title: '사업 계획서 초안',
    content: 'AI가 작성한 사업 계획서 초안입니다...',
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-12T14:00:00Z',
    tags: ['사업', '문서'],
    isFavorite: false,
  },
  {
    id: '5',
    type: 'prompt',
    title: 'SEO 블로그 작성 프롬프트',
    content: 'SEO에 최적화된 블로그 글을 작성해주세요...',
    createdAt: '2024-01-11T11:00:00Z',
    updatedAt: '2024-01-11T11:00:00Z',
    tags: ['SEO', '블로그'],
    isFavorite: false,
  },
]

const typeConfig: Record<AIContentType, { icon: string; label: string; color: string }> = {
  prompt: { icon: '✨', label: '프롬프트', color: '#8b5cf6' },
  image: { icon: '🎨', label: '이미지', color: '#ec4899' },
  chat: { icon: '💬', label: '대화', color: '#3b82f6' },
  document: { icon: '📄', label: '문서', color: '#10b981' },
}

export default function AILibraryPage() {
  const [items, setItems] = useState<AIContent[]>(dummyData)
  const [filter, setFilter] = useState<AIContentType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)

  // 필터링
  const filteredItems = items.filter(item => {
    const matchesType = filter === 'all' || item.type === filter
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesType && matchesSearch
  })

  // 즐겨찾기 토글
  const toggleFavorite = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ))
  }

  // 삭제
  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id))
    setShowDeleteModal(null)
  }

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <DashboardLayout title="AI 라이브러리">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">AI 라이브러리</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              AI로 생성한 프롬프트, 이미지, 대화, 문서를 관리하세요
            </p>
          </div>
          <Link
            href="/dashboard/ai-library/new"
            className="px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            <span>+</span>
            <span>새로 만들기</span>
          </Link>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* 검색 */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="제목, 내용, 태그로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-xl outline-none transition-all"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
          </div>

          {/* 필터 */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className="px-4 py-2 rounded-lg font-medium transition-all"
              style={{
                background: filter === 'all' ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                color: filter === 'all' ? 'var(--color-bg)' : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              전체
            </button>
            {Object.entries(typeConfig).map(([type, config]) => (
              <button
                key={type}
                onClick={() => setFilter(type as AIContentType)}
                className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                style={{
                  background: filter === type ? config.color : 'var(--color-bg-secondary)',
                  color: filter === type ? 'white' : 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span>{config.icon}</span>
                <span>{config.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(typeConfig).map(([type, config]) => {
            const count = items.filter(item => item.type === type).length
            return (
              <div
                key={type}
                className="p-4 rounded-xl"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ background: `${config.color}20` }}
                  >
                    {config.icon}
                  </span>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{config.label}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 목록 */}
        {filteredItems.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            <span className="text-6xl block mb-4">📭</span>
            <p className="text-lg font-medium mb-2">항목이 없습니다</p>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {searchQuery ? '검색 조건에 맞는 항목이 없습니다' : '새로운 AI 콘텐츠를 만들어보세요'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map((item) => {
              const config = typeConfig[item.type]
              return (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden transition-all hover:scale-[1.01]"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* 이미지 프리뷰 (이미지 타입일 경우) */}
                    {item.type === 'image' && item.preview && (
                      <div className="md:w-48 h-32 md:h-auto">
                        <img
                          src={item.preview}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* 콘텐츠 */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* 타입 배지 */}
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"
                              style={{ background: `${config.color}20`, color: config.color }}
                            >
                              {config.icon} {config.label}
                            </span>
                            {item.isFavorite && (
                              <span className="text-yellow-500">⭐</span>
                            )}
                          </div>

                          {/* 제목 */}
                          <Link href={`/dashboard/ai-library/${item.id}`}>
                            <h3 className="text-lg font-bold mb-2 hover:underline">{item.title}</h3>
                          </Link>

                          {/* 내용 미리보기 */}
                          <p
                            className="text-sm line-clamp-2 mb-3"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {item.content}
                          </p>

                          {/* 태그 */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 rounded-md text-xs"
                                style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* 날짜 */}
                          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                            {formatDate(item.createdAt)}
                          </p>
                        </div>

                        {/* 액션 버튼 */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className="p-2 rounded-lg transition-all hover:scale-110"
                            style={{ background: 'var(--color-bg)' }}
                            title={item.isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}
                          >
                            {item.isFavorite ? '⭐' : '☆'}
                          </button>
                          <Link
                            href={`/dashboard/ai-library/${item.id}/edit`}
                            className="p-2 rounded-lg transition-all hover:scale-110"
                            style={{ background: 'var(--color-bg)' }}
                            title="수정"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => setShowDeleteModal(item.id)}
                            className="p-2 rounded-lg transition-all hover:scale-110"
                            style={{ background: 'var(--color-bg)' }}
                            title="삭제"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 삭제 확인 모달 */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className="max-w-md w-full p-6 rounded-2xl"
              style={{ background: 'var(--color-bg)' }}
            >
              <h3 className="text-xl font-bold mb-4">삭제 확인</h3>
              <p style={{ color: 'var(--color-text-secondary)' }} className="mb-6">
                이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 rounded-lg"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                >
                  취소
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ background: '#ef4444' }}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
