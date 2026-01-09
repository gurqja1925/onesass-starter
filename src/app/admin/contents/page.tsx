'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'
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
    email: string
    name: string | null
  }
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
          <Button>+ 콘텐츠 추가</Button>
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
                          <span>작성자: {content.user.name || content.user.email}</span>
                          <span>생성: {formatDate(content.createdAt)}</span>
                          <span>수정: {formatDate(content.updatedAt)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          className="px-3 py-1 text-sm rounded"
                          style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
                        >
                          보기
                        </button>
                        <button
                          className="px-3 py-1 text-sm rounded"
                          style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                        >
                          수정
                        </button>
                        <button
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
    </AdminLayout>
  )
}
