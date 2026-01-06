'use client'

/**
 * AI 번역 템플릿
 * 다국어 번역 및 로컬라이징 서비스
 */

import { useState, FormEvent } from 'react'
import {
  Languages,
  Loader2,
  Copy,
  Check,
  ArrowLeftRight,
  Volume2,
  History,
  Star,
  Trash2,
} from 'lucide-react'

// 언어 목록
const LANGUAGES = [
  { id: 'ko', name: '한국어', flag: '🇰🇷' },
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'ja', name: '日本語', flag: '🇯🇵' },
  { id: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { id: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { id: 'es', name: 'Español', flag: '🇪🇸' },
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { id: 'it', name: 'Italiano', flag: '🇮🇹' },
  { id: 'pt', name: 'Português', flag: '🇵🇹' },
  { id: 'ru', name: 'Русский', flag: '🇷🇺' },
  { id: 'ar', name: 'العربية', flag: '🇸🇦' },
  { id: 'th', name: 'ไทย', flag: '🇹🇭' },
  { id: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { id: 'id', name: 'Indonesia', flag: '🇮🇩' },
]

// 번역 톤
const TONE_OPTIONS = [
  { id: 'formal', name: '격식체', description: '비즈니스, 공식 문서' },
  { id: 'casual', name: '비격식체', description: '일상 대화, SNS' },
  { id: 'polite', name: '정중체', description: '고객 응대, 이메일' },
  { id: 'technical', name: '기술문서', description: '개발 문서, 매뉴얼' },
]

// 번역 기록 타입
interface TranslationRecord {
  id: string
  source: string
  result: string
  fromLang: string
  toLang: string
  timestamp: Date
}

export function TranslatorTemplate() {
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [fromLang, setFromLang] = useState('ko')
  const [toLang, setToLang] = useState('en')
  const [tone, setTone] = useState('formal')
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<TranslationRecord[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // 언어 스왑
  const swapLanguages = () => {
    setFromLang(toLang)
    setToLang(fromLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  // 번역 실행
  const handleTranslate = async (e: FormEvent) => {
    e.preventDefault()
    if (!sourceText.trim() || isTranslating) return

    setIsTranslating(true)
    setTranslatedText('')

    try {
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          fromLang,
          toLang,
          tone,
        }),
      })

      if (!response.ok) throw new Error('번역 실패')

      const data = await response.json()
      const result = data.translation || data.text
      setTranslatedText(result)

      // 기록 추가
      const record: TranslationRecord = {
        id: Date.now().toString(),
        source: sourceText,
        result,
        fromLang,
        toLang,
        timestamp: new Date(),
      }
      setHistory((prev) => [record, ...prev.slice(0, 9)])
    } catch (error) {
      console.error('Translate error:', error)
      setTranslatedText('번역 중 오류가 발생했습니다.')
    } finally {
      setIsTranslating(false)
    }
  }

  // 복사
  const copyTranslation = async () => {
    await navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 음성 재생 (TTS)
  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      speechSynthesis.speak(utterance)
    }
  }

  // 기록에서 불러오기
  const loadFromHistory = (record: TranslationRecord) => {
    setSourceText(record.source)
    setTranslatedText(record.result)
    setFromLang(record.fromLang)
    setToLang(record.toLang)
    setShowHistory(false)
  }

  const getLanguageName = (id: string) => LANGUAGES.find((l) => l.id === id)?.name || id
  const getLanguageFlag = (id: string) => LANGUAGES.find((l) => l.id === id)?.flag || ''

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
              <Languages className="w-6 h-6" style={{ color: 'var(--color-bg)' }} />
            </div>
            <div>
              <h1
                className="font-bold text-lg"
                style={{ color: 'var(--color-text)' }}
              >
                AI 번역
              </h1>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                다국어 번역 및 로컬라이징
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
            }}
          >
            <History className="w-4 h-4" />
            기록
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* 언어 선택 바 */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value)}
            className="px-4 py-3 rounded-xl border outline-none text-lg font-medium"
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>

          <button
            onClick={swapLanguages}
            className="p-3 rounded-xl transition-all hover:scale-110"
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-bg)',
            }}
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>

          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value)}
            className="px-4 py-3 rounded-xl border outline-none text-lg font-medium"
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* 톤 선택 */}
        <div className="flex justify-center gap-2 mb-6">
          {TONE_OPTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className="px-4 py-2 rounded-lg text-sm transition-all"
              style={{
                background: tone === t.id ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                color: tone === t.id ? 'var(--color-bg)' : 'var(--color-text)',
                border: `1px solid ${tone === t.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* 번역 영역 */}
        <form onSubmit={handleTranslate}>
          <div className="grid md:grid-cols-2 gap-4">
            {/* 원문 */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                background: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <span
                  className="font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {getLanguageFlag(fromLang)} {getLanguageName(fromLang)}
                </span>
                <button
                  type="button"
                  onClick={() => speakText(sourceText, fromLang)}
                  className="p-1.5 rounded-lg"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="번역할 텍스트를 입력하세요..."
                rows={8}
                className="w-full px-4 py-3 resize-none outline-none"
                style={{
                  background: 'transparent',
                  color: 'var(--color-text)',
                }}
              />
              <div
                className="px-4 py-2 text-xs text-right"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {sourceText.length.toLocaleString()} 자
              </div>
            </div>

            {/* 번역 결과 */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                background: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <span
                  className="font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {getLanguageFlag(toLang)} {getLanguageName(toLang)}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => speakText(translatedText, toLang)}
                    className="p-1.5 rounded-lg"
                    style={{ color: 'var(--color-text-secondary)' }}
                    disabled={!translatedText}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={copyTranslation}
                    className="p-1.5 rounded-lg"
                    style={{ color: 'var(--color-text-secondary)' }}
                    disabled={!translatedText}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div
                className="min-h-[200px] px-4 py-3"
                style={{ color: 'var(--color-text)' }}
              >
                {translatedText ? (
                  <p className="whitespace-pre-wrap">{translatedText}</p>
                ) : (
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    {isTranslating ? '번역 중...' : '번역 결과가 여기에 표시됩니다'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 번역 버튼 */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={!sourceText.trim() || isTranslating}
              className="px-12 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 flex items-center gap-2"
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-bg)',
              }}
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  번역 중...
                </>
              ) : (
                <>
                  <Languages className="w-5 h-5" />
                  번역하기
                </>
              )}
            </button>
          </div>
        </form>

        {/* 번역 기록 모달 */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className="w-full max-w-lg rounded-2xl p-6"
              style={{ background: 'var(--color-bg)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="font-bold text-lg"
                  style={{ color: 'var(--color-text)' }}
                >
                  번역 기록
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  닫기
                </button>
              </div>

              {history.length === 0 ? (
                <p
                  className="text-center py-8"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  아직 번역 기록이 없습니다
                </p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {history.map((record) => (
                    <button
                      key={record.id}
                      onClick={() => loadFromHistory(record)}
                      className="w-full p-4 rounded-xl border text-left transition-all hover:opacity-80"
                      style={{
                        background: 'var(--color-bg-secondary)',
                        borderColor: 'var(--color-border)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                          {getLanguageFlag(record.fromLang)} → {getLanguageFlag(record.toLang)}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {new Date(record.timestamp).toLocaleString('ko-KR')}
                        </span>
                      </div>
                      <p
                        className="text-sm line-clamp-2"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {record.source}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="mt-4 flex items-center gap-2 text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <Trash2 className="w-4 h-4" />
                  기록 전체 삭제
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
