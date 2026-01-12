/**
 * 앱 모드 설정
 *
 * - demo: 로그인 없이 샘플 데이터로 체험
 * - production: 실제 운영 모드 (인증 필요)
 *
 * 모드 결정 우선순위:
 * 1. 환경변수 NEXT_PUBLIC_DEMO_MODE (서버/클라이언트 공통)
 * 2. 로컬스토리지 (클라이언트 오버라이드, 개발용)
 */

export type AppMode = 'demo' | 'production'

// 환경변수에서 기본 모드 확인
function getEnvMode(): AppMode {
  // NEXT_PUBLIC_DEMO_MODE=true 이면 demo, 그 외에는 production
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? 'demo' : 'production'
}

// 클라이언트에서 모드 확인
export function getAppMode(): AppMode {
  // 환경변수 기본값
  const envMode = getEnvMode()

  // 환경변수가 production이면 무조건 production (보안)
  if (envMode === 'production') {
    return 'production'
  }

  // 환경변수가 demo인 경우에만 로컬스토리지 오버라이드 허용
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('app_mode')
    if (stored === 'production') return 'production'
  }

  return 'demo'
}

// 모드 변경 (데모 모드일 때만 가능)
export function setAppMode(mode: AppMode): void {
  // 환경변수가 production이면 변경 불가
  if (getEnvMode() === 'production') {
    console.warn('운영 모드에서는 앱 모드를 변경할 수 없습니다.')
    return
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('app_mode', mode)
    // 페이지 새로고침으로 변경 적용
    window.location.reload()
  }
}

// 데모 모드인지 확인
export function isDemoMode(): boolean {
  return getAppMode() === 'demo'
}

// 운영 모드인지 확인
export function isProductionMode(): boolean {
  return getAppMode() === 'production'
}

// 환경변수 기반 데모 모드 확인 (서버 사이드용)
export function isEnvDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

// 샘플 데이터 생성 함수들
export const sampleData = {
  users: [
    { id: '1', email: 'demo@example.com', name: '데모 사용자', plan: 'pro', status: 'active', createdAt: new Date().toISOString() },
    { id: '2', email: 'user1@example.com', name: '김철수', plan: 'free', status: 'active', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: '3', email: 'user2@example.com', name: '이영희', plan: 'pro', status: 'active', createdAt: new Date(Date.now() - 172800000).toISOString() },
    { id: '4', email: 'user3@example.com', name: '박민수', plan: 'enterprise', status: 'active', createdAt: new Date(Date.now() - 259200000).toISOString() },
    { id: '5', email: 'user4@example.com', name: '최지현', plan: 'free', status: 'inactive', createdAt: new Date(Date.now() - 345600000).toISOString() },
  ],
  stats: {
    totalUsers: 1234,
    newUsersToday: 23,
    activeSubscriptions: 89,
    monthlyRevenue: 4520000,
  },
  payments: [
    { id: '1', user: '김철수', amount: 29000, status: 'completed', method: 'card', createdAt: new Date().toISOString() },
    { id: '2', user: '이영희', amount: 99000, status: 'completed', method: 'kakao', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: '3', user: '박민수', amount: 299000, status: 'pending', method: 'bank', createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: '4', user: '최지현', amount: 29000, status: 'refunded', method: 'card', createdAt: new Date(Date.now() - 86400000).toISOString() },
  ],
  activities: [
    { id: '1', type: 'signup', user: 'new_user@example.com', timestamp: new Date().toISOString(), detail: '신규 가입' },
    { id: '2', type: 'payment', user: '김철수', timestamp: new Date(Date.now() - 1800000).toISOString(), detail: 'Pro 플랜 결제 ₩29,000' },
    { id: '3', type: 'login', user: '이영희', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: '4', type: 'ai_usage', user: '박민수', timestamp: new Date(Date.now() - 5400000).toISOString(), detail: 'AI 작문 1,500 토큰' },
    { id: '5', type: 'subscription', user: '최지현', timestamp: new Date(Date.now() - 7200000).toISOString(), detail: 'Pro → Free 다운그레이드' },
  ],
  subscriptions: [
    { id: '1', user: '김철수', plan: 'pro', status: 'active', currentPeriodEnd: new Date(Date.now() + 2592000000).toISOString() },
    { id: '2', user: '이영희', plan: 'pro', status: 'active', currentPeriodEnd: new Date(Date.now() + 1728000000).toISOString() },
    { id: '3', user: '박민수', plan: 'enterprise', status: 'active', currentPeriodEnd: new Date(Date.now() + 864000000).toISOString() },
    { id: '4', user: '최지현', plan: 'free', status: 'canceled', canceledAt: new Date(Date.now() - 86400000).toISOString() },
  ],
  aiUsages: [
    { id: '1', user: '김철수', type: 'writer', tokens: 1500, cost: 45, createdAt: new Date().toISOString() },
    { id: '2', user: '이영희', type: 'image', tokens: 0, cost: 100, createdAt: new Date(Date.now() - 1800000).toISOString() },
    { id: '3', user: '박민수', type: 'code', tokens: 2000, cost: 60, createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: '4', user: '최지현', type: 'translate', tokens: 500, cost: 15, createdAt: new Date(Date.now() - 5400000).toISOString() },
  ],
}
