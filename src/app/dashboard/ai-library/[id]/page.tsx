'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
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
const dummyData: Record<string, AIContent> = {
  '1': {
    id: '1',
    type: 'prompt',
    title: '마케팅 카피 프롬프트',
    content: `다음 제품에 대한 매력적인 마케팅 카피를 작성해주세요.

[제품명]: {제품명}
[타겟 고객]: {타겟}
[핵심 가치]: {가치}
[톤앤매너]: 친근하고 전문적인

요구사항:
1. 헤드라인 (10자 이내)
2. 서브 헤드라인 (20자 이내)
3. 본문 (100자 이내)
4. CTA 버튼 텍스트

형식에 맞춰 작성해주세요.`,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    tags: ['마케팅', '카피라이팅'],
    isFavorite: true,
  },
  '2': {
    id: '2',
    type: 'image',
    title: '미래 도시 일러스트',
    content: 'A futuristic cityscape with flying cars and neon lights, cyberpunk style, detailed illustration, 4K, trending on artstation',
    preview: 'https://picsum.photos/seed/city/800/600',
    createdAt: '2024-01-14T15:20:00Z',
    updatedAt: '2024-01-14T15:20:00Z',
    tags: ['일러스트', '미래'],
    isFavorite: false,
  },
  '3': {
    id: '3',
    type: 'chat',
    title: 'GPT와 코딩 대화',
    content: `[사용자]: React에서 상태 관리를 어떻게 해야 할까요?

[AI]: React에서 상태 관리는 여러 방법이 있습니다:

1. **useState** - 간단한 로컬 상태
2. **useReducer** - 복잡한 상태 로직
3. **Context API** - 전역 상태 (중간 규모)
4. **Redux/Zustand** - 대규모 앱

프로젝트 규모에 따라 선택하세요.

[사용자]: Zustand 예제 좀 보여주세요.

[AI]: \`\`\`typescript
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
\`\`\``,
    createdAt: '2024-01-13T09:00:00Z',
    updatedAt: '2024-01-13T09:00:00Z',
    tags: ['코딩', 'React'],
    isFavorite: true,
  },
}

const typeConfig: Record<AIContentType, { icon: string; label: string; color: string }> = {
  prompt: { icon: '✨', label: '프롬프트', color: '#8b5cf6' },
  image: { icon: '🎨', label: '이미지', color: '#ec4899' },
  chat: { icon: '💬', label: '대화', color: '#3b82f6' },
  document: { icon: '📄', label: '문서', color: '#10b981' },
}

export default function AILibraryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [item, setItem] = useState<AIContent | null>(dummyData[id] || null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!item) {
    return (
      <DashboardLayout title="AI 라이브러리">
        <div className="max-w-4xl mx-auto text-center py-16">
          <span className="text-6xl block mb-4">🔍</span>
          <h2 className="text-2xl font-bold mb-4">항목을 찾을 수 없습니다</h2>
          <Link
            href="/dashboard/ai-library"
            className="text-sm"
            style={{ color: 'var(--color-accent)' }}
          >
            ← 목록으로 돌아가기
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const config = typeConfig[item.type]

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 복사
  const handleCopy = () => {
    navigator.clipboard.writeText(item.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 즐겨찾기 토글
  const toggleFavorite = () => {
    setItem({ ...item, isFavorite: !item.isFavorite })
  }

  // 삭제
  const handleDelete = () => {
    // 실제로는 API 호출
    router.push('/dashboard/ai-library')
  }

  return (
    <DashboardLayout title="AI 라이브러리">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 */}
        <Link
          href="/dashboard/ai-library"
          className="inline-flex items-center gap-2 mb-6 text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          ← 목록으로
        </Link>

        {/* 헤더 */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: `${config.color}20` }}
              >
                {config.icon}
              </span>
              <div>
                <span
                  className="px-2 py-1 rounded-md text-xs font-medium"
                  style={{ background: `${config.color}20`, color: config.color }}
                >
                  {config.label}
                </span>
                <h1 className="text-2xl font-bold mt-1">{item.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleFavorite}
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
                onClick={() => setShowDeleteModal(true)}
                className="p-2 rounded-lg transition-all hover:scale-110"
                style={{ background: 'var(--color-bg)' }}
                title="삭제"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-sm"
                style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 날짜 */}
          <div className="flex gap-6 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <span>생성: {formatDate(item.createdAt)}</span>
            <span>수정: {formatDate(item.updatedAt)}</span>
          </div>
        </div>

        {/* 이미지 프리뷰 */}
        {item.type === 'image' && item.preview && (
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{ border: '1px solid var(--color-border)' }}
          >
            <img
              src={item.preview}
              alt={item.title}
              className="w-full"
            />
          </div>
        )}

        {/* 콘텐츠 */}
        <div
          className="rounded-2xl p-6"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">내용</h2>
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all hover:scale-105"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              {copied ? '✓ 복사됨' : '📋 복사'}
            </button>
          </div>
          <div
            className="p-4 rounded-xl whitespace-pre-wrap font-mono text-sm"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
          >
            {item.content}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-4 mt-6">
          <Link
            href={`/dashboard/ai-library/${item.id}/edit`}
            className="flex-1 py-3 rounded-xl font-medium text-center transition-all hover:scale-[1.02]"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            수정하기
          </Link>
          <button
            onClick={handleCopy}
            className="flex-1 py-3 rounded-xl font-medium transition-all hover:scale-[1.02]"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            내용 복사
          </button>
        </div>

        {/* 삭제 확인 모달 */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className="max-w-md w-full p-6 rounded-2xl"
              style={{ background: 'var(--color-bg)' }}
            >
              <h3 className="text-xl font-bold mb-4">삭제 확인</h3>
              <p style={{ color: 'var(--color-text-secondary)' }} className="mb-6">
                "{item.title}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-lg"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
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
