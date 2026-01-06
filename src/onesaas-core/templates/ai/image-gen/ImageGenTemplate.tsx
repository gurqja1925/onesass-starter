'use client'

/**
 * AI 이미지 생성 템플릿
 * 텍스트 프롬프트로 이미지를 생성하는 인터페이스
 */

import { useState, FormEvent } from 'react'
import {
  Sparkles,
  Download,
  Copy,
  Loader2,
  Image as ImageIcon,
  Wand2,
  Settings2,
  Grid,
  Square,
  RectangleHorizontal,
  RectangleVertical,
} from 'lucide-react'

// 생성된 이미지 타입
interface GeneratedImage {
  id: string
  url: string
  prompt: string
  model: string
  size: string
  createdAt: Date
}

// 이미지 크기 옵션
const IMAGE_SIZES = [
  { id: '1024x1024', label: '정사각형', icon: Square, ratio: '1:1' },
  { id: '1792x1024', label: '가로형', icon: RectangleHorizontal, ratio: '16:9' },
  { id: '1024x1792', label: '세로형', icon: RectangleVertical, ratio: '9:16' },
]

// AI 모델 옵션
const IMAGE_MODELS = [
  { id: 'dall-e-3', name: 'DALL-E 3', provider: 'OpenAI' },
  { id: 'stable-diffusion-xl', name: 'Stable Diffusion XL', provider: 'Stability AI' },
  { id: 'midjourney', name: 'Midjourney', provider: 'Midjourney' },
]

// 스타일 프리셋
const STYLE_PRESETS = [
  { id: 'realistic', name: '사실적', prompt: 'photorealistic, 8k, detailed' },
  { id: 'anime', name: '애니메이션', prompt: 'anime style, vibrant colors, detailed' },
  { id: 'oil-painting', name: '유화', prompt: 'oil painting style, artistic, brush strokes' },
  { id: 'watercolor', name: '수채화', prompt: 'watercolor painting, soft colors, artistic' },
  { id: '3d-render', name: '3D 렌더', prompt: '3D render, octane render, unreal engine' },
  { id: 'pixel-art', name: '픽셀 아트', prompt: 'pixel art style, 16-bit, retro game' },
  { id: 'sketch', name: '스케치', prompt: 'pencil sketch, hand-drawn, artistic' },
  { id: 'cyberpunk', name: '사이버펑크', prompt: 'cyberpunk style, neon lights, futuristic' },
]

// Props
interface ImageGenTemplateProps {
  title?: string
  subtitle?: string
  defaultModel?: string
  showHistory?: boolean
  maxHistory?: number
}

