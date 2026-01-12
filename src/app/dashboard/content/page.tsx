'use client'

/**
 * 콘텐츠 관리 - 데이터베이스 연동 비즈니스 서비스 예제
 *
 * 이 페이지는 다음을 보여줍니다:
 * 1. 데이터베이스 CRUD (Prisma + API)
 * 2. AI 통합 (콘텐츠 자동 생성)
 * 3. 인증된 사용자별 데이터 관리
 * 4. 필터링 및 검색
 */

import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { useAuth } from '@/onesaas-core/auth/provider'
import { createClient } from '@/lib/supabase/client'

interface Content {
  id: string
  title: string
  body: string | null
  type: string
  status: string
  metadata: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

// API 호출 헬퍼 함수
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const supabase = createClient()
  let token = ''

  if (supabase) {
    const { data } = await supabase.auth.getSession()
    token = data.session?.access_token || ''
  }

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
}

const contentTypes = [
  { id: 'post', label: '블로그', icon: '📝' },
  { id: 'page', label: '페이지', icon: '📄' },
  { id: 'draft', label: '임시저장', icon: '📋' },
]

const statusOptions = [
  { id: 'draft', label: '초안', color: 'bg-yellow-500/20 text-yellow-500' },
  { id: 'published', label: '게시됨', color: 'bg-green-500/20 text-green-500' },
  { id: 'archived', label: '보관됨', color: 'bg-gray-500/20 text-gray-500' },
]

