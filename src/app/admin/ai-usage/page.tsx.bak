'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'
import { Button } from '@/onesaas-core/ui/Button'

interface AIUsage {
  id: string
  userId: string
  type: string
  tokens: number
  cost: number
  input: string | null
  output: string | null
  model: string
  createdAt: string
  user: {
    email: string
    name: string | null
  }
}

interface UsageStats {
  type: string
  count: number
  tokens: number
}

export default function AIUsagePage() {
  const [usages, setUsages] = useState<AIUsage[]>([])
  const [stats, setStats] = useState<UsageStats[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [usageRes, analyticsRes] = await Promise.all([
        fetch(`/api/admin/ai-usage?page=${page}&limit=20${typeFilter !== 'all' ? `&type=${typeFilter}` : ''}`),
        fetch('/api/admin/analytics?days=30'),
      ])

      const usageData = await usageRes.json()
      const analyticsData = await analyticsRes.json()

      setUsages(usageData.usages || [])
      setTotal(usageData.total || 0)
      setStats(analyticsData.aiUsageByType || [])
    } catch (error) {
      console.error('Failed to fetch AI usage:', error)
    } finally {
      setLoading(false)
    }
  }, [page, typeFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalTokens = stats.reduce((sum, s) => sum + (s.tokens || 0), 0)
  const totalCalls = stats.reduce((sum, s) => sum + s.count, 0)
  const estimatedCost = (totalTokens / 1000) * 0.002 // 예상 비용 계산

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      chat: '채팅',
      image: '이미지 생성',
      code: '코드 생성',
      translate: '번역',
      summarize: '요약',
      writer: '글쓰기',
    }
    return labels[type] || type
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      chat: '💬',
      image: '🎨',
      code: '💻',
      translate: '🌐',
      summarize: '📋',
      writer: '✍️',
    }
    return icons[type] || '🤖'
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ko-KR')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            AI 사용량 관리
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            AI 서비스 사용 현황을 모니터링하세요
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
                {totalCalls.toLocaleString()}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                총 API 호출
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: '#10b981' }}>
                {totalTokens.toLocaleString()}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                총 토큰 사용량
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: '#f59e0b' }}>
                ${estimatedCost.toFixed(2)}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                예상 비용 (30일)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                {stats.length}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                활성 기능 수
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 기능별 사용량 */}
        <Card>
          <CardHeader>
            <CardTitle>기능별 사용량</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.type}
                  className="p-4 rounded-lg text-center cursor-pointer transition-all hover:scale-105"
                  style={{
                    background: typeFilter === stat.type ? 'var(--color-accent)' : 'var(--color-bg)',
                    color: typeFilter === stat.type ? 'var(--color-bg)' : 'var(--color-text)',
                  }}
                  onClick={() => setTypeFilter(typeFilter === stat.type ? 'all' : stat.type)}
                >
                  <span className="text-2xl block mb-2">{getTypeIcon(stat.type)}</span>
                  <p className="font-medium text-sm">{getTypeLabel(stat.type)}</p>
                  <p className="text-xs mt-1" style={{ opacity: 0.7 }}>
                    {stat.count}회 / {(stat.tokens || 0).toLocaleString()} 토큰
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 필터 */}
        <div className="flex gap-2">
          <button
            onClick={() => { setTypeFilter('all'); setPage(1) }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: typeFilter === 'all' ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
              color: typeFilter === 'all' ? 'var(--color-bg)' : 'var(--color-text)',
            }}
          >
            전체
          </button>
          {stats.map((stat) => (
            <button
              key={stat.type}
              onClick={() => { setTypeFilter(stat.type); setPage(1) }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: typeFilter === stat.type ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                color: typeFilter === stat.type ? 'var(--color-bg)' : 'var(--color-text)',
              }}
            >
              {getTypeLabel(stat.type)}
            </button>
          ))}
        </div>

        {/* 사용 내역 테이블 */}
        <Card padding="none">
          {loading ? (
            <div className="p-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
              로딩 중...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>사용자</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>기능</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>모델</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>토큰</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>비용</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>시간</th>
                  </tr>
                </thead>
                <tbody>
                  {usages.map((usage) => (
                    <tr key={usage.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium" style={{ color: 'var(--color-text)' }}>{usage.user.name || '-'}</p>
                          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{usage.user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                          {getTypeIcon(usage.type)} {getTypeLabel(usage.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
                        >
                          {usage.model}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium" style={{ color: 'var(--color-text)' }}>
                        {usage.tokens.toLocaleString()}
                      </td>
                      <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>
                        ${usage.cost.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {formatDate(usage.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

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
