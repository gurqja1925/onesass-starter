'use client'

/**
 * 관리자 훅
 */

import { useEffect, useState } from 'react'
import { useAuth } from '../auth/provider'

/**
 * 관리자 권한 체크
 */
export function useAdminAuth() {
  const { user, loading: userLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 실제 인증 체크
    if (!userLoading) {
      if (user) {
        // 관리자 이메일 확인 (하드코딩된 리스트 사용)
        const ADMIN_EMAILS = ['johunsang@gmail.com']
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || ADMIN_EMAILS
        const isAdminUser = adminEmails.includes(user.email?.toLowerCase() || '')
        setIsAdmin(isAdminUser)
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    }
  }, [user, userLoading])

  return { user, isAdmin, loading }
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

  useEffect(() => {
    const fetchStats = async () => {
      // API에서 실제 데이터 가져오기
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
  }, [])

  return { stats, loading, error }
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