export function ImageGenTemplate({
  title = 'AI 이미지 생성',
  subtitle = '상상을 현실로 만들어보세요',
  defaultModel = 'dall-e-3',
  showHistory = true,
  maxHistory = 12,
}: ImageGenTemplateProps) {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState(defaultModel)
  const [selectedSize, setSelectedSize] = useState('1024x1024')
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)

  // 이미지 생성
  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)

    try {
      // 스타일 프롬프트 추가
      let finalPrompt = prompt
      if (selectedStyle) {
        const style = STYLE_PRESETS.find((s) => s.id === selectedStyle)
        if (style) {
          finalPrompt = `${prompt}, ${style.prompt}`
        }
      }

      const response = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          negativePrompt,
          model: selectedModel,
          size: selectedSize,
        }),
      })

      if (!response.ok) throw new Error('이미지 생성 실패')

      const data = await response.json()

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: data.url || data.image,
        prompt: prompt,
        model: selectedModel,
        size: selectedSize,
        createdAt: new Date(),
      }

      setGeneratedImages((prev) => [newImage, ...prev].slice(0, maxHistory))
    } catch (error) {
      console.error('Image generation error:', error)
      alert('이미지 생성 중 오류가 발생했습니다.')
    } finally {
      setIsGenerating(false)
    }
  }

  // 이미지 다운로드
  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  // 프롬프트 복사
  const copyPrompt = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* 헤더 */}
      <header
        className="border-b px-6 py-4"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--color-accent)' }}
            >
              <Sparkles className="w-6 h-6" style={{ color: 'var(--color-bg)' }} />
            </div>
            <div>
              <h1
                className="font-bold text-lg"
                style={{ color: 'var(--color-text)' }}
              >
                {title}
              </h1>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {subtitle}
              </p>
            </div>
          </div>

          {/* 모델 선택 */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none"
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
          >
            {IMAGE_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 입력 패널 */}
          <div className="space-y-6">
            <form onSubmit={handleGenerate} className="space-y-4">
              {/* 프롬프트 입력 */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  프롬프트
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="생성하고 싶은 이미지를 설명해주세요..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 resize-none"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                  }}
                />
              </div>

              {/* 스타일 선택 */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  스타일
                </label>
                <div className="flex flex-wrap gap-2">
                  {STYLE_PRESETS.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() =>
                        setSelectedStyle(
                          selectedStyle === style.id ? null : style.id
                        )
                      }
                      className="px-3 py-1.5 rounded-lg text-sm border transition-all"
                      style={{
                        background:
                          selectedStyle === style.id
                            ? 'var(--color-accent)'
                            : 'var(--color-bg-secondary)',
                        color:
                          selectedStyle === style.id
                            ? 'var(--color-bg)'
                            : 'var(--color-text)',
                        borderColor:
                          selectedStyle === style.id
                            ? 'var(--color-accent)'
                            : 'var(--color-border)',
                      }}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 이미지 크기 */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  크기
                </label>
                <div className="flex gap-2">
                  {IMAGE_SIZES.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size.id)}
                      className="flex-1 px-4 py-3 rounded-xl border flex flex-col items-center gap-1 transition-all"
                      style={{
                        background:
                          selectedSize === size.id
                            ? 'var(--color-accent)'
                            : 'var(--color-bg-secondary)',
                        color:
                          selectedSize === size.id
                            ? 'var(--color-bg)'
                            : 'var(--color-text)',
                        borderColor:
                          selectedSize === size.id
                            ? 'var(--color-accent)'
                            : 'var(--color-border)',
                      }}
                    >
                      <size.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{size.label}</span>
                      <span className="text-xs opacity-60">{size.ratio}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 고급 설정 */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <Settings2 className="w-4 h-4" />
                  고급 설정
                </button>

                {showAdvanced && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <label
                        className="block text-sm mb-1"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        네거티브 프롬프트 (제외할 요소)
                      </label>
                      <input
                        type="text"
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="예: blur, low quality, watermark"
                        className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                        style={{
                          background: 'var(--color-bg)',
                          color: 'var(--color-text)',
                          borderColor: 'var(--color-border)',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 생성 버튼 */}
              <button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-bg)',
                }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    이미지 생성
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 결과 패널 */}
          <div>
            <h2
              className="font-bold mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              생성된 이미지
            </h2>

            {generatedImages.length === 0 ? (
              <div
                className="aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <ImageIcon
                  className="w-16 h-16 mb-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                />
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  프롬프트를 입력하고 이미지를 생성해보세요
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative rounded-xl overflow-hidden border"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full aspect-square object-cover"
                    />

                    {/* 오버레이 */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="w-full">
                        <p className="text-white text-xs line-clamp-2 mb-2">
                          {image.prompt}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              downloadImage(
                                image.url,
                                `ai-image-${image.id}.png`
                              )
                            }
                            className="flex-1 py-1.5 rounded-lg bg-white text-black text-xs font-medium flex items-center justify-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            다운로드
                          </button>
                          <button
                            onClick={() => copyPrompt(image.prompt)}
                            className="py-1.5 px-3 rounded-lg bg-white/20 text-white text-xs"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
