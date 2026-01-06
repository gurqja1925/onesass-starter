/**
 * 로딩 컴포넌트
 */

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export function Loading({ size = 'md', text }: LoadingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} border-2 rounded-full animate-spin`}
        style={{
          borderColor: 'var(--color-border)',
          borderTopColor: 'var(--color-accent)',
        }}
      />
      {text && (
        <p
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {text}
        </p>
      )}
    </div>
  )
}

export function PageLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-bg)' }}
    >
      <Loading size="lg" text="로딩 중..." />
    </div>
  )
}

export function Skeleton({
  className = '',
  height = 'h-4',
}: {
  className?: string
  height?: string
}) {
  return (
    <div
      className={`animate-pulse rounded ${height} ${className}`}
      style={{ background: 'var(--color-bg-secondary)' }}
    />
  )
}
