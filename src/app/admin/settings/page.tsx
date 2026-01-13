'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'
import { Button } from '@/onesaas-core/ui/Button'
import { Input } from '@/onesaas-core/ui/Input'
import { SUPPORTED_PROVIDERS, PROVIDER_META, type AuthProviderType } from '@/onesaas-core/auth/config'

interface Settings {
  site: {
    name: string
    description: string
    supportEmail: string
  }
  auth: {
    providers: Record<AuthProviderType, boolean>
  }
}

const DEFAULT_AUTH_PROVIDERS: Record<AuthProviderType, boolean> = {
  email: true,
  google: false,
  kakao: false,
  github: false,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    site: {
      name: '',
      description: '',
      supportEmail: ''
    },
    auth: {
      providers: { ...DEFAULT_AUTH_PROVIDERS }
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingAuth, setSavingAuth] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (data.settings) {
        // auth_providers를 파싱
        let authProviders = { ...DEFAULT_AUTH_PROVIDERS }
        if (data.settings.auth_providers) {
          try {
            authProviders = JSON.parse(data.settings.auth_providers)
          } catch {
            // 파싱 실패 시 기본값 유지
          }
        }

        setSettings({
          site: {
            name: data.settings.site_name || '',
            description: data.settings.site_description || '',
            supportEmail: data.settings.support_email || ''
          },
          auth: {
            providers: authProviders
          }
        })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            site_name: settings.site.name,
            site_description: settings.site.description,
            support_email: settings.site.supportEmail
          }
        })
      })
      alert('설정이 저장되었습니다')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('저장 실패')
    } finally {
      setSaving(false)
    }
  }

  const toggleProvider = (provider: AuthProviderType) => {
    setSettings(prev => ({
      ...prev,
      auth: {
        ...prev.auth,
        providers: {
          ...prev.auth.providers,
          [provider]: !prev.auth.providers[provider]
        }
      }
    }))
  }

  const handleSaveAuth = async () => {
    setSavingAuth(true)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            auth_providers: JSON.stringify(settings.auth.providers)
          }
        })
      })
      alert('로그인 설정이 저장되었습니다')
    } catch (error) {
      console.error('Failed to save auth settings:', error)
      alert('저장 실패')
    } finally {
      setSavingAuth(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          로딩 중...
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            설정
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            서비스 설정을 관리하세요
          </p>
        </div>

        {/* 사이트 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>사이트 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              label="서비스 이름"
              value={settings.site.name}
              onChange={(e) => setSettings({
                ...settings,
                site: { ...settings.site, name: e.target.value }
              })}
              placeholder="OneSaaS"
            />
            <Input
              label="서비스 설명"
              value={settings.site.description}
              onChange={(e) => setSettings({
                ...settings,
                site: { ...settings.site, description: e.target.value }
              })}
              placeholder="SaaS 템플릿"
            />
            <Input
              label="고객지원 이메일"
              type="email"
              value={settings.site.supportEmail}
              onChange={(e) => setSettings({
                ...settings,
                site: { ...settings.site, supportEmail: e.target.value }
              })}
              placeholder="support@example.com"
            />
            <div className="flex justify-end pt-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? '저장 중...' : '사이트 정보 저장'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 로그인 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>로그인 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              활성화할 로그인 방법을 선택하세요. 소셜 로그인을 사용하려면 Supabase에서 해당 프로바이더를 먼저 설정해야 합니다.
            </p>

            <div className="space-y-3">
              {SUPPORTED_PROVIDERS.map((provider) => {
                const meta = PROVIDER_META[provider]
                const isEnabled = settings.auth.providers[provider]

                return (
                  <div
                    key={provider}
                    className="flex items-center justify-between p-4 rounded-lg border"
                    style={{
                      borderColor: isEnabled ? 'var(--color-primary)' : 'var(--color-border)',
                      backgroundColor: isEnabled ? 'var(--color-primary-light, rgba(99, 102, 241, 0.1))' : 'var(--color-bg-secondary)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: meta.bgColor, color: meta.color }}
                      >
                        {meta.icon}
                      </div>
                      <div>
                        <h4 className="font-medium" style={{ color: 'var(--color-text)' }}>
                          {meta.name}
                        </h4>
                        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          {provider === 'email' && '이메일/비밀번호 로그인'}
                          {provider === 'google' && 'Google 계정으로 로그인'}
                          {provider === 'kakao' && '카카오 계정으로 로그인'}
                          {provider === 'github' && 'GitHub 계정으로 로그인'}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => toggleProvider(provider)}
                      variant={isEnabled ? 'primary' : 'outline'}
                      size="sm"
                    >
                      {isEnabled ? '사용 중' : '사용 안함'}
                    </Button>
                  </div>
                )
              })}
            </div>

            {/* 소셜 로그인 가이드 */}
            <div 
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)'
              }}
            >
              <h4 className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                소셜 로그인 설정 가이드
              </h4>
              <ul className="space-y-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                <li>
                  <strong>Google:</strong> Google Cloud Console에서 OAuth 클라이언트 생성 후, Supabase Authentication {'>'} Providers {'>'} Google에서 설정
                </li>
                <li>
                  <strong>카카오:</strong> 카카오 개발자 센터에서 앱 생성 후, Supabase Authentication {'>'} Providers {'>'} Kakao에서 설정
                </li>
                <li>
                  <strong>GitHub:</strong> GitHub Settings {'>'} Developer settings {'>'} OAuth Apps에서 앱 생성 후 Supabase에 등록
                </li>
              </ul>
              <p className="mt-3 text-xs" style={{ color: 'var(--color-warning, #f59e0b)' }}>
                Supabase에서 프로바이더 설정을 완료해야 해당 로그인 방법이 작동합니다.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleSaveAuth} disabled={savingAuth}>
                {savingAuth ? '저장 중...' : '로그인 설정 저장'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 환경 변수 안내 */}
        <Card>
          <CardHeader>
            <CardTitle>환경 변수</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              환경 변수는 <code style={{ background: 'var(--color-bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>.env</code> 파일에서 관리됩니다.
            </p>
            <ul className="space-y-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              <li>• <code>DATABASE_URL</code> - 데이터베이스 연결</li>
              <li>• <code>NEXT_PUBLIC_SUPABASE_URL</code> - Supabase URL</li>
              <li>• <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> - Supabase 키</li>
              <li>• <code>NEXT_PUBLIC_TOSS_CLIENT_KEY</code> - TossPayments 클라이언트 키</li>
              <li>• <code>TOSS_SECRET_KEY</code> - TossPayments 시크릿 키</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
