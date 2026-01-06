'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { User, Bell, Shield, CreditCard, Palette, Globe } from 'lucide-react'

type SettingsTab = 'profile' | 'notifications' | 'security' | 'billing' | 'appearance' | 'language'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  const tabs = [
    { id: 'profile' as const, label: '프로필', icon: User },
    { id: 'notifications' as const, label: '알림', icon: Bell },
    { id: 'security' as const, label: '보안', icon: Shield },
    { id: 'billing' as const, label: '결제', icon: CreditCard },
    { id: 'appearance' as const, label: '테마', icon: Palette },
    { id: 'language' as const, label: '언어', icon: Globe },
  ]

  return (
    <DashboardLayout title="설정">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">설정</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>계정 및 서비스 설정을 관리하세요</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div
            className="w-48 shrink-0 rounded-xl p-2"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all"
                  style={{
                    background: activeTab === tab.id ? 'var(--color-accent)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--color-bg)' : 'var(--color-text)',
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Content */}
          <div
            className="flex-1 rounded-xl p-6"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold mb-6">프로필 설정</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      U
                    </div>
                    <button
                      className="px-4 py-2 rounded-lg text-sm"
                      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                    >
                      사진 변경
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>이름</label>
                    <input
                      type="text"
                      defaultValue="사용자"
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>이메일</label>
                    <input
                      type="email"
                      defaultValue="user@example.com"
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                    />
                  </div>
                  <button
                    className="px-6 py-2 rounded-lg font-medium"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    저장
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold mb-6">알림 설정</h2>
                <div className="space-y-4">
                  {[
                    { label: '이메일 알림', desc: '중요한 업데이트를 이메일로 받기', enabled: true },
                    { label: '마케팅 이메일', desc: '프로모션 및 이벤트 정보 받기', enabled: false },
                    { label: '푸시 알림', desc: '브라우저 푸시 알림 받기', enabled: true },
                    { label: '주간 리포트', desc: '매주 사용 통계 이메일 받기', enabled: true },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-lg"
                      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                    >
                      <div>
                        <p className="font-medium" style={{ color: 'var(--color-text)' }}>{item.label}</p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                      </div>
                      <button
                        className={`w-12 h-6 rounded-full relative transition-all ${item.enabled ? 'bg-green-500' : 'bg-gray-600'}`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${item.enabled ? 'left-7' : 'left-1'}`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-bold mb-6">보안 설정</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">비밀번호 변경</h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>정기적으로 비밀번호를 변경하세요</p>
                    <button
                      className="px-4 py-2 rounded-lg text-sm"
                      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                    >
                      비밀번호 변경
                    </button>
                  </div>
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                    <h3 className="font-medium mb-2">2단계 인증</h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>계정 보안을 강화하세요</p>
                    <button
                      className="px-4 py-2 rounded-lg text-sm"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      2단계 인증 활성화
                    </button>
                  </div>
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                    <h3 className="font-medium mb-2 text-red-400">계정 삭제</h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>계정을 삭제하면 모든 데이터가 영구 삭제됩니다</p>
                    <button className="px-4 py-2 rounded-lg text-sm bg-red-500/20 text-red-400">
                      계정 삭제
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div>
                <h2 className="text-xl font-bold mb-6">결제 설정</h2>
                <div className="space-y-6">
                  <div
                    className="p-4 rounded-lg"
                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">현재 요금제</span>
                      <span
                        className="px-2 py-1 rounded text-sm font-medium"
                        style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                      >
                        프로
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>월 ₩29,000 • 다음 결제일: 2024-02-15</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-4">결제 수단</h3>
                    <div
                      className="p-4 rounded-lg flex items-center justify-between"
                      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <span>•••• •••• •••• 4242</span>
                      </div>
                      <button className="text-sm" style={{ color: 'var(--color-accent)' }}>변경</button>
                    </div>
                  </div>
                  <button
                    className="px-6 py-2 rounded-lg font-medium"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    요금제 업그레이드
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-bold mb-6">테마 설정</h2>
                <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                  원하는 테마를 선택하세요. 쇼케이스에서 더 많은 테마를 확인할 수 있습니다.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { id: 'neon', name: '네온', colors: ['#0a0a0a', '#00ff88'] },
                    { id: 'minimal', name: '미니멀', colors: ['#ffffff', '#000000'] },
                    { id: 'luxury', name: '럭셔리', colors: ['#1a1a2e', '#d4af37'] },
                    { id: 'playful', name: '플레이풀', colors: ['#fef3c7', '#f472b6'] },
                    { id: 'brutalist', name: '브루탈리스트', colors: ['#f5f5f5', '#000000'] },
                    { id: 'corporate', name: '코퍼레이트', colors: ['#1e293b', '#3b82f6'] },
                  ].map(theme => (
                    <button
                      key={theme.id}
                      className="p-4 rounded-lg text-left transition-all hover:scale-[1.02]"
                      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                    >
                      <div className="flex gap-2 mb-3">
                        {theme.colors.map((color, i) => (
                          <div key={i} className="w-6 h-6 rounded-full" style={{ background: color }} />
                        ))}
                      </div>
                      <p className="font-medium">{theme.name}</p>
                    </button>
                  ))}
                </div>
                <a
                  href="/showcase"
                  className="inline-block px-6 py-2 rounded-lg font-medium"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  쇼케이스에서 더 보기
                </a>
              </div>
            )}

            {activeTab === 'language' && (
              <div>
                <h2 className="text-xl font-bold mb-6">언어 설정</h2>
                <div className="space-y-4">
                  {[
                    { code: 'ko', name: '한국어', flag: '🇰🇷', selected: true },
                    { code: 'en', name: 'English', flag: '🇺🇸', selected: false },
                    { code: 'ja', name: '日本語', flag: '🇯🇵', selected: false },
                    { code: 'zh', name: '中文', flag: '🇨🇳', selected: false },
                  ].map(lang => (
                    <button
                      key={lang.code}
                      className="w-full flex items-center justify-between p-4 rounded-lg text-left transition-all"
                      style={{
                        background: lang.selected ? 'var(--color-accent)' : 'var(--color-bg)',
                        color: lang.selected ? 'var(--color-bg)' : 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </div>
                      {lang.selected && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
