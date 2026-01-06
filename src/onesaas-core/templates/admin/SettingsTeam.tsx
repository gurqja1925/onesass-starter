'use client'

/**
 * SettingsTeam 템플릿
 * 팀 설정
 */

import { useState } from 'react'
import {
  Users, UserPlus, MoreVertical, Mail, Shield, Trash2,
  Check, X, ChevronDown
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  status: 'active' | 'pending'
  avatar?: string
  joinedAt?: string
}

interface SettingsTeamProps {
  members?: TeamMember[]
  pendingInvites?: TeamMember[]
  onInvite?: (email: string, role: string) => void
  onRemove?: (memberId: string) => void
  onRoleChange?: (memberId: string, role: string) => void
  className?: string
}

export function SettingsTeam({
  members,
  pendingInvites,
  onInvite,
  onRemove,
  onRoleChange,
  className = '',
}: SettingsTeamProps) {
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [showInviteForm, setShowInviteForm] = useState(false)

  const defaultMembers: TeamMember[] = members || [
    { id: '1', name: '김소유자', email: 'owner@example.com', role: 'owner', status: 'active', joinedAt: '2024-01-01' },
    { id: '2', name: '이관리자', email: 'admin@example.com', role: 'admin', status: 'active', joinedAt: '2024-01-05' },
    { id: '3', name: '박팀원', email: 'member@example.com', role: 'member', status: 'active', joinedAt: '2024-01-10' },
    { id: '4', name: '정뷰어', email: 'viewer@example.com', role: 'viewer', status: 'active', joinedAt: '2024-01-15' },
  ]

  const defaultPending: TeamMember[] = pendingInvites || [
    { id: '5', name: '', email: 'pending@example.com', role: 'member', status: 'pending' },
  ]

  const roleLabels = {
    owner: { label: '소유자', color: 'bg-purple-100 text-purple-700', description: '모든 권한' },
    admin: { label: '관리자', color: 'bg-blue-100 text-blue-700', description: '팀원 관리 가능' },
    member: { label: '팀원', color: 'bg-green-100 text-green-700', description: '편집 가능' },
    viewer: { label: '뷰어', color: 'bg-gray-100 text-gray-700', description: '읽기 전용' },
  }

  const handleInvite = () => {
    if (inviteEmail) {
      onInvite?.(inviteEmail, inviteRole)
      setInviteEmail('')
      setShowInviteForm(false)
    }
  }

  return (
    <div className={`p-6 max-w-4xl mx-auto ${className}`} style={{ background: 'var(--color-bg)' }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            팀 관리
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            팀원을 초대하고 권한을 관리하세요
          </p>
        </div>
        <button
          onClick={() => setShowInviteForm(true)}
          className="px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
        >
          <UserPlus className="w-4 h-4" /> 팀원 초대
        </button>
      </div>

      {/* 초대 폼 */}
      {showInviteForm && (
        <div
          className="p-6 rounded-xl mb-6"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            새 팀원 초대
          </h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="이메일 주소"
                className="w-full px-4 py-2 rounded-lg border outline-none"
                style={{
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                }}
              />
            </div>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="px-4 py-2 rounded-lg border outline-none"
              style={{
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
            >
              <option value="admin">관리자</option>
              <option value="member">팀원</option>
              <option value="viewer">뷰어</option>
            </select>
            <button
              onClick={handleInvite}
              className="px-4 py-2 rounded-lg font-medium"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              초대
            </button>
            <button
              onClick={() => setShowInviteForm(false)}
              className="p-2 rounded-lg"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 대기 중인 초대 */}
      {defaultPending.length > 0 && (
        <div
          className="p-6 rounded-xl mb-6"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <Mail className="w-5 h-5" /> 대기 중인 초대
          </h3>
          <div className="space-y-3">
            {defaultPending.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'var(--color-bg)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-border)' }}
                  >
                    <Mail className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>{member.email}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      초대 대기 중 • {roleLabels[member.role].label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemove?.(member.id)}
                  className="text-sm px-3 py-1 rounded text-red-500"
                >
                  취소
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 팀원 목록 */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
      >
        <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <Users className="w-5 h-5" /> 팀원 ({defaultMembers.length}명)
          </h3>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {defaultMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ background: 'var(--color-accent)' }}
                >
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>{member.name}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 text-xs rounded-full ${roleLabels[member.role].color}`}>
                  {roleLabels[member.role].label}
                </span>

                {member.role !== 'owner' && (
                  <div className="flex items-center gap-2">
                    <select
                      value={member.role}
                      onChange={(e) => onRoleChange?.(member.id, e.target.value)}
                      className="text-sm px-2 py-1 rounded border outline-none"
                      style={{
                        background: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        borderColor: 'var(--color-border)',
                      }}
                    >
                      <option value="admin">관리자</option>
                      <option value="member">팀원</option>
                      <option value="viewer">뷰어</option>
                    </select>
                    <button
                      onClick={() => onRemove?.(member.id)}
                      className="p-2 rounded hover:bg-red-100 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 권한 설명 */}
      <div
        className="p-6 rounded-xl mt-6"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Shield className="w-5 h-5" /> 권한 설명
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(roleLabels).map(([role, info]) => (
            <div key={role} className="flex items-center gap-3">
              <span className={`px-2 py-1 text-xs rounded-full ${info.color}`}>
                {info.label}
              </span>
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {info.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
