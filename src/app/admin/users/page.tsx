'use client'

import { AdminLayout, UserTable } from '@/onesaas-core/admin'
import { useUserList } from '@/onesaas-core/admin/hooks'

export default function UsersPage() {
  const { users, total, loading } = useUserList()

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              사용자 관리
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              총 {total}명의 사용자
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-lg font-medium"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            사용자 추가
          </button>
        </div>

        <UserTable users={users} loading={loading} />
      </div>
    </AdminLayout>
  )
}
