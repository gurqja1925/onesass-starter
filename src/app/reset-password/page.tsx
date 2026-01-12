'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)

  useEffect(() => {
    // 세션 확인
    const checkSession = async () => {
      const supabase = createClient()
      if (!supabase) {
        setIsError(true)
        setMessage('Supabase client not available')
        return
      }

      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setIsError(true)
        setMessage('유효하지 않은 링크입니다. 비밀번호 재설정을 다시 요청해주세요.')
      } else {
        setIsValidSession(true)
      }
    }

    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setIsError(true)
      setMessage('비밀번호가 일치하지 않습니다')
      return
    }

    if (password.length < 6) {
      setIsError(true)
      setMessage('비밀번호는 6자 이상이어야 합니다')
      return
    }

    setLoading(true)
    setMessage('')
    setIsError(false)

    try {
      const supabase = createClient()
      if (!supabase) {
        throw new Error('Supabase client not available')
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setIsError(false)
      setMessage('✓ 비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다...')

      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: any) {
      setIsError(true)
      setMessage('✗ 비밀번호 변경 실패: ' + (error.message || '알 수 없는 오류'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--color-bg)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            비밀번호 재설정
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            새로운 비밀번호를 입력해주세요
          </p>
        </div>

        {!isValidSession && isError ? (
          <div className="text-center">
            <div className="mb-6 p-4 rounded-lg" style={{ background: '#ef444420', color: '#ef4444' }}>
              {message}
            </div>
            <Link
              href="/login"
              className="inline-block px-6 py-3 rounded-lg font-medium"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              로그인 페이지로
            </Link>
          </div>
        ) : isValidSession ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                새 비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                placeholder="6자 이상 입력"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                placeholder="비밀번호 재입력"
              />
            </div>

            {message && (
              <div
                className="p-4 rounded-lg text-sm text-center"
                style={{
                  background: isError ? '#ef444420' : '#10b98120',
                  color: isError ? '#ef4444' : '#10b981'
                }}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg font-medium"
              style={{
                background: loading ? 'var(--color-bg)' : 'var(--color-accent)',
                color: loading ? 'var(--color-text-secondary)' : 'var(--color-bg)',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm"
                style={{ color: 'var(--color-accent)' }}
              >
                로그인 페이지로 돌아가기
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center" style={{ color: 'var(--color-text-secondary)' }}>
            세션 확인 중...
          </div>
        )}
      </div>
    </div>
  )
}
