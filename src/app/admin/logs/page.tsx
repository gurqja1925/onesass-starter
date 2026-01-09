'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'
import { Button } from '@/onesaas-core/ui/Button'
import { Input } from '@/onesaas-core/ui/Input'

interface Activity {
  id: string
  type: string
  user: string
  timestamp: string
  detail?: string
}

export default function LogsPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [limit, setLimit] = useState(50)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/activities?limit=${limit}`)
      const data = await res.json()
      setActivities(data.activities || [])
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getTypeInfo = (type: string) => {
    const info: Record<string, { icon: string; label: string; color: string }> = {
      signup: { icon: '✨', label: '회원가입', color: '#10b981' },
      payment: { icon: '💳', label: '결제', color: '#f59e0b' },
      login: { icon: '🔑', label: '로그인', color: '#6b7280' },
      ai_usage: { icon: '🤖', label: 'AI 사용', color: 'var(--color-accent)' },
      subscription: { icon: '📋', label: '구독', color: '#8b5cf6' },
      content: { icon: '📝', label: '콘텐츠', color: '#ec4899' },
    }
    return info[type] || { icon: '📌', label: type, color: 'var(--color-text)' }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const filteredActivities = activities.filter(activity => {
    const matchesType = typeFilter === 'all' || activity.type === typeFilter
    const matchesSearch = !searchTerm ||
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.detail?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const activityTypes = [...new Set(activities.map(a => a.type))]
  const typeCounts = activityTypes.reduce((acc, type) => {
    acc[type] = activities.filter(a => a.type === type).length
    return acc
  }, {} as Record<string, number>)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              활동 로그
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              시스템 활동 내역을 확인하세요
            </p>
          </div>
          <Button onClick={fetchData} variant="secondary">
            새로고침
          </Button>
        </div>

        {/* 타입별 카운트 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {activityTypes.map((type) => {
            const info = getTypeInfo(type)
            return (
              <Card
                key={type}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
                style={{
                  borderColor: typeFilter === type ? info.color : 'transparent',
                  borderWidth: '2px',
                }}
              >
                <CardContent className="text-center py-4">
                  <span className="text-2xl block mb-1">{info.icon}</span>
                  <p className="text-xl font-bold" style={{ color: info.color }}>
                    {typeCounts[type]}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {info.label}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="사용자 또는 상세내용 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border"
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
          >
            <option value={50}>최근 50개</option>
            <option value={100}>최근 100개</option>
            <option value={200}>최근 200개</option>
          </select>
        </div>

        {/* 필터 버튼 */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setTypeFilter('all')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: typeFilter === 'all' ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
              color: typeFilter === 'all' ? 'var(--color-bg)' : 'var(--color-text)',
            }}
          >
            전체 ({activities.length})
          </button>
          {activityTypes.map((type) => {
            const info = getTypeInfo(type)
            return (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                style={{
                  background: typeFilter === type ? info.color : 'var(--color-bg-secondary)',
                  color: typeFilter === type ? 'white' : 'var(--color-text)',
                }}
              >
                {info.icon} {info.label} ({typeCounts[type]})
              </button>
            )
          })}
        </div>

        {/* 로그 목록 */}
        <Card padding="none">
          {loading ? (
            <div className="p-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
              로딩 중...
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
              활동 내역이 없습니다
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredActivities.map((activity) => {
                const info = getTypeInfo(activity.type)
                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-opacity-50 transition-colors"
                    style={{ background: 'transparent' }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: 'var(--color-bg)' }}
                    >
                      {info.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{ background: info.color, color: 'white' }}
                        >
                          {info.label}
                        </span>
                        <span className="font-medium truncate" style={{ color: 'var(--color-text)' }}>
                          {activity.user}
                        </span>
                      </div>
                      {activity.detail && (
                        <p className="text-sm mt-1 truncate" style={{ color: 'var(--color-text-secondary)' }}>
                          {activity.detail}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {formatTimestamp(activity.timestamp)}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)', opacity: 0.7 }}>
                        {new Date(activity.timestamp).toLocaleTimeString('ko-KR')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* 더 보기 */}
        {filteredActivities.length >= limit && (
          <div className="text-center">
            <Button
              variant="secondary"
              onClick={() => setLimit(l => l + 50)}
            >
              더 보기
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
