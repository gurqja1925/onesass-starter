'use client'

/**
 * AI 음성 서비스 템플릿
 * TTS(텍스트→음성), STT(음성→텍스트) 기능
 */

import { useState, useRef, FormEvent } from 'react'
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Download,
  Loader2,
  FileAudio,
  Languages,
  Settings2,
  Trash2,
} from 'lucide-react'

// 음성 모드
type VoiceMode = 'tts' | 'stt'

// 음성 옵션
const VOICE_OPTIONS = [
  { id: 'alloy', name: 'Alloy', description: '중립적, 균형잡힌' },
  { id: 'echo', name: 'Echo', description: '남성적, 깊은' },
  { id: 'fable', name: 'Fable', description: '영국식, 서사적' },
  { id: 'onyx', name: 'Onyx', description: '권위있는, 깊은' },
  { id: 'nova', name: 'Nova', description: '여성적, 부드러운' },
  { id: 'shimmer', name: 'Shimmer', description: '표현력 있는, 따뜻한' },
]

// 언어 옵션
const LANGUAGE_OPTIONS = [
  { id: 'ko', name: '한국어' },
  { id: 'en', name: 'English' },
  { id: 'ja', name: '日本語' },
  { id: 'zh', name: '中文' },
  { id: 'es', name: 'Español' },
  { id: 'fr', name: 'Français' },
]

// 속도 옵션
const SPEED_OPTIONS = [
  { id: '0.5', name: '0.5x' },
  { id: '0.75', name: '0.75x' },
  { id: '1.0', name: '1x (기본)' },
  { id: '1.25', name: '1.25x' },
  { id: '1.5', name: '1.5x' },
  { id: '2.0', name: '2x' },
]

