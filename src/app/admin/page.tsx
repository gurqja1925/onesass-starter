import { AdminLayout, DashboardStats, RecentActivity } from '@/onesaas-core/admin'

// 샘플 활동 데이터
const sampleActivities = [
  { id: '1', type: 'signup' as const, user: 'user@example.com', timestamp: new Date().toISOString() },
  { id: '2', type: 'payment' as const, user: 'pro@example.com', timestamp: new Date(Date.now() - 3600000).toISOString(), detail: '프로 플랜' },
  { id: '3', type: 'login' as const, user: 'test@example.com', timestamp: new Date(Date.now() - 7200000).toISOString() },
]

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--color-text)' }}
          >
            대시보드
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            서비스 현황을 한눈에 확인하세요
          </p>
        </div>

        <DashboardStats />

        <div className="grid lg:grid-cols-2 gap-8">
          <RecentActivity activities={sampleActivities} />

          <div
            className="rounded-xl p-6"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              빠른 작업
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/admin/users"
                className="p-4 rounded-lg text-center transition-colors hover:opacity-80"
                style={{ background: 'var(--color-bg)' }}
              >
                <span className="text-2xl block mb-2">👥</span>
                <span style={{ color: 'var(--color-text)' }}>사용자 관리</span>
              </a>
              <a
                href="/admin/analytics"
                className="p-4 rounded-lg text-center transition-colors hover:opacity-80"
                style={{ background: 'var(--color-bg)' }}
              >
                <span className="text-2xl block mb-2">📈</span>
                <span style={{ color: 'var(--color-text)' }}>통계 보기</span>
              </a>
              <a
                href="/admin/settings"
                className="p-4 rounded-lg text-center transition-colors hover:opacity-80"
                style={{ background: 'var(--color-bg)' }}
              >
                <span className="text-2xl block mb-2">⚙️</span>
                <span style={{ color: 'var(--color-text)' }}>설정</span>
              </a>
              <a
                href="/"
                className="p-4 rounded-lg text-center transition-colors hover:opacity-80"
                style={{ background: 'var(--color-bg)' }}
              >
                <span className="text-2xl block mb-2">🏠</span>
                <span style={{ color: 'var(--color-text)' }}>사이트 보기</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
