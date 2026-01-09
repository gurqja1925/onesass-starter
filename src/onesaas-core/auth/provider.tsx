'use client'

/**
 * 인증 Provider
 *
 * Supabase Auth를 사용하여 인증 상태를 관리합니다.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isConfigured: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithProvider: (provider: 'google' | 'kakao' | 'github') => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Supabase가 설정되지 않은 경우 로딩만 해제
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    // 현재 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const supabase = createClient()
    if (!supabase) return { error: new Error('Supabase not configured') }
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    // 로그인 성공 시 이벤트 기록 및 사용자 동기화
    if (!error) {
      try {
        await fetch('/api/auth/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'login' }),
        })
        await fetch('/api/auth/sync', { method: 'POST' })
      } catch (e) {
        console.error('Event recording failed:', e)
      }
    }

    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const supabase = createClient()
    if (!supabase) return { error: new Error('Supabase not configured') }
    const { error } = await supabase.auth.signUp({ email, password })

    // 회원가입 성공 시 이벤트 기록 (사용자 생성은 이벤트 API에서 처리)
    if (!error) {
      try {
        await fetch('/api/auth/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'signup' }),
        })
      } catch (e) {
        console.error('Event recording failed:', e)
      }
    }

    return { error }
  }

  const signOut = async () => {
    const supabase = createClient()
    if (!supabase) return

    // 로그아웃 이벤트 기록
    try {
      await fetch('/api/auth/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'logout' }),
      })
    } catch (e) {
      console.error('Event recording failed:', e)
    }

    await supabase.auth.signOut()
  }

  const signInWithProvider = async (provider: 'google' | 'kakao' | 'github') => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        signInWithProvider,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