export default function ContentPage() {
  const { user } = useAuth()

  // 상태 관리
  const [contents, setContents] = useState<Content[]>([])
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // 필터 상태
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')

  // 폼 상태
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [editType, setEditType] = useState('post')
  const [editStatus, setEditStatus] = useState('draft')

  // 로딩/에러 상태
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // AI 기능 상태
  const [aiLoading, setAiLoading] = useState(false)

  // 콘텐츠 목록 불러오기
  const fetchContents = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (selectedType !== 'all') {
        params.set('type', selectedType)
      }

      const res = await fetchWithAuth(`/api/contents?${params.toString()}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '콘텐츠를 불러올 수 없습니다')
      }

      const data = await res.json()
      setContents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }, [selectedType])

  useEffect(() => {
    fetchContents()
  }, [fetchContents])

  // 새 콘텐츠 생성
  const handleCreate = async () => {
    try {
      setIsSaving(true)
      setError(null)

      const res = await fetchWithAuth('/api/contents', {
        method: 'POST',
        body: JSON.stringify({
          title: editTitle || '새 콘텐츠',
          body: editBody,
          type: editType,
          status: editStatus,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '콘텐츠를 생성할 수 없습니다')
      }

      const newContent = await res.json()
      setContents((prev) => [newContent, ...prev])
      setSelectedContent(newContent)
      setIsCreating(false)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '생성 중 오류가 발생했습니다')
    } finally {
      setIsSaving(false)
    }
  }

  // 콘텐츠 수정
  const handleUpdate = async () => {
    if (!selectedContent) return

    try {
      setIsSaving(true)
      setError(null)

      const res = await fetchWithAuth(`/api/contents/${selectedContent.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: editTitle,
          body: editBody,
          type: editType,
          status: editStatus,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '콘텐츠를 수정할 수 없습니다')
      }

      const updatedContent = await res.json()
      setContents((prev) =>
        prev.map((c) => (c.id === updatedContent.id ? updatedContent : c))
      )
      setSelectedContent(updatedContent)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '수정 중 오류가 발생했습니다')
    } finally {
      setIsSaving(false)
    }
  }

  // 콘텐츠 삭제
  const handleDelete = async (id: string) => {
    if (!confirm('이 콘텐츠를 삭제하시겠습니까?')) return

    try {
      setError(null)

      const res = await fetchWithAuth(`/api/contents/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '콘텐츠를 삭제할 수 없습니다')
      }

      setContents((prev) => prev.filter((c) => c.id !== id))
      if (selectedContent?.id === id) {
        setSelectedContent(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다')
    }
  }

  // AI 콘텐츠 생성
  const handleAiGenerate = async () => {
    if (!editTitle) {
      setError('제목을 먼저 입력해주세요')
      return
    }

    try {
      setAiLoading(true)
      setError(null)

      const res = await fetchWithAuth('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `당신은 전문 콘텐츠 작성자입니다. 주어진 제목에 대해 ${editType === 'post' ? '블로그 포스트' : '페이지 콘텐츠'}를 작성해주세요.
              - 한국어로 작성
              - 3-5개의 문단으로 구성
              - 전문적이고 읽기 쉬운 톤
              - 마크다운 형식 사용`,
            },
            { role: 'user', content: `제목: ${editTitle}` },
          ],
          stream: false,
        }),
      })

      if (!res.ok) {
        throw new Error('AI 콘텐츠 생성에 실패했습니다')
      }

      const data = await res.json()
      setEditBody(data.text || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 기능 오류')
    } finally {
      setAiLoading(false)
    }
  }

  // 새 콘텐츠 모드
  const handleNewContent = () => {
    setSelectedContent(null)
    setEditTitle('')
    setEditBody('')
    setEditType('post')
    setEditStatus('draft')
    setIsCreating(true)
    setIsEditing(true)
  }

  // 콘텐츠 선택
  const handleSelectContent = (content: Content) => {
    setSelectedContent(content)
    setEditTitle(content.title)
    setEditBody(content.body || '')
    setEditType(content.type)
    setEditStatus(content.status)
    setIsCreating(false)
    setIsEditing(false)
  }

  // 저장 처리
  const handleSave = () => {
    if (isCreating) {
      handleCreate()
    } else {
      handleUpdate()
    }
  }

  // 필터된 콘텐츠
  const filteredContents = contents.filter((content) =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (content.body || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // 상태 색상
  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find((s) => s.id === status)
    return statusOption?.color || 'bg-gray-500/20 text-gray-500'
  }

  // 타입 아이콘
  const getTypeIcon = (type: string) => {
    const typeOption = contentTypes.find((t) => t.id === type)
    return typeOption?.icon || '📄'
  }

  return (
    <DashboardLayout title="콘텐츠">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">콘텐츠 관리</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {user?.email ? `${user.email}님의 콘텐츠` : '블로그, 페이지 등 콘텐츠를 관리하세요'}
            </p>
          </div>
          <button
            onClick={handleNewContent}
            className="px-6 py-3 rounded-xl font-medium transition-all hover:opacity-90"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            + 새 콘텐츠
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div
            className="p-4 rounded-xl mb-6"
            style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
          >
            {error}
            <button onClick={() => setError(null)} className="ml-4 underline">
              닫기
            </button>
          </div>
        )}

        {/* 필터 */}
        <div
          className="p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          {/* 검색 */}
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="콘텐츠 검색..."
              className="w-full px-4 py-2 rounded-lg outline-none"
              style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>
          {/* 타입 필터 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className="px-3 py-1.5 rounded-full text-sm transition-all"
              style={{
                background: selectedType === 'all' ? 'var(--color-accent)' : 'var(--color-bg)',
                color: selectedType === 'all' ? 'var(--color-bg)' : 'var(--color-text)',
              }}
            >
              전체
            </button>
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className="px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-1"
                style={{
                  background: selectedType === type.id ? 'var(--color-accent)' : 'var(--color-bg)',
                  color: selectedType === type.id ? 'var(--color-bg)' : 'var(--color-text)',
                }}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 콘텐츠 목록 */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500"></div>
                <p className="mt-4" style={{ color: 'var(--color-text-secondary)' }}>
                  콘텐츠를 불러오는 중...
                </p>
              </div>
            ) : filteredContents.length === 0 ? (
              <div className="text-center py-12" style={{ color: 'var(--color-text-secondary)' }}>
                <span className="text-5xl mb-4 block">📝</span>
                <p className="text-lg mb-2">콘텐츠가 없습니다</p>
                <p className="text-sm mb-4">첫 번째 콘텐츠를 만들어보세요</p>
                <button
                  onClick={handleNewContent}
                  className="px-6 py-3 rounded-xl font-medium"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  첫 콘텐츠 만들기
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredContents.map((content) => (
                  <div
                    key={content.id}
                    onClick={() => handleSelectContent(content)}
                    className="p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                    style={{
                      background: 'var(--color-bg-secondary)',
                      border:
                        selectedContent?.id === content.id
                          ? '2px solid var(--color-accent)'
                          : '1px solid var(--color-border)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getTypeIcon(content.type)}</span>
                          <h3 className="font-bold text-lg truncate">{content.title}</h3>
                        </div>
                        <p
                          className="text-sm mt-1 line-clamp-2"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {content.body || '(내용 없음)'}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(content.status)}`}>
                            {statusOptions.find((s) => s.id === content.status)?.label || content.status}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                            {formatDate(content.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(content.id)
                        }}
                        className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 콘텐츠 에디터 */}
          <div className="lg:col-span-1">
            {selectedContent || isCreating ? (
              <div
                className="rounded-2xl p-6 sticky top-24"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-xl font-bold mb-4 px-3 py-2 rounded-lg bg-transparent outline-none"
                      style={{
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                      }}
                      placeholder="제목"
                    />

                    {/* 타입 & 상태 선택 */}
                    <div className="flex gap-2 mb-4">
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg outline-none"
                        style={{
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      >
                        {contentTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg outline-none"
                        style={{
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      >
                        {statusOptions.map((status) => (
                          <option key={status.id} value={status.id}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      className="w-full h-48 px-3 py-2 rounded-lg bg-transparent outline-none resize-none"
                      style={{
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                      }}
                      placeholder="내용을 입력하세요..."
                    />

                    {/* AI 버튼 */}
                    <button
                      onClick={handleAiGenerate}
                      disabled={aiLoading || !editTitle}
                      className="w-full mt-4 mb-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                    >
                      {aiLoading ? '✨ AI가 작성 중...' : '✨ AI로 콘텐츠 생성'}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50"
                        style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                      >
                        {isSaving ? '저장 중...' : isCreating ? '생성하기' : '저장하기'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setIsCreating(false)
                        }}
                        className="flex-1 py-2.5 rounded-lg font-medium"
                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                      >
                        취소
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getTypeIcon(selectedContent?.type || '')}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(selectedContent?.status || '')}`}>
                        {statusOptions.find((s) => s.id === selectedContent?.status)?.label}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-4">{selectedContent?.title}</h2>
                    <p
                      className="whitespace-pre-wrap mb-4 text-sm leading-relaxed"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {selectedContent?.body || '(내용 없음)'}
                    </p>
                    <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                      마지막 수정: {selectedContent && formatDate(selectedContent.updatedAt)}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full py-2.5 rounded-lg font-medium transition-all hover:opacity-90"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      수정하기
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div
                className="rounded-2xl p-6 text-center"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span className="text-5xl mb-4 block">📄</span>
                <p className="mb-2 font-medium">콘텐츠를 선택하세요</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  왼쪽에서 콘텐츠를 선택하면
                  <br />
                  여기서 편집할 수 있습니다
                </p>
              </div>
            )}

            {/* 비즈니스 로직 안내 */}
            <div
              className="mt-6 rounded-xl p-4 text-sm"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              <h4 className="font-bold mb-2">💡 비즈니스 서비스 예제</h4>
              <ul className="space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                <li>✅ 데이터베이스 CRUD (Prisma)</li>
                <li>✅ 인증된 사용자별 데이터</li>
                <li>✅ AI 콘텐츠 자동 생성</li>
                <li>✅ 필터링 및 검색</li>
                <li>✅ 타입/상태 관리</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
