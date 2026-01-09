'use client'

/**
 * 관리자 훅
 */

import { useEffect, useState, useCallback } from 'react'
import { useUser } from '../auth/hooks'
import { getAppMode, setAppMode, isDemoMode as checkDemoMode, sampleData, type AppMode } from '@/lib/mode'

/**
 * 앱 모드 훅
 */
export function useAppMode() {
  const [mode, setMode] = useState<AppMode>('demo')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMode(getAppMode())
    setMounted(true)
  }, [])

  const changeMode = useCallback((newMode: AppMode) => {
    setAppMode(newMode)
  }, [])

  return {
    mode,
    isDemoMode: mode === 'demo',
    isProductionMode: mode === 'production',
    changeMode,
    mounted,
  }
}

/**
 * 관리자 권한 체크
 */
export function useAdminAuth() {
  const { user, loading: userLoading } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<AppMode>('demo')

  useEffect(() => {
    // 클라이언트에서만 모드 확인
    if (typeof window !== 'undefined') {
      setMode(getAppMode())
    }
  }, [])

  useEffect(() => {
    // 데모 모드: 인증 없이 관리자 접근 허용
    if (mode === 'demo') {
      setIsAdmin(true)
      setLoading(false)
      return
    }

    // 운영 모드: 실제 인증 필요
    if (!userLoading) {
      if (user) {
        // 관리자 이메일 확인 또는 DB에서 role 확인
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || []
        // 첫 번째 가입자는 자동으로 관리자 권한 부여 (또는 환경변수로 설정된 이메일)
        const isAdminUser = adminEmails.includes(user.email || '')
        setIsAdmin(isAdminUser || adminEmails.length === 0) // 설정된 관리자 이메일이 없으면 모든 로그인 사용자에게 관리자 권한
      }
      setLoading(false)
    }
  }, [user, userLoading, mode])

  return { user, isAdmin, loading, mode }
}

/**
 * 관리자 통계 데이터
 */
interface AdminStats {
  totalUsers: number
  newUsersToday: number
  activeSubscriptions: number
  monthlyRevenue: number
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isDemoMode } = useAppMode()

  useEffect(() => {
    const fetchStats = async () => {
      // 데모 모드: 샘플 데이터 사용
      if (isDemoMode) {
        setStats(sampleData.stats)
        setLoading(false)
        return
      }

      // 운영 모드: API에서 실제 데이터 가져오기
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          setError('통계를 불러올 수 없습니다')
        }
      } catch {
        setError('통계를 불러오는 중 오류가 발생했습니다')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isDemoMode])

  return { stats, loading, error, isDemoMode }
}

/**
 * 사용자 목록
 */
interface User {
  id: string
  email: string
  createdAt: string
  lastSignIn?: string
  plan?: string
}

export function useUserList(page = 1, limit = 10) {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/users?page=${page}&limit=${limit}`)
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users)
          setTotal(data.total)
        }
      } catch {
        // 에러 처리
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [page, limit])

  return { users, total, loading }
}
