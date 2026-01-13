'use client'

import { useState } from 'react'
import { useAuth } from '@/onesaas-core/auth/provider'
import { getAdminAuthConfig } from '@/onesaas-core/auth/config'
import { Button } from '@/onesaas-core/ui'

export default function AdminAuthPage() {
  const { signIn, signInWithProvider, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const adminConfig = getAdminAuthConfig()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        return
      }

      // 로그인 성공 - 권한 확인 후 리다이렉트
      try {
        // 사용자 동기화 API 호출
        await fetch('/api/auth/sync', { method: 'POST' })
        
        // 잠시 대기하여 동기화 완료
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 관리자 권한 확인
        const sessionResponse = await fetch('/api/auth/session')
        const sessionData = await sessionResponse.json()
        
        if (sessionData.user?.isAdmin) {
          window.location.href = '/admin'
        } else {
          setError('관리자 권한이 없는 계정입니다.')
        }
      } catch (syncError) {
        console.error('Sync or auth check error:', syncError)
        setError('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderLogin = async (provider: 'google' | 'kakao' | 'github') => {
    try {
      await signInWithProvider(provider)
    } catch (err) {
      setError(`${provider} 로그인 중 오류가 발생했습니다.`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            관리자 로그인
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            관리자 계정으로 로그인해주세요
          </p>
        </div>

        {/* 소셜 로그인 제거 - 이메일/비밀번호만 표시 */}
        {adminConfig.providers.includes('email') && (
          <form onSubmit={handleEmailLogin} className="space-y-6">
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
                placeholder="••••••••"
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
              disabled={isLoading || loading}
              className="w-full"
            >
              {isLoading || loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        )}

        <div className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          <p>관리자 권한이 있는 계정만 접근할 수 있습니다.</p>
          <p className="mt-2">첫 번째 가입자는 자동으로 관리자 권한을 얻습니다.</p>
        </div>
      </div>
    </div>
  )
}