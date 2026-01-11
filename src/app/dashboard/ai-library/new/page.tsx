'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

type AIContentType = 'prompt' | 'image' | 'chat' | 'document'

const typeConfig: Record<AIContentType, { icon: string; label: string; color: string; description: string }> = {
  prompt: { icon: '✨', label: '프롬프트', color: '#8b5cf6', description: 'AI에게 지시할 프롬프트를 저장합니다' },
  image: { icon: '🎨', label: '이미지', color: '#ec4899', description: '이미지 생성 프롬프트와 결과를 저장합니다' },
  chat: { icon: '💬', label: '대화', color: '#3b82f6', description: 'AI와의 대화 내용을 저장합니다' },
  document: { icon: '📄', label: '문서', color: '#10b981', description: 'AI가 생성한 문서를 저장합니다' },
}

export default function NewAILibraryPage() {
  const router = useRouter()

  const [type, setType] = useState<AIContentType>('prompt')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요'
    }
    if (!content.trim()) {
      newErrors.content = '내용을 입력해주세요'
    }
    if (type === 'image' && imageUrl && !imageUrl.startsWith('http')) {
      newErrors.imageUrl = '올바른 이미지 URL을 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 성공 시 목록으로 이동
    router.push('/dashboard/ai-library')
  }

  return (
    <DashboardLayout title="AI 라이브러리">
      <div className="max-w-2xl mx-auto">
        {/* 뒤로가기 */}
        <Link
          href="/dashboard/ai-library"
          className="inline-flex items-center gap-2 mb-6 text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          ← 목록으로
        </Link>

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">새로 만들기</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            AI 콘텐츠를 라이브러리에 저장하세요
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 타입 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">유형 선택</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(typeConfig).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setType(key as AIContentType)}
                  className="p-4 rounded-xl text-center transition-all"
                  style={{
                    background: type === key ? config.color : 'var(--color-bg-secondary)',
                    color: type === key ? 'white' : 'var(--color-text)',
                    border: type === key ? 'none' : '1px solid var(--color-border)',
                  }}
                >
                  <span className="text-2xl block mb-2">{config.icon}</span>
                  <span className="font-medium text-sm">{config.label}</span>
                </button>
              ))}
            </div>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
              {typeConfig[type].description}
            </p>
          </div>

          {/* 제목 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 마케팅 카피 프롬프트"
              className="w-full px-4 py-3 rounded-xl outline-none transition-all"
              style={{
                background: 'var(--color-bg-secondary)',
                border: errors.title ? '1px solid #ef4444' : '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* 이미지 URL (이미지 타입일 때만) */}
          {type === 'image' && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                이미지 URL (선택)
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.png"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: errors.imageUrl ? '1px solid #ef4444' : '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
              {errors.imageUrl && (
                <p className="text-sm text-red-500 mt-1">{errors.imageUrl}</p>
              )}
              {imageUrl && imageUrl.startsWith('http') && (
                <div className="mt-3 rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                  <img src={imageUrl} alt="미리보기" className="w-full max-h-64 object-cover" />
                </div>
              )}
            </div>
          )}

          {/* 내용 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                type === 'prompt' ? '프롬프트 내용을 입력하세요...' :
                type === 'image' ? '이미지 생성에 사용한 프롬프트를 입력하세요...' :
                type === 'chat' ? '대화 내용을 붙여넣기 하세요...' :
                '문서 내용을 입력하세요...'
              }
              rows={10}
              className="w-full px-4 py-3 rounded-xl outline-none transition-all resize-none font-mono"
              style={{
                background: 'var(--color-bg-secondary)',
                border: errors.content ? '1px solid #ef4444' : '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            {errors.content && (
              <p className="text-sm text-red-500 mt-1">{errors.content}</p>
            )}
          </div>

          {/* 태그 */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">
              태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="예: 마케팅, 카피라이팅, SNS"
              className="w-full px-4 py-3 rounded-xl outline-none transition-all"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            {tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.split(',').map((tag, i) => tag.trim() && (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl font-medium transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              {isSubmitting ? '저장 중...' : '저장하기'}
            </button>
            <Link
              href="/dashboard/ai-library"
              className="px-6 py-3 rounded-xl font-medium text-center transition-all hover:scale-[1.02]"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
