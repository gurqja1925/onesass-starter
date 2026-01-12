'use client'

/**
 * 노트 서비스 - 데이터베이스 연동 비즈니스 서비스 예제
 *
 * 이 페이지는 다음을 보여줍니다:
 * 1. 데이터베이스 CRUD (Prisma + API)
 * 2. AI 통합 (요약, 확장, 번역)
 * 3. 인증된 사용자별 데이터 관리
 */

import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { useAuth } from '@/onesaas-core/auth/provider'
import { createClient } from '@/lib/supabase/client'

interface Note {
  id: string
  title: string
  content: string | null
  published: boolean
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

export default function NotesPage() {
  const { user } = useAuth()

  // 상태 관리
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // 폼 상태
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  // 로딩/에러 상태
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // AI 기능 상태
  const [aiLoading, setAiLoading] = useState<string | null>(null) // 'summarize' | 'expand' | 'translate'

  // 노트 목록 불러오기
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const res = await fetchWithAuth('/api/notes')
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '노트를 불러올 수 없습니다')
      }

      const data = await res.json()
      setNotes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  // 새 노트 생성
  const handleCreate = async () => {
    try {
      setIsSaving(true)
      setError(null)

      const res = await fetchWithAuth('/api/notes', {
        method: 'POST',
        body: JSON.stringify({
          title: editTitle || '새 노트',
          content: editContent,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '노트를 생성할 수 없습니다')
      }

      const newNote = await res.json()
      setNotes((prev) => [newNote, ...prev])
      setSelectedNote(newNote)
      setIsCreating(false)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '생성 중 오류가 발생했습니다')
    } finally {
      setIsSaving(false)
    }
  }

  // 노트 수정
  const handleUpdate = async () => {
    if (!selectedNote) return

    try {
      setIsSaving(true)
      setError(null)

      const res = await fetchWithAuth(`/api/notes/${selectedNote.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '노트를 수정할 수 없습니다')
      }

      const updatedNote = await res.json()
      setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)))
      setSelectedNote(updatedNote)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '수정 중 오류가 발생했습니다')
    } finally {
      setIsSaving(false)
    }
  }

  // 노트 삭제
  const handleDelete = async (id: string) => {
    if (!confirm('이 노트를 삭제하시겠습니까?')) return

    try {
      setError(null)

      const res = await fetchWithAuth(`/api/notes/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '노트를 삭제할 수 없습니다')
      }

      setNotes((prev) => prev.filter((n) => n.id !== id))
      if (selectedNote?.id === id) {
        setSelectedNote(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다')
    }
  }

  // AI 기능: 요약
  const handleAiSummarize = async () => {
    if (!editContent) return

    try {
      setAiLoading('summarize')
      setError(null)

      const res = await fetchWithAuth('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: '다음 텍스트를 한국어로 간결하게 요약해주세요. 핵심 내용만 3-5문장으로 정리하세요.',
            },
            { role: 'user', content: editContent },
          ],
          stream: false,
        }),
      })

      if (!res.ok) {
        throw new Error('AI 요약에 실패했습니다')
      }

      const data = await res.json()
      setEditContent(data.text || editContent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 기능 오류')
    } finally {
      setAiLoading(null)
    }
  }

  // AI 기능: 확장
  const handleAiExpand = async () => {
    if (!editContent) return

    try {
      setAiLoading('expand')
      setError(null)

      const res = await fetchWithAuth('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content:
                '다음 텍스트를 더 자세하고 풍부하게 확장해주세요. 관련 내용과 설명을 추가하여 2-3배 정도 길이로 만들어주세요. 한국어로 작성하세요.',
            },
            { role: 'user', content: editContent },
          ],
          stream: false,
        }),
      })

      if (!res.ok) {
        throw new Error('AI 확장에 실패했습니다')
      }

      const data = await res.json()
      setEditContent(data.text || editContent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 기능 오류')
    } finally {
      setAiLoading(null)
    }
  }

  // AI 기능: 번역
  const handleAiTranslate = async () => {
    if (!editContent) return

    try {
      setAiLoading('translate')
      setError(null)

      const res = await fetchWithAuth('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content:
                '다음 텍스트가 한국어이면 영어로, 영어이면 한국어로 번역해주세요. 번역 결과만 출력하세요.',
            },
            { role: 'user', content: editContent },
          ],
          stream: false,
        }),
      })

      if (!res.ok) {
        throw new Error('AI 번역에 실패했습니다')
      }

      const data = await res.json()
      setEditContent(data.text || editContent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 기능 오류')
    } finally {
      setAiLoading(null)
    }
  }

  // 새 노트 모드
  const handleNewNote = () => {
    setSelectedNote(null)
    setEditTitle('새 노트')
    setEditContent('')
    setIsCreating(true)
    setIsEditing(true)
  }

  // 노트 선택
  const handleSelectNote = (note: Note) => {
    setSelectedNote(note)
    setEditTitle(note.title)
    setEditContent(note.content || '')
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

  // 필터된 노트
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.content || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <DashboardLayout title="노트">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">노트</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {user?.email ? `${user.email}님의 노트` : '아이디어와 메모를 정리하세요'}
            </p>
          </div>
          <button
            onClick={handleNewNote}
            className="px-6 py-3 rounded-xl font-medium transition-all hover:opacity-90"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            + 새 노트
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

        {/* 검색 */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="노트 검색..."
            className="w-full px-4 py-3 rounded-xl outline-none"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 노트 목록 */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500"></div>
                <p className="mt-4" style={{ color: 'var(--color-text-secondary)' }}>
                  노트를 불러오는 중...
                </p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-12" style={{ color: 'var(--color-text-secondary)' }}>
                <span className="text-5xl mb-4 block">📝</span>
                <p className="text-lg mb-2">노트가 없습니다</p>
                <p className="text-sm mb-4">첫 번째 노트를 만들어보세요</p>
                <button
                  onClick={handleNewNote}
                  className="px-6 py-3 rounded-xl font-medium"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  첫 노트 만들기
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className="p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                    style={{
                      background: 'var(--color-bg-secondary)',
                      border:
                        selectedNote?.id === note.id
                          ? '2px solid var(--color-accent)'
                          : '1px solid var(--color-border)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">{note.title}</h3>
                        <p
                          className="text-sm mt-1 line-clamp-2"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {note.content || '(내용 없음)'}
                        </p>
                        <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                          {formatDate(note.updatedAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(note.id)
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

          {/* 노트 에디터 */}
          <div className="lg:col-span-1">
            {selectedNote || isCreating ? (
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
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-48 px-3 py-2 rounded-lg bg-transparent outline-none resize-none"
                      style={{
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                      }}
                      placeholder="내용을 입력하세요..."
                    />

                    {/* AI 기능 버튼 */}
                    <div className="flex flex-wrap gap-2 mt-4 mb-4">
                      <button
                        onClick={handleAiSummarize}
                        disabled={!!aiLoading || !editContent}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                      >
                        {aiLoading === 'summarize' ? '요약 중...' : '✨ AI 요약'}
                      </button>
                      <button
                        onClick={handleAiExpand}
                        disabled={!!aiLoading || !editContent}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                      >
                        {aiLoading === 'expand' ? '확장 중...' : '✨ AI 확장'}
                      </button>
                      <button
                        onClick={handleAiTranslate}
                        disabled={!!aiLoading || !editContent}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                      >
                        {aiLoading === 'translate' ? '번역 중...' : '🌐 번역'}
                      </button>
                    </div>

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
                          if (!selectedNote) {
                            setEditTitle('')
                            setEditContent('')
                          }
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
                    <h2 className="text-xl font-bold mb-4">{selectedNote?.title}</h2>
                    <p
                      className="whitespace-pre-wrap mb-4 text-sm leading-relaxed"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {selectedNote?.content || '(내용 없음)'}
                    </p>
                    <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                      마지막 수정: {selectedNote && formatDate(selectedNote.updatedAt)}
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
                <span className="text-5xl mb-4 block">📋</span>
                <p className="mb-2 font-medium">노트를 선택하세요</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  왼쪽에서 노트를 선택하면
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
                <li>✅ AI 통합 (요약/확장/번역)</li>
                <li>✅ 에러 처리 및 로딩 상태</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