export function VoiceTemplate() {
  const [mode, setMode] = useState<VoiceMode>('tts')
  const [text, setText] = useState('')
  const [transcript, setTranscript] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('nova')
  const [selectedLanguage, setSelectedLanguage] = useState('ko')
  const [speed, setSpeed] = useState('1.0')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // TTS: 텍스트 → 음성
  const handleTTS = async (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim() || isProcessing) return

    setIsProcessing(true)

    try {
      const response = await fetch('/api/ai/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: selectedVoice,
          speed: parseFloat(speed),
          language: selectedLanguage,
        }),
      })

      if (!response.ok) throw new Error('TTS 변환 실패')

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
    } catch (error) {
      console.error('TTS error:', error)
      alert('음성 변환 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  // STT: 음성 → 텍스트
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await transcribeAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Recording error:', error)
      alert('마이크 접근 권한이 필요합니다.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      formData.append('language', selectedLanguage)

      const response = await fetch('/api/ai/voice/stt', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('STT 변환 실패')

      const data = await response.json()
      setTranscript(data.text || data.transcript)
    } catch (error) {
      console.error('STT error:', error)
      alert('음성 인식 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  // 오디오 재생/일시정지
  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // 오디오 다운로드
  const downloadAudio = () => {
    if (!audioUrl) return
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `voice-${Date.now()}.mp3`
    link.click()
  }

  // 초기화
  const reset = () => {
    setText('')
    setTranscript('')
    setAudioUrl(null)
    setIsPlaying(false)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* 헤더 */}
      <header
        className="border-b px-6 py-4"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--color-accent)' }}
            >
              <Volume2 className="w-6 h-6" style={{ color: 'var(--color-bg)' }} />
            </div>
            <div>
              <h1
                className="font-bold text-lg"
                style={{ color: 'var(--color-text)' }}
              >
                AI 음성 서비스
              </h1>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                텍스트 ↔ 음성 변환
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <Settings2 className="w-5 h-5" />
            </button>
            <button
              onClick={reset}
              className="p-2 rounded-lg"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* 모드 선택 */}
        <div className="mb-6">
          <div
            className="inline-flex rounded-xl p-1"
            style={{ background: 'var(--color-bg-secondary)' }}
          >
            <button
              onClick={() => setMode('tts')}
              className="px-6 py-3 rounded-lg font-medium transition-all"
              style={{
                background: mode === 'tts' ? 'var(--color-accent)' : 'transparent',
                color: mode === 'tts' ? 'var(--color-bg)' : 'var(--color-text)',
              }}
            >
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                텍스트 → 음성
              </span>
            </button>
            <button
              onClick={() => setMode('stt')}
              className="px-6 py-3 rounded-lg font-medium transition-all"
              style={{
                background: mode === 'stt' ? 'var(--color-accent)' : 'transparent',
                color: mode === 'stt' ? 'var(--color-bg)' : 'var(--color-text)',
              }}
            >
              <span className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                음성 → 텍스트
              </span>
            </button>
          </div>
        </div>

        {/* 설정 패널 */}
        {showSettings && (
          <div
            className="mb-6 p-4 rounded-xl border"
            style={{
              background: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="grid md:grid-cols-3 gap-4">
              {/* 언어 */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  언어
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{
                    background: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 음성 (TTS만) */}
              {mode === 'tts' && (
                <>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--color-text)' }}
                    >
                      음성
                    </label>
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border outline-none"
                      style={{
                        background: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        borderColor: 'var(--color-border)',
                      }}
                    >
                      {VOICE_OPTIONS.map((voice) => (
                        <option key={voice.id} value={voice.id}>
                          {voice.name} - {voice.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--color-text)' }}
                    >
                      속도
                    </label>
                    <select
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border outline-none"
                      style={{
                        background: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        borderColor: 'var(--color-border)',
                      }}
                    >
                      {SPEED_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* TTS 모드 */}
        {mode === 'tts' && (
          <div className="space-y-6">
            <form onSubmit={handleTTS}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  텍스트 입력
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="음성으로 변환할 텍스트를 입력하세요..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 resize-none"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                  }}
                />
                <p
                  className="text-xs mt-1 text-right"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {text.length} 자
                </p>
              </div>

              <button
                type="submit"
                disabled={!text.trim() || isProcessing}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-bg)',
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    변환 중...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    음성으로 변환
                  </>
                )}
              </button>
            </form>

            {/* 오디오 플레이어 */}
            {audioUrl && (
              <div
                className="p-6 rounded-xl border"
                style={{
                  background: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlayback}
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-accent)' }}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" style={{ color: 'var(--color-bg)' }} />
                    ) : (
                      <Play className="w-6 h-6 ml-1" style={{ color: 'var(--color-bg)' }} />
                    )}
                  </button>

                  <div className="flex-1">
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      className="w-full"
                      controls
                    />
                  </div>

                  <button
                    onClick={downloadAudio}
                    className="p-3 rounded-lg border"
                    style={{
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STT 모드 */}
        {mode === 'stt' && (
          <div className="space-y-6">
            {/* 녹음 버튼 */}
            <div className="flex flex-col items-center py-12">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                  isRecording ? 'animate-pulse' : ''
                }`}
                style={{
                  background: isRecording ? '#ef4444' : 'var(--color-accent)',
                }}
              >
                {isProcessing ? (
                  <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'var(--color-bg)' }} />
                ) : isRecording ? (
                  <MicOff className="w-12 h-12" style={{ color: 'white' }} />
                ) : (
                  <Mic className="w-12 h-12" style={{ color: 'var(--color-bg)' }} />
                )}
              </button>

              <p
                className="mt-4 text-lg font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                {isProcessing
                  ? '음성 인식 중...'
                  : isRecording
                  ? '녹음 중... 탭하여 중지'
                  : '탭하여 녹음 시작'}
              </p>
            </div>

            {/* 변환 결과 */}
            {transcript && (
              <div
                className="p-6 rounded-xl border"
                style={{
                  background: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className="font-bold"
                    style={{ color: 'var(--color-text)' }}
                  >
                    인식된 텍스트
                  </h3>
                  <button
                    onClick={() => navigator.clipboard.writeText(transcript)}
                    className="text-sm px-3 py-1 rounded-lg"
                    style={{
                      background: 'var(--color-bg)',
                      color: 'var(--color-text)',
                    }}
                  >
                    복사
                  </button>
                </div>
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: 'var(--color-text)' }}
                >
                  {transcript}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
