'use client'

import Link from 'next/link'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { useAuth } from '@/onesaas-core/auth/provider'

export default function DashboardPage() {
  const { user: authUser } = useAuth()
  const userName = authUser?.user_metadata?.name || authUser?.email?.split('@')[0] || '사용자'

  const usageStats = [
    { label: '노트', used: 12, limit: '무제한', icon: '📝', color: '#10b981' },
  ]

  const quickFeatures = [
    { href: '/dashboard/notes', icon: '📝', title: '노트', desc: '아이디어 정리', gradient: 'linear-gradient(135deg, #10b981, #047857)' },
    { href: '/dashboard/settings', icon: '⚙️', title: '설정', desc: '계정 관리', gradient: 'linear-gradient(135deg, #6366f1, #4338ca)' },
  ]

  const recentActivity = [
    { type: 'note', title: '노트 저장', detail: '"회의 노트" 수정', time: '1시간 전', icon: '📝' },
    { type: 'note', title: '노트 생성', detail: '"프로젝트 아이디어" 작성', time: '2시간 전', icon: '📝' },
    { type: 'note', title: '노트 저장', detail: '"할 일 목록" 업데이트', time: '5시간 전', icon: '📝' },
  ]

  return (
    <DashboardLayout title="대시보드">
      <div className="max-w-6xl mx-auto">
        {/* 환영 메시지 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">안녕하세요, {userName}님! 👋</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            오늘도 AI와 함께 창의적인 하루를 시작하세요
          </p>
        </div>

        {/* 플랜 정보 */}
        <div
          className="mb-8 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, #10b981 100%)' }}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-sm font-bold bg-white/20 text-white">
                무료 플랜
              </span>
            </div>
            <p className="text-white/90">
              기본 기능을 사용할 수 있습니다
            </p>
          </div>
          <Link
            href="/dashboard/settings"
            className="px-6 py-3 rounded-xl font-medium bg-white hover:bg-white/90 transition-all"
            style={{ color: 'var(--color-accent)' }}
          >
            결제하기
          </Link>
        </div>

        {/* 사용량 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {usageStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-6"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `${stat.color}20` }}
                >
                  {stat.icon}
                </span>
              </div>
              <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                {stat.label}
              </p>
              <p className="text-2xl font-bold mb-2">
                {stat.used}
                <span className="text-base font-normal" style={{ color: 'var(--color-text-secondary)' }}>
                  {' '}/{' '}{stat.limit}
                </span>
              </p>
              {typeof stat.limit === 'number' && (
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: 'var(--color-bg)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(stat.used / stat.limit) * 100}%`,
                      background: stat.color,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 빠른 시작 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">빠른 시작</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickFeatures.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="rounded-2xl p-4 text-center transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: feature.gradient }}
              >
                <span className="text-3xl block mb-2">{feature.icon}</span>
                <p className="font-bold text-white text-sm">{feature.title}</p>
                <p className="text-xs text-white/70">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* 최근 활동 */}
        <div
          className="rounded-2xl overflow-hidden max-w-2xl"
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div className="p-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-bold">최근 활동</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm line-clamp-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {activity.detail}
                    </p>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 안내 배너 */}
        <div
          className="mt-8 p-12 rounded-2xl"
          style={{ background: 'var(--color-bg-secondary)', border: '2px solid var(--color-border)' }}
        >
          <div className="text-center mb-8">
            <span className="text-6xl block mb-4">🚀</span>
            <h2 className="text-3xl font-bold mb-4">이것은 샘플 페이지입니다</h2>
            <p className="text-lg mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              이제 여러분들이 여기다가 직접 <strong style={{ color: 'var(--color-accent)' }}>바이브 코딩</strong>을 통해서
            </p>
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              나만의 서비스를 만들면 됩니다
            </p>
          </div>

          {/* 프롬프트 예시 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-center">💡 프롬프트 예시</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <div
                className="p-4 rounded-xl"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🤖</span>
                  <p className="font-bold">Claude Code</p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  "대시보드에 사용자 통계 차트 추가해줘"
                </p>
              </div>

              <div
                className="p-4 rounded-xl"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✨</span>
                  <p className="font-bold">Cursor / Copilot</p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  "노트 페이지에 마크다운 에디터 추가"
                </p>
              </div>

              <div
                className="p-4 rounded-xl"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💬</span>
                  <p className="font-bold">ChatGPT</p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  "Next.js에서 Supabase로 실시간 채팅 구현하는 방법"
                </p>
              </div>

              <div
                className="p-4 rounded-xl"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔍</span>
                  <p className="font-bold">Google</p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  "Next.js tailwind css 반응형 레이아웃 예제"
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/dashboard/notes"
              className="px-6 py-3 rounded-lg font-medium"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              노트 시작하기
            </Link>
            <Link
              href="/dashboard/settings"
              className="px-6 py-3 rounded-lg"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              설정 가기
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
