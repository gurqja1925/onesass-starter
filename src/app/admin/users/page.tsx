'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card } from '@/onesaas-core/ui/Card'
import { Input } from '@/onesaas-core/ui/Input'
import { Button } from '@/onesaas-core/ui/Button'
import { Modal } from '@/onesaas-core/ui/Modal'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  plan: string
  status: string
  createdAt: string
  emailVerified: string | null
  paymentCount?: number
}

interface Subscription {
  id: string
  planName: string
  status: string
  currentPeriodEnd: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newUser, setNewUser] = useState({ email: '', name: '', plan: 'free', role: 'user' })
  const [processing, setProcessing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    plan: '',
    status: '',
    role: '',
  })
  const [userSubscription, setUserSubscription] = useState<Subscription | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)

    // API에서 실제 데이터
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=10`)
      const data = await res.json()
      setUsers(data.users || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const handleAddUser = async () => {
    if (!newUser.email) return
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })
      if (res.ok) {
        setNewUser({ email: '', name: '', plan: 'free', role: 'user' })
        setShowAddModal(false)
        fetchUsers()
      }
    } catch (error) {
      console.error('Failed to add user:', error)
    }
  }

  const handleOpenEditModal = async (user: User) => {
    setSelectedUser(user)
    setEditForm({
      name: user.name || '',
      plan: user.plan,
      status: user.status,
      role: user.role,
    })

    // 구독 정보 가져오기
    try {
      const res = await fetch(`/api/admin/users/${user.id}/subscription`)
      const data = await res.json()
      if (data.subscription) {
        setUserSubscription(data.subscription)
      } else {
        setUserSubscription(null)
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
      setUserSubscription(null)
    }

    setShowEditModal(true)
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return
    setProcessing(true)

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const data = await res.json()
      if (data.success) {
        setShowEditModal(false)
        setSelectedUser(null)
        fetchUsers()
        alert('사용자 정보가 업데이트되었습니다')
      } else {
        alert(data.error || '수정 실패')
      }
    } catch (error) {
      console.error('Failed to update user:', error)
      alert('사용자 정보 수정 중 오류가 발생했습니다')
    } finally {
      setProcessing(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return
    setProcessing(true)

    try {
      // API 호출
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permanent: false }), // 비활성화만
      })
      const data = await res.json()
      if (data.success) {
        setShowDeleteModal(false)
        setSelectedUser(null)
        fetchUsers()
        alert(data.message || '사용자가 비활성화되었습니다')
      } else {
        alert(data.error || '삭제 실패')
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('사용자 삭제 중 오류가 발생했습니다')
    } finally {
      setProcessing(false)
    }
  }

  const getPlanBadge = (plan: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      free: { bg: 'var(--color-bg)', color: 'var(--color-text)' },
      pro: { bg: 'var(--color-accent)', color: 'var(--color-bg)' },
      enterprise: { bg: '#8b5cf6', color: 'white' },
    }
    return styles[plan] || styles.free
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      active: { bg: '#10b981', color: 'white' },
      inactive: { bg: '#6b7280', color: 'white' },
      suspended: { bg: '#ef4444', color: 'white' },
    }
    return styles[status] || styles.inactive
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              사용자 관리
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              총 {total}명의 사용자
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            + 사용자 추가
          </Button>
        </div>

        {/* 검색 */}
        <Input
          placeholder="이메일 또는 이름으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* 사용자 테이블 */}
        <Card padding="none">
          {loading ? (
            <div className="p-8 text-center" style={{ color: 'var(--color-text-secondary)' }}>
              로딩 중...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>이름</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>이메일</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>플랜</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>상태</th>
                    <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>가입일</th>
                    <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td className="px-6 py-4 font-medium" style={{ color: 'var(--color-text)' }}>
                        {user.name || '-'}
                        {user.role === 'admin' && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs rounded" style={{ background: '#fbbf24', color: '#000' }}>관리자</span>
                        )}
                      </td>
                      <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded text-xs font-medium" style={getPlanBadge(user.plan)}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded text-xs font-medium" style={getStatusBadge(user.status)}>
                          {user.status === 'active' ? '활성' : user.status === 'suspended' ? '정지' : '비활성'}
                        </span>
                      </td>
                      <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="px-3 py-1 text-sm rounded mr-2"
                          style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => { setSelectedUser(user); setShowDeleteModal(true) }}
                          className="px-3 py-1 text-sm rounded"
                          style={{ background: '#ef4444', color: 'white' }}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* 페이지네이션 */}
        {total > 10 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              이전
            </Button>
            <span className="px-4 py-2" style={{ color: 'var(--color-text)' }}>
              {page} / {Math.ceil(total / 10)}
            </span>
            <Button
              variant="secondary"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / 10)}
            >
              다음
            </Button>
          </div>
        )}

        {/* 사용자 추가 모달 */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="새 사용자 추가">
          <div className="space-y-4">
            <Input
              label="이름"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="홍길동"
            />
            <Input
              label="이메일"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="user@example.com"
            />
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>플랜</label>
              <select
                value={newUser.plan}
                onChange={(e) => setNewUser({ ...newUser, plan: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border"
                style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
              >
                <option value="free">무료</option>
                <option value="pro">프로</option>
                <option value="enterprise">엔터프라이즈</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">취소</Button>
              <Button onClick={handleAddUser} className="flex-1">추가</Button>
            </div>
          </div>
        </Modal>

        {/* 사용자 수정 모달 */}
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="사용자 정보 수정">
          {selectedUser && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>이메일</p>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{selectedUser.email}</p>
              </div>

              <Input
                label="이름"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="이름 입력"
              />

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>역할</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border"
                  style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
                >
                  <option value="user">일반 사용자</option>
                  <option value="admin">관리자</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>플랜</label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border"
                  style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
                >
                  <option value="free">무료</option>
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>상태</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border"
                  style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
                >
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                  <option value="suspended">정지</option>
                </select>
              </div>

              {userSubscription && (
                <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                  <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>구독 정보</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-text-secondary)' }}>플랜:</span>
                      <span style={{ color: 'var(--color-text)' }}>{userSubscription.planName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-text-secondary)' }}>상태:</span>
                      <span style={{ color: 'var(--color-text)' }}>{userSubscription.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-text-secondary)' }}>만료일:</span>
                      <span style={{ color: 'var(--color-text)' }}>{formatDate(userSubscription.currentPeriodEnd)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="secondary" onClick={() => setShowEditModal(false)} className="flex-1" size="sm">취소</Button>
                <Button onClick={handleUpdateUser} className="flex-1" disabled={processing} size="sm">
                  {processing ? '저장 중...' : '저장'}
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* 삭제 확인 모달 */}
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="사용자 삭제">
          <div className="space-y-4">
            <p style={{ color: 'var(--color-text)' }}>
              <strong>{selectedUser?.name || selectedUser?.email}</strong> 사용자를 삭제하시겠습니까?
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              이 작업은 되돌릴 수 없습니다. 해당 사용자의 모든 데이터가 삭제됩니다.
            </p>
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="flex-1">취소</Button>
              <Button variant="danger" onClick={handleDeleteUser} className="flex-1">삭제</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  )
}
