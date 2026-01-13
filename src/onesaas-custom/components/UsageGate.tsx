/**
 * UsageGate - 사용량 기반 권한 체크 컴포넌트
 * 
 * 사용량 한도에 도달하면 자식 요소를 비활성화하거나 업그레이드 안내를 보여줍니다.
 */

'use client'

import { useState, useEffect, ReactNode } from 'react'
import { Button } from '@/onesaas-core/ui'
import Link from 'next/link'

export type UsageType = 'creates' | 'aiCalls' | 'exports' | 'apiCalls' | 'storage'

interface UsageGateProps {
  /** 체크할 사용량 타입 */
  type: UsageType
  /** 자식 요소 (보통 버튼) */
  children: ReactNode
  /** 한도 도달 시 보여줄 대체 요소 (기본: 업그레이드 버튼) */
  fallback?: ReactNode
  /** 한도 도달 시 호출할 콜백 */
  onLimitReached?: () => void
  /** 사용량 체크 시 호출할 콜백 (결과 전달) */
  onCheck?: (canUse: boolean, remaining: number) => void
}

interface UsageCheckResult {
  canUse: boolean
  remaining: number
  limit: number
  current: number
}

/**
 * 사용량 체크 후 자식 요소 렌더링
 * 
 * @example
 * ```tsx
 * <UsageGate type="creates">
 *   <Button onClick={handleCreate}>새로 만들기</Button>
 * </UsageGate>
 * ```
 */
export function UsageGate({ 
  type, 
  children, 
  fallback,
  onLimitReached,
  onCheck 
}: UsageGateProps) {
  const [checkResult, setCheckResult] = useState<UsageCheckResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUsage = async () => {
      try {
        const response = await fetch('/api/usage')
        if (response.ok) {
          const data = await response.json()
          const remaining = data.remaining[type]
          const canUse = remaining === -1 || remaining > 0
          
          setCheckResult({
            canUse,
            remaining,
            limit: data.limits[type],
            current: data.usage[type],
          })

          onCheck?.(canUse, remaining)
          
          if (!canUse) {
            onLimitReached?.()
          }
        }
      } catch (error) {
        console.error('사용량 체크 오류:', error)
        // 오류 시 기본적으로 허용
        setCheckResult({
          canUse: true,
          remaining: -1,
          limit: -1,
          current: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    checkUsage()
  }, [type, onCheck, onLimitReached])

  if (loading) {
    return <>{children}</>
  }

  // 사용 가능하면 자식 요소 그대로 렌더링
  if (checkResult?.canUse) {
    return <>{children}</>
  }

  // 한도 도달 시 fallback 또는 기본 업그레이드 버튼
  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <p className="text-xs text-red-500">
        월간 {getTypeName(type)} 한도에 도달했습니다
      </p>
      <Link href="/subscription">
        <Button variant="outline" size="sm">
          플랜 업그레이드
        </Button>
      </Link>
    </div>
  )
}

/**
 * 사용량 체크 버튼 - 클릭 시 사용량 증가
 * 
 * @example
 * ```tsx
 * <UsageButton 
 *   type="creates" 
 *   onClick={handleCreate}
 * >
 *   새로 만들기
 * </UsageButton>
 * ```
 */
interface UsageButtonProps {
  /** 체크할 사용량 타입 */
  type: UsageType
  /** 버튼 클릭 시 콜백 */
  onClick: () => void | Promise<void>
  /** 버튼 텍스트 */
  children: ReactNode
  /** 버튼 variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg'
  /** 추가 클래스 */
  className?: string
  /** 로딩 중 비활성화 */
  disabled?: boolean
}

export function UsageButton({
  type,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}: UsageButtonProps) {
  const [remaining, setRemaining] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const checkUsage = async () => {
      try {
        const response = await fetch('/api/usage')
        if (response.ok) {
          const data = await response.json()
          setRemaining(data.remaining[type])
        }
      } catch (error) {
        console.error('사용량 체크 오류:', error)
        setRemaining(-1) // 오류 시 무제한으로 처리
      } finally {
        setLoading(false)
      }
    }

    checkUsage()
  }, [type])

  const handleClick = async () => {
    if (remaining !== -1 && remaining !== null && remaining <= 0) {
      return
    }

    setProcessing(true)
    try {
      // 사용량 증가
      const response = await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, amount: 1 }),
      })

      if (response.ok) {
        const result = await response.json()
        setRemaining(result.remaining)
        await onClick()
      } else {
        const error = await response.json()
        alert(error.error || '한도에 도달했습니다.')
      }
    } catch (error) {
      console.error('사용량 증가 오류:', error)
    } finally {
      setProcessing(false)
    }
  }

  const canUse = remaining === -1 || (remaining !== null && remaining > 0)
  const isDisabled = disabled || loading || processing || !canUse

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled={isDisabled}
        onClick={handleClick}
      >
        {processing ? '처리 중...' : children}
      </Button>
      {!loading && remaining !== null && remaining !== -1 && (
        <span className={`text-xs ${remaining <= 3 ? 'text-amber-500' : 'text-gray-500'}`}>
          {remaining > 0 ? `${remaining}회 남음` : '한도 도달'}
        </span>
      )}
    </div>
  )
}

/**
 * 남은 사용량 표시 배지
 */
interface UsageBadgeProps {
  type: UsageType
  showWhenUnlimited?: boolean
}

export function UsageBadge({ type, showWhenUnlimited = false }: UsageBadgeProps) {
  const [remaining, setRemaining] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUsage = async () => {
      try {
        const response = await fetch('/api/usage')
        if (response.ok) {
          const data = await response.json()
          setRemaining(data.remaining[type])
        }
      } catch (error) {
        console.error('사용량 체크 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUsage()
  }, [type])

  if (loading || remaining === null) return null
  if (remaining === -1 && !showWhenUnlimited) return null

  const getBadgeColor = () => {
    if (remaining === -1) return 'bg-green-100 text-green-800'
    if (remaining === 0) return 'bg-red-100 text-red-800'
    if (remaining <= 3) return 'bg-amber-100 text-amber-800'
    return 'bg-blue-100 text-blue-800'
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}>
      {remaining === -1 ? '무제한' : `${remaining ?? 0}회 남음`}
    </span>
  )
}

// 타입 이름 헬퍼
function getTypeName(type: UsageType): string {
  const names: Record<UsageType, string> = {
    creates: '생성',
    aiCalls: 'AI 호출',
    exports: '내보내기',
    apiCalls: 'API 호출',
    storage: '저장공간',
  }
  return names[type]
}
