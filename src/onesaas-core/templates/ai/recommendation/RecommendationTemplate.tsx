'use client'

/**
 * AI 추천 시스템 템플릿
 * 상품, 콘텐츠, 개인화 추천 인터페이스
 */

import { useState, FormEvent } from 'react'
import {
  Sparkles,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Settings2,
  ShoppingBag,
  Film,
  Music,
  Book,
  Utensils,
  MapPin,
  Users,
  Star,
} from 'lucide-react'

// 추천 카테고리
const CATEGORIES = [
  { id: 'product', name: '상품', icon: ShoppingBag, description: '맞춤 상품 추천' },
  { id: 'content', name: '콘텐츠', icon: Film, description: '영화, 영상 추천' },
  { id: 'music', name: '음악', icon: Music, description: '음악 플레이리스트' },
  { id: 'book', name: '도서', icon: Book, description: '책 추천' },
  { id: 'food', name: '맛집', icon: Utensils, description: '음식점 추천' },
  { id: 'travel', name: '여행지', icon: MapPin, description: '여행 장소 추천' },
]

// 추천 항목 타입
interface RecommendItem {
  id: string
  title: string
  description: string
  category: string
  rating: number
  matchScore: number
  image?: string
  tags: string[]
  reason: string
}

// 사용자 선호도 타입
interface UserPreference {
  liked: string[]
  disliked: string[]
  categories: string[]
  budget?: string
  mood?: string
}

