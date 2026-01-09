'use client'

import Link from 'next/link'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

export default function DashboardPage() {
  const user = {
    name: '홍길동',
    plan: 'Pro',
    planExpiry: '2024년 3월 15일',
  }

  const usageStats = [
    { label: 'AI 채팅', used: 47, limit: 100, icon: '💬', color: '#3b82f6' },
    { label: '이미지 생성', used: 23, limit: 50, icon: '🎨', color: '#8b5cf6' },
    { label: '영상 생성', used: 8, limit: 20, icon: '🎬', color: '#ec4899' },
    { label: '노트', used: 12, limit: '무제한', icon: '📝', color: '#10b981' },
  ]

  const quickFeatures = [
    { href: '/dashboard/ai-chat', icon: '💬', title: 'AI 채팅', desc: '무엇이든 물어보세요', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    { href: '/dashboard/image-gen', icon: '🎨', title: '이미지 생성', desc: '상상을 현실로', gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
    { href: '/dashboard/video-gen', icon: '🎬', title: '영상 생성', desc: 'AI 영상 제작', gradient: 'linear-gradient(135deg, #ec4899, #be185d)' },
    { href: '/dashboard/notes', icon: '📝', title: '노트', desc: '아이디어 정리', gradient: 'linear-gradient(135deg, #10b981, #047857)' },
    { href: '/dashboard/templates', icon: '📋', title: '템플릿', desc: '빠른 시작', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { href: '/dashboard/analytics', icon: '📊', title: '분석', desc: '사용 현황', gradient: 'linear-gradient(135deg, #6366f1, #4338ca)' },
  ]

  const recentActivity = [
    { type: 'chat', title: 'AI 채팅', detail: '"마케팅 전략에 대해..."', time: '5분 전', icon: '💬' },
    { type: 'image', title: '이미지 생성', detail: '"미래 도시 야경"', time: '30분 전', icon: '🎨' },
    { type: 'note', title: '노트 저장', detail: '"회의 노트" 수정', time: '1시간 전', icon: '📝' },
    { type: 'video', title: '영상 생성', detail: '"제품 소개 영상"', time: '3시간 전', icon: '🎬' },
  ]

  return (
    <DashboardLayout title="대시보드">
      <div className="max-w-6xl mx-auto">
        {/* 환영 메시지 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">안녕하세요, {user.name}님! 👋</h1>
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
                {user.plan} 플랜
              </span>
            </div>
            <p className="text-white/90">
              다음 갱신일: {user.planExpiry}
            </p>
          </div>
          <Link
            href="/pricing"
            className="px-6 py-3 rounded-xl font-medium bg-white hover:bg-white/90 transition-all"
            style={{ color: 'var(--color-accent)' }}
          >
            플랜 업그레이드
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 최근 활동 */}
          <div
            className="rounded-2xl overflow-hidden"
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
              <Link
                href="/dashboard/analytics"
                className="block text-center mt-6 text-sm"
                style={{ color: 'var(--color-accent)' }}
              >
                전체 활동 보기 →
              </Link>
            </div>
          </div>

          {/* 추천 템플릿 */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div className="p-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <h2 className="text-lg font-bold">추천 템플릿</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {[
                  { icon: '📢', title: '광고 카피 생성', color: '#fef3c7' },
                  { icon: '✍️', title: '블로그 글 작성', color: '#dbeafe' },
                  { icon: '📱', title: '인스타그램 캡션', color: '#fce7f3' },
                  { icon: '💼', title: '사업 계획서', color: '#dcfce7' },
                ].map((template) => (
                  <Link
                    key={template.title}
                    href="/dashboard/templates"
                    className="flex items-center gap-4 p-3 rounded-xl transition-all hover:scale-[1.02]"
                    style={{ background: template.color }}
                  >
                    <span className="text-2xl">{template.icon}</span>
                    <span className="font-medium text-gray-800">{template.title}</span>
                  </Link>
                ))}
              </div>
              <Link
                href="/dashboard/templates"
                className="block text-center mt-6 text-sm"
                style={{ color: 'var(--color-accent)' }}
              >
                모든 템플릿 보기 →
              </Link>
            </div>
          </div>
        </div>

        {/* 도움말 배너 */}
        <div
          className="mt-8 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">💡</span>
            <div>
              <p className="font-bold mb-1">도움이 필요하신가요?</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                AI 채팅에서 사용 방법을 물어보거나 고객센터에 문의해주세요
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/ai-chat"
              className="px-4 py-2 rounded-lg font-medium"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              AI에게 물어보기
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-lg"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
            >
              고객센터
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
