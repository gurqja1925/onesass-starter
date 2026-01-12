'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { useAuth } from '@/onesaas-core/auth/provider'

export default function SettingsPage() {
  const { user } = useAuth()

  // Profile state
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || user?.email?.split('@')[0] || '',
    email: user?.email || ''
  })
  const [isEditing, setIsEditing] = useState(false)

  const handleProfileSave = () => {
    // TODO: API call to save profile
    setIsEditing(false)
    alert('프로필이 저장되었습니다!')
  }

  return (
    <DashboardLayout title="설정">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">⚙️ 설정</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            프로필 정보를 관리하세요
          </p>
        </div>

        {/* Profile Section */}
        <div
          className="p-8 rounded-2xl"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">프로필 정보</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                수정하기
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                >
                  취소
                </button>
                <button
                  onClick={handleProfileSave}
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  저장
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">이름</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-lg transition-all"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">이메일</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-3 rounded-lg"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  cursor: 'not-allowed'
                }}
              />
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                이메일은 변경할 수 없습니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