export function RecommendationTemplate() {
  const [category, setCategory] = useState('product')
  const [query, setQuery] = useState('')
  const [preferences, setPreferences] = useState<UserPreference>({
    liked: [],
    disliked: [],
    categories: [],
  })
  const [budget, setBudget] = useState('')
  const [mood, setMood] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<RecommendItem[]>([])
  const [showPreferences, setShowPreferences] = useState(false)

  // 추천 가져오기
  const getRecommendations = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setRecommendations([])

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          query,
          preferences: {
            ...preferences,
            budget,
            mood,
          },
        }),
      })

      if (!response.ok) throw new Error('추천 실패')

      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error('Recommendation error:', error)
      // 데모용 더미 데이터
      setRecommendations([
        {
          id: '1',
          title: '추천 항목 1',
          description: 'AI가 분석한 맞춤 추천입니다.',
          category,
          rating: 4.5,
          matchScore: 95,
          tags: ['인기', '추천', '베스트'],
          reason: '사용자의 선호도와 95% 일치합니다.',
        },
        {
          id: '2',
          title: '추천 항목 2',
          description: '당신의 취향에 맞는 또 다른 추천입니다.',
          category,
          rating: 4.3,
          matchScore: 88,
          tags: ['신규', '트렌드'],
          reason: '최근 관심사와 유사한 패턴이 발견되었습니다.',
        },
        {
          id: '3',
          title: '추천 항목 3',
          description: '새로운 경험을 위한 추천입니다.',
          category,
          rating: 4.7,
          matchScore: 82,
          tags: ['프리미엄'],
          reason: '비슷한 취향의 사용자들이 좋아한 항목입니다.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // 피드백 처리
  const handleFeedback = (itemId: string, isPositive: boolean) => {
    if (isPositive) {
      setPreferences((prev) => ({
        ...prev,
        liked: [...prev.liked, itemId],
        disliked: prev.disliked.filter((id) => id !== itemId),
      }))
    } else {
      setPreferences((prev) => ({
        ...prev,
        disliked: [...prev.disliked, itemId],
        liked: prev.liked.filter((id) => id !== itemId),
      }))
    }
  }

  // 새로고침
  const refreshRecommendations = () => {
    if (query.trim()) {
      getRecommendations({ preventDefault: () => {} } as FormEvent)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* 헤더 */}
      <header
        className="border-b px-6 py-4"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
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
                AI 추천
              </h1>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                맞춤형 추천을 받아보세요
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
            }}
          >
            <Settings2 className="w-4 h-4" />
            선호도 설정
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* 카테고리 선택 */}
        <div className="mb-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className="p-4 rounded-xl border text-center transition-all"
                style={{
                  background: category === cat.id ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                  color: category === cat.id ? 'var(--color-bg)' : 'var(--color-text)',
                  borderColor: category === cat.id ? 'var(--color-accent)' : 'var(--color-border)',
                }}
              >
                <cat.icon className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">{cat.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 검색 폼 */}
        <form onSubmit={getRecommendations} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`어떤 ${CATEGORIES.find((c) => c.id === category)?.name}을 찾으시나요?`}
                className="w-full px-4 py-4 rounded-xl border outline-none focus:ring-2 text-lg"
                style={{
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-bg)',
              }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              추천받기
            </button>
          </div>

          {/* 필터 옵션 */}
          <div className="flex gap-3 mt-3">
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="px-3 py-2 rounded-lg border outline-none text-sm"
              style={{
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
            >
              <option value="">예산 무관</option>
              <option value="low">저렴한</option>
              <option value="medium">적당한</option>
              <option value="high">프리미엄</option>
            </select>

            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="px-3 py-2 rounded-lg border outline-none text-sm"
              style={{
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
            >
              <option value="">분위기 무관</option>
              <option value="calm">차분한</option>
              <option value="exciting">신나는</option>
              <option value="romantic">로맨틱한</option>
              <option value="practical">실용적인</option>
            </select>
          </div>
        </form>

        {/* 선호도 설정 패널 */}
        {showPreferences && (
          <div
            className="mb-8 p-6 rounded-xl border"
            style={{
              background: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border)',
            }}
          >
            <h3
              className="font-bold mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              선호도 설정
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  좋아하는 것들
                </label>
                <p
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {preferences.liked.length > 0
                    ? `${preferences.liked.length}개 항목`
                    : '아직 없음'}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  피하고 싶은 것들
                </label>
                <p
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {preferences.disliked.length > 0
                    ? `${preferences.disliked.length}개 항목`
                    : '아직 없음'}
                </p>
              </div>
            </div>
            <p
              className="text-xs mt-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              추천 결과에 피드백을 주면 자동으로 선호도가 학습됩니다.
            </p>
          </div>
        )}

        {/* 추천 결과 */}
        {recommendations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="font-bold text-lg"
                style={{ color: 'var(--color-text)' }}
              >
                맞춤 추천 결과
              </h2>
              <button
                onClick={refreshRecommendations}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                style={{
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                }}
              >
                <RefreshCw className="w-4 h-4" />
                다른 추천 보기
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border overflow-hidden transition-all hover:shadow-lg"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  {/* 이미지 영역 */}
                  <div
                    className="h-40 flex items-center justify-center"
                    style={{ background: 'var(--color-border)' }}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag
                        className="w-12 h-12"
                        style={{ color: 'var(--color-text-secondary)' }}
                      />
                    )}
                  </div>

                  {/* 콘텐츠 */}
                  <div className="p-4">
                    {/* 매치 스코어 */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{
                          background: 'var(--color-accent)',
                          color: 'var(--color-bg)',
                        }}
                      >
                        {item.matchScore}% 매치
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span
                          className="text-sm"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {item.rating}
                        </span>
                      </div>
                    </div>

                    <h3
                      className="font-bold mb-1"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm mb-2 line-clamp-2"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {item.description}
                    </p>

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-xs"
                          style={{
                            background: 'var(--color-bg)',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* 추천 이유 */}
                    <p
                      className="text-xs mb-3"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {item.reason}
                    </p>

                    {/* 피드백 버튼 */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFeedback(item.id, true)}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1 text-sm transition-all ${
                          preferences.liked.includes(item.id) ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{
                          background: preferences.liked.includes(item.id)
                            ? 'var(--color-accent)'
                            : 'var(--color-bg)',
                          color: preferences.liked.includes(item.id)
                            ? 'var(--color-bg)'
                            : 'var(--color-text)',
                        }}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        좋아요
                      </button>
                      <button
                        onClick={() => handleFeedback(item.id, false)}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1 text-sm transition-all ${
                          preferences.disliked.includes(item.id) ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{
                          background: preferences.disliked.includes(item.id)
                            ? '#ef4444'
                            : 'var(--color-bg)',
                          color: preferences.disliked.includes(item.id)
                            ? 'white'
                            : 'var(--color-text)',
                        }}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        별로예요
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {!isLoading && recommendations.length === 0 && (
          <div
            className="text-center py-16"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">맞춤 추천을 받아보세요</p>
            <p className="text-sm">
              찾고 싶은 것을 입력하면 AI가 분석하여 추천해드립니다
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
