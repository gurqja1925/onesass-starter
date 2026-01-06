'use client'

/**
 * KoreanDate 컴포넌트
 * 한국 날짜 형식 표시 (YYYY년 MM월 DD일)
 */

export interface KoreanDateProps {
  date: Date | string | number
  format?: 'full' | 'short' | 'relative' | 'time' | 'datetime'
  showDayOfWeek?: boolean
  className?: string
}

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

export function KoreanDate({
  date,
  format = 'full',
  showDayOfWeek = false,
  className = '',
}: KoreanDateProps) {
  const d = new Date(date)

  if (isNaN(d.getTime())) {
    return <span className={className}>유효하지 않은 날짜</span>
  }

  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const dayOfWeek = DAY_NAMES[d.getDay()]
  const hours = d.getHours()
  const minutes = d.getMinutes().toString().padStart(2, '0')
  const ampm = hours < 12 ? '오전' : '오후'
  const hour12 = hours % 12 || 12

  const getRelativeTime = (): string => {
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (seconds < 60) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    if (days < 30) return `${Math.floor(days / 7)}주 전`
    if (months < 12) return `${months}개월 전`
    return `${years}년 전`
  }

  const formatDate = (): string => {
    switch (format) {
      case 'full':
        return `${year}년 ${month}월 ${day}일${showDayOfWeek ? ` (${dayOfWeek})` : ''}`
      case 'short':
        return `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`
      case 'relative':
        return getRelativeTime()
      case 'time':
        return `${ampm} ${hour12}:${minutes}`
      case 'datetime':
        return `${year}년 ${month}월 ${day}일 ${ampm} ${hour12}:${minutes}`
      default:
        return `${year}년 ${month}월 ${day}일`
    }
  }

  return (
    <time dateTime={d.toISOString()} className={className} style={{ color: 'var(--color-text)' }}>
      {formatDate()}
    </time>
  )
}
