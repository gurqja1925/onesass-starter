'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout, useAppMode } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'
import { Input } from '@/onesaas-core/ui/Input'
import { Button } from '@/onesaas-core/ui/Button'
import { ThemeSelector } from '@/onesaas-core/design/ThemeSelector'

export default function SettingsPage() {
  const { mode, isDemoMode, changeMode, mounted } = useAppMode()
  const [siteName, setSiteName] = useState('')
  const [siteDescription, setSiteDescription] = useState('')
  const [supportEmail, setSupportEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const fetchSettings = useCallback(async () => {
    if (isDemoMode) {
      setSiteName('My SaaS (데모)')
      setSiteDescription('AI 기반 생산성 도구 - 데모 모드로 실행 중')
      setSupportEmail('demo@example.com')
      setLoading(false)
      return
    }
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      const settings = data.settings || {}
      setSiteName(settings.site_name || '')
      setSiteDescription(settings.site_description || '')
      setSupportEmail(settings.support_email || '')
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }, [isDemoMode])

  useEffect(() => {
    if (mounted) {
      fetchSettings()
    }
  }, [fetchSettings, mounted])

  const handleSave = async () => {
    if (isDemoMode) {
      alert('데모 모드에서는 설정을 저장할 수 없습니다')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            site_name: siteName,
            site_description: siteDescription,
            support_email: supportEmail,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '저장에 실패했습니다')
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert(error instanceof Error ? error.message : '설정 저장에 실패했습니다')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
          로딩 중...
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--color-text)' }}
          >
            설정
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            서비스 기본 설정을 관리하세요
          </p>
        </div>

        {/* 운영 모드 전환 카드 */}
        <Card
          style={{
            background: isDemoMode
              ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
              : 'linear-gradient(135deg, #dcfce7 0%, #86efac 100%)',
            border: 'none',
          }}
        >
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: 'rgba(255,255,255,0.5)' }}
                >
                  {isDemoMode ? '🎮' : '🚀'}
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: '#1f2937' }}>
                    {isDemoMode ? '데모 모드' : '운영 모드'}
                  </h2>
                  <p className="text-sm" style={{ color: '#4b5563' }}>
                    {isDemoMode
                      ? '샘플 데이터로 체험 중입니다. 로그인 없이 모든 기능을 둘러볼 수 있습니다.'
                      : '실제 데이터로 운영 중입니다. 로그인이 필요하며 모든 변경사항이 저장됩니다.'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => changeMode(isDemoMode ? 'production' : 'demo')}
                  className="px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-105"
                  style={{
                    background: isDemoMode ? '#10b981' : '#f59e0b',
                  }}
                >
                  {isDemoMode ? '🚀 운영 모드로 전환' : '🎮 데모 모드로 전환'}
                </button>
                <span className="text-xs" style={{ color: '#6b7280' }}>
                  {isDemoMode
                    ? '운영 모드에서는 실제 Supabase 로그인이 필요합니다'
                    : '데모 모드에서는 로그인 없이 체험할 수 있습니다'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 기본 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="서비스 이름"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="My SaaS"
              />
              <Input
                label="서비스 설명"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                placeholder="AI 기반 생산성 도구"
              />
              <Input
                label="고객지원 이메일"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@example.com"
              />
              <Button onClick={handleSave} className="w-full" disabled={saving}>
                {saving ? '저장 중...' : saved ? '저장됨!' : '저장하기'}
              </Button>
            </CardContent>
          </Card>

          {/* 결제 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>결제 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="p-4 rounded-lg"
                style={{ background: 'var(--color-bg)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: 'var(--color-text)' }}>PortOne 연동</span>
                  <span
                    className="px-2 py-1 rounded text-xs"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    연결됨
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  카드, 계좌이체, 간편결제 사용 가능
                </p>
              </div>

              <div
                className="p-4 rounded-lg"
                style={{ background: 'var(--color-bg)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: 'var(--color-text)' }}>구독 플랜</span>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--color-text-secondary)' }}>무료</span>
                    <span style={{ color: 'var(--color-text)' }}>₩0/월</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--color-text-secondary)' }}>프로</span>
                    <span style={{ color: 'var(--color-text)' }}>₩9,900/월</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--color-text-secondary)' }}>엔터프라이즈</span>
                    <span style={{ color: 'var(--color-text)' }}>₩99,000/월</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 알림 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: '신규 가입 알림', key: 'notify_signup' },
                { label: '결제 완료 알림', key: 'notify_payment' },
                { label: '문의 접수 알림', key: 'notify_inquiry' },
                { label: '주간 리포트', key: 'notify_weekly' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: 'var(--color-bg)' }}
                >
                  <span style={{ color: 'var(--color-text)' }}>{item.label}</span>
                  <button
                    className="w-12 h-6 rounded-full relative transition-colors"
                    style={{
                      background: 'var(--color-border)',
                    }}
                  >
                    <span
                      className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                      style={{
                        left: '4px',
                      }}
                    />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 테마 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>테마 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                10가지 프리셋 테마 중 선택하거나 커스텀 테마를 적용하세요
              </p>
              <ThemeSelector
                onThemeChange={(themeId) => {
                  console.log('Theme changed:', themeId)
                }}
              />
            </CardContent>
          </Card>

          {/* 위험 영역 */}
          <Card>
            <CardHeader>
              <CardTitle>위험 영역</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="p-4 rounded-lg border"
                style={{ borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}
              >
                <h3 className="font-bold mb-2" style={{ color: '#ef4444' }}>
                  서비스 일시 중지
                </h3>
                <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                  모든 사용자의 접근이 차단됩니다
                </p>
                <Button variant="danger" size="sm">
                  서비스 중지
                </Button>
              </div>

              <div
                className="p-4 rounded-lg border"
                style={{ borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}
              >
                <h3 className="font-bold mb-2" style={{ color: '#ef4444' }}>
                  모든 데이터 삭제
                </h3>
                <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                  이 작업은 되돌릴 수 없습니다
                </p>
                <Button variant="danger" size="sm">
                  데이터 삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
