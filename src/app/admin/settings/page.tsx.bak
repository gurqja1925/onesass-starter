'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'
import { Button } from '@/onesaas-core/ui/Button'
import { Input } from '@/onesaas-core/ui/Input'

interface Settings {
  site: {
    name: string
    description: string
    supportEmail: string
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    site: {
      name: '',
      description: '',
      supportEmail: ''
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (data.settings) {
        setSettings({
          site: {
            name: data.settings.site_name || '',
            description: data.settings.site_description || '',
            supportEmail: data.settings.support_email || ''
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

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '저장 중...' : '설정 저장'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
