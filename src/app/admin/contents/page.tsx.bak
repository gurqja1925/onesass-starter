'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent } from '@/onesaas-core/ui/Card'
import { Button } from '@/onesaas-core/ui/Button'
import { Input } from '@/onesaas-core/ui/Input'

interface Content {
  id: string
  userId: string
  title: string
  body: string
  type: string
  status: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    email: string
    name: string | null
  }
}

interface ContentForm {
  id?: string
  title: string
  body: string
  type: string
  status: string
  userId?: string
}

export default function ContentsPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({ published: 0, draft: 0, archived: 0 })

  // 모달 상태
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'add' | 'edit'>('view')
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [formData, setFormData] = useState<ContentForm>({
    title: '',
    body: '',
    type: 'post',
    status: 'draft',
  })
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      })
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (typeFilter !== 'all') params.append('type', typeFilter)

      const res = await fetch(`/api/admin/contents?${params}`)
      const data = await res.json()
      setContents(data.contents || [])
      setTotal(data.total || 0)
      setStats(data.stats || { published: 0, draft: 0, archived: 0 })
    } catch (error) {
      console.error('Failed to fetch contents:', error)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, typeFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredContents = contents.filter(content =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.body.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      published: { bg: '#10b981', color: 'white', label: '게시됨' },
      draft: { bg: '#f59e0b', color: 'white', label: '임시저장' },
      archived: { bg: '#6b7280', color: 'white', label: '보관됨' },
    }
    return styles[status] || styles.draft
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      post: '게시글',
      page: '페이지',
      document: '문서',
      template: '템플릿',
    }
    return labels[type] || type
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      post: '📝',
      page: '📄',
      document: '📋',
      template: '📑',
    }
    return icons[type] || '📝'
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR')
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // 콘텐츠 보기
  const handleView = (content: Content) => {
    setSelectedContent(content)
    setModalMode('view')
    setShowModal(true)
  }

  // 콘텐츠 추가 모달
  const handleAdd = () => {
    setSelectedContent(null)
    setFormData({ title: '', body: '', type: 'post', status: 'draft' })
    setModalMode('add')
    setShowModal(true)
  }

  // 콘텐츠 수정 모달
  const handleEdit = (content: Content) => {
    setSelectedContent(content)
    setFormData({
      id: content.id,
      title: content.title,
      body: content.body,
      type: content.type,
      status: content.status,
      userId: content.userId,
    })
    setModalMode('edit')
    setShowModal(true)
  }

  // 콘텐츠 저장 (추가/수정)
  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요')
      return
    }

    setSaving(true)
    try {
      const method = modalMode === 'add' ? 'POST' : 'PUT'
      const res = await fetch('/api/admin/contents', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '저장에 실패했습니다')
      }

      alert(modalMode === 'add' ? '콘텐츠가 추가되었습니다' : '콘텐츠가 수정되었습니다')
      setShowModal(false)
      fetchData()
    } catch (error) {
      alert(error instanceof Error ? error.message : '오류가 발생했습니다')
    } finally {
      setSaving(false)
    }
  }

  // 콘텐츠 삭제
  const handleDelete = async (content: Content) => {
    if (!confirm(`"${content.title}" 콘텐츠를 삭제하시겠습니까?`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/contents?id=${content.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '삭제에 실패했습니다')
      }

      alert('콘텐츠가 삭제되었습니다')
      fetchData()
    } catch (error) {
      alert(error instanceof Error ? error.message : '오류가 발생했습니다')
    }
  }

  // 상태 변경
  const handleStatusChange = async (content: Content, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/contents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: content.id, status: newStatus }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '상태 변경에 실패했습니다')
      }

      fetchData()
    } catch (error) {
      alert(error instanceof Error ? error.message : '오류가 발생했습니다')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              콘텐츠 관리
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              사용자가 생성한 콘텐츠를 관리하세요
            </p>
          </div>
          <Button onClick={handleAdd}>+ 콘텐츠 추가</Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
                {total}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                전체 콘텐츠
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: '#10b981' }}>
                {stats.published}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                게시됨
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: '#f59e0b' }}>
                {stats.draft}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                임시저장
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: '#6b7280' }}>
                {stats.archived}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                보관됨
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="제목 또는 내용으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {[
              { value: 'all', label: '전체 상태' },
              { value: 'published', label: '게시됨' },
              { value: 'draft', label: '임시저장' },
              { value: 'archived', label: '보관됨' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => { setStatusFilter(value); setPage(1) }}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: statusFilter === value ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                  color: statusFilter === value ? 'var(--color-bg)' : 'var(--color-text)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 콘텐츠 목록 */}
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
              로딩 중...
            </CardContent>
          </Card>
        ) : filteredContents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
              콘텐츠가 없습니다
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredContents.map((content) => {
              const statusBadge = getStatusBadge(content.status)
              return (
                <Card key={content.id}>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: 'var(--color-bg)' }}
                      >
                        {getTypeIcon(content.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate" style={{ color: 'var(--color-text)' }}>
                            {content.title}
                          </h3>
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium flex-shrink-0"
                            style={{ background: statusBadge.bg, color: statusBadge.color }}
                          >
                            {statusBadge.label}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded text-xs flex-shrink-0"
                            style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}
                          >
                            {getTypeLabel(content.type)}
                          </span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                          {truncateText(content.body, 150)}
                        </p>
                        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          <span>작성자: {content.user?.name || content.user?.email || '알 수 없음'}</span>
                          <span>생성: {formatDate(content.createdAt)}</span>
                          <span>수정: {formatDate(content.updatedAt)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleView(content)}
                          className="px-3 py-1 text-sm rounded"
                          style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
                        >
                          보기
                        </button>
                        <button
                          onClick={() => handleEdit(content)}
                          className="px-3 py-1 text-sm rounded"
                          style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(content)}
                          className="px-3 py-1 text-sm rounded"
                          style={{ background: '#ef4444', color: 'white' }}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* 페이지네이션 */}
        {total > 20 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              이전
            </Button>
            <span className="px-4 py-2" style={{ color: 'var(--color-text)' }}>
              {page} / {Math.ceil(total / 20)}
            </span>
            <Button
              variant="secondary"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / 20)}
            >
              다음
            </Button>
          </div>
        )}
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6"
            style={{ background: 'var(--color-bg-secondary)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                {modalMode === 'view' ? '콘텐츠 보기' : modalMode === 'add' ? '콘텐츠 추가' : '콘텐츠 수정'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                ×
              </button>
            </div>

            {modalMode === 'view' && selectedContent ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>제목</label>
                  <p className="mt-1" style={{ color: 'var(--color-text)' }}>{selectedContent.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>유형</label>
                  <p className="mt-1" style={{ color: 'var(--color-text)' }}>{getTypeLabel(selectedContent.type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>상태</label>
                  <div className="mt-1 flex gap-2">
                    {['draft', 'published', 'archived'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedContent, status)}
                        className="px-3 py-1 rounded text-sm"
                        style={{
                          background: selectedContent.status === status ? getStatusBadge(status).bg : 'var(--color-bg)',
                          color: selectedContent.status === status ? 'white' : 'var(--color-text)',
                        }}
                      >
                        {getStatusBadge(status).label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>내용</label>
                  <p className="mt-1 whitespace-pre-wrap" style={{ color: 'var(--color-text)' }}>{selectedContent.body}</p>
                </div>
                <div className="flex gap-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <span>작성자: {selectedContent.user?.name || selectedContent.user?.email}</span>
                  <span>생성: {formatDate(selectedContent.createdAt)}</span>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="secondary" onClick={() => setShowModal(false)}>닫기</Button>
                  <Button onClick={() => handleEdit(selectedContent)}>수정하기</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                    제목 *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="콘텐츠 제목을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                    유형
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg"
                    style={{
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <option value="post">게시글</option>
                    <option value="page">페이지</option>
                    <option value="document">문서</option>
                    <option value="template">템플릿</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                    상태
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg"
                    style={{
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <option value="draft">임시저장</option>
                    <option value="published">게시됨</option>
                    <option value="archived">보관됨</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                    내용
                  </label>
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="콘텐츠 내용을 입력하세요"
                    rows={8}
                    className="w-full px-3 py-2 rounded-lg resize-none"
                    style={{
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)',
                      border: '1px solid var(--color-border)',
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>
                    취소
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? '저장 중...' : modalMode === 'add' ? '추가' : '저장'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
