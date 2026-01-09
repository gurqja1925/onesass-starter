'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

interface GeneratedImage {
  id: string
  prompt: string
  url: string
  createdAt: Date
}

export default function ImageGenPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [style, setStyle] = useState('realistic')
  const [size, setSize] = useState('1024x1024')
  const [images, setImages] = useState<GeneratedImage[]>([
    {
      id: '1',
      prompt: '일몰이 아름다운 해변 풍경',
      url: 'https://picsum.photos/seed/sunset/400/400',
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      prompt: '미래적인 도시 야경',
      url: 'https://picsum.photos/seed/city/400/400',
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: '3',
      prompt: '귀여운 고양이 일러스트',
      url: 'https://picsum.photos/seed/cat/400/400',
      createdAt: new Date(Date.now() - 259200000),
    },
  ])

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return

    setLoading(true)

    // 데모: 랜덤 이미지 생성 (실제로는 AI API 호출)
    setTimeout(() => {
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt,
        url: `https://picsum.photos/seed/${Date.now()}/400/400`,
        createdAt: new Date(),
      }
      setImages((prev) => [newImage, ...prev])
      setPrompt('')
      setLoading(false)
    }, 3000)
  }

  const styles = [
    { id: 'realistic', label: '사실적', icon: '📷' },
    { id: 'artistic', label: '예술적', icon: '🎨' },
    { id: 'cartoon', label: '카툰', icon: '🎭' },
    { id: 'anime', label: '애니메이션', icon: '✨' },
    { id: '3d', label: '3D 렌더', icon: '🎮' },
  ]

  const sizes = [
    { id: '512x512', label: '512×512' },
    { id: '1024x1024', label: '1024×1024' },
    { id: '1024x1792', label: '1024×1792 (세로)' },
    { id: '1792x1024', label: '1792×1024 (가로)' },
  ]

  return (
    <DashboardLayout title="이미지 생성">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">AI 이미지 생성</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            텍스트로 설명하면 AI가 이미지를 만들어 드립니다
          </p>
        </div>

        {/* 사용량 */}
        <div
          className="mb-6 p-4 rounded-xl flex items-center justify-between"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>이번 달 생성</p>
            <p className="text-lg font-bold">23 / 50 이미지</p>
          </div>
          <div className="text-right">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>크레딧</p>
            <p className="font-bold" style={{ color: 'var(--color-accent)' }}>27 남음</p>
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
                  placeholder="원하는 이미지를 설명해주세요...&#10;예: 석양이 지는 바다 위의 작은 등대"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl resize-none"
                  style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              {/* 스타일 선택 */}
              <div>
                <label className="block text-sm font-medium mb-2">스타일</label>
                <div className="grid grid-cols-2 gap-2">
                  {styles.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className="p-3 rounded-lg text-sm transition-all"
                      style={{
                        background: style === s.id ? 'var(--color-accent)' : 'var(--color-bg)',
                        color: style === s.id ? 'var(--color-bg)' : 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <span className="mr-1">{s.icon}</span> {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 크기 선택 */}
              <div>
                <label className="block text-sm font-medium mb-2">크기</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl"
                  style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {sizes.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
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
                  '이미지 생성'
                )}
              </button>

              {/* 프롬프트 예시 */}
              <div>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>예시 프롬프트</p>
                <div className="space-y-2">
                  {[
                    '사이버펑크 도시의 네온사인 거리',
                    '봄날 벚꽃이 흩날리는 공원',
                    '우주에서 본 지구와 달',
                  ].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPrompt(p)}
                      className="w-full text-left p-2 rounded-lg text-sm transition-all hover:opacity-80"
                      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 갤러리 */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">내 이미지</h2>
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {images.length}개의 이미지
              </span>
            </div>

            {loading && (
              <div
                className="mb-4 p-8 rounded-2xl flex flex-col items-center justify-center"
                style={{ background: 'var(--color-bg-secondary)', border: '2px dashed var(--color-accent)' }}
              >
                <div className="text-4xl mb-4 animate-pulse">🎨</div>
                <p className="font-medium">이미지를 생성하고 있습니다...</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>잠시만 기다려주세요</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer"
                  style={{ background: 'var(--color-bg-secondary)' }}
                >
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4"
                    style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}
                  >
                    <p className="text-sm text-white line-clamp-2">{img.prompt}</p>
                    <div className="flex gap-2 mt-2">
                      <button className="px-3 py-1 rounded-lg text-xs bg-white/20 text-white hover:bg-white/30">
                        다운로드
                      </button>
                      <button className="px-3 py-1 rounded-lg text-xs bg-white/20 text-white hover:bg-white/30">
                        수정
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
