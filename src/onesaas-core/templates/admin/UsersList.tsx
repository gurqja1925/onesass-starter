'use client'

/**
 * UsersList 템플릿
 * 사용자 목록
 */

import { useState } from 'react'
import {
  Search, Filter, MoreVertical, ChevronLeft, ChevronRight,
  UserPlus, Download, Mail, Shield, Ban
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'moderator'
  status: 'active' | 'inactive' | 'suspended'
  joinedAt: string
  lastActive?: string
}

interface UsersListProps {
  users?: User[]
  onUserClick?: (user: User) => void
  onAddUser?: () => void
  className?: string
}

export function UsersList({
  users,
  onUserClick,
  onAddUser,
  className = '',
}: UsersListProps) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const defaultUsers: User[] = users || [
    { id: '1', name: '김관리자', email: 'admin@example.com', role: 'admin', status: 'active', joinedAt: '2024-01-01', lastActive: '방금 전' },
    { id: '2', name: '이운영자', email: 'mod@example.com', role: 'moderator', status: 'active', joinedAt: '2024-01-05', lastActive: '1시간 전' },
    { id: '3', name: '박사용자', email: 'user1@example.com', role: 'user', status: 'active', joinedAt: '2024-01-10', lastActive: '3일 전' },
    { id: '4', name: '정회원', email: 'user2@example.com', role: 'user', status: 'inactive', joinedAt: '2024-01-15', lastActive: '1주 전' },
    { id: '5', name: '최테스트', email: 'test@example.com', role: 'user', status: 'suspended', joinedAt: '2024-01-20' },
  ]

  const roleLabels = {
    admin: { label: '관리자', color: 'bg-purple-100 text-purple-700' },
    moderator: { label: '운영자', color: 'bg-blue-100 text-blue-700' },
    user: { label: '사용자', color: 'bg-gray-100 text-gray-700' },
  }

  const statusLabels = {
    active: { label: '활성', color: 'bg-green-100 text-green-700' },
    inactive: { label: '비활성', color: 'bg-yellow-100 text-yellow-700' },
    suspended: { label: '정지', color: 'bg-red-100 text-red-700' },
  }

  const filteredUsers = defaultUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className={`p-6 ${className}`} style={{ background: 'var(--color-bg)' }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            사용자 관리
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            총 {defaultUsers.length}명의 사용자
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg font-medium border flex items-center gap-2"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            <Download className="w-4 h-4" /> 내보내기
          </button>
          <button
            onClick={onAddUser}
            className="px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            <UserPlus className="w-4 h-4" /> 사용자 추가
          </button>
        </div>
      </div>

      {/* 필터 */}
      <div
        className="p-4 rounded-xl mb-4"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
      >
        <div className="flex flex-wrap gap-4">
          {/* 검색 */}
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름 또는 이메일 검색..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border outline-none"
              style={{
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
            />
          </div>

          {/* 역할 필터 */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border outline-none"
            style={{
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
          >
            <option value="all">모든 역할</option>
            <option value="admin">관리자</option>
            <option value="moderator">운영자</option>
            <option value="user">사용자</option>
          </select>

          {/* 상태 필터 */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border outline-none"
            style={{
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
          >
            <option value="all">모든 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
            <option value="suspended">정지</option>
          </select>
        </div>
      </div>

      {/* 테이블 */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--color-bg)' }}>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded"
                />
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                사용자
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                역할
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                상태
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                가입일
              </th>
              <th className="p-4 text-left text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                최근 접속
              </th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-t cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                style={{ borderColor: 'var(--color-border)' }}
                onClick={() => onUserClick?.(user)}
              >
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                    className="w-4 h-4 rounded"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ background: 'var(--color-accent)' }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--color-text)' }}>{user.name}</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${roleLabels[user.role].color}`}>
                    {roleLabels[user.role].label}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusLabels[user.status].color}`}>
                    {statusLabels[user.status].label}
                  </span>
                </td>
                <td className="p-4 text-sm" style={{ color: 'var(--color-text)' }}>
                  {user.joinedAt}
                </td>
                <td className="p-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {user.lastActive || '-'}
                </td>
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                    <MoreVertical className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {filteredUsers.length}개 중 1-{Math.min(10, filteredUsers.length)} 표시
          </p>
          <div className="flex gap-1">
            <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <ChevronLeft className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
            </button>
            <button className="px-3 py-1 rounded" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>1</button>
            <button className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" style={{ color: 'var(--color-text)' }}>2</button>
            <button className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" style={{ color: 'var(--color-text)' }}>3</button>
            <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
