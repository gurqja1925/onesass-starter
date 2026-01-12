'use client'

/**
 * 커스텀 기능 카드 컴포넌트
 *
 * 이 컴포넌트는 onesaas-custom 폴더에 있으므로
 * 템플릿 업데이트 시에도 안전합니다!
 */

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  link?: string
}

export function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <div
      className="p-6 rounded-2xl transition-all hover:scale-105"
      style={{
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* 아이콘 */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4"
        style={{ background: 'var(--color-accent)' }}
      >
        {icon}
      </div>

      {/* 제목 */}
      <h3
        className="text-xl font-bold mb-2"
        style={{ color: 'var(--color-text)' }}
      >
        {title}
      </h3>

      {/* 설명 */}
      <p
        className="text-sm mb-4"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {description}
      </p>

      {/* 링크 */}
      {link && (
        <a
          href={link}
          className="text-sm font-semibold inline-flex items-center gap-1 hover:opacity-80"
          style={{ color: 'var(--color-accent)' }}
        >
          자세히 보기 →
        </a>
      )}
    </div>
  )
}
