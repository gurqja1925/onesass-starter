'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('7d')

  const stats = [
    { label: 'AI 채팅', value: '247', change: '+18%', icon: '💬', color: '#3b82f6' },
    { label: '이미지 생성', value: '89', change: '+32%', icon: '🎨', color: '#8b5cf6' },
    { label: '영상 생성', value: '23', change: '+12%', icon: '🎬', color: '#ec4899' },
    { label: '노트 작성', value: '156', change: '+8%', icon: '📝', color: '#10b981' },
  ]

  const usageData = [
    { date: '월', chat: 35, image: 12, video: 3 },
    { date: '화', chat: 42, image: 15, video: 5 },
    { date: '수', chat: 38, image: 18, video: 4 },
    { date: '목', chat: 45, image: 14, video: 6 },
    { date: '금', chat: 52, image: 20, video: 3 },
    { date: '토', chat: 28, image: 8, video: 1 },
    { date: '일', chat: 22, image: 5, video: 1 },
  ]

  const topFeatures = [
    { name: 'AI 채팅', usage: 247, percentage: 48 },
    { name: '노트', usage: 156, percentage: 30 },
    { name: '이미지 생성', usage: 89, percentage: 17 },
    { name: '영상 생성', usage: 23, percentage: 5 },
  ]

  const recentActivity = [
    { action: 'AI 채팅', detail: '"마케팅 전략에 대해..."', time: '방금 전' },
    { action: '이미지 생성', detail: '"미래 도시 야경"', time: '5분 전' },
    { action: '노트 저장', detail: '"회의 노트" 수정', time: '15분 전' },
    { action: 'AI 채팅', detail: '"코드 리뷰 요청..."', time: '30분 전' },
    { action: '영상 생성', detail: '"제품 소개 영상"', time: '1시간 전' },
  ]

  const maxUsage = Math.max(...usageData.map((d) => d.chat + d.image + d.video))

  return (
    <DashboardLayout title="분석 도구">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">분석 도구</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              사용 현황과 통계를 확인하세요
            </p>
          </div>
          <div className="flex gap-2">
            {[
              { id: '7d', label: '7일' },
              { id: '30d', label: '30일' },
              { id: '90d', label: '90일' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className="px-4 py-2 rounded-lg text-sm"
                style={{
                  background: period === p.id ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                  color: period === p.id ? 'var(--color-bg)' : 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-6"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${stat.color}20` }}
                >
                  {stat.icon}
                </span>
                <span
                  className="text-sm font-medium px-2 py-1 rounded-full"
                  style={{ background: '#10b98120', color: '#10b981' }}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {stat.label} 사용
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 사용량 차트 */}
          <div
            className="lg:col-span-2 rounded-2xl p-6"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2 className="text-lg font-bold mb-6">일별 사용량</h2>
            <div className="flex items-end justify-between h-48 gap-2">
              {usageData.map((data) => {
                const total = data.chat + data.image + data.video
                const height = (total / maxUsage) * 100
                return (
                  <div key={data.date} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg transition-all hover:opacity-80"
                      style={{
                        height: `${height}%`,
                        background: `linear-gradient(to top, #3b82f6 ${(data.chat / total) * 100}%, #8b5cf6 ${(data.chat / total) * 100}%, #8b5cf6 ${((data.chat + data.image) / total) * 100}%, #ec4899 ${((data.chat + data.image) / total) * 100}%)`,
                      }}
                    />
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {data.date}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: '#3b82f6' }} />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>채팅</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: '#8b5cf6' }} />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>이미지</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: '#ec4899' }} />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>영상</span>
              </div>
            </div>
          </div>

          {/* 기능별 사용량 */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2 className="text-lg font-bold mb-6">기능별 사용량</h2>
            <div className="space-y-4">
              {topFeatures.map((feature) => (
                <div key={feature.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{feature.name}</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{feature.usage}회</span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'var(--color-bg)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${feature.percentage}%`,
                        background: 'var(--color-accent)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 최근 활동 */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2 className="text-lg font-bold mb-4">최근 활동</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl"
                  style={{ background: 'var(--color-bg)' }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    {activity.action === 'AI 채팅' && '💬'}
                    {activity.action === '이미지 생성' && '🎨'}
                    {activity.action === '영상 생성' && '🎬'}
                    {activity.action === '노트 저장' && '📝'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm line-clamp-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {activity.detail}
                    </p>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 사용량 요약 */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2 className="text-lg font-bold mb-4">이번 달 사용량</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span>AI 채팅</span>
                  <span>47 / 100</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-bg)' }}>
                  <div className="h-full rounded-full" style={{ width: '47%', background: '#3b82f6' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>이미지 생성</span>
                  <span>23 / 50</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-bg)' }}>
                  <div className="h-full rounded-full" style={{ width: '46%', background: '#8b5cf6' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>영상 생성</span>
                  <span>8 / 20</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-bg)' }}>
                  <div className="h-full rounded-full" style={{ width: '40%', background: '#ec4899' }} />
                </div>
              </div>
              <div
                className="p-4 rounded-xl mt-4"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                <p className="font-bold mb-1">Pro 플랜</p>
                <p className="text-sm opacity-80">다음 갱신: 2024년 2월 15일</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
