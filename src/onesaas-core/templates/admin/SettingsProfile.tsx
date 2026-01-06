'use client'

/**
 * SettingsProfile 템플릿
 * 프로필 설정
 */

import { useState } from 'react'
import { Camera, Mail, Phone, MapPin, Building, Globe, Save, Trash2 } from 'lucide-react'

interface ProfileData {
  name: string
  email: string
  phone: string
  company?: string
  location?: string
  website?: string
  bio?: string
  avatar?: string
}

interface SettingsProfileProps {
  profile?: ProfileData
  onSave?: (data: ProfileData) => void
  onAvatarChange?: (file: File) => void
  className?: string
}

export function SettingsProfile({
  profile,
  onSave,
  onAvatarChange,
  className = '',
}: SettingsProfileProps) {
  const [data, setData] = useState<ProfileData>(profile || {
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    company: '(주)테크스타트업',
    location: '서울시 강남구',
    website: 'https://example.com',
    bio: '안녕하세요. 소프트웨어 개발자입니다.',
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    onSave?.(data)
    setIsEditing(false)
  }

  const handleAvatarClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        onAvatarChange?.(file)
      }
    }
    input.click()
  }

  return (
    <div className={`p-6 max-w-4xl mx-auto ${className}`} style={{ background: 'var(--color-bg)' }}>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          프로필 설정
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          개인 정보를 관리하세요
        </p>
      </div>

      {/* 프로필 카드 */}
      <div
        className="p-6 rounded-xl mb-6"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* 아바타 */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                {data.avatar ? (
                  <img src={data.avatar} alt={data.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  data.name.charAt(0)
                )}
              </div>
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <Camera className="w-4 h-4" style={{ color: 'var(--color-text)' }} />
              </button>
            </div>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              클릭하여 변경
            </p>
          </div>

          {/* 기본 정보 */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                기본 정보
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm px-3 py-1 rounded"
                  style={{ color: 'var(--color-accent)' }}
                >
                  수정
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-sm px-3 py-1 rounded"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    className="text-sm px-3 py-1 rounded flex items-center gap-1"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    <Save className="w-4 h-4" /> 저장
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>이름</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                ) : (
                  <p className="py-2 font-medium" style={{ color: 'var(--color-text)' }}>{data.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <Mail className="w-4 h-4 inline mr-1" />이메일
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                ) : (
                  <p className="py-2" style={{ color: 'var(--color-text)' }}>{data.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <Phone className="w-4 h-4 inline mr-1" />전화번호
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                ) : (
                  <p className="py-2" style={{ color: 'var(--color-text)' }}>{data.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <Building className="w-4 h-4 inline mr-1" />회사
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={data.company || ''}
                    onChange={(e) => setData({ ...data, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                ) : (
                  <p className="py-2" style={{ color: 'var(--color-text)' }}>{data.company || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <MapPin className="w-4 h-4 inline mr-1" />위치
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={data.location || ''}
                    onChange={(e) => setData({ ...data, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                ) : (
                  <p className="py-2" style={{ color: 'var(--color-text)' }}>{data.location || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <Globe className="w-4 h-4 inline mr-1" />웹사이트
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={data.website || ''}
                    onChange={(e) => setData({ ...data, website: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                ) : (
                  <p className="py-2" style={{ color: 'var(--color-text)' }}>{data.website || '-'}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>소개</label>
              {isEditing ? (
                <textarea
                  value={data.bio || ''}
                  onChange={(e) => setData({ ...data, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border outline-none resize-none"
                  style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                />
              ) : (
                <p className="py-2" style={{ color: 'var(--color-text)' }}>{data.bio || '-'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 위험 구역 */}
      <div
        className="p-6 rounded-xl border-2 border-red-200"
        style={{ background: 'var(--color-bg-secondary)' }}
      >
        <h2 className="text-lg font-semibold text-red-600 mb-2">위험 구역</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 취소할 수 없습니다.
        </p>
        <button className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> 계정 삭제
        </button>
      </div>
    </div>
  )
}
