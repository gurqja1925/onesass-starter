'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

interface Video {
  id: string
  title: string
  prompt: string
  status: 'processing' | 'completed' | 'failed'
  thumbnail: string
  duration: string
  createdAt: Date
}

export default function VideoGenPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [duration, setDuration] = useState('5')
  const [aspect, setAspect] = useState('16:9')
  const [videos, setVideos] = useState<Video[]>([
    {
      id: '1',
      title: '우주 탐험',
      prompt: '우주선이 행성을 지나가는 장면',
      status: 'completed',
      thumbnail: 'https://picsum.photos/seed/space/320/180',
      duration: '5초',
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      title: '자연 풍경',
      prompt: '숲속 시냇물이 흐르는 평화로운 장면',
      status: 'completed',
      thumbnail: 'https://picsum.photos/seed/forest/320/180',
      duration: '10초',
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: '3',
      title: '로고 애니메이션',
      prompt: '현대적인 로고가 등장하는 인트로',
      status: 'processing',
      thumbnail: 'https://picsum.photos/seed/logo/320/180',
      duration: '3초',
      createdAt: new Date(),
    },
  ])

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return

    setLoading(true)

    const newVideo: Video = {
      id: Date.now().toString(),
      title: prompt.slice(0, 20) + '...',
      prompt,
      status: 'processing',
      thumbnail: `https://picsum.photos/seed/${Date.now()}/320/180`,
      duration: `${duration}초`,
      createdAt: new Date(),
    }

    setVideos((prev) => [newVideo, ...prev])
    setPrompt('')

    // 데모: 처리 완료 시뮬레이션
    setTimeout(() => {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === newVideo.id ? { ...v, status: 'completed' as const } : v
        )
      )
      setLoading(false)
    }, 5000)
  }

  const getStatusBadge = (status: Video['status']) => {
    const styles = {
      processing: { bg: '#f59e0b', label: '처리 중' },
      completed: { bg: '#10b981', label: '완료' },
      failed: { bg: '#ef4444', label: '실패' },
    }
    return styles[status]
  }

  return (
    <DashboardLayout title="영상 생성">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">AI 영상 생성</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            텍스트로 설명하면 AI가 영상을 만들어 드립니다
          </p>
        </div>

        {/* 사용량 */}
        <div
          className="mb-6 p-4 rounded-xl flex items-center justify-between"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>이번 달 생성</p>
            <p className="text-lg font-bold">8 / 20 영상</p>
          </div>
          <div className="text-right">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>크레딧</p>
            <p className="font-bold" style={{ color: 'var(--color-accent)' }}>12 남음</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 생성 패널 */}
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl p-6 space-y-6"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            >
              {/* 프롬프트 */}
              <div>
                <label className="block text-sm font-medium mb-2">프롬프트</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="원하는 영상을 설명해주세요...&#10;예: 해변에서 석양을 바라보는 드론 샷"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl resize-none"
                  style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              {/* 영상 길이 */}
              <div>
                <label className="block text-sm font-medium mb-2">영상 길이</label>
                <div className="flex gap-2">
                  {['3', '5', '10', '15'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className="flex-1 py-2 rounded-lg text-sm transition-all"
                      style={{
                        background: duration === d ? 'var(--color-accent)' : 'var(--color-bg)',
                        color: duration === d ? 'var(--color-bg)' : 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {d}초
                    </button>
                  ))}
                </div>
              </div>

              {/* 화면 비율 */}
              <div>
                <label className="block text-sm font-medium mb-2">화면 비율</label>
                <div className="flex gap-2">
                  {[
                    { id: '16:9', label: '가로 (16:9)' },
                    { id: '9:16', label: '세로 (9:16)' },
                    { id: '1:1', label: '정방형 (1:1)' },
                  ].map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAspect(a.id)}
                      className="flex-1 py-2 rounded-lg text-sm transition-all"
                      style={{
                        background: aspect === a.id ? 'var(--color-accent)' : 'var(--color-bg)',
                        color: aspect === a.id ? 'var(--color-bg)' : 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 생성 버튼 */}
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full py-4 rounded-xl font-bold transition-all disabled:opacity-50"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> 생성 중...
                  </span>
                ) : (
                  '영상 생성'
                )}
              </button>

              {/* 안내 */}
              <div
                className="p-4 rounded-xl text-sm"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <p className="font-medium mb-1">💡 팁</p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  구체적으로 설명할수록 원하는 결과물을 얻을 수 있습니다.
                  카메라 움직임, 조명, 분위기 등을 포함해보세요.
                </p>
              </div>
            </div>
          </div>

          {/* 영상 목록 */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">내 영상</h2>
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {videos.length}개의 영상
              </span>
            </div>

            <div className="space-y-4">
              {videos.map((video) => {
                const badge = getStatusBadge(video.status)
                return (
                  <div
                    key={video.id}
                    className="flex gap-4 p-4 rounded-2xl transition-all hover:opacity-90"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                  >
                    {/* 썸네일 */}
                    <div className="relative w-40 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      {video.status === 'processing' && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: 'rgba(0,0,0,0.6)' }}
                        >
                          <span className="animate-spin text-2xl">⏳</span>
                        </div>
                      )}
                      {video.status === 'completed' && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.6)' }}>
                          <span className="text-4xl">▶️</span>
                        </div>
                      )}
                      <span
                        className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs text-white"
                        style={{ background: 'rgba(0,0,0,0.7)' }}
                      >
                        {video.duration}
                      </span>
                    </div>

                    {/* 정보 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{video.title}</h3>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs text-white"
                          style={{ background: badge.bg }}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-sm mb-2 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                        {video.prompt}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        {video.createdAt.toLocaleDateString('ko-KR')}
                      </p>
                    </div>

                    {/* 액션 */}
                    <div className="flex flex-col gap-2">
                      {video.status === 'completed' && (
                        <>
                          <button
                            className="px-4 py-2 rounded-lg text-sm"
                            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                          >
                            다운로드
                          </button>
                          <button
                            className="px-4 py-2 rounded-lg text-sm"
                            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                          >
                            공유
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
