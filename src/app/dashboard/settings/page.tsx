'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { User, Shield, CreditCard, Globe, Receipt } from 'lucide-react'
import { useAuth } from '@/onesaas-core/auth/provider'
import { createClient } from '@/lib/supabase/client'

type SettingsTab = 'billing' | 'payment-history' | 'profile' | 'security' | 'language'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('billing')
  const { user } = useAuth()
  const [name, setName] = useState(user?.user_metadata?.name || user?.email?.split('@')[0] || '사용자')
  const [email, setEmail] = useState(user?.email || '')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [passwordChanging, setPasswordChanging] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')

  const tabs = [
    { id: 'billing' as const, label: '결제', icon: CreditCard },
    { id: 'payment-history' as const, label: '결제 이력', icon: Receipt },
    { id: 'profile' as const, label: '프로필', icon: User },
    { id: 'security' as const, label: '보안', icon: Shield },
    { id: 'language' as const, label: '언어', icon: Globe },
  ]

  // user 정보가 로드되면 name, email 업데이트
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || user.email?.split('@')[0] || '사용자')
      setEmail(user.email || '')
    }
  }, [user])

  const handleSaveProfile = async () => {
    setSaving(true)
    setSaveMessage('')

    try {
      const supabase = createClient()
      if (!supabase) {
        throw new Error('Supabase client not available')
      }

      // Supabase user_metadata 업데이트
      const { error } = await supabase.auth.updateUser({
        data: {
          name: name
        }
      })

      if (error) throw error

      setSaveMessage('✓ 저장되었습니다')
      setTimeout(() => setSaveMessage(''), 2000)

      // 페이지 새로고침하여 업데이트된 정보 반영
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      setSaveMessage('✗ 저장 실패: ' + (error.message || '알 수 없는 오류'))
      setTimeout(() => setSaveMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!user?.email) {
      setPasswordMessage('✗ 이메일 정보가 없습니다')
      return
    }

    setPasswordChanging(true)
    setPasswordMessage('')

    try {
      const supabase = createClient()
      if (!supabase) {
        throw new Error('Supabase client not available')
      }

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setPasswordMessage('✓ 비밀번호 재설정 이메일이 발송되었습니다')
      setTimeout(() => setPasswordMessage(''), 3000)
    } catch (error: any) {
      setPasswordMessage('✗ 이메일 발송 실패: ' + (error.message || '알 수 없는 오류'))
      setTimeout(() => setPasswordMessage(''), 3000)
    } finally {
      setPasswordChanging(false)
    }
  }

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
                      {name?.[0]?.toUpperCase() || 'U'}
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>이메일</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                      disabled
                    />
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                      이메일은 변경할 수 없습니다
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-2 rounded-lg font-medium"
                      style={{
                        background: saving ? 'var(--color-bg-secondary)' : 'var(--color-accent)',
                        color: 'var(--color-bg)',
                        opacity: saving ? 0.6 : 1,
                      }}
                    >
                      {saving ? '저장 중...' : '저장'}
                    </button>
                    {saveMessage && (
                      <span className="text-sm" style={{ color: saveMessage.includes('✓') ? '#10b981' : '#ef4444' }}>
                        {saveMessage}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

{activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-bold mb-6">보안 설정</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">비밀번호 변경</h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                      이메일로 비밀번호 재설정 링크가 발송됩니다
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePasswordChange}
                        disabled={passwordChanging}
                        className="px-4 py-2 rounded-lg text-sm"
                        style={{
                          background: passwordChanging ? 'var(--color-bg-secondary)' : 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text)',
                          opacity: passwordChanging ? 0.6 : 1,
                        }}
                      >
                        {passwordChanging ? '발송 중...' : '비밀번호 재설정 이메일 발송'}
                      </button>
                      {passwordMessage && (
                        <span className="text-sm" style={{ color: passwordMessage.includes('✓') ? '#10b981' : '#ef4444' }}>
                          {passwordMessage}
                        </span>
                      )}
                    </div>
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
                        무료
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>기본 기능을 사용할 수 있습니다</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-4">일회용 결제</h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                      필요할 때마다 일회성으로 결제할 수 있습니다. 카드 정보는 저장되지 않습니다.
                    </p>
                    <button
                      className="px-6 py-2 rounded-lg font-medium"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      일회용 결제하기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment-history' && (
              <div>
                <h2 className="text-xl font-bold mb-6">결제 이력</h2>
                <div
                  className="p-12 rounded-lg text-center"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                >
                  <span className="text-4xl block mb-4">💳</span>
                  <p className="text-lg font-medium mb-2">결제 이력이 없습니다</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    일회용 결제를 하시면 이곳에 기록이 표시됩니다
                  </p>
                </div>
              </div>
            )}

{activeTab === 'language' && (
              <div>
                <h2 className="text-xl font-bold mb-6">언어 설정</h2>
                <div className="space-y-4">
                  <button
                    className="w-full flex items-center justify-between p-4 rounded-lg text-left"
                    style={{
                      background: 'var(--color-accent)',
                      color: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇰🇷</span>
                      <span className="font-medium">한국어</span>
                    </div>
                    <span>✓</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
