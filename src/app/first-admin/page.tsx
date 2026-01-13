'use client'

/**
 * 첫 번째 관리자 계정 생성 페이지
 *
 * 배포 직후 이 페이지에 접속하여 첫 관리자를 생성할 수 있습니다.
 * /first-admin
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/onesaas-core/ui'

export default function FirstAdminPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [canCreate, setCanCreate] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // 첫 관리자를 생성할 수 있는지 확인
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/admin/setup-first')
        const data = await response.json()
        setCanCreate(data.canCreate)
        setChecking(false)
      } catch (error) {
        console.error('상태 확인 오류:', error)
        setError('상태 확인 중 오류가 발생했습니다.')
        setChecking(false)
      }
    }

    checkStatus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 유효성 검사
    if (!email || !password || !confirmPassword) {
      setError('모든 필드를 입력해주세요.')
      return
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/setup-first', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '관리자 계정 생성에 실패했습니다.')
        return
      }

      setSuccess(true)

      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push('/login?message=admin-created')
      }, 3000)

    } catch (error) {
      console.error('관리자 생성 오류:', error)
      setError('관리자 계정 생성 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p style={{ color: 'var(--color-text-secondary)' }}>상태 확인 중...</p>
        </div>
      </div>
    )
  }

  if (!canCreate) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            이미 설정이 완료되었습니다
          </h1>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            첫 번째 관리자 계정은 이미 생성되었습니다.
            <br />
            로그인 페이지로 이동하세요.
          </p>
          <Button onClick={() => router.push('/login')}>
            로그인 페이지로 이동
          </Button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            관리자 계정이 생성되었습니다!
          </h1>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            잠시 후 로그인 페이지로 이동합니다...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            첫 번째 관리자 계정 생성
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            관리자 계정을 생성하여 시스템을 시작하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              style={{
                background: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)'
              }}
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              style={{
                background: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)'
              }}
              placeholder="최소 8자 이상"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              style={{
                background: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)'
              }}
              placeholder="비밀번호 재입력"
            />
          </div>

          {error && (
            <div className="p-3 rounded-md text-sm" style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--color-error)',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? '생성 중...' : '관리자 계정 생성'}
          </Button>
        </form>

        <div className="mt-6 p-4 rounded-md text-sm" style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)'
        }}>
          <p className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            💡 안내
          </p>
          <ul className="space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
            <li>• 첫 번째 계정은 자동으로 관리자 권한을 받습니다</li>
            <li>• 비밀번호는 최소 8자 이상이어야 합니다</li>
            <li>• 계정 생성 후 즉시 로그인할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
